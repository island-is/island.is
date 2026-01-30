import { Fragment, useContext } from 'react'
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
  CaseIndictmentRulingDecision,
  CaseType,
  IndictmentCaseReviewDecision,
} from '@island.is/judicial-system-web/src/graphql/schema'

import { isNonEmptyArray } from '../../utils/arrayHelpers'
import { sortByIcelandicAlphabet } from '../../utils/sortHelper'
import { FormContext } from '../FormProvider/FormProvider'
import { LinkComponent } from '../MarkdownWrapper/MarkdownWrapper'
import { UserContext } from '../UserProvider/UserProvider'
import { CivilClaimantInfo } from './CivilClaimantInfo/CivilClaimantInfo'
import { DefendantInfo } from './DefendantInfo/DefendantInfo'
import RenderPersonalData from './RenderPersonalInfo/RenderPersonalInfo'
import { VictimInfo } from './VictimInfo/VictimInfo'
import { Item } from './InfoCard'
import { strings } from './useInfoCardItems.strings'
import { grid } from '../../utils/styles/recipes.css'
import * as styles from './InfoCard.css'

const useInfoCardItems = () => {
  const { formatMessage } = useIntl()
  const { workingCase } = useContext(FormContext)
  const { limitedAccess } = useContext(UserContext)

  // helper for info card items. If items have no values they will have [{falsy value}]
  const showItem = (item: Item) =>
    isNonEmptyArray(item.values) && !!item.values[0]

  const defendants = ({
    caseType,
    displayAppealExpirationInfo,
    displayVerdictViewDate,
    displaySentToPrisonAdminDate,
    displayOpenCaseReference,
  }: {
    caseType?: CaseType | null
    displayAppealExpirationInfo?: boolean
    displayVerdictViewDate?: boolean
    displaySentToPrisonAdminDate?: boolean
    displayOpenCaseReference?: boolean
  }): Item => {
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
                  gender: defendants?.[0].gender,
                }),
          )}
        </Text>
      ),
      values: defendants
        ? [
            <div className={grid({ gap: 3 })}>
              {defendants.map((defendant, index) => (
                <div
                  key={defendant.id}
                  className={cn({
                    [styles.renderDividerFull]:
                      index < defendants.length - 1 && isMultipleDefendants,
                  })}
                >
                  <DefendantInfo
                    defendant={defendant}
                    workingCaseId={workingCase.id}
                    courtId={workingCase.court?.id}
                    defender={{
                      name: workingCase.defenderName,
                      email: workingCase.defenderEmail,
                      phoneNumber: workingCase.defenderPhoneNumber,
                      sessionArrangement: workingCase.sessionArrangements,
                    }}
                    displayAppealExpirationInfo={displayAppealExpirationInfo}
                    displayVerdictViewDate={displayVerdictViewDate}
                    displaySentToPrisonAdminDate={displaySentToPrisonAdminDate}
                    displayOpenCaseReference={displayOpenCaseReference}
                  />
                </div>
              ))}
            </div>,
          ]
        : [],
    }
  }

  const indictmentCreated: Item = {
    id: 'indictment-created-item',
    title: formatMessage(strings.indictmentSentToCourt),
    values: [formatDate(workingCase.caseSentToCourtDate, 'PP')],
  }

  const prosecutor = (
    caseType?: CaseType | null,
    onClick?: () => void,
  ): Item => ({
    id: 'prosecutor-item',
    title: formatMessage(
      isRequestCase(caseType) ? core.prosecutorPerson : strings.prosecutor,
    ),
    values: [
      RenderPersonalData({
        name: workingCase.prosecutor?.name,
        email: workingCase.prosecutor?.email,
        onClick,
      }),
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

  const offenses: Item = {
    id: 'offenses-item',
    title: formatMessage(strings.offense),
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
      RenderPersonalData({
        name: workingCase.judge?.name,
        email: workingCase.judge?.email,
      }),
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
      RenderPersonalData({
        name: workingCase.registrar?.name,
        email: workingCase.registrar?.email,
      }),
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

  const getMergeCaseValue = () => {
    const internalCourtCaseNumber = workingCase.mergeCase?.courtCaseNumber
    if (internalCourtCaseNumber) {
      return internalCourtCaseNumber
    }

    const externalCourtCaseNumber = workingCase.mergeCaseNumber
    if (externalCourtCaseNumber) {
      return formatMessage(strings.externalMergeCase, {
        mergeCaseNumber: externalCourtCaseNumber,
      })
    }

    return undefined
  }

  const mergeCase: Item = {
    id: 'merge-case-item',
    title: formatMessage(strings.indictmentMergedTitle),
    values: [getMergeCaseValue()],
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

  const splitCases: Item = {
    id: 'split-cases-item',
    title: 'Klofinn frá',
    values:
      workingCase.splitCases?.flatMap((splitCase) =>
        splitCase.defendants?.map((defendant) => (
          <Fragment key={defendant.id}>
            <Text>{defendant.name}</Text>
            <LinkComponent
              href={`/${constants.ROUTE_HANDLER_ROUTE}/${splitCase.id}`}
            >
              {splitCase.courtCaseNumber}
            </LinkComponent>
          </Fragment>
        )),
      ) || [],
  }

  const splitCase: Item = {
    id: 'split-case-item',
    title: 'Klofið frá',
    values: workingCase.splitCase
      ? [
          limitedAccess ? (
            workingCase.splitCase.courtCaseNumber
          ) : (
            <LinkComponent
              href={`${constants.ROUTE_HANDLER_ROUTE}/${workingCase.splitCase.id}`}
              key={workingCase.splitCase.id}
            >
              {workingCase.splitCase.courtCaseNumber}
            </LinkComponent>
          ),
        ]
      : [],
  }

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
        {
          isFine:
            workingCase.indictmentRulingDecision ===
            CaseIndictmentRulingDecision.FINE,
        },
      ),
    ],
  }

  const indictmentReviewedDate = (date: string): Item => ({
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
            key={civilClaimant.id}
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
            <CivilClaimantInfo civilClaimant={civilClaimant} />
          </div>
        ))
      : [],
  }

  const victims: Item = {
    id: 'victim-item',
    title: (
      <Text
        variant="h4"
        as="h4"
        marginBottom={
          workingCase.victims && workingCase.victims.length > 1 ? 3 : 2
        }
      >
        {workingCase.victims && workingCase.victims.length > 1
          ? 'Brotaþolar'
          : 'Brotaþoli'}
      </Text>
    ),
    values: workingCase.victims
      ? workingCase.victims.map((victim, index) => (
          <div
            key={victim.id}
            className={cn(
              workingCase.victims && workingCase.victims.length > 1
                ? styles.renderDivider
                : undefined,
              workingCase.victims && index === workingCase.victims.length - 1
                ? styles.last
                : undefined,
            )}
          >
            <VictimInfo victim={victim} />
          </div>
        ))
      : [],
  }

  return {
    showItem,
    defendants,
    indictmentCreated,
    prosecutor,
    prosecutorsOffice,
    policeCaseNumbers,
    court,
    courtCaseNumber,
    offenses,
    judge,
    caseType,
    registrar,
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
    splitCases,
    splitCase,
    victims,
  }
}

export default useInfoCardItems
