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
import {
  CaseTransition,
  isIndictmentCase,
} from '@island.is/judicial-system/types'

import { type Case, DateLog } from '../repository'
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

const caseEvent: Record<CaseEvent, string> = {
  [CaseTransition.ACCEPT]: ':white_check_mark: Samþykkt',
  [CaseTransition.APPEAL]: ':judge: Kæra',
  ARCHIVE: ':file_cabinet: Sett í geymslu',
  [CaseTransition.ASK_FOR_CANCELLATION]: ':interrobang: Beðið um afturköllun',
  [CaseTransition.ASK_FOR_CONFIRMATION]: ':question: Beðið um staðfestingu',
  [CaseTransition.COMPLETE]: ':white_check_mark: Lokið',
  [CaseTransition.COMPLETE_APPEAL]: ':white_check_mark: Kæru lokið',
  [CaseTransition.DELETE]: ':fire: Afturkallað',
  [CaseTransition.DENY_INDICTMENT]: ':no_entry_sign: Ákæru hafnað',
  [CaseTransition.DISMISS]: ':woman-shrugging: Vísað frá',
  CREATE: ':new: Mál stofnað',
  CREATE_XRD: ':new: Mál stofnað í gegnum Strauminn',
  EXTEND: ':recycle: Mál framlengt',
  [CaseTransition.OPEN]: ':unlock: Opnað fyrir dómstól',
  [CaseTransition.RECEIVE]: ':eyes: Móttekið',
  [CaseTransition.RECEIVE_APPEAL]: ':eyes: Kæra móttekin',
  [CaseTransition.REJECT]: ':negative_squared_cross_mark: Hafnað',
  [CaseTransition.REOPEN]: ':construction: Opnað aftur',
  [CaseTransition.REOPEN_APPEAL]: ':building_construction: Kæra opnuð aftur',
  RESUBMIT: ':mailbox_with_mail: Sent aftur',
  [CaseTransition.RETURN_INDICTMENT]: ':woman-gesturing-no: Ákæru afturkallað',
  SCHEDULE_COURT_DATE: ':timer_clock: Fyrirtökutíma úthlutað',
  SUBPOENA_SERVICE_STATUS: ':page_with_curl: Staða fyrirkalls uppfærð',
  [CaseTransition.SUBMIT]: ':mailbox_with_mail: Sent',
  [CaseTransition.WITHDRAW_APPEAL]:
    ':leftwards_arrow_with_hook: Kæru afturkallað',
  [CaseTransition.MOVE]: ':flying_disc: Máli úthlutað á nýjan dómstól',
}

export type CaseEvent =
  | CaseTransition
  | 'ARCHIVE'
  | 'CREATE'
  | 'CREATE_XRD'
  | 'EXTEND'
  | 'RESUBMIT'
  | 'SCHEDULE_COURT_DATE'
  | 'SUBPOENA_SERVICE_STATUS'

const caseEventsToLog = [
  'CREATE',
  'CREATE_XRD',
  'SCHEDULE_COURT_DATE',
  'SUBPOENA_SERVICE_STATUS',
  'COMPLETE',
  'ACCEPT',
  'REJECT',
  'DISMISS',
]

@Injectable()
export class EventService {
  constructor(
    @Inject(eventModuleConfig.KEY)
    private readonly config: ConfigType<typeof eventModuleConfig>,
    @Inject(LOGGER_PROVIDER)
    private readonly logger: Logger,
  ) {}

