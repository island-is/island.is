import { useLocale } from '@island.is/localization'
import {
  formatDate,
  formatDateWithTime,
  InfoLine,
  InfoLineStack,
  IntroWrapper,
} from '@island.is/portals/my-pages/core'
import React from 'react'
import { messages } from '../../lib/messages'
import { Button, Box } from '@island.is/island-ui/core'
import { mockData } from './mockData'
import { useParams } from 'react-router-dom'

type UseParams = {
  id: string
}
const PermitDetail: React.FC = () => {
  const { formatMessage } = useLocale()
  const { id } = useParams() as UseParams
  const loading = false // Replace with actual loading state if needed
  const permit = mockData.find((permit) => permit.id.toString() === id)

  return (
    <IntroWrapper
      title={formatMessage(messages.permit)}
      intro={formatMessage(messages.patientDataPermitDescription)}
      serviceProviderSlug="landlaeknir"
      serviceProviderTooltip={formatMessage(
        messages.landlaeknirVaccinationsTooltip,
      )} // TODO: Update this tooltip message if needed
      buttonGroup={[
        <Button variant="utility" icon="download" iconType="outline">
          {formatMessage(messages.downloadPDF)}
        </Button>,
      ]}
    >
      <Box>
        <InfoLineStack>
          <InfoLine
            label={formatMessage(messages.referralFrom) ?? ''}
            content={permit?.publisher ?? ''}
            loading={loading}
            button={{
              to: 'https://www.landlaeknir.is',
              label: formatMessage(messages.organizationWebsite),
              type: 'link',
            }}
          />
          <InfoLine
            label={formatMessage(messages.publicationDate) ?? ''}
            content={formatDateWithTime(permit?.publishedDate.toString() ?? '')}
            loading={loading}
          />
          <InfoLine
            label={formatMessage(messages.status) ?? ''}
            content={
              permit?.isValid
                ? formatMessage(messages.valid)
                : formatMessage(messages.invalid)
            }
            loading={loading}
          />
          <InfoLine
            label={formatMessage(messages.validTime) ?? ''}
            content={
              formatDate(permit?.validFrom.toString()) +
              ' - ' +
              formatDate(permit?.validTo.toString())
            }
            loading={loading}
          />
          <InfoLine
            label={formatMessage(messages.permitValidForShort) ?? ''}
            content={permit?.countries.join(', ') ?? ''}
            loading={loading}
          />
        </InfoLineStack>
      </Box>
    </IntroWrapper>
  )
}

export default PermitDetail
