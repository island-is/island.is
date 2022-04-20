import React, { FC } from 'react'
import { Box, Text, Divider, Checkbox } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { m } from '../../lib/messages'
import { FieldBaseProps } from '@island.is/application/core'

export type Individual = {
  name: string
  nationalId: string
  phone: string
  email: string
}

export const ApplicationOverview: FC<FieldBaseProps> = ({ application }) => {
  const { formatMessage } = useLocale()
  const { answers } = application
  const applicant = answers.applicant as Individual
  const spouse = answers.spouse as Individual
  const witness1 = answers.witness1 as Individual
  const witness2 = answers.witness2 as Individual

  return (
    <>
      <Box>
        <Box paddingBottom={3}>
          <Divider />
        </Box>
        <Text variant="h3" marginBottom={3}>
          {'Hjónaefni 1'}
        </Text>
        <Box display="flex" marginBottom={3}>
          <Box width="half">
            <Text variant="h4">{'Nafn'}</Text>
            <Text>{applicant.name}</Text>
          </Box>
          <Box width="half">
            <Text variant="h4">{'Kennitala'}</Text>
            <Text>{applicant.nationalId}</Text>
          </Box>
        </Box>
        <Box display="flex">
          <Box width="half">
            <Text variant="h4">{'Símanúmer'}</Text>
            <Text>{applicant.phone}</Text>
          </Box>
          <Box width="half">
            <Text variant="h4">{'Netfang'}</Text>
            <Text>{applicant.email}</Text>
          </Box>
        </Box>
      </Box>
      <Box marginTop={4}>
        <Text variant="h3" marginBottom={3}>
          {'Hjónaefni 2'}
        </Text>
        <Box display="flex" marginBottom={3}>
          <Box width="half">
            <Text variant="h4">{'Nafn'}</Text>
            <Text>{spouse.name}</Text>
          </Box>
          <Box width="half">
            <Text variant="h4">{'Kennitala'}</Text>
            <Text>{spouse.nationalId}</Text>
          </Box>
        </Box>
        <Box display="flex">
          <Box width="half">
            <Text variant="h4">{'Símanúmer'}</Text>
            <Text>{spouse.phone}</Text>
          </Box>
          <Box width="half">
            <Text variant="h4">{'Netfang'}</Text>
            <Text>{spouse.email}</Text>
          </Box>
        </Box>
      </Box>
      <Box marginTop={4}>
        <Box paddingBottom={3}>
          <Divider />
        </Box>
        <Text variant="h3" marginBottom={3}>
          {'Vottur 1'}
        </Text>
        <Box display="flex" marginBottom={3}>
          <Box width="half">
            <Text variant="h4">{'Nafn'}</Text>
            <Text>{witness1.name}</Text>
          </Box>
          <Box width="half">
            <Text variant="h4">{'Kennitala'}</Text>
            <Text>{witness1.nationalId}</Text>
          </Box>
        </Box>
        <Box display="flex">
          <Box width="half">
            <Text variant="h4">{'Símanúmer'}</Text>
            <Text>{witness1.phone}</Text>
          </Box>
          <Box width="half">
            <Text variant="h4">{'Netfang'}</Text>
            <Text>{witness2.email}</Text>
          </Box>
        </Box>
      </Box>
      <Box marginTop={4}>
        <Text variant="h3" marginBottom={3}>
          {'Vottur 2'}
        </Text>
        <Box display="flex" marginBottom={3}>
          <Box width="half">
            <Text variant="h4">{'Nafn'}</Text>
            <Text>{witness2.name}</Text>
          </Box>
          <Box width="half">
            <Text variant="h4">{'Kennitala'}</Text>
            <Text>{witness2.nationalId}</Text>
          </Box>
        </Box>
        <Box display="flex">
          <Box width="half">
            <Text variant="h4">{'Símanúmer'}</Text>
            <Text>{witness2.phone}</Text>
          </Box>
          <Box width="half">
            <Text variant="h4">{'Netfang'}</Text>
            <Text>{witness2.email}</Text>
          </Box>
        </Box>
      </Box>
    </>
  )
}
