import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import { Application } from './model/application'
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
import { University } from '../university/model/university'
import { ProgramModeOfDelivery } from '../program/model/programModeOfDelivery'
import { Program } from '../program/model/program'
import { NoContentException } from '@island.is/nest/problem'

@Injectable()
export class ApplicationService {
  constructor(
    private readonly reykjavikUniversityClient: ReykjavikUniversityApplicationClient,

    private readonly universityOfIcelandClient: UniversityOfIcelandApplicationClient,

    @InjectModel(Application)
    private applicationModel: typeof Application,

    @InjectModel(Program)
    private programModel: typeof Program,

    @InjectModel(ProgramModeOfDelivery)
    private programModeOfDeliveryModel: typeof ProgramModeOfDelivery,

    @InjectModel(University)
    private universityModel: typeof University,
  ) {}

  async getApplicationById(id: string, user: User): Promise<Application> {
    const application = await this.applicationModel.findOne({
      attributes: ['status'],
      where: { id: id, nationalId: user.nationalId },
    })

    if (!application) {
      throw new NoContentException()
    }

    return application
  }

  async createApplication(
    applicationDto: CreateApplicationDto,
    user: User,
  ): Promise<Application> {
    // Get university national id
    const university = await this.universityModel.findByPk(
      applicationDto.universityId,
    )
    if (!university) {
      throw new Error(
        `University with id ${applicationDto.universityId} not found in DB`,
      )
    }

    // Get program info
    const program = await this.programModel.findOne({
      where: { id: applicationDto.programId, universityId: university.id },
    })
    if (!program) {
      throw new Error(
        `Program with id ${applicationDto.programId} for university with national id ${university.nationalId} not found`,
      )
    }

    const programModeOfDelivery = await this.programModeOfDeliveryModel.findOne(
      {
        where: {
          programId: program.id,
          modeOfDelivery: applicationDto.modeOfDelivery,
        },
      },
    )
    if (!programModeOfDelivery) {
      throw new Error(
        `Program mode of delivery with program id ${
          program.id
        } and mode of delivery ${applicationDto.modeOfDelivery.toString()} not found`,
      )
    }

    // Wrap answers in obj that can be sent to libs/clients for universities
    const applicationObj: IApplication = {
      programExternalId: program.externalId,
      modeOfDelivery: programModeOfDelivery.modeOfDelivery,
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
        programModeOfDeliveryId: programModeOfDelivery.id,
        status: ApplicationStatus.IN_REVIEW,
      })
    ).id

    // Create application in University DB
    let applicationExternalId: string | undefined
    if (university.nationalId === UniversityNationalIds.REYKJAVIK_UNIVERSITY) {
      try {
        applicationExternalId =
          await this.reykjavikUniversityClient.createApplication(applicationObj)
      } catch (e) {
        throw new Error(
          `Failed to create application in Reykjavik University DB`,
        )
      }
    } else if (
      university.nationalId === UniversityNationalIds.UNIVERSITY_OF_ICELAND
    ) {
      // TODO need to perform for all Uglu universities
      try {
        applicationExternalId =
          await this.universityOfIcelandClient.createApplication(applicationObj)
      } catch (e) {
        throw new Error(
          `Failed to create application in University of Iceland DB`,
        )
      }
    }

    // Update the application externalId
    if (applicationExternalId) {
      await this.applicationModel.update(
        {
          externalId: applicationExternalId,
        },
        {
          where: { id: applicationId },
        },
      )
    }

    // Return the recently created application
    const application = await this.applicationModel.findOne({
      where: { id: applicationId, nationalId: user.nationalId },
    })
    if (!application) {
      throw new Error(
        `Application with id ${applicationId} for user with national id ${user.nationalId} not found`,
      )
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
      throw new Error(
        `Application with id ${applicationId} for user with national id ${user.nationalId} not found`,
      )
    }

    // Check application external id
    if (!application.externalId) {
      throw new Error(
        `Application with id ${applicationId} does not have external id set`,
      )
    }

    // Get university national id
    const university = await this.universityModel.findByPk(
      application.universityId,
    )
    if (!university) {
      throw new Error(
        `University with id ${application.universityId} not found`,
      )
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
        throw new Error(
          `Failed to update application status in Reykjavik University DB`,
        )
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
        throw new Error(
          `Failed to update application status inUniversity of Iceland DB`,
        )
      }
    }

    // Return the recently updated application
    const updatedApplication = await this.applicationModel.findOne({
      where: { id: applicationId, nationalId: user.nationalId },
    })
    if (!updatedApplication) {
      throw new Error(
        `Application with id ${applicationId} for user with national id ${user.nationalId} not found`,
      )
    }
    return updatedApplication
  }
}
