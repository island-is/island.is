import { useContext } from 'react'
import { useIntl } from 'react-intl'

import { Text } from '@island.is/island-ui/core'
import {
  capitalize,
  formatCaseType,
  formatDate,
  readableIndictmentSubtypes,
} from '@island.is/judicial-system/formatters'
import { EventType, isRestrictionCase } from '@island.is/judicial-system/types'
import { core } from '@island.is/judicial-system-web/messages'
import {
  Case,
  CaseType,
  IndictmentCaseReviewDecision,
} from '@island.is/judicial-system-web/src/graphql/schema'

import { sortByIcelandicAlphabet } from '../../utils/sortHelper'
import { FormContext } from '../FormProvider/FormProvider'
import {
  DefendantInfo,
  DefendantInfoActionButton,
} from './DefendantInfo/DefendantInfo'
import RenderPersonalData from './RenderPersonalInfo/RenderPersonalInfo'
import { Item } from './InfoCardNew'
import { strings } from './InfoCardIndictment.strings'

const useInfoCardItems = () => {
  const { formatMessage } = useIntl()
  const { workingCase } = useContext(FormContext)

  const defendants = (
    caseType?: CaseType | null,
    displayAppealExpirationInfo?: boolean,
    defendantInfoActionButton?: DefendantInfoActionButton,
    displayVerdictViewDate?: boolean,
  ): Item => ({
    id: 'defendant-item',
    title: capitalize(
      isRestrictionCase(caseType)
        ? formatMessage(core.defendant, {
            suffix:
              workingCase.defendants && workingCase.defendants.length > 1
                ? 'ar'
                : 'i',
          })
        : workingCase.defendants && workingCase.defendants.length > 1
        ? formatMessage(core.indictmentDefendants)
        : formatMessage(core.indictmentDefendant, {
            gender: workingCase.defendants && workingCase.defendants[0].gender,
          }),
    ),
    values: workingCase.defendants
      ? workingCase.defendants.map((defendant) => (
          <DefendantInfo
            defendant={defendant}
            defender={{
              name: workingCase.defenderName,
              email: workingCase.defenderEmail,
              phoneNumber: workingCase.defenderPhoneNumber,
              sessionArrangement: workingCase.sessionArrangements,
            }}
            displayAppealExpirationInfo={displayAppealExpirationInfo}
            displayVerdictViewDate={displayVerdictViewDate}
            defendantInfoActionButton={defendantInfoActionButton}
          />
        ))
      : [],
  })

  const indictmentCreated: Item = {
    id: 'indictment-created-item',
    title: formatMessage(strings.indictmentCreated),
    values: [formatDate(workingCase.created, 'PP')],
  }

  const prosecutor = (caseType?: CaseType | null): Item => ({
    id: 'prosecutor-item',
    title: formatMessage(
      isRestrictionCase(caseType) ? core.prosecutorPerson : strings.prosecutor,
    ),
    values: [
      RenderPersonalData(
        workingCase.prosecutor?.name,
        workingCase.prosecutor?.email,
      ),
    ],
  })

  const prosecutorsOffice: Item = {
    id: 'prosecutors-office-item',
    title: formatMessage(core.prosecutor),
    values: [workingCase.prosecutorsOffice?.name || ''],
  }

  const policeCaseNumbers: Item = {
    id: 'police-case-number-item',
    title: formatMessage(core.policeCaseNumber),
    values:
      workingCase.policeCaseNumbers?.map((n) => <Text key={n}>{n}</Text>) || [],
  }

  const court: Item = {
    id: 'court-item',
    title: formatMessage(core.court),
    values: [workingCase.court?.name || ''],
  }

  const courtCaseNumber: Item = {
    id: 'court-case-number-item',
    title: formatMessage(core.courtCaseNumber),
    values: [workingCase.courtCaseNumber],
  }

  const offences: Item = {
    id: 'offences-item',
    title: formatMessage(strings.offence),
    values: [
      <>
        {readableIndictmentSubtypes(
          workingCase.policeCaseNumbers,
          workingCase.indictmentSubtypes,
        ).map((subtype, index) => (
          <Text key={`${subtype}-${index}`}>{capitalize(subtype)}</Text>
        ))}
      </>,
    ],
  }

  const judge: Item = {
    id: 'judges-item',
    title: formatMessage(core.judge),
    values: [
      RenderPersonalData(workingCase.judge?.name, workingCase.judge?.email),
    ],
  }

  const caseType: Item = {
    id: 'case-type-item',
    title: formatMessage(core.caseType),
    values: [capitalize(formatCaseType(workingCase.type))],
  }

  const registrar: Item = {
    id: 'registrar-item',
    title: formatMessage(core.registrar),
    values: [
      RenderPersonalData(
        workingCase.registrar?.name,
        workingCase.registrar?.email,
      ),
    ],
  }

  const offence: Item = {
    id: 'offence-item',
    title: formatMessage(strings.offence),
    values: [
      <>
        {readableIndictmentSubtypes(
          workingCase.policeCaseNumbers,
          workingCase.indictmentSubtypes,
        ).map((subtype) => (
          <Text key={subtype}>{capitalize(subtype)}</Text>
        ))}
      </>,
    ],
  }

  const mergeCase: Item = {
    id: 'merge-case-item',
    title: formatMessage(strings.indictmentMergedTitle),
    values: [workingCase.mergeCase?.courtCaseNumber],
  }

  const mergedCasePoliceCaseNumbers = (mergedCase: Case): Item => ({
    id: 'merged-case-police-case-number-item',
    title: formatMessage(core.policeCaseNumber),
    values:
      mergedCase.policeCaseNumbers?.map((n) => <Text key={n}>{n}</Text>) || [],
  })

  const mergedCaseCourtCaseNumber = (mergedCase: Case): Item => ({
    id: 'merged-case-court-case-number-item',
    title: formatMessage(strings.mergedFromTitle),
    values: [mergedCase.courtCaseNumber],
  })

  const mergedCaseProsecutor = (mergedCase: Case): Item => ({
    id: 'merged-case-prosecutor-item',
    title: formatMessage(core.prosecutor),
    values: [mergedCase.prosecutorsOffice?.name],
  })

  const mergedCaseJudge = (mergedCase: Case): Item => ({
    id: 'merged-case-judge-item',
    title: formatMessage(core.judge),
    values: [mergedCase.judge?.name],
  })

  const mergedCaseCourt = (mergedCase: Case): Item => ({
    id: 'merged-case-court-item',
    title: formatMessage(core.court),
    values: [mergedCase.court?.name],
  })

  const appealCaseNumber: Item = {
    id: 'appeal-case-number-item',
    title: formatMessage(core.appealCaseNumberHeading),
    values: [workingCase.appealCaseNumber],
  }

  const appealAssistant: Item = {
    id: 'appeal-assistant-item',
    title: formatMessage(core.appealAssistantHeading),
    values: [workingCase.appealAssistant?.name],
  }

  const appealJudges: Item = {
    id: 'appeal-judges-item',
    title: formatMessage(core.appealJudgesHeading),
    values: [
      <>
        {sortByIcelandicAlphabet([
          workingCase.appealJudge1?.name || '',
          workingCase.appealJudge2?.name || '',
          workingCase.appealJudge3?.name || '',
        ]).map((judge, index) => (
          <Text key={`${judge}_${index}`}>{judge}</Text>
        ))}
      </>,
    ],
  }

  const indictmentReviewer: Item = {
    id: 'indictment-reviewer-item',
    title: formatMessage(strings.indictmentReviewer),
    values: [workingCase.indictmentReviewer?.name],
  }

  const indictmentReviewDecision: Item = {
    id: 'indictment-review-decision-item',
    title: formatMessage(strings.indictmentReviewDecision),
    values: [
      formatMessage(
        workingCase.indictmentReviewDecision ===
          IndictmentCaseReviewDecision.ACCEPT
          ? strings.reviewTagAccepted
          : strings.reviewTagAppealed,
      ),
    ],
  }

  const indictmentReviewedDate = (date?: string | null): Item => ({
    id: 'indictment-reviewed-date-item',
    title: formatMessage(strings.indictmentReviewedDateTitle),
    values: [formatDate(date, 'PP')],
  })

  return {
    defendants,
    indictmentCreated,
    prosecutor,
    prosecutorsOffice,
    policeCaseNumbers,
    court,
    courtCaseNumber,
    offences,
    judge,
    caseType,
    registrar,
    offence,
    mergeCase,
    mergedCasePoliceCaseNumbers,
    mergedCaseCourtCaseNumber,
    mergedCaseProsecutor,
    mergedCaseJudge,
    mergedCaseCourt,
    appealCaseNumber,
    appealAssistant,
    appealJudges,
    indictmentReviewer,
    indictmentReviewDecision,
    indictmentReviewedDate,
  }
}

export default useInfoCardItems
