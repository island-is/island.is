import { FC } from 'react'
import { IntlShape, useIntl } from 'react-intl'
import flatMap from 'lodash/flatMap'

import { Box, Tag, Text } from '@island.is/island-ui/core'
import {
  capitalize,
  enumerate,
  formatDate,
} from '@island.is/judicial-system/formatters'
import {
  isCompletedCase,
  isIndictmentCase,
} from '@island.is/judicial-system/types'
import { core } from '@island.is/judicial-system-web/messages'
import {
  Case,
  CaseType,
  Defendant,
} from '@island.is/judicial-system-web/src/graphql/schema'

import { strings } from './CaseInfo.strings'

const PoliceCaseNumbersTags: FC<{
  policeCaseNumbers?: string[] | null
}> = ({ policeCaseNumbers }) => (
  <Box display="flex" flexWrap="wrap">
    {policeCaseNumbers?.map((policeCaseNumber, index) => (
      <Box marginTop={1} marginRight={1} key={`${policeCaseNumber}-${index}`}>
        <Tag disabled>{policeCaseNumber}</Tag>
      </Box>
    ))}
  </Box>
)

const Entry: FC<{ label: string; value: string }> = ({ label, value }) => {
  return (
    <Text color="dark400" fontWeight="semiBold" paddingTop={'smallGutter'}>
      {`${label}: ${value}`}
    </Text>
  )
}

export const getDefendantLabel = (
  formatMessage: IntlShape['formatMessage'],
  defendants: Defendant[],
  type?: CaseType | null,
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

const Defendants: FC<Props> = ({ workingCase }) => {
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

const Prosecutor: FC<Props> = ({ workingCase }) => {
  const { formatMessage } = useIntl()
  if (!workingCase.prosecutorsOffice?.name) {
    return null
  }

  return (
    <Entry
      label={formatMessage(core.prosecutor)}
      value={workingCase.prosecutorsOffice.name}
    />
  )
}

export const ProsecutorCaseInfo: FC<
  Props & { hideCourt?: boolean; hideDefendants?: boolean }
> = ({ workingCase, hideCourt = false, hideDefendants = false }) => {
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
      {!hideDefendants && <Defendants workingCase={workingCase} />}
    </Box>
  )
}

export const ProsecutorAndDefendantsEntries: FC<Props> = ({
  workingCase,
}: {
  workingCase: Case
}) => (
  <>
    <Prosecutor workingCase={workingCase} />
    <Defendants workingCase={workingCase} />
  </>
)

export const CourtCaseInfo: FC<Props> = ({ workingCase }) => {
  const { formatMessage } = useIntl()

  return (
    <Box component="section" marginBottom={5}>
      {workingCase.courtCaseNumber && (
        <Box marginBottom={1}>
          <Text variant="h2" as="h2">
            {formatMessage(core.caseNumber, {
              caseNumber: workingCase.courtCaseNumber,
            })}
          </Text>
        </Box>
      )}
      {isIndictmentCase(workingCase.type) &&
      isCompletedCase(workingCase.state) ? (
        <Box marginTop={1}>
          <Text as="h5" variant="h5">
            {formatMessage(strings.rulingDate, {
              rulingDate: `${formatDate(workingCase.rulingDate, 'PPP')}`,
            })}
          </Text>
        </Box>
      ) : (
        <ProsecutorAndDefendantsEntries workingCase={workingCase} />
      )}
    </Box>
  )
}
