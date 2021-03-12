import React, { FC } from 'react'
import { FieldBaseProps } from '@island.is/application/core'
import { Box, Divider, Text } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import {
  delimitation,
  info,
  overview,
  section,
  sharedFields,
} from '../lib/messages'
import { DataProtectionComplaint, OnBehalf } from '../lib/dataSchema'
import { NO, YES } from '../shared'
import { MessageDescriptor } from '@formatjs/intl'

const onBehalfValueLabelMapper = {
  [OnBehalf.MYSELF]: info.labels.myself,
  [OnBehalf.MYSELF_AND_OR_OTHERS]: info.labels.myselfAndOrOthers,
  [OnBehalf.OTHERS]: info.labels.others,
  [OnBehalf.ORGANIZATION_OR_INSTITUTION]: info.labels.organizationInstitution,
}

const yesNoValueLabelMapper = {
  [YES]: sharedFields.yes,
  [NO]: sharedFields.no,
}

const SectionHeading: FC<{ title: string | MessageDescriptor }> = ({
  title,
}) => {
  const { formatMessage } = useLocale()

  return (
    <Text variant="h4" marginBottom={3}>
      {formatMessage(title)}
    </Text>
  )
}

const ValueLine: FC<{
  label: string | MessageDescriptor
  value: string | MessageDescriptor
}> = ({ label, value }) => {
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

export const ComplaintOverview: FC<FieldBaseProps> = ({ application }) => {
  const { formatMessage } = useLocale()
  const answers = (application as any).answers as DataProtectionComplaint

  return (
    <Box>
      <Text marginTop={2} marginBottom={[4, 6]}>
        {formatMessage(overview.general.pageDescription)}
      </Text>
      <SectionHeading title={section.info} />
      <ValueLine
        label={info.general.pageTitle}
        value={onBehalfValueLabelMapper[answers.info.onBehalf]}
      />
      <ValueLine
        label={delimitation.labels.inCourtProceedings}
        value={yesNoValueLabelMapper[answers.inCourtProceedings]}
      />
      <ValueLine
        label={delimitation.labels.concernsMediaCoverage}
        value={yesNoValueLabelMapper[answers.concernsMediaCoverage]}
      />
      <ValueLine
        label={delimitation.labels.concernsBanMarking}
        value={yesNoValueLabelMapper[answers.concernsBanMarking]}
      />
      <ValueLine
        label={delimitation.labels.concernsLibel}
        value={yesNoValueLabelMapper[answers.concernsLibel]}
      />
    </Box>
  )
}
