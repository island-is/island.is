import React, { useContext } from 'react'
import { useIntl } from 'react-intl'

import { Text } from '@island.is/island-ui/core'
import {
  capitalize,
  readableIndictmentSubtypes,
} from '@island.is/judicial-system/formatters'
import { core } from '@island.is/judicial-system-web/messages'

import { FormContext } from '../FormProvider/FormProvider'
import { DefendantInfoActionButton } from './DefendantInfo/DefendantInfo'
import InfoCard, { NameAndEmail } from './InfoCard'
import { strings } from './InfoCardIndictment.strings'

export interface Props {
  defendantInfoActionButton?: DefendantInfoActionButton
  displayAppealExpirationInfo?: boolean
}

const InfoCardClosedIndictment: React.FC<Props> = (props) => {
  const { workingCase } = useContext(FormContext)
  const { formatMessage } = useIntl()

  const { defendantInfoActionButton, displayAppealExpirationInfo } = props

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
        {
          title: formatMessage(core.court),
          value: workingCase.court?.name,
        },
        {
          title: formatMessage(strings.prosecutor),
          value: NameAndEmail(
            workingCase.prosecutor?.name,
            workingCase.prosecutor?.email,
          ),
        },
        {
          title: formatMessage(core.judge),
          value: NameAndEmail(
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
            }
          : undefined
      }
      additionalDataSections={[
        ...(workingCase.indictmentReviewer?.name
          ? [
              {
                data: [
                  {
                    title: formatMessage(strings.indictmentReviewer),
                    value: workingCase.indictmentReviewer?.name,
                  },
                ],
              },
            ]
          : []),
      ]}
    />
  )
}

export default InfoCardClosedIndictment
