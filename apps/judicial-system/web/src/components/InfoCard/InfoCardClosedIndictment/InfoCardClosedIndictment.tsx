import React, { FC, useContext } from 'react'
import { IntlFormatters, useIntl } from 'react-intl'

import { Text } from '@island.is/island-ui/core'
import {
  capitalize,
  formatDate,
  readableIndictmentSubtypes,
} from '@island.is/judicial-system/formatters'
import { core } from '@island.is/judicial-system-web/messages'

import { IndictmentCaseReviewDecision } from '../../../graphql/schema'
import { FormContext } from '../../FormProvider/FormProvider'
import { DefendantInfoActionButton } from '../DefendantInfo/DefendantInfo'
import InfoCard, { DataSection } from '../InfoCard'
import RenderPersonalData from '../RenderPersonalInfo/RenderPersonalInfo'
import { strings } from '../InfoCardIndictment.strings'

export interface Props {
  defendantInfoActionButton?: DefendantInfoActionButton
  displayAppealExpirationInfo?: boolean
  displayVerdictViewDate?: boolean
  indictmentReviewedDate?: string | null
}

export const getAdditionalDataSections = (
  formatMessage: IntlFormatters['formatMessage'],
  reviewerName?: string | null,
  reviewDecision?: IndictmentCaseReviewDecision | null,
  indictmendReviewedDate?: string | null,
): DataSection[] => [
  ...(reviewerName
    ? [
        {
          data: [
            {
              title: formatMessage(strings.indictmentReviewer),
              value: reviewerName,
            },
            ...(reviewDecision
              ? [
                  {
                    title: formatMessage(strings.indictmentReviewDecision),
                    value:
                      reviewDecision === IndictmentCaseReviewDecision.ACCEPT
                        ? formatMessage(strings.reviewTagAccepted)
                        : formatMessage(strings.reviewTagAppealed),
                  },
                ]
              : []),
            ...(indictmendReviewedDate
              ? [
                  {
                    title: formatMessage(strings.indictmentReviewedDateTitle),
                    value: formatDate(indictmendReviewedDate, 'PPP'),
                  },
                ]
              : []),
          ],
        },
      ]
    : []),
]

const InfoCardClosedIndictment: FC<Props> = (props) => {
  const { workingCase } = useContext(FormContext)
  const { formatMessage } = useIntl()

  const {
    defendantInfoActionButton,
    displayAppealExpirationInfo,
    displayVerdictViewDate,
    indictmentReviewedDate,
  } = props

  return (
    <InfoCard
      data={[
        {
          title: formatMessage(core.policeCaseNumber),
          value: workingCase.policeCaseNumbers?.map((n) => (
            <Text key={n}>{n}</Text>
          )),
        },
        {
          title: formatMessage(core.courtCaseNumber),
          value: workingCase.courtCaseNumber,
        },
        {
          title: formatMessage(core.prosecutor),
          value: `${workingCase.prosecutorsOffice?.name}`,
        },
        ...(workingCase.mergeCase
          ? [
              {
                title: formatMessage(strings.indictmentMergedTitle),
                value: workingCase.mergeCase?.courtCaseNumber,
              },
            ]
          : []),
        {
          title: formatMessage(core.court),
          value: workingCase.court?.name,
        },
        {
          title: formatMessage(strings.prosecutor),
          value: RenderPersonalData(
            workingCase.prosecutor?.name,
            workingCase.prosecutor?.email,
          ),
        },
        {
          title: formatMessage(core.judge),
          value: RenderPersonalData(
            workingCase.judge?.name,
            workingCase.judge?.email,
          ),
        },
        {
          title: formatMessage(strings.offence),
          value: (
            <>
              {readableIndictmentSubtypes(
                workingCase.policeCaseNumbers,
                workingCase.indictmentSubtypes,
              ).map((subtype) => (
                <Text key={subtype}>{capitalize(subtype)}</Text>
              ))}
            </>
          ),
        },
      ]}
      defendants={
        workingCase.defendants
          ? {
              title: capitalize(
                workingCase.defendants.length > 1
                  ? formatMessage(strings.indictmentDefendants)
                  : formatMessage(strings.indictmentDefendant, {
                      gender: workingCase.defendants[0].gender,
                    }),
              ),
              items: workingCase.defendants,
              defendantInfoActionButton: defendantInfoActionButton,
              displayAppealExpirationInfo,
              displayVerdictViewDate,
            }
          : undefined
      }
      additionalDataSections={getAdditionalDataSections(
        formatMessage,
        workingCase.indictmentReviewer?.name,
        workingCase.indictmentReviewDecision,
        indictmentReviewedDate,
      )}
    />
  )
}

export default InfoCardClosedIndictment
