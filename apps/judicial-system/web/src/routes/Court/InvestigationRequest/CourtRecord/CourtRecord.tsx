import React, { useContext, useEffect } from 'react'
import { useIntl } from 'react-intl'

import { PageLayout } from '@island.is/judicial-system-web/src/components'
import { CaseType, SessionArrangements } from '@island.is/judicial-system/types'
import {
  CourtSubsections,
  Sections,
} from '@island.is/judicial-system-web/src/types'
import { useCase } from '@island.is/judicial-system-web/src/utils/hooks'
import {
  core,
  icCourtRecord as m,
} from '@island.is/judicial-system-web/messages'
import { FormContext } from '@island.is/judicial-system-web/src/components/FormProvider/FormProvider'
import { UserContext } from '@island.is/judicial-system-web/src/components/UserProvider/UserProvider'
import PageHeader from '@island.is/judicial-system-web/src/components/PageHeader/PageHeader'
import { titles } from '@island.is/judicial-system-web/messages/Core/titles'

import CourtRecordForm from './CourtRecordForm'

const CourtRecord = () => {
  const { autofill } = useCase()
  const { formatMessage } = useIntl()
  const {
    workingCase,
    setWorkingCase,
    isLoadingWorkingCase,
    caseNotFound,
    isCaseUpToDate,
  } = useContext(FormContext)
  const { user } = useContext(UserContext)

  useEffect(() => {
    if (isCaseUpToDate) {
      const theCase = workingCase

      if (theCase.courtDate) {
        autofill('courtStartDate', theCase.courtDate, theCase)
      }

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
        let autofillAttendees = ''

        if (theCase.prosecutor) {
          autofillAttendees += `${theCase.prosecutor.name} ${theCase.prosecutor.title}`
        }

        if (
          theCase.defenderName &&
          theCase.sessionArrangements !== SessionArrangements.PROSECUTOR_PRESENT
        ) {
          autofillAttendees += `\n${theCase.defenderName} skipaður ${
            theCase.defenderIsSpokesperson ? 'talsmaður' : 'verjandi'
          } ${formatMessage(core.defendant, { suffix: 'a' })}`
        }

        if (theCase.translator) {
          autofillAttendees += `\n${theCase.translator} túlkur`
        }

        if (theCase.defendants && theCase.defendants.length > 0) {
          if (theCase.sessionArrangements === SessionArrangements.ALL_PRESENT) {
            theCase.defendants.forEach((defendant) => {
              autofillAttendees += `\n${defendant.name} ${formatMessage(
                core.defendant,
                {
                  suffix: 'i',
                },
              )}`
            })
          }
        }

        autofill('courtAttendees', autofillAttendees, theCase)
      }

      if (theCase.type === CaseType.RESTRAINING_ORDER) {
        autofill(
          'sessionBookings',
          formatMessage(m.sections.sessionBookings.autofillRestrainingOrder),
          theCase,
        )
      } else if (theCase.type === CaseType.AUTOPSY) {
        autofill(
          'sessionBookings',
          formatMessage(m.sections.sessionBookings.autofillAutopsy),
          theCase,
        )
      } else if (
        theCase.sessionArrangements === SessionArrangements.ALL_PRESENT
      ) {
        let autofillSessionBookings = ''

        if (theCase.defenderName) {
          autofillSessionBookings += `${formatMessage(
            m.sections.sessionBookings.autofillDefender,
            {
              defender: theCase.defenderName,
            },
          )}\n\n`
        }

        if (theCase.translator) {
          autofillSessionBookings += `${formatMessage(
            m.sections.sessionBookings.autofillTranslator,
            {
              translator: theCase.translator,
            },
          )}\n\n`
        }

        autofillSessionBookings += `${formatMessage(
          m.sections.sessionBookings.autofillRightToRemainSilent,
        )}\n\n${formatMessage(
          m.sections.sessionBookings.autofillCourtDocumentOne,
        )}\n\n${formatMessage(
          m.sections.sessionBookings.autofillAccusedPlea,
        )}\n\n${formatMessage(m.sections.sessionBookings.autofillAllPresent)}`

        autofill('sessionBookings', autofillSessionBookings, theCase)
      } else if (
        theCase.sessionArrangements ===
        SessionArrangements.ALL_PRESENT_SPOKESPERSON
      ) {
        autofill(
          'sessionBookings',
          formatMessage(m.sections.sessionBookings.autofillSpokeperson),
          theCase,
        )
      } else if (
        theCase.sessionArrangements === SessionArrangements.PROSECUTOR_PRESENT
      ) {
        autofill(
          'sessionBookings',
          formatMessage(m.sections.sessionBookings.autofillProsecutor),
          theCase,
        )
      }

      setWorkingCase(theCase)
    }
  }, [autofill, formatMessage, isCaseUpToDate, setWorkingCase, workingCase])

  return (
    <PageLayout
      workingCase={workingCase}
      activeSection={
        workingCase?.parentCase ? Sections.JUDGE_EXTENSION : Sections.JUDGE
      }
      activeSubSection={CourtSubsections.COURT_RECORD}
      isLoading={isLoadingWorkingCase}
      notFound={caseNotFound}
    >
      <PageHeader
        title={formatMessage(titles.court.investigationCases.courtRecord)}
      />
      <CourtRecordForm
        workingCase={workingCase}
        setWorkingCase={setWorkingCase}
        isLoading={isLoadingWorkingCase}
        user={user}
      />
    </PageLayout>
  )
}

export default CourtRecord
