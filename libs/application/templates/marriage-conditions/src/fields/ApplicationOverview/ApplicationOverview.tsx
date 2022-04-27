import React, { FC } from 'react'
import { Box, Text, Divider } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { m } from '../../lib/messages'
import { FieldBaseProps } from '@island.is/application/core'
import { Individual } from '../../types'
import { format as formatNationalId } from 'kennitala'

type InfoProps = {
  side: Individual
}

export const ApplicationOverview: FC<FieldBaseProps> = ({ application }) => {
  const { formatMessage } = useLocale()
  const { answers } = application
  const applicant = answers.applicant as Individual
  const spouse = answers.spouse as Individual
  const witness1 = answers.witness1 as Individual
  const witness2 = answers.witness2 as Individual

  const InfoSection: FC<InfoProps> = ({ side }) => {
    return (
      <Box>
        <Box display="flex" marginBottom={3}>
          <Box width="half">
            <Text variant="h4">{formatMessage(m.name)}</Text>
            <Text>{side.person.name}</Text>
          </Box>
          <Box width="half">
            <Text variant="h4">{formatMessage(m.nationalId)}</Text>
            <Text>{formatNationalId(side.person.nationalId)}</Text>
          </Box>
        </Box>
        <Box display="flex">
          <Box width="half">
            <Text variant="h4">{formatMessage(m.phone)}</Text>
            <Text>{side.phone}</Text>
          </Box>
          <Box width="half">
            <Text variant="h4">{formatMessage(m.email)}</Text>
            <Text>{side.email}</Text>
          </Box>
        </Box>
      </Box>
    )
  }

  return (
    <>
      <Box>
        <Box paddingBottom={4}>
          <Divider />
        </Box>
        <Text variant="h3" marginBottom={3}>
          {formatMessage(m.informationSpouse1)}
        </Text>
        <InfoSection side={applicant} />
      </Box>
      <Box marginTop={4}>
        <Text variant="h3" marginBottom={3}>
          {formatMessage(m.informationSpouse2)}
        </Text>
        <InfoSection side={spouse} />
      </Box>
      <Box marginTop={5}>
        <Box paddingBottom={4}>
          <Divider />
        </Box>
        <Text variant="h3" marginBottom={3}>
          {formatMessage(m.informationWitness1)}
        </Text>
        <InfoSection side={witness1} />
      </Box>
      <Box marginTop={4}>
        <Text variant="h3" marginBottom={3}>
          {formatMessage(m.informationWitness1)}
        </Text>
        <InfoSection side={witness2} />
      </Box>
      <Box marginTop={5}>
        <Box paddingBottom={4}>
          <Divider />
        </Box>
        <Text variant="small">
          {formatMessage(m.witnessOverviewFooterText)}
        </Text>
      </Box>
    </>
  )
}
