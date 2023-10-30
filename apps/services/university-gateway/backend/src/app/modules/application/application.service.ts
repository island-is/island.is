import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import { Application } from './model/application'
import { ApplicationResponse } from './dto/applicationResponse'
import { CreateApplicationDto } from './dto/createApplicationDto'
import { UpdateApplicationDto } from './dto/updateApplicationDto'
import { User } from '@island.is/auth-nest-tools'
import { ReykjavikUniversityApplicationClient } from '@island.is/clients/university-application/reykjavik-university'
import { UniversityOfIcelandApplicationClient } from '@island.is/clients/university-application/university-of-iceland'
import {
  ApplicationStatus,
  IApplication,
  UniversityNationalIds,
} from '@island.is/university-gateway'
import { logger } from '@island.is/logging'
import { University } from '../university'
import { ProgramTable } from '../program'

@Injectable()
export class ApplicationService {
  constructor(
    private readonly reykjavikUniversityClient: ReykjavikUniversityApplicationClient,

    private readonly universityOfIcelandClient: UniversityOfIcelandApplicationClient,

    @InjectModel(Application)
    private applicationModel: typeof Application,

    @InjectModel(ProgramTable)
    private programModel: typeof ProgramTable,

    @InjectModel(University)
    private universityModel: typeof University,
  ) {}

  async getApplication(id: string, user: User): Promise<ApplicationResponse> {
    const application = await this.applicationModel.findOne({
      attributes: ['status'],
      where: { id: id, nationalId: user.nationalId },
    })

    if (!application) {
      const errorMsg = `Application with id ${id} and for user with national id ${user.nationalId} not found`
      logger.error(`Failed to get application, reason:`, errorMsg)
      throw new Error(errorMsg)
    }

    return { data: application }
  }

  async createApplication(
    applicationDto: CreateApplicationDto,
    user: User,
  ): Promise<Application> {
    // Get university national id
    const university = await this.universityModel.findOne({
      where: { id: applicationDto.universityId },
    })
    if (!university) {
      const errorMsg = `University with id ${applicationDto.universityId} not found in DB`
      logger.error(`Failed to create application, reason:`, errorMsg)
      throw new Error(errorMsg)
    }

    const program = await this.programModel.findOne({
      where: { id: applicationDto.programId, universityId: university.id },
    })
    if (!program) {
      const errorMsg = `Program with id ${applicationDto.programId} for university with national id ${university.nationalId} not found`
      logger.error(`Failed to create application, reason:`, errorMsg)
      throw new Error(errorMsg)
    }

    // Wrap answers in obj that can be sent to libs/clients for universities
    const applicationObj: IApplication = {
      programExternalId: program.externalId,
      modeOfDelivery: applicationDto.modeOfDelivery,
      startingSemesterYear: program.startingSemesterYear,
      startingSemesterSeason: program.startingSemesterSeason,
      applicant: {
        nationalId: user.nationalId,
        givenName: applicationDto.applicant.givenName,
        middleName: applicationDto.applicant.middleName,
        familyName: applicationDto.applicant.familyName,
        email: applicationDto.applicant.email,
        phone: applicationDto.applicant.phone,
        genderCode: applicationDto.applicant.genderCode,
        citizenshipCode: applicationDto.applicant.citizenshipCode,
        streetAddress: applicationDto.applicant.streetAddress,
        postalCode: applicationDto.applicant.postalCode,
        city: applicationDto.applicant.city,
        municipalityCode: applicationDto.applicant.municipalityCode,
        countryCode: applicationDto.applicant.countryCode,
      },
      preferredLanguage: applicationDto.preferredLanguage,
      educationList: applicationDto.educationList,
      workExperienceList: applicationDto.workExperienceList,
      extraFieldList: applicationDto.extraFieldList,
    }

    // Create application in our DB
    const applicationId = (
      await this.applicationModel.create({
        nationalId: user.nationalId,
        universityId: university.id,
        programId: program.id,
        modeOfDeliveryId: applicationObj.modeOfDelivery,
        status: ApplicationStatus.IN_REVIEW,
      })
    ).id

    // Create application in University DB
    if (university.nationalId === UniversityNationalIds.REYKJAVIK_UNIVERSITY) {
      try {
        await this.reykjavikUniversityClient.createApplication(applicationObj)
      } catch (e) {
        const errorMsg = `Failed to create application in Reykjavik University DB`
        logger.error(`Failed to create application, reason:`, errorMsg, e)
        throw new Error(errorMsg)
      }
    } else if (
      university.nationalId === UniversityNationalIds.UNIVERSITY_OF_ICELAND
    ) {
      // TODO need to perform for all Uglu universities
      try {
        await this.universityOfIcelandClient.createApplication(applicationObj)
      } catch (e) {
        const errorMsg = `Failed to create application in University of Iceland DB`
        logger.error(`Failed to create application, reason:`, errorMsg, e)
        throw new Error(errorMsg)
      }
    }

    // Return the recently created application
    const application = await this.applicationModel.findOne({
      where: { id: applicationId, nationalId: user.nationalId },
    })
    if (!application) {
      const errorMsg = `Application with id ${applicationId} for user with national id ${user.nationalId} not found`
      logger.error(`Failed to create application, reason:`, errorMsg)
      throw new Error(errorMsg)
    }
    return application
  }

