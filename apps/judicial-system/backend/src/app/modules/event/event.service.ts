import fetch from 'isomorphic-fetch'

import { Inject, Injectable } from '@nestjs/common'

import { LOGGER_PROVIDER } from '@island.is/logging'
import type { Logger } from '@island.is/logging'
import {
  capitalize,
  caseTypes,
  formatDate,
} from '@island.is/judicial-system/formatters'

import { environment } from '../../../environments'
import { Case } from '../case/models/case.model'

const caseEvent = {
  CREATE: ':new: Krafa stofnuð',
  CREATE_XRD: ':new: Krafa stofnuð í gegnum Strauminn',
  EXTEND: ':recycle: Krafa framlengd',
  OPEN: ':unlock: Krafa opnuð fyrir dómstól',
  SUBMIT: ':mailbox_with_mail: Krafa send til dómstóls',
  RESUBMIT: ':mailbox_with_mail: Krafa send aftur til dómstóls',
  RECEIVE: ':eyes: Krafa móttekin',
  ACCEPT: ':white_check_mark: Krafa samþykkt',
  REJECT: ':negative_squared_cross_mark: Kröfu hafnað',
  DELETE: ':fire: Krafa dregin til baka',
  SCHEDULE_COURT_DATE: ':timer_clock: Kröfu úthlutað fyrirtökutíma',
  DISMISS: ':woman-shrugging: Kröfu vísað frá',
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
  REJECT = 'REJECT',
  DELETE = 'DELETE',
  SCHEDULE_COURT_DATE = 'SCHEDULE_COURT_DATE',
  DISMISS = 'DISMISS',
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

      const typeText = `${capitalize(caseTypes[theCase.type])}${
        theCase.description ? ` - _${theCase.description}_` : ''
      }`
      const prosecutionText = `${
        theCase.prosecutor?.institution
          ? `${theCase.prosecutor?.institution?.name} `
          : ''
      }*${theCase.policeCaseNumber}*`
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
              // color: '#2eb886',
              text: {
                type: 'mrkdwn',
                text: `*${caseEvent[event]}:*\n>${typeText}\n>${prosecutionText}\n>${courtText}${extraText}`,
              },
            },
          ],
        }),
      })
    } catch (error) {
      this.logger.error(
        `Failed to post event ${event} for case ${theCase.id}`,
        error,
      )
    }
  }
}
