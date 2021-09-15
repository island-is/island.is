import React, { useEffect, useState } from 'react'
import { PageLayout } from '@island.is/judicial-system-web/src/shared-components'
import { SessionArrangements } from '@island.is/judicial-system/types'
import type { Case } from '@island.is/judicial-system/types'
import {
  CaseData,
  JudgeSubsections,
  Sections,
} from '@island.is/judicial-system-web/src/types'
import { useQuery } from '@apollo/client'
import { CaseQuery } from '@island.is/judicial-system-web/graphql'
import { useRouter } from 'next/router'
import CourtRecordForm from './CourtRecordForm'
import { useCase } from '@island.is/judicial-system-web/src/utils/hooks'
import { icCourtRecord } from '@island.is/judicial-system-web/messages'
import { useIntl } from 'react-intl'

const CourtRecord = () => {
  const [workingCase, setWorkingCase] = useState<Case>()
  const { autofill } = useCase()
  const { formatMessage } = useIntl()

  const router = useRouter()
  const id = router.query.id

  const { data, loading } = useQuery<CaseData>(CaseQuery, {
    variables: { input: { id: id } },
    fetchPolicy: 'no-cache',
  })

  useEffect(() => {
    document.title = 'Þingbók - Réttarvörslugátt'
  }, [])

  useEffect(() => {
    const defaultCourtAttendees = (wc: Case): string => {
      let attendees = ''

      if (wc.registrar) {
        attendees += `${wc.registrar.name} ${wc.registrar.title}\n`
      }

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
        attendees +=
          'Varnaraðili var ekki viðstaddur sbr. 104. gr. laga 88/2008 um meðferð sakamála.'
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

    if (!workingCase && data?.case) {
      const theCase = data.case

      autofill('courtStartDate', new Date().toString(), theCase)

      autofill('courtAttendees', defaultCourtAttendees(theCase), theCase)

      if (theCase.demands) {
        autofill('prosecutorDemands', theCase.demands, theCase)
      }

      if (theCase.sessionArrangements === SessionArrangements.REMOTE_SESSION) {
        autofill(
          'litigationPresentations',
          formatMessage(
            icCourtRecord.sections.litigationPresentations.autofill,
          ),
          theCase,
        )
      }
      setWorkingCase(data.case)
    }
  }, [workingCase, setWorkingCase, data, autofill])

  return (
    <PageLayout
      activeSection={
        workingCase?.parentCase ? Sections.JUDGE_EXTENSION : Sections.JUDGE
      }
      activeSubSection={JudgeSubsections.COURT_RECORD}
      isLoading={loading}
      notFound={data?.case === undefined}
      parentCaseDecision={workingCase?.parentCase?.decision}
      caseType={workingCase?.type}
      caseId={workingCase?.id}
    >
      {workingCase && (
        <CourtRecordForm
          workingCase={workingCase}
          setWorkingCase={setWorkingCase}
          isLoading={loading}
        />
      )}
    </PageLayout>
  )
}

export default CourtRecord
