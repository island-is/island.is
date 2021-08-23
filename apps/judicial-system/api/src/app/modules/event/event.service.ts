import fetch from 'isomorphic-fetch'

import { Injectable } from '@nestjs/common'

import { Case } from '@island.is/judicial-system/types'
import { capitalize, caseTypes } from '@island.is/judicial-system/formatters'

import { environment } from '../../../environments'

const caseEvent = {
  CREATE: ':new: Krafa stofnuð',
  EXTEND: ':recycle: Krafa framlengd',
  OPEN: ':unlock: Krafa opnuð fyrir dómstól',
  SUBMIT: ':mailbox_with_mail: Krafa send til dómstóls',
  RECEIVE: ':eyes: Krafa móttekin',
  ACCEPT: ':white_check_mark: Krafa samþykkt',
  REJECT: ':negative_squared_cross_mark: Kröfu hafnað',
  DELETE: ':fire: Krafa dregin til baka',
}

export enum CaseEvent {
  CREATE = 'CREATE',
  EXTEND = 'EXTEND',
  OPEN = 'OPEN',
  SUBMIT = 'SUBMIT',
  RECEIVE = 'RECEIVE',
  ACCEPT = 'ACCEPT',
  REJECT = 'REJECT',
  DELETE = 'DELETE',
}

@Injectable()
export class EventService {
  postEvent(event: CaseEvent, theCase: Case) {
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
          theCase.courtCaseNumber ? ` *${theCase.courtCaseNumber}*` : ''
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
              text: `*${caseEvent[event]}:*\n>${typeText}\n>${prosecutionText}\n>${courtText}`,
            },
          },
        ],
      }),
    })
  }
}
