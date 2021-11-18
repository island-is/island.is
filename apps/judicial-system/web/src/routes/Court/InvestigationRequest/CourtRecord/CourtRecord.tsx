import React, { useContext, useEffect } from 'react'
import { useIntl } from 'react-intl'
import formatISO from 'date-fns/formatISO'

import { PageLayout } from '@island.is/judicial-system-web/src/components'
import { SessionArrangements } from '@island.is/judicial-system/types'
import {
  JudgeSubsections,
  Sections,
} from '@island.is/judicial-system-web/src/types'
import { useCase } from '@island.is/judicial-system-web/src/utils/hooks'
import { FormContext } from '@island.is/judicial-system-web/src/components/FormProvider/FormProvider'
import { icCourtRecord as m } from '@island.is/judicial-system-web/messages'
import type { Case } from '@island.is/judicial-system/types'

import CourtRecordForm from './CourtRecordForm'

const CourtRecord = () => {
  const { autofill } = useCase()
  const { formatMessage } = useIntl()
  const {
    workingCase,
    setWorkingCase,
    isLoadingWorkingCase,
    caseNotFound,
  } = useContext(FormContext)

  useEffect(() => {
    document.title = 'Þingbók - Réttarvörslugátt'
  }, [])

  useEffect(() => {
    const defaultCourtAttendees = (wc: Case): string => {
      let attendees = ''

      if (
        wc.prosecutor &&
        wc.sessionArrangements !== SessionArrangements.REMOTE_SESSION
      ) {
        attendees += `${wc.prosecutor.name} ${wc.prosecutor.title}\n`
      }

      if (wc.sessionArrangements === SessionArrangements.ALL_PRESENT) {
        if (wc.accusedName) {
          attendees += `${wc.accusedName} varnaraðili`
        }
      } else {
        attendees += formatMessage(
          m.sections.courtAttendees.defendantNotPresentAutofill,
        )
      }

      if (
        wc.defenderName &&
        wc.sessionArrangements !== SessionArrangements.REMOTE_SESSION
      ) {
        attendees += `\n${wc.defenderName} skipaður ${
          wc.defenderIsSpokesperson ? 'talsmaður' : 'verjandi'
        } varnaraðila`
      }

      if (
        wc.translator &&
        wc.sessionArrangements !== SessionArrangements.REMOTE_SESSION
      ) {
        attendees += `\n${wc.translator} túlkur`
      }

      return attendees
    }

    if (workingCase.id !== '') {
      const theCase = workingCase

      autofill('courtStartDate', formatISO(new Date()), theCase)

      if (theCase.court) {
        autofill(
          'courtLocation',
          `í ${
            theCase.court.name.indexOf('dómur') > -1
              ? theCase.court.name.replace('dómur', 'dómi')
              : theCase.court.name
          }`,
          theCase,
        )
      }

      if (theCase.courtAttendees !== '') {
        autofill('courtAttendees', defaultCourtAttendees(theCase), theCase)
      }

      if (theCase.demands) {
        autofill('prosecutorDemands', theCase.demands, theCase)
      }

      if (theCase.sessionArrangements === SessionArrangements.REMOTE_SESSION) {
        autofill(
          'litigationPresentations',
          formatMessage(m.sections.litigationPresentations.autofill),
          theCase,
        )
      }

      if (theCase.sessionArrangements === SessionArrangements.ALL_PRESENT) {
        let autofillAccusedBookings = ''

        if (theCase.defenderName) {
          autofillAccusedBookings += `${formatMessage(
            m.sections.accusedBookings.autofillDefender,
            {
              defender: theCase.defenderName,
            },
          )}\n\n`
        }

        if (theCase.translator) {
          autofillAccusedBookings += `${formatMessage(
            m.sections.accusedBookings.autofillTranslator,
            {
              translator: theCase.translator,
            },
          )}\n\n`
        }

        autofillAccusedBookings += `${formatMessage(
          m.sections.accusedBookings.autofillRightToRemainSilent,
        )}\n\n${formatMessage(
          m.sections.accusedBookings.autofillCourtDocumentOne,
        )}\n\n${formatMessage(m.sections.accusedBookings.autofillAccusedPlea)}`

        autofill('accusedBookings', autofillAccusedBookings, theCase)
      }

      if (
        theCase.sessionArrangements ===
          SessionArrangements.ALL_PRESENT_SPOKESPERSON &&
        theCase.defenderIsSpokesperson &&
        theCase.defenderName
      ) {
        autofill(
          'accusedBookings',
          formatMessage(m.sections.accusedBookings.autofillSpokeperson, {
            spokesperson: theCase.defenderName,
          }),
          theCase,
        )
      }

      setWorkingCase(theCase)
    }
  }, [workingCase, setWorkingCase, autofill, formatMessage])

  return (
    <PageLayout
      workingCase={workingCase}
      activeSection={
        workingCase?.parentCase ? Sections.JUDGE_EXTENSION : Sections.JUDGE
      }
      activeSubSection={JudgeSubsections.COURT_RECORD}
      isLoading={isLoadingWorkingCase}
      notFound={caseNotFound}
    >
      <CourtRecordForm
        workingCase={workingCase}
        setWorkingCase={setWorkingCase}
        isLoading={isLoadingWorkingCase}
      />
    </PageLayout>
  )
}

export default CourtRecord