  async updateApplication(
    applicationId: string,
    applicationDto: UpdateApplicationDto,
    user: User,
  ): Promise<Application> {
    // Get application info
    const application = await this.applicationModel.findOne({
      attributes: ['externalId', 'universityId'],
      where: { id: applicationId, nationalId: user.nationalId },
    })
    if (!application) {
      const errorMsg = `Application with id ${applicationId} for user with national id ${user.nationalId} not found`
      logger.error(`Failed to update application, reason:`, errorMsg)
      throw new Error(errorMsg)
    }

    // Get university national id
    const university = await this.universityModel.findOne({
      where: { id: application.universityId },
    })
    if (!university) {
      const errorMsg = `University with id ${application.universityId} not found`
      logger.error(`Failed to update application, reason:`, errorMsg)
      throw new Error(errorMsg)
    }

    // Update the application status in our DB
    await this.applicationModel.update(
      {
        status: applicationDto.status,
      },
      {
        where: { id: applicationId, nationalId: user.nationalId },
      },
    )

    // Update the application status in University DB
    if (university.nationalId === UniversityNationalIds.REYKJAVIK_UNIVERSITY) {
      try {
        await this.reykjavikUniversityClient.updateApplicationStatus(
          application.externalId,
          applicationDto.status,
        )
      } catch (e) {
        const errorMsg = `Failed to update application status in Reykjavik University DB`
        logger.error(`Failed to update application, reason:`, errorMsg, e)
        throw new Error(errorMsg)
      }
    } else if (
      university.nationalId === UniversityNationalIds.UNIVERSITY_OF_ICELAND
    ) {
      // TODO need to perform for all Uglu universities
      try {
        await this.universityOfIcelandClient.updateApplicationStatus(
          application.externalId,
          applicationDto.status,
        )
      } catch (e) {
        const errorMsg = `Failed to update application status inUniversity of Iceland DB`
        logger.error(`Failed to update application, reason:`, errorMsg, e)
        throw new Error(errorMsg)
      }
    }

    // Return the recently updated application
    const updatedApplication = await this.applicationModel.findOne({
      where: { id: applicationId, nationalId: user.nationalId },
    })
    if (!updatedApplication) {
      const errorMsg = `Application with id ${applicationId} for user with national id ${user.nationalId} not found`
      logger.error(`Failed to update application, reason:`, errorMsg)
      throw new Error(errorMsg)
    }
    return updatedApplication
  }
}
