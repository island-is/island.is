import React, { useContext, useEffect, useState } from 'react'
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
  titles,
} from '@island.is/judicial-system-web/messages'
import { FormContext } from '@island.is/judicial-system-web/src/components/FormProvider/FormProvider'
import { UserContext } from '@island.is/judicial-system-web/src/components/UserProvider/UserProvider'
import PageHeader from '@island.is/judicial-system-web/src/components/PageHeader/PageHeader'

import CourtRecordForm from './CourtRecordForm'

const CourtRecord = () => {
  const [initialAutoFillDone, setInitialAutoFillDone] = useState(false)
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
    if (isCaseUpToDate && !initialAutoFillDone) {
      if (workingCase.courtDate) {
        autofill('courtStartDate', workingCase.courtDate, workingCase)
      }

      if (workingCase.court) {
        autofill(
          'courtLocation',
          `í ${
            workingCase.court.name.indexOf('dómur') > -1
              ? workingCase.court.name.replace('dómur', 'dómi')
              : workingCase.court.name
          }`,
          workingCase,
        )
      }

      if (workingCase.courtAttendees !== '') {
        let autofillAttendees = ''

        if (workingCase.prosecutor) {
          autofillAttendees += `${workingCase.prosecutor.name} ${workingCase.prosecutor.title}`
        }

        if (
          workingCase.defenderName &&
          workingCase.sessionArrangements !==
            SessionArrangements.PROSECUTOR_PRESENT
        ) {
          autofillAttendees += `\n${workingCase.defenderName} skipaður ${
            workingCase.defenderIsSpokesperson ? 'talsmaður' : 'verjandi'
          } ${formatMessage(core.defendant, { suffix: 'a' })}`
        }

        if (workingCase.translator) {
          autofillAttendees += `\n${workingCase.translator} túlkur`
        }

        if (workingCase.defendants && workingCase.defendants.length > 0) {
          if (
            workingCase.sessionArrangements === SessionArrangements.ALL_PRESENT
          ) {
            workingCase.defendants.forEach((defendant) => {
              autofillAttendees += `\n${defendant.name} ${formatMessage(
                core.defendant,
                {
                  suffix: 'i',
                },
              )}`
            })
          }
        }

        autofill('courtAttendees', autofillAttendees, workingCase)
      }

      if (workingCase.type === CaseType.RESTRAINING_ORDER) {
        autofill(
          'sessionBookings',
          formatMessage(m.sections.sessionBookings.autofillRestrainingOrder),
          workingCase,
        )
      } else if (workingCase.type === CaseType.AUTOPSY) {
        autofill(
          'sessionBookings',
          formatMessage(m.sections.sessionBookings.autofillAutopsy),
          workingCase,
        )
      } else if (
        workingCase.sessionArrangements === SessionArrangements.ALL_PRESENT
      ) {
        let autofillSessionBookings = ''

        if (workingCase.defenderName) {
          autofillSessionBookings += `${formatMessage(
            m.sections.sessionBookings.autofillDefender,
            {
              defender: workingCase.defenderName,
            },
          )}\n\n`
        }

        if (workingCase.translator) {
          autofillSessionBookings += `${formatMessage(
            m.sections.sessionBookings.autofillTranslator,
            {
              translator: workingCase.translator,
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

        autofill('sessionBookings', autofillSessionBookings, workingCase)
      } else if (
        workingCase.sessionArrangements ===
        SessionArrangements.ALL_PRESENT_SPOKESPERSON
      ) {
        autofill(
          'sessionBookings',
          formatMessage(m.sections.sessionBookings.autofillSpokeperson),
          workingCase,
        )
      } else if (
        workingCase.sessionArrangements ===
        SessionArrangements.PROSECUTOR_PRESENT
      ) {
        autofill(
          'sessionBookings',
          formatMessage(m.sections.sessionBookings.autofillProsecutor),
          workingCase,
        )
      }

      setInitialAutoFillDone(true)
      setWorkingCase({ ...workingCase })
    }
  }, [
    autofill,
    formatMessage,
    initialAutoFillDone,
    isCaseUpToDate,
    setWorkingCase,
    workingCase,
  ])

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
