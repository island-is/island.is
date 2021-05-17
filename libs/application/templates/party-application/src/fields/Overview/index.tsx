import React, { FC } from 'react'
import { useFormContext } from 'react-hook-form'
import { FieldBaseProps } from '@island.is/application/core'
import { Box, Text, Inline, Icon, Input } from '@island.is/island-ui/core'
import { m } from '../../lib/messages'
import { useLocale } from '@island.is/localization'

export interface Props extends FieldBaseProps {
  title?: string
  description?: string
}

const Overview: FC<FieldBaseProps> = ({ application }) => {
  const { formatMessage } = useLocale()
  const { answers, externalData } = application
  const { register } = useFormContext()

  return (
    <>
      <Box marginBottom={3}>
        <Text variant="h3">{formatMessage(m.overviewSection.subtitle)}</Text>
      </Box>
      <Box marginBottom={3}>
        <Text variant="h5">
          {formatMessage(m.overviewSection.responsiblePerson)}
        </Text>
        <Text>
          {
            (externalData.nationalRegistry?.data as {
              fullName?: string
            })?.fullName
          }
        </Text>
      </Box>
      <Box marginBottom={3}>
        <Text variant="h5">{formatMessage(m.overviewSection.partyType)}</Text>
        <Text>{'Alþingiskosningar 2021'}</Text>
      </Box>
      <Box marginBottom={3}>
        <Text variant="h5">
          {formatMessage(m.overviewSection.constituency)}
        </Text>
        <Text>{answers.constituency}</Text>
      </Box>
      <Box marginBottom={3}>
        <Text variant="h5">
          {formatMessage(m.overviewSection.signatureCount)}
        </Text>
        <Text>{'548'}</Text>
      </Box>
      <Box marginBottom={3}>
        <Inline space={2}>
          <Text variant="h5">
            {formatMessage(m.overviewSection.signaturesInvalid)}
          </Text>
          <Icon icon="informationCircle" color="yellow600" />
        </Inline>
        <Text>{'13'}</Text>
      </Box>
      <Box marginBottom={3} width="half">
        <Text variant="h5" marginBottom={2}>
          {formatMessage(m.overviewSection.emailLabel)}
        </Text>
        <Input
          id="email"
          name="email"
          backgroundColor="blue"
          label={formatMessage(m.overviewSection.emailPlaceholder)}
          ref={register}
          defaultValue={
            (externalData.userProfile?.data as {
              email?: string
            })?.email
          }
        />
      </Box>
    </>
  )
}

export default Overview
