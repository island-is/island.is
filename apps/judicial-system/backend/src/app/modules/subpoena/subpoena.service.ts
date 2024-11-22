import { Base64 } from 'js-base64'
import { Includeable, Sequelize } from 'sequelize'
import { Transaction } from 'sequelize/types'

import {
  forwardRef,
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common'
import { InjectConnection, InjectModel } from '@nestjs/sequelize'

import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'

import {
  Message,
  MessageService,
  MessageType,
} from '@island.is/judicial-system/message'
import {
  CaseFileCategory,
  isFailedServiceStatus,
  isSuccessfulServiceStatus,
  isTrafficViolationCase,
  ServiceStatus,
  SubpoenaNotificationType,
  type User as TUser,
} from '@island.is/judicial-system/types'

import { Case } from '../case/models/case.model'
import { PdfService } from '../case/pdf.service'
import { DefendantService } from '../defendant/defendant.service'
import { Defendant } from '../defendant/models/defendant.model'
import { EventService } from '../event'
import { FileService } from '../file'
import { PoliceService } from '../police'
import { User } from '../user'
import { UpdateSubpoenaDto } from './dto/updateSubpoena.dto'
import { DeliverResponse } from './models/deliver.response'
import { Subpoena } from './models/subpoena.model'

export const include: Includeable[] = [
  {
    model: Case,
    as: 'case',
    include: [
      {
        model: User,
        as: 'judge',
      },
      {
        model: User,
        as: 'registrar',
      },
    ],
  },
  { model: Defendant, as: 'defendant' },
]

@Injectable()
export class SubpoenaService {
  constructor(
    @InjectModel(Subpoena) private readonly subpoenaModel: typeof Subpoena,
    private readonly pdfService: PdfService,
    private readonly messageService: MessageService,
    @Inject(forwardRef(() => PoliceService))
    private readonly policeService: PoliceService,
    @Inject(forwardRef(() => FileService))
    private readonly fileService: FileService,
    private readonly eventService: EventService,
    private readonly defendantService: DefendantService,
    @Inject(LOGGER_PROVIDER) private readonly logger: Logger,
  ) {}

  async createSubpoena(
    defendantId: string,
    caseId: string,
    transaction: Transaction,
    arraignmentDate?: Date,
    location?: string,
  ): Promise<Subpoena> {
    return this.subpoenaModel.create(
      {
        defendantId,
        caseId,
        arraignmentDate,
        location,
      },
      { transaction },
    )
  }

  async setHash(id: string, hash: string): Promise<void> {
    const [numberOfAffectedRows] = await this.subpoenaModel.update(
      { hash },
      { where: { id } },
    )

    if (numberOfAffectedRows > 1) {
      // Tolerate failure, but log error
      this.logger.error(
        `Unexpected number of rows (${numberOfAffectedRows}) affected when updating subpoena hash for subpoena ${id}`,
      )
    } else if (numberOfAffectedRows < 1) {
      throw new InternalServerErrorException(`Could not update subpoena ${id}`)
    }
  }

  private async addMessagesForSubpoenaUpdateToQueue(
    subpoena: Subpoena,
    serviceStatus?: ServiceStatus,
  ): Promise<void> {
    let message: Message | undefined = undefined

    if (serviceStatus && serviceStatus !== subpoena.serviceStatus) {
      if (isSuccessfulServiceStatus(serviceStatus)) {
        message = {
          type: MessageType.SUBPOENA_NOTIFICATION,
          caseId: subpoena.caseId,
          elementId: [subpoena.defendantId, subpoena.id],
          body: {
            type: SubpoenaNotificationType.SERVICE_SUCCESSFUL,
          },
        }
      } else if (isFailedServiceStatus(serviceStatus)) {
        message = {
          type: MessageType.SUBPOENA_NOTIFICATION,
          caseId: subpoena.caseId,
          elementId: [subpoena.defendantId, subpoena.id],
          body: {
            type: SubpoenaNotificationType.SERVICE_FAILED,
          },
        }
      }
    }

    if (!message) {
      return
    }

    return this.messageService.sendMessagesToQueue([message])
  }

  async update(
    subpoena: Subpoena,
    update: UpdateSubpoenaDto,
    transaction?: Transaction,
  ): Promise<Subpoena> {
    const {
      defenderChoice,
      defenderNationalId,
      defenderEmail,
      defenderPhoneNumber,
      defenderName,
      serviceStatus,
      requestedDefenderChoice,
      requestedDefenderNationalId,
      requestedDefenderName,
    } = update

    const [numberOfAffectedRows] = await this.subpoenaModel.update(update, {
      where: { subpoenaId: subpoena.subpoenaId },
      returning: true,
      transaction,
    })

    if (numberOfAffectedRows > 1) {
      // Tolerate failure, but log error
      this.logger.error(
        `Unexpected number of rows ${numberOfAffectedRows} affected when updating subpoena`,
      )
    }

    if (
      subpoena.case &&
      subpoena.defendant &&
      (defenderChoice ||
        defenderNationalId ||
        defenderName ||
        defenderEmail ||
        defenderPhoneNumber ||
        requestedDefenderChoice ||
        requestedDefenderNationalId ||
        requestedDefenderName)
    ) {
      // If there is a change in the defender choice after the judge has confirmed the choice,
      // we need to set the isDefenderChoiceConfirmed to false
      const resetDefenderChoiceConfirmed =
        subpoena.defendant?.isDefenderChoiceConfirmed &&
        ((defenderChoice &&
          subpoena.defendant?.defenderChoice !== defenderChoice) ||
          (defenderNationalId &&
            subpoena.defendant?.defenderNationalId !== defenderNationalId))

      // Færa message handling í defendant service
      await this.defendantService.updateRestricted(
        subpoena.case,
        subpoena.defendant,
        {
          defenderChoice,
          defenderNationalId,
          defenderName,
          defenderEmail,
          defenderPhoneNumber,
          requestedDefenderChoice,
          requestedDefenderNationalId,
          requestedDefenderName,
        },
        resetDefenderChoiceConfirmed ? false : undefined,
        transaction,
      )
    }

    // No need to wait for this to finish
    this.addMessagesForSubpoenaUpdateToQueue(subpoena, serviceStatus)

    if (
      update.serviceStatus &&
      update.serviceStatus !== subpoena.serviceStatus &&
      subpoena.case
    ) {
      this.eventService.postEvent(
        'SUBPOENA_SERVICE_STATUS',
        subpoena.case,
        false,
        { Staða: Subpoena.serviceStatusText(update.serviceStatus) },
      )
    }

    return this.findBySubpoenaId(subpoena.subpoenaId)
  }

  async findBySubpoenaId(subpoenaId?: string): Promise<Subpoena> {
    if (!subpoenaId) {
      throw new Error('Missing subpoena id')
    }

    const subpoena = await this.subpoenaModel.findOne({
      include,
      where: { subpoenaId },
    })

    if (!subpoena) {
      throw new Error(`Subpoena with subpoena id ${subpoenaId} not found`)
    }

    return subpoena
  }

  async getIndictmentPdf(theCase: Case): Promise<Buffer> {
    if (isTrafficViolationCase(theCase)) {
      return await this.pdfService.getIndictmentPdf(theCase)
    }

    const indictmentCaseFile = theCase.caseFiles?.find(
      (caseFile) =>
        caseFile.category === CaseFileCategory.INDICTMENT && caseFile.key,
    )

    if (!indictmentCaseFile) {
      // This shouldn't ever happen
      this.logger.error(
        `No indictment found for case ${theCase.id} so cannot deliver subpoena to police`,
      )
      throw new Error(`No indictment found for case ${theCase.id}`)
    }

    return await this.fileService.getCaseFileFromS3(theCase, indictmentCaseFile)
  }

  async deliverSubpoenaToPolice(
    theCase: Case,
    defendant: Defendant,
    subpoena: Subpoena,
    user: TUser,
  ): Promise<DeliverResponse> {
    try {
      const subpoenaPdf = await this.pdfService.getSubpoenaPdf(
        theCase,
        defendant,
        subpoena,
      )

      const indictmentPdf = await this.getIndictmentPdf(theCase)

      const createdSubpoena = await this.policeService.createSubpoena(
        theCase,
        defendant,
        Base64.btoa(subpoenaPdf.toString('binary')),
        Base64.btoa(indictmentPdf.toString('binary')),
        user,
      )

      if (!createdSubpoena) {
        this.logger.error('Failed to create subpoena file for police')

        return { delivered: false }
      }

      const [numberOfAffectedRows] = await this.subpoenaModel.update(
        { subpoenaId: createdSubpoena.subpoenaId },
        { where: { id: subpoena.id } },
      )

      if (numberOfAffectedRows !== 1) {
        this.logger.error(
          `Unexpected number of rows (${numberOfAffectedRows}) affected when updating subpoena for subpoena ${subpoena.id}`,
        )
      }

      this.logger.info(
        `Subpoena ${createdSubpoena.subpoenaId} delivered to police`,
      )

      return { delivered: true }
    } catch (error) {
      this.logger.error('Error delivering subpoena to police', error)

      return { delivered: false }
    }
  }
}
