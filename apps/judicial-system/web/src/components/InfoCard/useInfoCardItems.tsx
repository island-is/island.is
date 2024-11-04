import { useContext } from 'react'
import { useIntl } from 'react-intl'
import cn from 'classnames'

import { Text } from '@island.is/island-ui/core'
import * as constants from '@island.is/judicial-system/consts'
import {
  capitalize,
  formatCaseType,
  formatDate,
  readableIndictmentSubtypes,
} from '@island.is/judicial-system/formatters'
import { isRequestCase } from '@island.is/judicial-system/types'
import { core } from '@island.is/judicial-system-web/messages'
import { requestCourtDate } from '@island.is/judicial-system-web/messages'
import {
  Case,
  CaseType,
  IndictmentCaseReviewDecision,
} from '@island.is/judicial-system-web/src/graphql/schema'

import { sortByIcelandicAlphabet } from '../../utils/sortHelper'
import { FormContext } from '../FormProvider/FormProvider'
import { CivilClaimantInfo } from './CivilClaimantInfo/CivilClaimantInfo'
import { DefendantInfo } from './DefendantInfo/DefendantInfo'
import RenderPersonalData from './RenderPersonalInfo/RenderPersonalInfo'
import { Item } from './InfoCard'
import { strings } from './useInfoCardItems.strings'
import * as styles from './InfoCard.css'

const useInfoCardItems = () => {
  const { formatMessage } = useIntl()
  const { workingCase } = useContext(FormContext)

  const defendants = (
    caseType?: CaseType | null,
    displayAppealExpirationInfo?: boolean,
    displayVerdictViewDate?: boolean,
  ): Item => {
    const defendants = workingCase.defendants
    const isMultipleDefendants = defendants && defendants.length > 1

    return {
      id: 'defendant-item',
      title: (
        <Text variant="h4" as="h4" marginBottom={isMultipleDefendants ? 3 : 2}>
          {capitalize(
            isRequestCase(caseType)
              ? formatMessage(core.defendant, {
                  suffix: isMultipleDefendants ? 'ar' : 'i',
                })
              : isMultipleDefendants
              ? formatMessage(core.indictmentDefendants)
              : formatMessage(core.indictmentDefendant, {
                  gender: defendants && defendants[0].gender,
                }),
          )}
        </Text>
      ),
      values: defendants
        ? defendants.map((defendant, index) => (
            <div
              className={cn(
                isMultipleDefendants ? styles.renderDivider : undefined,
                defendants && index === defendants.length - 1
                  ? styles.last
                  : undefined,
              )}
            >
              <DefendantInfo
                key={defendant.id}
                defendant={defendant}
                defender={{
                  name: workingCase.defenderName,
                  email: workingCase.defenderEmail,
                  phoneNumber: workingCase.defenderPhoneNumber,
                  sessionArrangement: workingCase.sessionArrangements,
                }}
                displayAppealExpirationInfo={displayAppealExpirationInfo}
                displayVerdictViewDate={displayVerdictViewDate}
              />
            </div>
          ))
        : [],
    }
  }

  const indictmentCreated: Item = {
    id: 'indictment-created-item',
    title: formatMessage(strings.indictmentCreated),
    values: [formatDate(workingCase.created, 'PP')],
  }

  const prosecutor = (caseType?: CaseType | null): Item => ({
    id: 'prosecutor-item',
    title: formatMessage(
      isRequestCase(caseType) ? core.prosecutorPerson : strings.prosecutor,
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

  const requestedCourtDate: Item = {
    id: 'requested-court-date-item',
    title: formatMessage(requestCourtDate.heading),
    values: [
      `${capitalize(
        formatDate(workingCase.requestedCourtDate, 'PPPP', true) ?? '',
      )} eftir kl. ${formatDate(
        workingCase.requestedCourtDate,
        constants.TIME_FORMAT,
      )}`,
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

  const parentCaseValidToDate: Item = {
    id: 'parent-case-valid-to-date-item',
    title: workingCase.parentCase
      ? formatMessage(core.pastRestrictionCase, {
          caseType: workingCase.type,
        })
      : formatMessage(core.arrestDate),
    values: [
      workingCase.parentCase
        ? `${capitalize(
            formatDate(workingCase.parentCase.validToDate, 'PPPP', true) ?? '',
          )} kl. ${formatDate(
            workingCase.parentCase.validToDate,
            constants.TIME_FORMAT,
          )}`
        : workingCase.arrestDate
        ? `${capitalize(
            formatDate(workingCase.arrestDate, 'PPPP', true) ?? '',
          )} kl. ${formatDate(workingCase.arrestDate, constants.TIME_FORMAT)}`
        : 'Var ekki skráður',
    ],
  }

  const civilClaimants: Item = {
    id: 'civil-claimant-item',
    title: (
      <Text
        variant="h4"
        as="h4"
        marginBottom={
          workingCase.civilClaimants && workingCase.civilClaimants.length > 1
            ? 3
            : 2
        }
      >
        {capitalize(
          workingCase.civilClaimants && workingCase.civilClaimants.length > 1
            ? formatMessage(strings.civilClaimants)
            : formatMessage(strings.civilClaimant),
        )}
      </Text>
    ),
    values: workingCase.civilClaimants
      ? workingCase.civilClaimants.map((civilClaimant, index) => (
          <div
            className={cn(
              workingCase.civilClaimants &&
                workingCase.civilClaimants.length > 1
                ? styles.renderDivider
                : undefined,
              workingCase.civilClaimants &&
                index === workingCase.civilClaimants.length - 1
                ? styles.last
                : undefined,
            )}
          >
            <CivilClaimantInfo
              key={civilClaimant.id}
              civilClaimant={civilClaimant}
            />
          </div>
        ))
      : [],
  }

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
    requestedCourtDate,
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
    parentCaseValidToDate,
    civilClaimants,
  }
}

export default useInfoCardItems
