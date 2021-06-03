import React, { FC } from 'react'
import { useFormContext } from 'react-hook-form'
import { FieldBaseProps } from '@island.is/application/core'
import { Box, Text, Inline, Input, Tooltip } from '@island.is/island-ui/core'
import { m } from '../../lib/messages'
import { useLocale } from '@island.is/localization'
import { SchemaFormValues } from '../../lib/dataSchema'

export interface Props extends FieldBaseProps {
  title?: string
  description?: string
}

const Overview: FC<FieldBaseProps> = ({ application }) => {
  const { formatMessage } = useLocale()
  const { externalData } = application
  const answers = application.answers as SchemaFormValues

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
        <Text>{answers.endorsements ? answers.endorsements.length : 0}</Text>
      </Box>
      <Box marginBottom={3}>
        <Inline space={2}>
          <Text variant="h5">
            {formatMessage(m.overviewSection.signaturesInvalidTitle)}
          </Text>
          <Box>
            <Tooltip
              color="yellow600"
              iconSize="medium"
              text={formatMessage(m.overviewSection.signaturesInvalid)}
            />
          </Box>
        </Inline>
        <Text>
          {answers.endorsementsWithWarning
            ? answers.endorsementsWithWarning.length
            : 0}
        </Text>
      </Box>
      <Box marginBottom={3} width="half">
        <Text variant="h5" marginBottom={2}>
          {formatMessage(m.overviewSection.emailLabel)}
        </Text>
        <Input
          id="responsiblePersonEmail"
          name="responsiblePersonEmail"
          backgroundColor="blue"
          label={formatMessage(m.overviewSection.emailPlaceholder)}
          ref={register}
          defaultValue=""
        />
      </Box>
    </>
  )
}

export default Overview
