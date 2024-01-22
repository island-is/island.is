import formatDistance from 'date-fns/formatDistance'

import { Injectable } from '@nestjs/common'

import { logger } from '@island.is/logging'
import { InjectModel } from '@nestjs/sequelize'
import { UserProfile } from '../user-profile/userProfile.model'
import { UserProfileAdvania } from './userProfileAdvania.model'
import { ProcessedStatus } from './types'
import { hasMatchingContactInfo } from './worker.utils'
import { environment } from '../../environments'

/**
 * The purpose of this worker is to import user profiles from Advania
 */
@Injectable()
export class UserProfileWorkerService {
  constructor(
    @InjectModel(UserProfile)
    private readonly userProfileModel: typeof UserProfile,
    @InjectModel(UserProfileAdvania)
    private readonly userProfileAdvaniaModel: typeof UserProfileAdvania,
  ) {}

  public async run() {
    const timer = logger.startTimer()
    logger.info('Worker starting...')

    await this.migrateUserProfiles()

    logger.info('Worker finished.')
    timer.done()
  }

  private async processProfiles(
    advaniaProfile: UserProfileAdvania,
    existingUserProfile?: UserProfile,
  ) {
    if (!existingUserProfile) {
      return this.userProfileModel.create({
        nationalId: advaniaProfile.ssn,
        email: advaniaProfile.email?.toLowerCase?.(),
        mobilePhoneNumber: advaniaProfile.mobilePhoneNumber,
        lastNudge: null,
        documentNotifications: advaniaProfile.canNudge === true,
      })
    }

    if (hasMatchingContactInfo(advaniaProfile, existingUserProfile)) {
      return this.userProfileModel.upsert({
        nationalId: advaniaProfile.ssn,
        lastNudge: advaniaProfile.nudgeLastAsked,
      })
    }

    if (existingUserProfile.modified <= advaniaProfile.exported) {
      return this.userProfileModel.upsert({
        nationalId: advaniaProfile.ssn,
        email: advaniaProfile.email?.toLowerCase?.(),
        mobilePhoneNumber: advaniaProfile.mobilePhoneNumber,
        documentNotifications: advaniaProfile.canNudge === true,
        lastNudge: null,
      })
    }

    const { nationalId, emailVerified, mobilePhoneNumberVerified, modified } =
      existingUserProfile

    return this.userProfileModel.upsert({
      nationalId,
      lastNudge: emailVerified || mobilePhoneNumberVerified ? modified : null,
    })
  }

  private async migrateUserProfiles() {
    logger.info('migrateUserProfiles')

    const numberOfProfilesToProcess = await this.userProfileAdvaniaModel.count({
      where: {
        status: ProcessedStatus.PENDING,
      },
    })

    logger.info(`${numberOfProfilesToProcess} profiles to process`)

    const numberOfPagesToProcess = Math.ceil(
      numberOfProfilesToProcess / environment.worker.processPageSize,
    )
    logger.info(
      `splitting work into ${numberOfPagesToProcess} pages with page_size=${environment.worker.processPageSize}`,
    )

    const startTime = Date.now()

    for (
      let pageIndex = 0;
      pageIndex < numberOfPagesToProcess;
      pageIndex += 1
    ) {
      const nationalIdsProcessed: string[] = []
      const nationalIdsWithError: string[] = []

      logger.info(
        `processing page ${pageIndex + 1} / ${numberOfPagesToProcess} ...`,
      )

      const advaniaProfiles = await this.userProfileAdvaniaModel.findAll({
        where: {
          status: ProcessedStatus.PENDING,
        },
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

        try {
          await this.processProfiles(advaniaProfile, existingUserProfile)
          nationalIdsProcessed.push(advaniaProfile.ssn)
        } catch (e) {
          logger.error(`processProfiles.error: ${e?.message}`)
          nationalIdsWithError.push(advaniaProfile.ssn)
        }
      }

      logger.info(
        `processing for page ${
          pageIndex + 1
        } / ${numberOfPagesToProcess} done, updating status ...`,
      )

      if (nationalIdsProcessed.length > 0) {
        logger.info(
          `updating status to ${ProcessedStatus.DONE} for ${nationalIdsProcessed.length} profiles`,
        )
        await this.userProfileAdvaniaModel.update(
          {
            status: ProcessedStatus.DONE,
          },
          {
            where: {
              ssn: nationalIdsProcessed,
            },
          },
        )
      }

      if (nationalIdsWithError.length > 0) {
        logger.info(
          `updating status to ${ProcessedStatus.ERROR} for ${nationalIdsWithError.length} profiles`,
        )
        await this.userProfileAdvaniaModel.update(
          {
            status: ProcessedStatus.ERROR,
          },
          {
            where: {
              ssn: nationalIdsWithError,
            },
          },
        )
      }

      if (numberOfPagesToProcess > 1) {
        this.logTimeRemaining(startTime, pageIndex, numberOfProfilesToProcess)
      }
    }
  }

  private logTimeRemaining(
    startTime: number,
    currentPageIndex: number,
    numberOfProfilesToProcess: number,
  ) {
    const timeElapsed = Date.now() - startTime
    const profilesProcessed =
      (currentPageIndex + 1) * environment.worker.processPageSize
    const msPerProfile = timeElapsed / profilesProcessed
    const timeRemaining =
      (numberOfProfilesToProcess - profilesProcessed) * msPerProfile
    const estimatedDateWhenFinished = new Date(Date.now() + timeRemaining)

    logger.info(
      `the migration should finish ${formatDistance(
        estimatedDateWhenFinished,
        new Date(),
        {
          addSuffix: true,
          includeSeconds: true,
        },
      )} (based on average processing time)`,
    )
  }
}
