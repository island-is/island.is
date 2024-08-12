import React, { useContext } from 'react'
import { useIntl } from 'react-intl'

import { Text } from '@island.is/island-ui/core'
import {
  capitalize,
  formatDate,
  readableIndictmentSubtypes,
} from '@island.is/judicial-system/formatters'
import { core } from '@island.is/judicial-system-web/messages'

import { FormContext } from '../FormProvider/FormProvider'
import { DefendantInfo } from './DefendantInfo/DefendantInfo'
import { NameAndEmail } from './InfoCard'
import InfoCardNew from './InfoCard__new'
import { strings } from './InfoCardIndictment.strings'

const InfoCardActiveIndictment = () => {
  const { workingCase } = useContext(FormContext)
  const { formatMessage } = useIntl()

  return (
    <InfoCardNew
      sections={[
        ...(workingCase.defendants
          ? [
              {
                id: 'defendant-section',
                items: [
                  {
                    id: 'defendant-item',
                    title: capitalize(
                      workingCase.defendants.length > 1
                        ? formatMessage(core.indictmentDefendants)
                        : formatMessage(core.indictmentDefendant, {
                            gender: workingCase.defendants[0].gender,
                          }),
                    ),
                    values: workingCase.defendants.map((defendant) => (
                      <DefendantInfo
                        defendant={defendant}
                        displayDefenderInfo
                      />
                    )),
                  },
                ],
              },
            ]
          : []),
        {
          id: 'case-info-section',
          items: [
            {
              title: formatMessage(strings.indictmentCreated),
              values: [formatDate(workingCase.created, 'PP')],
              id: 'indictment-created-item',
            },
            {
              title: formatMessage(strings.prosecutor),
              values: [
                NameAndEmail(
                  workingCase.prosecutor?.name,
                  workingCase.prosecutor?.email,
                ),
              ],
              id: 'prosector-item',
            },
            {
              title: formatMessage(core.policeCaseNumber),
              values:
                workingCase.policeCaseNumbers?.map((n) => (
                  <Text key={n}>{n}</Text>
                )) || [],
              id: 'police-case-number-item',
            },
            {
              title: formatMessage(core.court),
              values: [workingCase.court?.name || ''],
              id: 'court-item',
            },
            {
              title: formatMessage(strings.offence),
              values: [
                <>
                  {readableIndictmentSubtypes(
                    workingCase.policeCaseNumbers,
                    workingCase.indictmentSubtypes,
                  ).map((subtype, index) => (
                    <Text key={`${subtype}-${index}`}>
                      {capitalize(subtype)}
                    </Text>
                  ))}
                </>,
              ],
              id: 'offence-item',
            },
          ],
          columns: 2,
        },
        ...(workingCase.mergedCases && workingCase.mergedCases.length > 0
          ? workingCase.mergedCases.map((mergedCase) => ({
              id: mergedCase.id,
              items: [
                {
                  id: 'merged-case-police-case-number-item',
                  title: formatMessage(core.policeCaseNumber),
                  values:
                    mergedCase.policeCaseNumbers?.map((n) => (
                      <Text key={n}>{n}</Text>
                    )) || [],
                },
                {
                  id: 'merged-case-court-case-number-item',
                  title: formatMessage(strings.mergedFromTitle),
                  values: [<Text>{mergedCase.courtCaseNumber}</Text>],
                },
                {
                  id: 'merged-case-prosecutor-item',
                  title: formatMessage(core.prosecutor),
                  values: [mergedCase.prosecutorsOffice?.name || ''],
                },
                {
                  id: 'merged-case-judge-item',
                  title: formatMessage(core.judge),
                  values: [mergedCase.judge?.name || ''],
                },
                {
                  id: 'merged-case-court-item',
                  title: formatMessage(core.court),
                  values: [mergedCase.court?.name || ''],
                },
              ],
              columns: 2,
            }))
          : []),
      ]}
    />
  )
}

export default InfoCardActiveIndictment
