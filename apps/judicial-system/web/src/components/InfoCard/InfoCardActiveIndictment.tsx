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
import InfoCard, { NameAndEmail } from './InfoCard'
import { strings } from './InfoCardIndictment.strings'

const InfoCardActiveIndictment = () => {
  const { workingCase } = useContext(FormContext)
  const { formatMessage } = useIntl()

  return (
    <InfoCard
      data={[
        {
          title: formatMessage(strings.indictmentCreated),
          value: formatDate(workingCase.created, 'PP'),
        },
        {
          title: formatMessage(strings.prosecutor),
          value: NameAndEmail(
            workingCase.prosecutor?.name,
            workingCase.prosecutor?.email,
          ),
        },
        {
          title: formatMessage(core.policeCaseNumber),
          value: workingCase.policeCaseNumbers?.map((n) => (
            <Text key={n}>{n}</Text>
          )),
        },
        {
          title: formatMessage(core.court),
          value: workingCase.court?.name,
        },
        {
          title: formatMessage(strings.offence),
          value: (
            <>
              {readableIndictmentSubtypes(
                workingCase.policeCaseNumbers,
                workingCase.indictmentSubtypes,
              ).map((subtype, index) => (
                <Text key={`${subtype}-${index}`}>{capitalize(subtype)}</Text>
              ))}
            </>
          ),
        },
      ]}
      additionalDataSections={[
        ...(workingCase.mergedCases
          ? workingCase.mergedCases.map((mergedCase) => ({
              data: [
                {
                  title: formatMessage(core.policeCaseNumber),
                  value: mergedCase.policeCaseNumbers?.map((n) => (
                    <Text key={n}>{n}</Text>
                  )),
                },
                {
                  title: formatMessage(strings.mergedFromTitle),
                  value: <Text>{mergedCase.courtCaseNumber}</Text>,
                },
                {
                  title: formatMessage(core.prosecutor),
                  value: mergedCase.prosecutorsOffice?.name,
                },
                {
                  title: formatMessage(core.judge),
                  value: mergedCase.judge?.name,
                },
                {
                  title: formatMessage(core.court),
                  value: mergedCase.court?.name,
                },
                {
                  title: formatMessage(strings.offence),
                  value: (
                    <>
                      {readableIndictmentSubtypes(
                        mergedCase.policeCaseNumbers,
                        mergedCase.indictmentSubtypes,
                      ).map((subtype, index) => (
                        <Text key={`${subtype}-${index}`}>
                          {capitalize(subtype)}
                        </Text>
                      ))}
                    </>
                  ),
                },
              ],
            }))
          : []),
      ]}
      defendants={
        workingCase.defendants
          ? {
              title: capitalize(
                workingCase.defendants.length > 1
                  ? formatMessage(core.indictmentDefendants)
                  : formatMessage(core.indictmentDefendant, {
                      gender: workingCase.defendants[0].gender,
                    }),
              ),
              items: workingCase.defendants,
            }
          : undefined
      }
    />
  )
}

export default InfoCardActiveIndictment
