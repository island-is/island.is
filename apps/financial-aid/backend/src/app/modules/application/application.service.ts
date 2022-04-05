import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
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
  Staff,
  FileType,
  getApplicantEmailDataFromEventType,
  firstDateOfMonth,
  UserType,
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
import { ApplicantEmailTemplate } from './emailTemplates/applicantEmailTemplate'
import { MunicipalityService } from '../municipality'
import { logger } from '@island.is/logging'
import { AmountModel, AmountService } from '../amount'
import { DeductionFactorsModel } from '../deductionFactors'
import { DirectTaxPaymentService } from '../directTaxPayment'
import { DirectTaxPaymentModel } from '../directTaxPayment/models'

interface Recipient {
  name: string
  address: string
}

const linkToStatusPage = (applicationId: string) => {
  return `${environment.oskBaseUrl}/stada/${applicationId}"`
}

@Injectable()
export class ApplicationService {
  constructor(
    @InjectModel(ApplicationModel)
    private readonly applicationModel: typeof ApplicationModel,
    private readonly fileService: FileService,
    private readonly amountService: AmountService,
    private readonly applicationEventService: ApplicationEventService,
    private readonly emailService: EmailService,
    private readonly municipalityService: MunicipalityService,
    private readonly directTaxPaymentService: DirectTaxPaymentService,
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

    return {
      hasPartnerApplied: Boolean(application),
      hasFiles: Boolean(files),
      applicantName: application ? application.name : '',
      applicantSpouseEmail: application?.spouseEmail ?? '',
    }
  }

  async findByNationalId(
    nationalId: string,
    municipalityCodes: string[],
  ): Promise<ApplicationModel[]> {
    return this.applicationModel.findAll({
      where: {
        [Op.or]: [
          {
            nationalId,
            municipalityCode: { [Op.in]: municipalityCodes },
          },
          {
            spouseNationalId: nationalId,
            municipalityCode: { [Op.in]: municipalityCodes },
          },
        ],
      },
      order: [['modified', 'DESC']],
      include: [
        {
          model: ApplicationFileModel,
          as: 'files',
          separate: true,
          order: [['created', 'DESC']],
        },
      ],
    })
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
    municipalityCodes: string[],
  ): Promise<ApplicationModel[]> {
    return this.applicationModel.findAll({
      where:
        stateUrl === ApplicationStateUrl.MYCASES
          ? {
              state: { [Op.in]: getStateFromUrl[stateUrl] },
              staffId,
              municipalityCode: { [Op.in]: municipalityCodes },
            }
          : {
              state: { [Op.in]: getStateFromUrl[stateUrl] },
              municipalityCode: { [Op.in]: municipalityCodes },
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
        {
          model: AmountModel,
          as: 'amount',
          include: [{ model: DeductionFactorsModel, as: 'deductionFactors' }],
          separate: true,
          order: [['created', 'DESC']],
        },
        {
          model: DirectTaxPaymentModel,
          as: 'directTaxPayments',
        },
      ],
    })

    if (application?.amount) {
      application.setDataValue('amount', application.amount['0'])
    }

    return application
  }

