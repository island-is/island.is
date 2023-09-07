import React from 'react'
import { IntlShape, useIntl } from 'react-intl'
import flatMap from 'lodash/flatMap'

import { Box, Tag, Text } from '@island.is/island-ui/core'
import {
  capitalize,
  enumerate,
  formatDate,
} from '@island.is/judicial-system/formatters'
import {
  completedCaseStates,
  isIndictmentCase,
} from '@island.is/judicial-system/types'
import { core } from '@island.is/judicial-system-web/messages'
import {
  CaseType,
  Defendant,
} from '@island.is/judicial-system-web/src/graphql/schema'
import { TempCase as Case } from '@island.is/judicial-system-web/src/types'

import { strings } from './CaseInfo.strings'

const PoliceCaseNumbersTags: React.FC<{ policeCaseNumbers: string[] }> = ({
  policeCaseNumbers,
}) => (
  <Box display="flex" flexWrap="wrap">
    {policeCaseNumbers.map((policeCaseNumber, index) => (
      <Box marginTop={1} marginRight={1} key={`${policeCaseNumber}-${index}`}>
        <Tag disabled>{policeCaseNumber}</Tag>
      </Box>
    ))}
  </Box>
)

const Entry: React.FC<
  React.PropsWithChildren<{ label: string; value: string }>
> = ({ label, value }) => {
  return (
    <Text color="dark400" fontWeight="semiBold" paddingTop={'smallGutter'}>
      {`${label}: ${value}`}
    </Text>
  )
}

export const getDefendantLabel = (
  formatMessage: IntlShape['formatMessage'],
  defendants: Defendant[],
  type: CaseType,
) => {
  if (!isIndictmentCase(type)) {
    return formatMessage(core.defendant, {
      suffix: defendants.length > 1 ? 'ar' : 'i',
    })
  }

  if (defendants.length === 1) {
    return formatMessage(core.indictmentDefendant, {
      gender: defendants[0].gender,
    })
  }

  return formatMessage(core.indictmentDefendants)
}

interface Props {
  workingCase: Case
}

const Defendants: React.FC<React.PropsWithChildren<Props>> = ({
  workingCase,
}) => {
  const { defendants, type } = workingCase
  const { formatMessage } = useIntl()

  if (!defendants) return null

  return (
    <Entry
      label={capitalize(getDefendantLabel(formatMessage, defendants, type))}
      value={enumerate(
        flatMap(defendants, (d) => (d.name ? [d.name] : [])),
        formatMessage(core.and),
      )}
    />
  )
}

export const ProsecutorCaseInfo: React.FC<
  React.PropsWithChildren<Props & { hideCourt?: boolean }>
> = ({ workingCase, hideCourt = false }) => {
  const { policeCaseNumbers, court } = workingCase
  const { formatMessage } = useIntl()

  return (
    <Box component="section" marginBottom={5}>
      <Box marginBottom={2}>
        <PoliceCaseNumbersTags policeCaseNumbers={policeCaseNumbers} />
      </Box>
      {!hideCourt && court?.name && (
        <Entry label={formatMessage(core.court)} value={court?.name} />
      )}
      <Defendants workingCase={workingCase} />
    </Box>
  )
}

export const CourtCaseInfo: React.FC<React.PropsWithChildren<Props>> = ({
  workingCase,
}) => {
  const { courtCaseNumber, prosecutor } = workingCase
  const { formatMessage } = useIntl()

  return (
    <Box component="section" marginBottom={5}>
      {courtCaseNumber && (
        <Box marginBottom={1}>
          <Text variant="h2" as="h2">
            {formatMessage(core.caseNumber, {
              caseNumber: courtCaseNumber,
            })}
          </Text>
        </Box>
      )}
      {isIndictmentCase(workingCase.type) &&
      completedCaseStates.includes(workingCase.state) ? (
        <Box marginTop={1}>
          <Text as="h5" variant="h5">
            {formatMessage(strings.rulingDate, {
              rulingDate: `${formatDate(workingCase.rulingDate, 'PPP')}`,
            })}
          </Text>
        </Box>
      ) : (
        <>
          {prosecutor?.institution?.name && (
            <Entry
              label={formatMessage(core.prosecutor)}
              value={prosecutor.institution.name}
            />
          )}
          <Defendants workingCase={workingCase} />
        </>
      )}
    </Box>
  )
}
