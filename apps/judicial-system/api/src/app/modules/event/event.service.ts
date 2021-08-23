import fetch from 'isomorphic-fetch'

import { Injectable } from '@nestjs/common'

import { Case } from '@island.is/judicial-system/types'
import { capitalize, caseTypes } from '@island.is/judicial-system/formatters'

import { environment } from '../../../environments'

const caseEvent = {
  CREATE: 'Krafa stofnuð',
  EXTEND: 'Krafa framlengd',
  OPEN: 'Krafa opnuð fyrir dómstól',
  SUBMIT: 'Krafa send til dómstóls',
  RECEIVE: 'Krafa móttekin',
  ACCEPT: 'Krafa samþykkt',
  REJECT: 'Kröfu hafnað',
  DELETE: 'Krafa dregin til baka',
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
      theCase.description ? `/${theCase.description}` : ''
    }`
    const prosecutionText = `${
      theCase.prosecutor?.institution
        ? `${theCase.prosecutor?.institution}/`
        : ''
    }${theCase.policeCaseNumber}`
    const courtText = theCase.court
      ? ` - ${theCase.court.name}${
          theCase.courtCaseNumber ? `/${theCase.courtCaseNumber}` : ''
        }`
      : ''

    fetch(`${environment.events.url}`, {
      method: 'POST',
      headers: { 'Content-type': 'application/json' },
      body: JSON.stringify({
        text: `${caseEvent[event]}: ${typeText} - ${prosecutionText}${courtText}`,
      }),
    })
  }
}
