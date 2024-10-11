import { Base64 } from 'js-base64'
import { Includeable, Sequelize } from 'sequelize'
import { Transaction } from 'sequelize/types'

import {
  forwardRef,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotImplementedException,
} from '@nestjs/common'
import { InjectConnection, InjectModel } from '@nestjs/sequelize'

import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'

import { MessageService, MessageType } from '@island.is/judicial-system/message'
import {
  CaseFileCategory,
  isTrafficViolationCase,
  NotificationType,
  ServiceStatus,
  type User,
} from '@island.is/judicial-system/types'

import { Case } from '../case/models/case.model'
import { PdfService } from '../case/pdf.service'
import { Defendant } from '../defendant/models/defendant.model'
import { FileService } from '../file'
import { PoliceService } from '../police'
import { UpdateSubpoenaDto } from './dto/updateSubpoena.dto'
import { DeliverResponse } from './models/deliver.response'
import { Subpoena } from './models/subpoena.model'

export const include: Includeable[] = [
  { model: Case, as: 'case' },
  { model: Defendant, as: 'defendant' },
]
@Injectable()
export class SubpoenaService {
  constructor(
    @InjectConnection() private readonly sequelize: Sequelize,
    @InjectModel(Subpoena) private readonly subpoenaModel: typeof Subpoena,
    @InjectModel(Defendant) private readonly defendantModel: typeof Defendant,
    private readonly pdfService: PdfService,
    private readonly messageService: MessageService,
    @Inject(forwardRef(() => PoliceService))
    private readonly policeService: PoliceService,
    @Inject(forwardRef(() => FileService))
    private readonly fileService: FileService,
    @Inject(LOGGER_PROVIDER) private readonly logger: Logger,
  ) {}

  private isSuccessfulServiceStatus(serviceStatus?: ServiceStatus) {
    return (
      serviceStatus &&
      [
        ServiceStatus.ELECTRONICALLY,
        ServiceStatus.DEFENDER,
        ServiceStatus.IN_PERSON,
      ].includes(serviceStatus)
    )
  }

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
    } = update

    const [numberOfAffectedRows] = await this.subpoenaModel.update(update, {
      where: { subpoenaId: subpoena.subpoenaId },
      returning: true,
      transaction,
    })
    let defenderAffectedRows = 0

    if (defenderChoice || defenderNationalId) {
      const defendantUpdate: Partial<Defendant> = {
        defenderChoice,
        defenderNationalId,
        defenderName,
        defenderEmail,
        defenderPhoneNumber,
      }

      const [defenderUpdateAffectedRows] = await this.defendantModel.update(
        defendantUpdate,
        {
          where: { id: subpoena.defendantId },
          transaction,
        },
      )

      defenderAffectedRows = defenderUpdateAffectedRows
    }

    if (numberOfAffectedRows < 1 && defenderAffectedRows < 1) {
      this.logger.error(
        `Unexpected number of rows ${numberOfAffectedRows} affected when updating subpoena`,
      )
    }

    if (this.isSuccessfulServiceStatus(serviceStatus)) {
      this.messageService
        .sendMessagesToQueue([
          {
            type: MessageType.NOTIFICATION,
            body: {
              type: NotificationType.SERVICE_STATUS_UPDATED,
              subpoenaId: subpoena.id,
            },
          },
        ])
        .catch((reason) =>
          // Tolerate failure, but log
          this.logger.error('Failed to dispatch notifications', { reason }),
        )
    }

    const updatedSubpoena = await this.findBySubpoenaId(subpoena.subpoenaId)

    return updatedSubpoena
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
    user: User,
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

      if (numberOfAffectedRows < 1) {
        this.logger.error(
          `Unexpected number of rows (${numberOfAffectedRows}) affected when updating subpoena for subpoena ${subpoena.id}`,
        )
      }

      return { delivered: true }
    } catch (error) {
      if (error instanceof NotImplementedException) {
        this.logger.info(
          'Failed to deliver subpoena to police due to lack of implementation',
          error,
        )
        return { delivered: true }
      } else {
        this.logger.error('Error delivering subpoena to police', error)
        return { delivered: false }
      }
    }
  }
}
