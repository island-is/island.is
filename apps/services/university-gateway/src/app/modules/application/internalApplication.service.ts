import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import { Application } from './model/application'
import { University } from '../university/model/university'
import { ReykjavikUniversityApplicationClient } from '@island.is/clients/university-application/reykjavik-university'
import { UniversityOfIcelandApplicationClient } from '@island.is/clients/university-application/university-of-iceland'
import {
  ApplicationStatus,
  UniversityNationalIds,
} from '@island.is/university-gateway'
import { logger } from '@island.is/logging'
import { Op } from 'sequelize'

@Injectable()
export class InternalApplicationService {
  constructor(
    private readonly reykjavikUniversityClient: ReykjavikUniversityApplicationClient,

    private readonly universityOfIcelandClient: UniversityOfIcelandApplicationClient,

    @InjectModel(Application)
    private applicationModel: typeof Application,

    @InjectModel(University)
    private universityModel: typeof University,
  ) {}

  async updateApplicationStatus(): Promise<void> {
    Promise.allSettled([
      await this.doUpdateApplicationStatusForUniversity(
        UniversityNationalIds.REYKJAVIK_UNIVERSITY,
        (applicationExternalId: string) =>
          this.reykjavikUniversityClient.getApplicationStatus(
            applicationExternalId,
          ),
      ),
      // TODO need to perform for all Uglu universities
      await this.doUpdateApplicationStatusForUniversity(
        UniversityNationalIds.UNIVERSITY_OF_ICELAND,
        (applicationExternalId: string) =>
          this.universityOfIcelandClient.getApplicationStatus(
            applicationExternalId,
          ),
      ),
    ]).catch((e) => {
      logger.error('Failed to update application statuses, reason:', e)
    })
  }

  private async doUpdateApplicationStatusForUniversity(
    universityNationalId: string,
    getApplicationStatus: (
      applicationExternalId: string,
    ) => Promise<ApplicationStatus>,
  ): Promise<void> {
    const universityId = (
      await this.universityModel.findOne({
        attributes: ['id'],
        where: { nationalId: universityNationalId },
        logging: false,
      })
    )?.id

    if (!universityId) {
      throw new Error(
        `University with national id ${universityNationalId} not found in DB`,
      )
    }

    const applicationList = await this.applicationModel.findAll({
      attributes: ['id', 'status'],
      where: { universityId },
      logging: false,
    })

    for (let i = 0; i < applicationList.length; i++) {
      const application = applicationList[i]

      try {
        if (!application.externalId) {
          throw new Error(
            `Application external id is empty for application ${application.id}`,
          )
        }

        const updatedApplicationStatus = await getApplicationStatus(
          application.externalId,
        )

        const [affectedCount] = await this.applicationModel.update(
          { status: updatedApplicationStatus },
          {
            where: {
              id: application.id,
              status: {
                [Op.ne]: updatedApplicationStatus,
              },
            },
            logging: false,
          },
        )

        if (affectedCount > 0) {
          //TODO update in application system DB
        }
      } catch (e) {
        logger.error(
          `Failed to update application status with id ${application.id} in DB, reason:`,
          e,
        )
      }
    }
  }
}
