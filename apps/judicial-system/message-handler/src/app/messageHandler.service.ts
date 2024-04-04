import { Inject, Injectable, OnModuleDestroy } from '@nestjs/common'

import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'
import type { ConfigType } from '@island.is/nest/config'

import type { CaseMessage } from '@island.is/judicial-system/message'
import {
  CaseFileMessage,
  DefendantMessage,
  messageEndpoint,
  MessageService,
  MessageType,
  OldMessageType,
  PoliceCaseMessage,
} from '@island.is/judicial-system/message'
import { NotificationType } from '@island.is/judicial-system/types'

import { appModuleConfig } from './app.config'
import { InternalDeliveryService } from './internalDelivery.service'

@Injectable()
export class MessageHandlerService implements OnModuleDestroy {
  private running!: boolean
  private runner!: Promise<void>

  constructor(
    private readonly messageService: MessageService,
    private readonly internalDeliveryService: InternalDeliveryService,
    @Inject(appModuleConfig.KEY)
    private readonly config: ConfigType<typeof appModuleConfig>,
    @Inject(LOGGER_PROVIDER) private readonly logger: Logger,
  ) {}

  async handleMessage(message: CaseMessage): Promise<boolean> {
    this.logger.debug('Handling message', { msg: message })

    let handled = false

    switch (message.type) {
      case OldMessageType.DELIVER_PROSECUTOR_TO_COURT:
        handled = await this.internalDeliveryService.deliver(
          message.user,
          message.caseId,
          `deliverProsecutorToCourt`,
        )
        break
      case OldMessageType.DELIVER_DEFENDANT_TO_COURT: {
        const defendantMessage: DefendantMessage = message as DefendantMessage
        handled = await this.internalDeliveryService.deliver(
          message.user,
          defendantMessage.caseId,
          `deliverDefendantToCourt/${defendantMessage.defendantId}`,
        )
        break
      }
      case OldMessageType.DELIVER_CASE_FILE_TO_COURT: {
        const caseFileMessage = message as CaseFileMessage
        handled = await this.internalDeliveryService.deliver(
          message.user,
          caseFileMessage.caseId,
          `deliverCaseFileToCourt/${caseFileMessage.caseFileId}`,
        )
        break
      }
      case OldMessageType.DELIVER_CASE_FILES_RECORD_TO_COURT: {
        const policeCaseMessage = message as PoliceCaseMessage
        handled = await this.internalDeliveryService.deliver(
          message.user,
          policeCaseMessage.caseId,
          `deliverCaseFilesRecordToCourt/${policeCaseMessage.policeCaseNumber}`,
        )
        break
      }
      case OldMessageType.DELIVER_REQUEST_TO_COURT:
        handled = await this.internalDeliveryService.deliver(
          message.user,
          message.caseId,
          'deliverRequestToCourt',
        )
        break
      case OldMessageType.DELIVER_COURT_RECORD_TO_COURT:
        handled = await this.internalDeliveryService.deliver(
          message.user,
          message.caseId,
          'deliverCourtRecordToCourt',
        )
        break
      case OldMessageType.DELIVER_SIGNED_RULING_TO_COURT:
        handled = await this.internalDeliveryService.deliver(
          message.user,
          message.caseId,
          'deliverSignedRulingToCourt',
        )
        break
      case OldMessageType.DELIVER_CASE_CONCLUSION_TO_COURT:
        handled = await this.internalDeliveryService.deliver(
          message.user,
          message.caseId,
          'deliverCaseConclusionToCourt',
        )
        break
      case OldMessageType.DELIVER_CASE_TO_POLICE:
        handled = await this.internalDeliveryService.deliver(
          message.user,
          message.caseId,
          'deliverCaseToPolice',
        )
        break
      case OldMessageType.DELIVER_INDICTMENT_CASE_TO_POLICE:
        handled = await this.internalDeliveryService.deliver(
          message.user,
          message.caseId,
          'deliverIndictmentCaseToPolice',
        )
        break
      case OldMessageType.DELIVER_INDICTMENT_TO_POLICE:
        handled = await this.internalDeliveryService.deliver(
          message.user,
          message.caseId,
          'deliverIndictmentToPolice',
        )
        break
      case OldMessageType.DELIVER_CASE_FILES_RECORD_TO_POLICE:
        {
          const policeCaseMessage = message as PoliceCaseMessage
          handled = await this.internalDeliveryService.deliver(
            message.user,
            policeCaseMessage.caseId,
            `deliverCaseFilesRecordToPolice/${policeCaseMessage.policeCaseNumber}`,
          )
        }
        break
      case OldMessageType.DELIVER_SIGNED_RULING_TO_POLICE:
        {
          const policeCaseMessage = message as PoliceCaseMessage
          handled = await this.internalDeliveryService.deliver(
            message.user,
            policeCaseMessage.caseId,
            'deliverSignedRulingToPolice',
          )
        }
        break
      case OldMessageType.DELIVER_APPEAL_TO_POLICE:
        handled = await this.internalDeliveryService.deliver(
          message.user,
          message.caseId,
          'deliverAppealToPolice',
        )
        break
      case OldMessageType.ARCHIVE_CASE_FILE: {
        const caseFileMessage = message as CaseFileMessage
        handled = await this.internalDeliveryService.deliver(
          message.user,
          caseFileMessage.caseId,
          `archiveCaseFile/${caseFileMessage.caseFileId}`,
        )
        break
      }
      case OldMessageType.ARCHIVE_CASE_FILES_RECORD: {
        const policeCaseMessage = message as PoliceCaseMessage
        handled = await this.internalDeliveryService.deliver(
          message.user,
          policeCaseMessage.caseId,
          `archiveCaseFilesRecord/${policeCaseMessage.policeCaseNumber}`,
        )
        break
      }
      case OldMessageType.SEND_HEADS_UP_NOTIFICATION:
        handled = await this.internalDeliveryService.deliver(
          message.user,
          message.caseId,
          'notification',
          { type: NotificationType.HEADS_UP },
        )
        break
      case OldMessageType.SEND_READY_FOR_COURT_NOTIFICATION:
        handled = await this.internalDeliveryService.deliver(
          message.user,
          message.caseId,
          'notification',
          { type: NotificationType.READY_FOR_COURT },
        )
        break
      case OldMessageType.SEND_RECEIVED_BY_COURT_NOTIFICATION:
        handled = await this.internalDeliveryService.deliver(
          message.user,
          message.caseId,
          'notification',
          { type: NotificationType.RECEIVED_BY_COURT },
        )
        break
      case OldMessageType.SEND_COURT_DATE_NOTIFICATION:
        handled = await this.internalDeliveryService.deliver(
          message.user,
          message.caseId,
          'notification',
          { type: NotificationType.COURT_DATE },
        )
        break
      case OldMessageType.SEND_DEFENDANTS_NOT_UPDATED_AT_COURT_NOTIFICATION:
        handled = await this.internalDeliveryService.deliver(
          message.user,
          message.caseId,
          'notification',
          { type: NotificationType.DEFENDANTS_NOT_UPDATED_AT_COURT },
        )
        break
      case OldMessageType.SEND_RULING_NOTIFICATION:
        handled = await this.internalDeliveryService.deliver(
          message.user,
          message.caseId,
          'notification',
          { type: NotificationType.RULING },
        )
        break
      case OldMessageType.SEND_MODIFIED_NOTIFICATION:
        handled = await this.internalDeliveryService.deliver(
          message.user,
          message.caseId,
          'notification',
          { type: NotificationType.MODIFIED },
        )
        break
      case OldMessageType.SEND_REVOKED_NOTIFICATION:
        handled = await this.internalDeliveryService.deliver(
          message.user,
          message.caseId,
          'notification',
          { type: NotificationType.REVOKED },
        )
        break
      case OldMessageType.SEND_DEFENDER_ASSIGNED_NOTIFICATION:
        handled = await this.internalDeliveryService.deliver(
          message.user,
          message.caseId,
          'notification',
          { type: NotificationType.DEFENDER_ASSIGNED },
        )
        break
      case OldMessageType.SEND_APPEAL_TO_COURT_OF_APPEALS_NOTIFICATION:
        handled = await this.internalDeliveryService.deliver(
          message.user,
          message.caseId,
          'notification',
          {
            type: NotificationType.APPEAL_TO_COURT_OF_APPEALS,
          },
        )
        break
      case OldMessageType.SEND_APPEAL_RECEIVED_BY_COURT_NOTIFICATION:
        handled = await this.internalDeliveryService.deliver(
          message.user,
          message.caseId,
          'notification',
          { type: NotificationType.APPEAL_RECEIVED_BY_COURT },
        )
        break
      case OldMessageType.SEND_APPEAL_STATEMENT_NOTIFICATION:
        handled = await this.internalDeliveryService.deliver(
          message.user,
          message.caseId,
          'notification',
          { type: NotificationType.APPEAL_STATEMENT },
        )
        break
      case OldMessageType.SEND_APPEAL_COMPLETED_NOTIFICATION:
        handled = await this.internalDeliveryService.deliver(
          message.user,
          message.caseId,
          'notification',
          { type: NotificationType.APPEAL_COMPLETED },
        )
        break
      case OldMessageType.SEND_APPEAL_JUDGES_ASSIGNED_NOTIFICATION:
        handled = await this.internalDeliveryService.deliver(
          message.user,
          message.caseId,
          'notification',
          { type: NotificationType.APPEAL_JUDGES_ASSIGNED },
        )
        break
      case OldMessageType.SEND_APPEAL_CASE_FILES_UPDATED_NOTIFICATION:
        handled = await this.internalDeliveryService.deliver(
          message.user,
          message.caseId,
          'notification',
          { type: NotificationType.APPEAL_CASE_FILES_UPDATED },
        )
        break
      case OldMessageType.SEND_APPEAL_WITHDRAWN_NOTIFICATION:
        handled = await this.internalDeliveryService.deliver(
          message.user,
          message.caseId,
          'notification',
          { type: NotificationType.APPEAL_WITHDRAWN },
        )
        break
      case OldMessageType.SEND_INDICTMENT_DENIED_NOTIFICATION:
        handled = await this.internalDeliveryService.deliver(
          message.user,
          message.caseId,
          'notification',
          { type: NotificationType.INDICTMENT_DENIED },
        )
        break
      default:
        if (message.type in MessageType) {
          handled = await this.internalDeliveryService.deliver(
            message.user,
            message.caseId,
            `${messageEndpoint[message.type]}${
              message.elementId ? `/${message.elementId}` : ''
            }`,
            message.body,
          )
        } else {
          this.logger.error('Unknown message type', { msg: message })
        }
    }

    this.logger.debug(`Message ${handled ? 'handled' : 'not handled'}`, {
      msg: message,
    })

    return handled
  }

  private async receiveMessages(resolve: () => void): Promise<void> {
    this.logger.info('Message handler started')

    this.running = true

    while (this.running) {
      this.logger.debug('Checking for messages')

      await this.messageService
        .receiveMessagesFromQueue(async (message: CaseMessage) => {
          return await this.handleMessage(message)
        })
        .catch(async (error) => {
          this.logger.error('Error handling message', { error })

          // Wait a bit before trying again
          await new Promise((resolve) =>
            setTimeout(resolve, this.config.waitTimeSeconds * 1000),
          )
        })
    }

    this.logger.info('Message handler stopped')

    resolve()
  }

  async run(): Promise<void> {
    this.runner = new Promise<void>((resolve) => {
      this.receiveMessages(resolve)
    })
  }

  async onModuleDestroy() {
    this.running = false

    if (this.runner) {
      await this.runner
    }
  }
}
