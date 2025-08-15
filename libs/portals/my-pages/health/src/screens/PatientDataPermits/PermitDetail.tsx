import { useLocale } from '@island.is/localization'
import {
  formatDate,
  formatDateWithTime,
  InfoLine,
  InfoLineStack,
  IntroWrapper,
} from '@island.is/portals/my-pages/core'
import React, { useState } from 'react'
import { messages } from '../../lib/messages'
import { Button, Box } from '@island.is/island-ui/core'
import { mockData } from './mockData'
import { useParams } from 'react-router-dom'
import { useGetPatientDataPermitQuery } from './PatientDataPermits.generated'
import { HealthDirectorateApprovalStatus } from '@island.is/api/schema'
import { InvalidatePermitModal } from '../../components/PatientDataPermit/InvalidatePermitModal'
import { Problem } from '@island.is/react-spa/shared'

type UseParams = {
  id: string
}
const PermitDetail: React.FC = () => {
  const { formatMessage, lang } = useLocale()
  const { id } = useParams() as UseParams
  const [modalOpen, setModalOpen] = useState<boolean>(false)

  const { data, error, loading } = useGetPatientDataPermitQuery({
    variables: { locale: lang, id },
  })
  const permit = data?.healthDirectoratePatientSummaryApproval

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
      {error && !loading && (
        <Problem title={formatMessage(messages.errorTryAgain)} />
      )}
      {!error && (
        <Box>
          <InfoLineStack>
            <InfoLine
              label={formatMessage(messages.referralFrom) ?? ''}
              content={formatMessage(messages.healthDirectorate)}
              loading={loading}
              button={{
                to: 'https://www.landlaeknir.is',
                label: formatMessage(messages.organizationWebsite),
                type: 'link',
              }}
            />
            <InfoLine
              label={formatMessage(messages.publicationDate) ?? ''}
              content={formatDateWithTime(permit?.createdAt.toString() ?? '')}
              loading={loading}
            />
            <InfoLine
              label={formatMessage(messages.status) ?? ''}
              content={
                permit?.status === HealthDirectorateApprovalStatus.active
                  ? formatMessage(messages.valid)
                  : permit?.status === HealthDirectorateApprovalStatus.expired
                  ? formatMessage(messages.expired)
                  : formatMessage(messages.invalid)
              }
              button={
                permit?.status === HealthDirectorateApprovalStatus.active
                  ? {
                      action: () => setModalOpen(true),
                      label: formatMessage(messages.invalidatePermit),
                      icon: 'eyeOff',
                      type: 'action',
                    }
                  : undefined
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
              content={permit?.countries
                .flatMap((country) => country.name)
                .join(', ')}
              loading={loading}
            />
          </InfoLineStack>
        </Box>
      )}
      <InvalidatePermitModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        countries={permit?.countries}
        validFrom={formatDate(permit?.validFrom)}
        validTo={formatDate(permit?.validTo)}
      />
    </IntroWrapper>
  )
}

export default PermitDetail
