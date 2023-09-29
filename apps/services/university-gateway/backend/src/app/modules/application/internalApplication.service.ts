import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import { Application } from './model'
import { University } from '../university/model'
import { ReykjavikUniversityApplicationClient } from '@island.is/clients/university-application/reykjavik-university'
import { UniversityOfIcelandApplicationClient } from '@island.is/clients/university-application/university-of-iceland'
import {
  ApplicationStatus,
  UniversityNationalIds,
} from '@island.is/university-gateway-lib'
import { logger } from '@island.is/logging'
import { Op } from 'sequelize'

export
@Injectable()
class InternalApplicationService {
  constructor(
    private readonly reykjavikUniversityClient: ReykjavikUniversityApplicationClient,

    private readonly universityOfIcelandClient: UniversityOfIcelandApplicationClient,

    @InjectModel(Application)
    private applicationModel: typeof Application,

    @InjectModel(University)
    private universityModel: typeof University,
  ) {}

  async updateApplicationStatus(): Promise<void> {
    try {
      logger.info('Updating application statuses for Reykjavik University')
      await this.doUpdateApplicationStatusForUniversity(
        UniversityNationalIds.REYKJAVIK_UNIVERSITY,
        (applicationExternalId: string) =>
          this.reykjavikUniversityClient.getApplicationStatus(
            applicationExternalId,
          ),
      )
    } catch (e) {
      logger.error(
        'Failed to update application statuses for Reykjavik University, reason:',
        e,
      )
    }

    // TODO need to perform for all Uglu universities
    try {
      logger.info('Updating application statuses for University of Iceland')
      await this.doUpdateApplicationStatusForUniversity(
        UniversityNationalIds.UNIVERSITY_OF_ICELAND,
        (applicationExternalId: string) =>
          this.universityOfIcelandClient.getApplicationStatus(
            applicationExternalId,
          ),
      )
    } catch (e) {
      logger.error(
        'Failed to update application statuses for University of Iceland, reason:',
        e,
      )
    }
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
          //TODOx update in application system DB
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
