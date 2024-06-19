import fetch from 'isomorphic-fetch'

import { Inject, Injectable } from '@nestjs/common'

import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'
import type { ConfigType } from '@island.is/nest/config'

import {
  capitalize,
  formatCaseType,
  formatDate,
  readableIndictmentSubtypes,
} from '@island.is/judicial-system/formatters'
import { isIndictmentCase } from '@island.is/judicial-system/types'

import { type Case } from '../case'
import { DateLog } from '../case/models/dateLog.model'
import { ExplanatoryComment } from '../case/models/explanatoryComment.model'
import { eventModuleConfig } from './event.config'

const errorEmojis = [
  ':sos:',
  ':scream:',
  ':exploding_head:',
  ':cry:',
  ':fearful:',
  ':face_with_raised_eyebrow:',
  ':unamused:',
  ':face_with_monocle:',
  ':skull_and_crossbones:',
  ':see_no_evil:',
  ':hear_no_evil:',
  ':speak_no_evil:',
  ':bomb:',
  ':bangbang:',
  ':x:',
]

const caseEvent = {
  CREATE: ':new: Mál stofnað',
  CREATE_XRD: ':new: Mál stofnað í gegnum Strauminn',
  EXTEND: ':recycle: Mál framlengt',
  OPEN: ':unlock: Opnað fyrir dómstól',
  ASK_FOR_CONFIRMATION: ':question: Beðið um staðfestingu',
  SUBMIT: ':mailbox_with_mail: Sent',
  RESUBMIT: ':mailbox_with_mail: Sent aftur',
  RECEIVE: ':eyes: Móttekið',
  ACCEPT: ':white_check_mark: Samþykkt',
  REJECT: ':negative_squared_cross_mark: Hafnað',
  DISMISS: ':woman-shrugging: Vísað frá',
  COMPLETE: ':white_check_mark: Lokið',
  DELETE: ':fire: Afturkallað',
  SCHEDULE_COURT_DATE: ':timer_clock: Fyrirtökutíma úthlutað',
  ARCHIVE: ':file_cabinet: Sett í geymslu',
  REOPEN: ':construction: Opnað aftur',
  APPEAL: ':judge: Kæra',
  RECEIVE_APPEAL: ':eyes: Kæra móttekin',
  COMPLETE_APPEAL: ':white_check_mark: Kæru lokið',
  REOPEN_APPEAL: ':building_construction: Kæra opnuð aftur',
}

export enum CaseEvent {
  CREATE = 'CREATE',
  CREATE_XRD = 'CREATE_XRD',
  EXTEND = 'EXTEND',
  OPEN = 'OPEN',
  ASK_FOR_CONFIRMATION = 'ASK_FOR_CONFIRMATION',
  SUBMIT = 'SUBMIT',
  RESUBMIT = 'RESUBMIT',
  RECEIVE = 'RECEIVE',
  ACCEPT = 'ACCEPT',
  REJECT = 'REJECT',
  DELETE = 'DELETE',
  SCHEDULE_COURT_DATE = 'SCHEDULE_COURT_DATE',
  DISMISS = 'DISMISS',
  ARCHIVE = 'ARCHIVE',
  REOPEN = 'REOPEN',
  APPEAL = 'APPEAL',
  RECEIVE_APPEAL = 'RECEIVE_APPEAL',
  COMPLETE_APPEAL = 'COMPLETE_APPEAL',
  REOPEN_APPEAL = 'REOPEN_APPEAL',
}

@Injectable()
export class EventService {
  constructor(
    @Inject(eventModuleConfig.KEY)
    private readonly config: ConfigType<typeof eventModuleConfig>,
    @Inject(LOGGER_PROVIDER)
    private readonly logger: Logger,
  ) {}

  postEvent(event: CaseEvent, theCase: Case, eventOnly = false) {
    try {
      if (!this.config.url) {
        return
      }

      const title = `${caseEvent[event]}${
        eventOnly ? ' - aðgerð ekki framkvæmd' : ''
      }`
      const typeText = `${capitalize(formatCaseType(theCase.type))}${
        isIndictmentCase(theCase.type)
          ? `:(${readableIndictmentSubtypes(
              theCase.policeCaseNumbers,
              theCase.indictmentSubtypes,
            ).join(', ')})`
          : ''
      } *${theCase.id}*`
      const prosecutionText = `${
        theCase.prosecutorsOffice ? `${theCase.prosecutorsOffice.name} ` : ''
      }*${theCase.policeCaseNumbers.join(', ')}*`
      const courtText = theCase.court
        ? `\n>${theCase.court.name} ${
            theCase.courtCaseNumber ? `*${theCase.courtCaseNumber}*` : ''
          }`
        : ''
      const courtOfAppealsText = theCase.appealCaseNumber
        ? `\n>Landsréttur *${theCase.appealCaseNumber}*`
        : ''
      const extraText =
        event === CaseEvent.SCHEDULE_COURT_DATE
          ? `\n>Dómari ${
              theCase.judge?.name ?? 'er ekki skráður'
            }\n>Dómritari ${
              theCase.registrar?.name ?? 'er ekki skráður'
            }\n>Fyrirtaka ${
              ExplanatoryComment.postponedIndefinitelyExplanation(
                theCase.explanatoryComments,
              )
                ? 'ekki ákveðin'
                : formatDate(
                    DateLog.courtDate(theCase.dateLogs)?.date ??
                      DateLog.arraignmentDate(theCase.dateLogs)?.date,
                    'Pp',
                  ) ?? 'er ekki skráð'
            }`
          : ''

      fetch(`${this.config.url}`, {
        method: 'POST',
        headers: { 'Content-type': 'application/json' },
        body: JSON.stringify({
          blocks: [
            {
              type: 'section',
              text: {
                type: 'mrkdwn',
                text: `*${title}*\n>${typeText}\n>${prosecutionText}${courtText}${courtOfAppealsText}${extraText}`,
              },
            },
          ],
        }),
      })
    } catch (error) {
      // Tolerate failure, but log error
      this.logger.error(
        `Failed to post event ${event} for case ${theCase.id}`,
        { error },
      )
    }
  }

  postErrorEvent(
    message: string,
    info: { [key: string]: string | boolean | Date | undefined },
    reason: Error,
  ) {
    try {
      if (!this.config.errorUrl) {
        return
      }

      let infoText = ''

      if (info) {
        let property: keyof typeof info
        for (property in info) {
          infoText = `${infoText}${property}: ${info[property]}\n`
        }
      }

      fetch(`${this.config.errorUrl}`, {
        method: 'POST',
        headers: { 'Content-type': 'application/json' },
        body: JSON.stringify({
          blocks: [
            {
              type: 'section',
              text: {
                type: 'mrkdwn',
                text: `${
                  errorEmojis[Math.floor(Math.random() * errorEmojis.length)]
                } *${message}:*\n${infoText}>${JSON.stringify(reason)}`,
              },
            },
          ],
        }),
      })
    } catch (error) {
      // Tolerate failure, but log error
      this.logger.error(`Failed to post an error event`, { error })
    }
  }
}
