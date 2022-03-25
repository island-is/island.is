import React from 'react'
import { Box, Text, Divider } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { m } from '../../lib/messages'

export const ApplicationOverview = () => {
  const { formatMessage } = useLocale()

  return (
    <>
      <Box>
        <Text variant="h3" marginTop={4} marginBottom={3}>
          {'Hjónaefni 1'}
        </Text>
        <Box display='flex' marginBottom={3}>
          <Box width='half'>
            <Text variant="h4">{'Nafn'}</Text>
            <Text>{'Albina'}</Text>
          </Box>
          <Box width='half'>
            <Text variant="h4">{'Kennitala'}</Text>
            <Text>{'020200200330'}</Text>
          </Box>
        </Box>
        <Box display='flex'>
          <Box width='half'>
            <Text variant="h4">{'Símanúmer'}</Text>
            <Text>{'8417484'}</Text>
          </Box>
          <Box width='half'>
            <Text variant="h4">{'Netfang'}</Text>
            <Text>{'jonaj@gmail.com'}</Text>
          </Box>
        </Box>
      </Box>
      <Box>
        <Text variant="h3" marginTop={4} marginBottom={3}>
          {'Hjónaefni 2'}
        </Text>
        <Box display='flex' marginBottom={3}>
          <Box width='half'>
            <Text variant="h4">{'Nafn'}</Text>
            <Text>{'Albina'}</Text>
          </Box>
          <Box width='half'>
            <Text variant="h4">{'Kennitala'}</Text>
            <Text>{'020200200330'}</Text>
          </Box>
        </Box>
        <Box display='flex'>
          <Box width='half'>
            <Text variant="h4">{'Símanúmer'}</Text>
            <Text>{'8417484'}</Text>
          </Box>
          <Box width='half'>
            <Text variant="h4">{'Netfang'}</Text>
            <Text>{'jonaj@gmail.com'}</Text>
          </Box>
        </Box>
      </Box>
      <Box marginTop={5}>
        <Divider />
      </Box>
      <Box marginTop={5}>
        <Text variant="h3" marginTop={4} marginBottom={3}>
          {'Votti 1'}
        </Text>
        <Box display='flex' marginBottom={3}>
          <Box width='half'>
            <Text variant="h4">{'Nafn'}</Text>
            <Text>{'Albina'}</Text>
          </Box>
          <Box width='half'>
            <Text variant="h4">{'Kennitala'}</Text>
            <Text>{'020200200330'}</Text>
          </Box>
        </Box>
        <Box display='flex'>
          <Box width='half'>
            <Text variant="h4">{'Símanúmer'}</Text>
            <Text>{'8417484'}</Text>
          </Box>
          <Box width='half'>
            <Text variant="h4">{'Netfang'}</Text>
            <Text>{'jonaj@gmail.com'}</Text>
          </Box>
        </Box>
      </Box>
      <Box>
        <Text variant="h3" marginTop={4} marginBottom={3}>
          {'Votti 2'}
        </Text>
        <Box display='flex' marginBottom={3}>
          <Box width='half'>
            <Text variant="h4">{'Nafn'}</Text>
            <Text>{'Albina'}</Text>
          </Box>
          <Box width='half'>
            <Text variant="h4">{'Kennitala'}</Text>
            <Text>{'020200200330'}</Text>
          </Box>
        </Box>
        <Box display='flex'>
          <Box width='half'>
            <Text variant="h4">{'Símanúmer'}</Text>
            <Text>{'8417484'}</Text>
          </Box>
          <Box width='half'>
            <Text variant="h4">{'Netfang'}</Text>
            <Text>{'jonaj@gmail.com'}</Text>
          </Box>
        </Box>
      </Box>
      <Box marginY={5}>
        <Divider />
      </Box>
      <Box>
        <Text variant="h3" marginTop={4} marginBottom={3}>
          {'Votti 2'}
        </Text>
        <Box display='flex' marginBottom={3}>
          <Box width='half'>
            <Text variant="h4">{'Nafn'}</Text>
            <Text>{'Albina'}</Text>
          </Box>
          <Box width='half'>
            <Text variant="h4">{'Kennitala'}</Text>
            <Text>{'020200200330'}</Text>
          </Box>
        </Box>
        <Box display='flex'>
          <Box width='half'>
            <Text variant="h4">{'Símanúmer'}</Text>
            <Text>{'8417484'}</Text>
          </Box>
          <Box width='half'>
            <Text variant="h4">{'Netfang'}</Text>
            <Text>{'jonaj@gmail.com'}</Text>
          </Box>
        </Box>
      </Box>
    </>
  )
}
