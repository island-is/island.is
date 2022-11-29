import React, { useContext } from 'react'
import { useIntl } from 'react-intl'

import {
  capitalize,
  caseTypes,
  readableIndictmentSubtypes,
} from '@island.is/judicial-system/formatters'
import { Text } from '@island.is/island-ui/core'
import { core } from '@island.is/judicial-system-web/messages'
import { isIndictmentCase } from '@island.is/judicial-system/types'

import InfoCard from './InfoCard'
import { infoCardActiveIndictment as m } from './InfoCard.strings'
import { FormContext } from '../FormProvider/FormProvider'

const InfoCardClosedIndictment: React.FC = () => {
  const { workingCase } = useContext(FormContext)
  const { formatMessage } = useIntl()
  return (
    <InfoCard
      data={[
        {
          title: formatMessage(core.policeCaseNumber),
          value: workingCase.policeCaseNumbers.map((n) => (
            <Text key={n}>{n}</Text>
          )),
        },
        {
          title: formatMessage(core.courtCaseNumber),
          value: workingCase.courtCaseNumber,
        },
        {
          title: formatMessage(core.prosecutor),
          value: `${workingCase.prosecutor?.institution?.name}`,
        },
        {
          title: formatMessage(core.court),
          value: workingCase.court?.name,
        },
        {
          title: formatMessage(m.prosecutor),
          value: workingCase.prosecutor?.name,
        },
        {
          title: formatMessage(core.judge),
          value: workingCase.judge?.name,
        },
        {
          title: formatMessage(m.offence),
          value: isIndictmentCase(workingCase.type) ? (
            <>
              {readableIndictmentSubtypes(
                workingCase.policeCaseNumbers,
                workingCase.indictmentSubtypes,
              ).map((subtype) => (
                <Text>{capitalize(subtype)}</Text>
              ))}
            </>
          ) : (
            caseTypes[workingCase.type]
          ),
        },
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

export default InfoCardClosedIndictment
