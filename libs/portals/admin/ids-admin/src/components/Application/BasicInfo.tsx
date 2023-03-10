import { AccordionCard, Input, Stack, Text } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import React from 'react'
import { m } from '../../lib/messages'
import ContentCard from './ContentCard'
const BasicInfoContent = ({ basicInfo }: any) => {
  const { formatMessage } = useLocale()
  return (
    <ContentCard title={formatMessage(m.basicInfo)}>
      <Stack space={3}>
        <Input
          readOnly
          type="text"
          size="sm"
          name="application"
          value={basicInfo.applicationId}
          label={formatMessage(m.applicationId)}
        />
        <Stack space={1}>
          <Input
            readOnly
            type="password"
            size="sm"
            name="application"
            value={basicInfo.applicationSecret}
            label={formatMessage(m.applicationSecret)}
          />
          <Text variant={'small'}>
            {formatMessage(m.applicationSecretDescription)}
          </Text>
        </Stack>
        <Input
          readOnly
          type="text"
          size="sm"
          name="application"
          value={basicInfo.idsURL}
          label={formatMessage(m.idsUrl)}
        />
        <AccordionCard
          id="otherEndpoints"
          label={formatMessage(m.otherEndpoints)}
        >
          OtherEndpoints
        </AccordionCard>
      </Stack>
    </ContentCard>
  )
}

export default BasicInfoContent
