import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'

import { ApplicationModel, SpouseResponse } from './models'

import { Op } from 'sequelize'

import { CreateApplicationDto, UpdateApplicationDto } from './dto'
import {
  ApplicationEventType,
  ApplicationFilters,
  ApplicationState,
  ApplicationStateUrl,
  getEventTypesFromService,
  getStateFromUrl,
  RolesRule,
  User,
  getEmailTextFromState,
  Staff,
  FileType,
  months,
  nextMonth,
  getNextPeriod,
} from '@island.is/financial-aid/shared/lib'
import { FileService } from '../file'
import {
  ApplicationEventService,
  ApplicationEventModel,
} from '../applicationEvent'
import { StaffModel } from '../staff'

import { EmailService } from '@island.is/email-service'

import { ApplicationFileModel } from '../file/models'
import { environment } from '../../../environments'
import { ApplicationReceivedTemplate } from './emailTemplates/applicationRecievedTemplate'
import { MunicipalityService } from '../municipality'
import { logger } from '@island.is/logging'

interface Recipient {
  name: string
  address: string
}

const linkToStatusPage = (applicationId: string) => {
  return `https://fjarhagsadstod.dev.sveitarfelog.net/stada/${applicationId}"`
}

const firstDateOfMonth = () => {
  const date = new Date()

  return new Date(date.getFullYear(), date.getMonth(), 1)
}

@Injectable()
export class ApplicationService {
  constructor(
    @InjectModel(ApplicationModel)
    private readonly applicationModel: typeof ApplicationModel,
    private readonly fileService: FileService,
    private readonly applicationEventService: ApplicationEventService,
    private readonly emailService: EmailService,
    private readonly municipalityService: MunicipalityService,
  ) {}

  async getSpouseInfo(spouseNationalId: string): Promise<SpouseResponse> {
    const application = await this.applicationModel.findOne({
      where: {
        spouseNationalId,
        created: { [Op.gte]: firstDateOfMonth() },
      },
    })

    const files = application
      ? await this.fileService.getApplicationFilesByType(
          application.id,
          FileType.SPOUSEFILES,
        )
      : false

    const spouseName = application ? application.name : ''

    return {
      hasPartnerApplied: Boolean(application),
      hasFiles: Boolean(files),
      spouseName: spouseName,
    }
  }

  async getCurrentApplicationId(nationalId: string): Promise<string | null> {
    const currentApplication = await this.applicationModel.findOne({
      where: {
        [Op.or]: [
          {
            nationalId,
          },
          {
            spouseNationalId: nationalId,
          },
        ],
        created: { [Op.gte]: firstDateOfMonth() },
      },
    })

    if (currentApplication) {
      return currentApplication.id
    }

    return null
  }

  async getAll(
    stateUrl: ApplicationStateUrl,
    staffId: string,
    municipalityCode: string,
  ): Promise<ApplicationModel[]> {
    return this.applicationModel.findAll({
      where:
        stateUrl === ApplicationStateUrl.MYCASES
          ? {
              state: { [Op.in]: getStateFromUrl[stateUrl] },
              staffId,
              municipalityCode,
            }
          : {
              state: { [Op.in]: getStateFromUrl[stateUrl] },
              municipalityCode,
            },
      order: [['modified', 'DESC']],
      include: [{ model: StaffModel, as: 'staff' }],
    })
  }

  async findById(
    id: string,
    service: RolesRule,
  ): Promise<ApplicationModel | null> {
    const application = await this.applicationModel.findOne({
      where: { id },
      include: [
        { model: StaffModel, as: 'staff' },
        {
          model: ApplicationEventModel,
          as: 'applicationEvents',
          separate: true,
          where: {
            eventType: {
              [Op.in]: getEventTypesFromService[service],
            },
          },
          order: [['created', 'DESC']],
        },
        {
          model: ApplicationFileModel,
          as: 'files',
          separate: true,
          order: [['created', 'DESC']],
        },
      ],
    })

    return application
  }

