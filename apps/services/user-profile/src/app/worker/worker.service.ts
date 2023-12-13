import { Injectable } from '@nestjs/common'

import { logger } from '@island.is/logging'
import { InjectModel } from '@nestjs/sequelize'
import { UserProfile } from '../user-profile/userProfile.model'
import { UserProfileAdvania } from './userProfileAdvania.model'
import { ProcessedStatus } from './types'
import { shouldReplaceExistingUserProfile } from './worker.utils'
import { environment } from '../../environments'

@Injectable()
export class UserProfileWorkerService {
  constructor(
    @InjectModel(UserProfile)
    private readonly userProfileModel: typeof UserProfile,
    @InjectModel(UserProfileAdvania)
    private readonly userProfileAdvaniaModel: typeof UserProfileAdvania,
  ) {}

  public async run() {
    logger.info('Worker starting...')

    await this.migrateUserProfiles()

    logger.info('Worker finished.')
  }

  private async processProfiles(
    advaniaProfile: UserProfileAdvania,
    existingUserProfile?: UserProfile,
  ) {
    try {
      if (
        shouldReplaceExistingUserProfile(advaniaProfile, existingUserProfile)
      ) {
        await this.userProfileModel.upsert({
          nationalId: advaniaProfile.ssn,
          email: advaniaProfile.email,
          mobilePhoneNumber: advaniaProfile.mobilePhoneNumber,
          lastNudge: null,
          documentNotifications: advaniaProfile.canNudge === true,
        })
      } else if (existingUserProfile?.modified < advaniaProfile.exported) {
        await this.userProfileModel.upsert({
          nationalId: advaniaProfile.ssn,
          lastNudge: advaniaProfile.nudgeLastAsked,
        })
      }
      return ProcessedStatus.DONE
    } catch (e) {
      logger.error(`processProfiles.error: ${e?.message}`)
      return ProcessedStatus.ERROR
    }
  }

  private async migrateUserProfiles() {
    logger.info('migrateUserProfiles')

    const numberOfProfilesToProcess = await this.userProfileAdvaniaModel.count({
      where: {
        status: ProcessedStatus.PENDING,
      },
    })

    logger.info(`${numberOfProfilesToProcess} profiles to process`)

    const numberOfPagesToProcess = Math.max(
      numberOfProfilesToProcess / environment.worker.processPageSize,
      1,
    )

    const nationalIdsProcessed: string[] = []
    const nationalIdsWithError: string[] = []

    for (
      let pageIndex = 0;
      pageIndex < numberOfPagesToProcess;
      pageIndex += 1
    ) {
      logger.info(
        `processing page ${
          pageIndex + 1
        } / ${numberOfPagesToProcess} (page_size=${
          environment.worker.processPageSize
        })`,
      )

      const offset = environment.worker.processPageSize * pageIndex

      const advaniaProfiles = await this.userProfileAdvaniaModel.findAll({
        where: {
          status: ProcessedStatus.PENDING,
        },
        offset,
        limit: environment.worker.processPageSize,
      })
      const userProfiles = await this.userProfileModel.findAll({
        where: {
          nationalId: advaniaProfiles.map((p) => p.ssn),
        },
      })

      for (const advaniaProfile of advaniaProfiles) {
        const existingUserProfile = userProfiles.find(
          (p) => p.nationalId === advaniaProfile.ssn,
        )

        const status = await this.processProfiles(
          advaniaProfile,
          existingUserProfile,
        )

        if (status === ProcessedStatus.DONE) {
          nationalIdsProcessed.push(advaniaProfile.ssn)
        } else if (status === ProcessedStatus.ERROR) {
          nationalIdsWithError.push(advaniaProfile.ssn)
        }
      }
    }

    logger.info('processing complete, updating profile status')

    // Wait until after processing to update status to not confuse
    // the profile query offset
    if (nationalIdsProcessed.length > 0) {
      const numberOfPagesToProcess = Math.max(
        nationalIdsProcessed.length / environment.worker.processPageSize,
        1,
      )

      for (
        let pageIndex = 0;
        pageIndex < numberOfPagesToProcess;
        pageIndex += 1
      ) {
        const offset = environment.worker.processPageSize * pageIndex
        await this.userProfileAdvaniaModel.update(
          {
            status: ProcessedStatus.DONE,
          },
          {
            where: {
              ssn: nationalIdsProcessed.slice(
                offset,
                environment.worker.processPageSize,
              ),
            },
          },
        )
      }

      logger.info(
        `successfully processed ${nationalIdsProcessed.length} profiles`,
      )
    }

    if (nationalIdsWithError.length > 0) {
      const numberOfPagesToProcess = Math.max(
        nationalIdsWithError.length / environment.worker.processPageSize,
        1,
      )

      for (
        let pageIndex = 0;
        pageIndex < numberOfPagesToProcess;
        pageIndex += 1
      ) {
        const offset = environment.worker.processPageSize * pageIndex
        await this.userProfileAdvaniaModel.update(
          {
            status: ProcessedStatus.ERROR,
          },
          {
            where: {
              ssn: nationalIdsWithError.slice(
                offset,
                environment.worker.processPageSize,
              ),
            },
          },
        )
      }

      logger.info(`${nationalIdsWithError.length} profiles had an error`)
    }
  }
}
