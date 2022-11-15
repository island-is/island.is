import fetch from 'isomorphic-fetch'

import { Inject, Injectable } from '@nestjs/common'

import { LOGGER_PROVIDER } from '@island.is/logging'
import type { Logger } from '@island.is/logging'
import {
  capitalize,
  caseTypes,
  formatDate,
} from '@island.is/judicial-system/formatters'
import { isIndictmentCase } from '@island.is/judicial-system/types'

import { environment } from '../../../environments'
import { Case } from '../case'

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
  SUBMIT: ':mailbox_with_mail: Sent',
  RESUBMIT: ':mailbox_with_mail: Sent aftur',
  RECEIVE: ':eyes: Móttekið',
  ACCEPT: ':white_check_mark: Samþykkt',
  ACCEPT_INDICTMENT: ':white_check_mark: Lokið',
  REJECT: ':negative_squared_cross_mark: Hafnað',
  DELETE: ':fire: Afturkallað',
  SCHEDULE_COURT_DATE: ':timer_clock: Úthlutað fyrirtökutíma',
  DISMISS: ':woman-shrugging: Vísað frá',
  ARCHIVE: ':file_cabinet: Sett í geymslu',
}

export enum CaseEvent {
  CREATE = 'CREATE',
  CREATE_XRD = 'CREATE_XRD',
  EXTEND = 'EXTEND',
  OPEN = 'OPEN',
  SUBMIT = 'SUBMIT',
  RESUBMIT = 'RESUBMIT',
  RECEIVE = 'RECEIVE',
  ACCEPT = 'ACCEPT',
  ACCEPT_INDICTMENT = 'ACCEPT_INDICTMENT',
  REJECT = 'REJECT',
  DELETE = 'DELETE',
  SCHEDULE_COURT_DATE = 'SCHEDULE_COURT_DATE',
  DISMISS = 'DISMISS',
  ARCHIVE = 'ARCHIVE',
}

@Injectable()
export class EventService {
  constructor(
    @Inject(LOGGER_PROVIDER)
    private readonly logger: Logger,
  ) {}

  postEvent(event: CaseEvent, theCase: Case) {
    try {
      if (!environment.events.url) {
        return
      }

      const title =
        event === CaseEvent.ACCEPT && isIndictmentCase(theCase.type)
          ? caseEvent[CaseEvent.ACCEPT_INDICTMENT]
          : caseEvent[event]
      const typeText = `${capitalize(caseTypes[theCase.type])} *${theCase.id}*`
      const prosecutionText = `${
        theCase.creatingProsecutor?.institution
          ? `${theCase.creatingProsecutor?.institution?.name} `
          : ''
      }*${theCase.policeCaseNumbers.join(', ')}*`
      const courtText = theCase.court
        ? `${theCase.court.name} ${
            theCase.courtCaseNumber ? `*${theCase.courtCaseNumber}*` : ''
          }`
        : ''
      const extraText =
        event === CaseEvent.SCHEDULE_COURT_DATE
          ? `\n>Dómari ${
              theCase.judge?.name ?? 'er ekki skráður'
            }\n>Dómritari ${
              theCase.registrar?.name ?? 'er ekki skráður'
            }\n>Fyrirtaka ${
              formatDate(theCase.courtDate, 'Pp') ?? 'er ekki skráð'
            }`
          : ''

      fetch(`${environment.events.url}`, {
        method: 'POST',
        headers: { 'Content-type': 'application/json' },
        body: JSON.stringify({
          blocks: [
            {
              type: 'section',
              text: {
                type: 'mrkdwn',
                text: `*${title}*\n>${typeText}\n>${prosecutionText}\n>${courtText}${extraText}`,
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
    info: { [key: string]: string | boolean | undefined },
    reason: Error,
  ) {
    try {
      if (!environment.events.errorUrl) {
        return
      }

      let infoText = ''

      if (info) {
        let property: keyof typeof info
        for (property in info) {
          infoText = `${infoText}${property}: ${info[property]}\n`
        }
      }

      fetch(`${environment.events.errorUrl}`, {
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
