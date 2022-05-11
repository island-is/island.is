import React, { useContext, useEffect, useState } from 'react'
import { IntlShape, useIntl } from 'react-intl'

import { PageLayout } from '@island.is/judicial-system-web/src/components'
import {
  Case,
  CaseType,
  SessionArrangements,
} from '@island.is/judicial-system/types'
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

const getSessionBookingsAutofill = (
  formatMessage: IntlShape['formatMessage'],
  workingCase: Case,
) => {
  const autofillSessionBookings = []

  if (workingCase.defenderName) {
    autofillSessionBookings.push(
      `${formatMessage(m.sections.sessionBookings.autofillDefender, {
        defender: workingCase.defenderName,
      })}\n\n`,
    )
  }

  if (workingCase.translator) {
    autofillSessionBookings.push(
      `${formatMessage(m.sections.sessionBookings.autofillTranslator, {
        translator: workingCase.translator,
      })}\n\n`,
    )
  }

  autofillSessionBookings.push(
    `${formatMessage(
      m.sections.sessionBookings.autofillRightToRemainSilent,
    )}\n\n${formatMessage(
      m.sections.sessionBookings.autofillCourtDocumentOne,
    )}\n\n${formatMessage(
      m.sections.sessionBookings.autofillAccusedPlea,
    )}\n\n${formatMessage(m.sections.sessionBookings.autofillAllPresent)}`,
  )
  return autofillSessionBookings.length > 0
    ? autofillSessionBookings.join('')
    : undefined
}

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
      const autofillAttendees = []

      if (workingCase.courtAttendees !== '') {
        if (workingCase.prosecutor) {
          autofillAttendees.push(
            `${workingCase.prosecutor.name} ${workingCase.prosecutor.title}`,
          )
        }

        if (
          workingCase.defenderName &&
          workingCase.sessionArrangements !==
            SessionArrangements.PROSECUTOR_PRESENT
        ) {
          autofillAttendees.push(
            `\n${workingCase.defenderName} skipaður ${
              workingCase.defenderIsSpokesperson ? 'talsmaður' : 'verjandi'
            } ${formatMessage(core.defendant, { suffix: 'a' })}`,
          )
        }

        if (workingCase.translator) {
          autofillAttendees.push(`\n${workingCase.translator} túlkur`)
        }

        if (workingCase.defendants && workingCase.defendants.length > 0) {
          if (
            workingCase.sessionArrangements === SessionArrangements.ALL_PRESENT
          ) {
            workingCase.defendants.forEach((defendant) => {
              autofillAttendees.push(
                `\n${defendant.name} ${formatMessage(core.defendant, {
                  suffix: 'i',
                })}`,
              )
            })
          }
        }
      }

      autofill(
        [
          { key: 'courtStartDate', value: workingCase.courtDate, force: true },
          {
            key: 'courtLocation',
            value: workingCase.court
              ? `í ${
                  workingCase.court.name.indexOf('dómur') > -1
                    ? workingCase.court.name.replace('dómur', 'dómi')
                    : workingCase.court.name
                }`
              : undefined,
            force: true,
          },
          {
            key: 'courtAttendees',
            value:
              autofillAttendees.length > 0
                ? autofillAttendees.join('')
                : undefined,
            force: true,
          },
          {
            key: 'sessionBookings',
            value:
              workingCase.type === CaseType.RESTRAINING_ORDER
                ? formatMessage(
                    m.sections.sessionBookings.autofillRestrainingOrder,
                  )
                : workingCase.type === CaseType.AUTOPSY
                ? formatMessage(m.sections.sessionBookings.autofillAutopsy)
                : workingCase.sessionArrangements ===
                  SessionArrangements.ALL_PRESENT
                ? getSessionBookingsAutofill(formatMessage, workingCase)
                : workingCase.sessionArrangements ===
                  SessionArrangements.ALL_PRESENT_SPOKESPERSON
                ? formatMessage(m.sections.sessionBookings.autofillSpokeperson)
                : workingCase.sessionArrangements ===
                  SessionArrangements.PROSECUTOR_PRESENT
                ? formatMessage(m.sections.sessionBookings.autofillProsecutor)
                : undefined,
          },
        ],
        workingCase,
        setWorkingCase,
      )

      setInitialAutoFillDone(true)
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