  async postEvent(
    event: CaseEvent,
    theCase: Case,
    eventOnly = false,
    info?: { [key: string]: string | boolean | Date | undefined },
  ) {
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
      const courtDateText =
        event === 'SCHEDULE_COURT_DATE'
          ? `\n>Dómari ${
              theCase.judge?.name ?? 'er ekki skráður'
            }\n>Dómritari ${
              theCase.registrar?.name ?? 'er ekki skráður'
            }\n>Fyrirtaka ${
              formatDate(
                DateLog.courtDate(theCase.dateLogs)?.date ??
                  DateLog.arraignmentDate(theCase.dateLogs)?.date,
                'Pp',
              ) ?? 'er ekki skráð'
            }`
          : ''

      const infoText = this.getInfoText(info)

      await fetch(`${this.config.url}`, {
        method: 'POST',
        headers: { 'Content-type': 'application/json' },
        body: JSON.stringify({
          blocks: [
            {
              type: 'section',
              text: {
                type: 'mrkdwn',
                text: `*${title}*\n>${typeText}\n>${prosecutionText}${courtText}${courtOfAppealsText}${courtDateText}\n>${infoText}`,
              },
            },
          ],
        }),
      })
      this.logInfo(event, theCase)
    } catch (error) {
      // Tolerate failure, but log error
      this.logger.error(
        `Failed to post event ${event} for case ${theCase.id}`,
        { error },
      )
    }
  }

  async postDailyLawyerRegistryResetEvent(count: number) {
    const title = ':arrows_counterclockwise: Lögmannaskrá'
    const message = `Lögmannaskrá uppfærð. Alls ${count} lögmenn á skrá.`

    try {
      if (!this.config.url) {
        return
      }

      await fetch(`${this.config.url}`, {
        method: 'POST',
        headers: { 'Content-type': 'application/json' },
        body: JSON.stringify({
          blocks: [
            {
              type: 'section',
              text: {
                type: 'mrkdwn',
                text: `*${title}*\n${message}`,
              },
            },
          ],
        }),
      })
    } catch (error) {
      this.logger.error(`Failed to reset lawyer registry`, {
        error,
      })
    }
  }

  async postDailyHearingArrangementEvents(date: Date, cases: Case[]) {
    const title = `:judge: Fyrirtökur ${formatDate(date)}`

    const arrangementTexts = cases.map((theCase) => {
      return `>${theCase.courtCaseNumber}: ${
        formatDate(
          DateLog.courtDate(theCase.dateLogs)?.date ??
            DateLog.arraignmentDate(theCase.dateLogs)?.date,
          'p',
        ) ?? date
      }`
    })

    const arrangementSummary =
      arrangementTexts.length > 0
        ? arrangementTexts.join('\n')
        : '>Engar fyrirtökur á dagskrá'

    try {
      if (!this.config.url) {
        return
      }

      await fetch(`${this.config.url}`, {
        method: 'POST',
        headers: { 'Content-type': 'application/json' },
        body: JSON.stringify({
          blocks: [
            {
              type: 'section',
              text: {
                type: 'mrkdwn',
                text: `*${title}*\n${arrangementSummary}`,
              },
            },
          ],
        }),
      })
    } catch (error) {
      this.logger.error(`Failed to post court hearing arrangement summary`, {
        error,
      })
    }
  }

  async postErrorEvent(
    message: string,
    info: { [key: string]: string | boolean | Date | undefined },
    reason: Error,
  ) {
    try {
      if (!this.config.errorUrl) {
        return
      }

      const infoText = this.getInfoText(info)

      await fetch(`${this.config.errorUrl}`, {
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

  getInfoText = (info?: {
    [key: string]: string | boolean | Date | undefined
  }) => {
    let infoText = ''

    if (info) {
      let property: keyof typeof info
      for (property in info) {
        infoText = `${infoText}${property}: ${
          info[property] ?? 'Ekki skráð'
        }\n>`
      }
    }

    return infoText
  }

  logInfo = (event: CaseEvent, theCase: Case) => {
    if (!caseEventsToLog.includes(event)) {
      return
    }

    let extraInfo

    switch (event) {
      case 'SCHEDULE_COURT_DATE':
        extraInfo = `courtDate: ${formatDate(
          DateLog.courtDate(theCase.dateLogs)?.date ??
            DateLog.arraignmentDate(theCase.dateLogs)?.date,
          'Pp',
        )}`
        break
      default:
        break
    }

    this.logger.info(`Event ${event} for case ${theCase.id}`, {
      caseId: theCase.id,
      event,
      extraInfo,
    })
  }
}