  async getAllFilters(
    staffId: string,
    municipalityCodes: string[],
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
        where: {
          state: item,
          municipalityCode: { [Op.in]: municipalityCodes },
        },
      }),
    )

    countPromises.push(
      this.applicationModel.count({
        where: {
          staffId,
          municipalityCode: { [Op.in]: municipalityCodes },
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
    const hasAppliedForPeriod = await this.getCurrentApplicationId(
      user.nationalId,
    )

    if (hasAppliedForPeriod) {
      throw new ForbiddenException('User or spouse has applied for period')
    }

    const appModel = await this.applicationModel.create({
      nationalId: user.nationalId,
      ...application,
    })

    await Promise.all([
      application.directTaxPayments.map((d) => {
        return this.directTaxPaymentService.create({
          applicationId: appModel.id,
          userType: UserType.APPLICANT,
          ...d,
        })
      }),
      application.files?.map((f) => {
        return this.fileService.createFile({
          applicationId: appModel.id,
          name: f.name,
          key: f.key,
          size: f.size,
          type: f.type,
        })
      }),
      this.createApplicationEmails(application, appModel, user),
      this.applicationEventService.create({
        applicationId: appModel.id,
        eventType: ApplicationEventType[appModel.state.toUpperCase()],
      }),
    ])

    return appModel
  }

  private async createApplicationEmails(
    application: CreateApplicationDto,
    appModel: ApplicationModel,
    user: User,
  ) {
    const municipality = await this.municipalityService.findByMunicipalityId(
      application.municipalityCode,
    )

    const emailData = getApplicantEmailDataFromEventType(
      ApplicationEventType.NEW,
      linkToStatusPage(appModel.id),
      application.email,
      municipality,
      appModel.created,
    )

    const emailPromises: Promise<void>[] = []

    emailPromises.push(
      this.sendEmail(
        {
          name: user.name,
          address: appModel.email,
        },
        emailData.subject,
        ApplicantEmailTemplate(emailData.data),
      ),
    )

    if (application.spouseNationalId) {
      const emailData = getApplicantEmailDataFromEventType(
        'SPOUSE',
        environment.oskBaseUrl,
        appModel.spouseEmail,
        municipality,
        appModel.created,
      )
      emailPromises.push(
        this.sendEmail(
          {
            name: appModel.spouseName,
            address: appModel.spouseEmail,
          },
          emailData.subject,
          ApplicantEmailTemplate(emailData.data),
        ),
      )
    }

    await Promise.all(emailPromises)
  }

  async update(
    id: string,
    update: UpdateApplicationDto,
    staff?: Staff,
  ): Promise<ApplicationModel> {
    if (update.state && update.state === ApplicationState.NEW) {
      update.staffId = null
    }

    const [
      numberOfAffectedRows,
      [updatedApplication],
    ] = await this.applicationModel.update(update, {
      where: { id },
      returning: true,
    })

    if (numberOfAffectedRows === 0) {
      throw new NotFoundException(`Application ${id} does not exist`)
    }

    await this.applicationEventService.create({
      applicationId: id,
      eventType: update.event,
      comment: update?.rejection || update?.comment,
      staffName: staff?.name,
      staffNationalId: staff?.nationalId,
    })

    if (update.amount) {
      const amount = await this.amountService.create(update.amount)
      updatedApplication?.setDataValue('amount', amount)
    }

    const events = this.applicationEventService
      .findById(id)
      .then((eventsResolved) => {
        updatedApplication?.setDataValue('applicationEvents', eventsResolved)
      })

    const files = this.fileService
      .getAllApplicationFiles(id)
      .then((filesResolved) => {
        updatedApplication?.setDataValue('files', filesResolved)
      })

    const directTaxPayments = this.directTaxPaymentService
      .getByApplicationId(id)
      .then((resolved) => {
        updatedApplication?.setDataValue('directTaxPayments', resolved)
      })

    if (
      update.event === ApplicationEventType.SPOUSEFILEUPLOAD &&
      update.directTaxPayments
    ) {
      await Promise.all([
        update.directTaxPayments.map((d) => {
          return this.directTaxPaymentService.create({
            applicationId: id,
            userType: UserType.SPOUSE,
            ...d,
          })
        }),
      ])
    }

    await Promise.all([
      events,
      files,
      this.sendApplicationUpdateEmail(update, updatedApplication),
      directTaxPayments,
    ])

    return updatedApplication
  }

  private async sendApplicationUpdateEmail(
    update: UpdateApplicationDto,
    updatedApplication: ApplicationModel,
  ) {
    if (
      update.event === ApplicationEventType.DATANEEDED ||
      update.event === ApplicationEventType.REJECTED ||
      update.event === ApplicationEventType.APPROVED
    ) {
      const municipality = await this.municipalityService.findByMunicipalityId(
        updatedApplication.municipalityCode,
      )

      const emailData = getApplicantEmailDataFromEventType(
        update.event,
        linkToStatusPage(updatedApplication.id),
        updatedApplication.email,
        municipality,
        updatedApplication.created,
        update.event === ApplicationEventType.DATANEEDED
          ? update?.comment
          : undefined,
        update.event === ApplicationEventType.REJECTED
          ? update?.rejection
          : undefined,
      )

      await this.sendEmail(
        {
          name: updatedApplication.name,
          address: updatedApplication.email,
        },
        emailData.subject,
        ApplicantEmailTemplate(emailData.data),
      )
    }
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
