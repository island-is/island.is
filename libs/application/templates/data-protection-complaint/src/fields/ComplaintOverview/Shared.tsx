import React, { FC } from 'react'
import { Box, Divider, Text } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { info, sharedFields } from '../../lib/messages'
import { OnBehalf } from '../../lib/dataSchema'
import { MessageDescriptor } from '@formatjs/intl'
import { NO, YES } from '@island.is/application/core'

export const onBehalfValueLabelMapper = {
  [OnBehalf.MYSELF]: info.labels.myself,
  [OnBehalf.MYSELF_AND_OR_OTHERS]: info.labels.myselfAndOrOthers,
  [OnBehalf.OTHERS]: info.labels.others,
  [OnBehalf.ORGANIZATION_OR_INSTITUTION]: info.labels.organizationInstitution,
}

export const yesNoValueLabelMapper = {
  [YES]: sharedFields.yes,
  [NO]: sharedFields.no,
}

export const SectionHeading: FC<
  React.PropsWithChildren<{ title: string | MessageDescriptor }>
> = ({ title }) => {
  const { formatMessage } = useLocale()

  return (
    <Text variant="h4" marginTop={4} marginBottom={3}>
      {formatMessage(title)}
    </Text>
  )
}

export const ValueLine: FC<
  React.PropsWithChildren<{
    label: string | MessageDescriptor
    value: string | MessageDescriptor
  }>
> = ({ label, value }) => {
  const { formatMessage } = useLocale()

  return (
    <>
      <Text variant="h5">{formatMessage(label)}</Text>
      <Text>{formatMessage(value)}</Text>
      <Box paddingY={3}>
        <Divider />
      </Box>
    </>
  )
}

export const ValueList: FC<
  React.PropsWithChildren<{
    label: string | MessageDescriptor
    list: string[]
  }>
> = ({ label, list }) => {
  const { formatMessage } = useLocale()

  return (
    <>
      <Text variant="h5">{formatMessage(label)}</Text>
      {list?.map((value, index) => (
        <Text key={`${index}-value-list`}>{value}</Text>
      ))}
      <Box paddingY={3}>
        <Divider />
      </Box>
    </>
  )
}