  async getAllFilters(
    staffId: string,
    municipalityCode: string,
  ): Promise<ApplicationFilters> {
    const statesToCount = [
      ApplicationState.NEW,
      ApplicationState.INPROGRESS,
      ApplicationState.DATANEEDED,
      ApplicationState.REJECTED,
      ApplicationState.APPROVED,
    ]

    const countPromises = statesToCount.map((item) =>
      this.applicationModel.count({
        where: { state: item, municipalityCode },
      }),
    )

    countPromises.push(
      this.applicationModel.count({
        where: {
          staffId,
          municipalityCode,
          state: {
            [Op.or]: [ApplicationState.INPROGRESS, ApplicationState.DATANEEDED],
          },
        },
      }),
    )

    const filterCounts = await Promise.all(countPromises)

    return {
      New: filterCounts[0],
      InProgress: filterCounts[1],
      DataNeeded: filterCounts[2],
      Rejected: filterCounts[3],
      Approved: filterCounts[4],
      MyCases: filterCounts[5],
    }
  }

  async create(
    application: CreateApplicationDto,
    user: User,
  ): Promise<ApplicationModel> {
    const appModel = await this.applicationModel.create(application)

    await this.applicationEventService.create({
      applicationId: appModel.id,
      eventType: ApplicationEventType[appModel.state.toUpperCase()],
    })

    if (application.files) {
      const promises = application.files.map((f) => {
        return this.fileService.createFile({
          applicationId: appModel.id,
          name: f.name,
          key: f.key,
          size: f.size,
          type: f.type,
        })
      })

      await Promise.all(promises)
    }

    const municipality = await this.municipalityService.findByMunicipalityId(
      application.municipalityCode,
    )

    await this.sendEmail(
      {
        name: user.name,
        address: appModel.email,
      },
      `Umsókn fyrir fjárhagsaðstoð móttekin ~ ${appModel.id}`,
      ApplicationReceivedTemplate(
        months[nextMonth],
        getNextPeriod.year,
        linkToStatusPage(appModel.id),
        application.email,
        municipality.name,
        municipality.homepage,
        municipality.rulesHomepage,
      ),
    )

    return appModel
  }

  async update(
    id: string,
    update: UpdateApplicationDto,
    staff?: Staff,
  ): Promise<{
    numberOfAffectedRows: number
    updatedApplication: ApplicationModel
  }> {
    const shouldSendEmail = [
      ApplicationEventType.NEW,
      ApplicationEventType.DATANEEDED,
      ApplicationEventType.REJECTED,
      ApplicationEventType.INPROGRESS,
      ApplicationEventType.APPROVED,
    ]

    if (update.state === ApplicationState.NEW) {
      update.staffId = null
    }

    await this.applicationEventService.create({
      applicationId: id,
      eventType: update.event,
      comment:
        update?.rejection ||
        update?.amount?.toLocaleString('de-DE') ||
        update?.comment,
      staffName: staff?.name,
      staffNationalId: staff?.nationalId,
    })

    const [
      numberOfAffectedRows,
      [updatedApplication],
    ] = await this.applicationModel.update(update, {
      where: { id },
      returning: true,
    })

    const events = await this.applicationEventService.findById(id)
    updatedApplication?.setDataValue('applicationEvents', events)

    const files = await this.fileService.getAllApplicationFiles(id)
    updatedApplication?.setDataValue('files', files)

    if (shouldSendEmail.includes(update.event)) {
      await this.sendEmail(
        {
          name: updatedApplication.name,
          address: updatedApplication.email,
        },
        updatedApplication.id,
        getEmailTextFromState[update.state],
      )
    }

    return { numberOfAffectedRows, updatedApplication }
  }

  private async sendEmail(
    to: Recipient | Recipient[],
    subject: string,
    html: string,
  ) {
    try {
      await this.emailService.sendEmail({
        from: {
          name: 'Samband íslenskra sveitarfélaga',
          address: environment.emailOptions.fromEmail,
        },
        replyTo: {
          name: 'Samband íslenskra sveitarfélaga',
          address: environment.emailOptions.replyToEmail,
        },
        to,
        subject,
        html,
      })
    } catch (error) {
      logger.warn('failed to send email', error)
    }
  }
}
