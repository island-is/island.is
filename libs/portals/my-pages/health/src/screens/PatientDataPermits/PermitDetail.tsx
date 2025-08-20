import { HealthDirectoratePermitStatus } from '@island.is/api/schema'
import { Box, Button, toast } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import {
  formatDate,
  formatDateWithTime,
  InfoLine,
  InfoLineStack,
  IntroWrapper,
} from '@island.is/portals/my-pages/core'
import { Problem } from '@island.is/react-spa/shared'
import React, { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { InvalidatePermitModal } from '../../components/PatientDataPermit/InvalidatePermitModal'
import { messages } from '../../lib/messages'
import {
  useGetPatientDataPermitQuery,
  useInvalidatePatientDataPermitMutation,
} from './PatientDataPermits.generated'

type UseParams = {
  id: string
}
const PermitDetail: React.FC = () => {
  const { formatMessage, lang } = useLocale()
  const navigate = useNavigate()
  const { id } = useParams() as UseParams
  const [modalOpen, setModalOpen] = useState<boolean>(false)

  const { data, error, loading } = useGetPatientDataPermitQuery({
    variables: { locale: lang, id },
  })

  const [invalidatePermit] = useInvalidatePatientDataPermitMutation()

  const permit = data?.healthDirectoratePatientDataPermit

  const onInvalidateSubmit = () => {
    // Call the API to invalidate the permit
    if (permit?.id) {
      invalidatePermit({
        variables: {
          input: {
            id: permit?.id,
          },
        },
      })
        .then(() => {
          // Handle successful invalidation
          toast.success(formatMessage(messages.permitInvalidated))
          navigate(-1)
        })
        .catch((error) => {
          // Handle error
          toast.error(formatMessage(messages.permitInvalidatedError))
        })
    }
  }

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
                permit?.status === HealthDirectoratePermitStatus.active
                  ? formatMessage(messages.valid)
                  : permit?.status === HealthDirectoratePermitStatus.expired
                  ? formatMessage(messages.expired)
                  : formatMessage(messages.invalid)
              }
              button={
                permit?.status === HealthDirectoratePermitStatus.active
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
        onSubmit={() => {
          onInvalidateSubmit()
        }}
        countries={permit?.countries}
        validFrom={formatDate(permit?.validFrom)}
        validTo={formatDate(permit?.validTo)}
      />
    </IntroWrapper>
  )
}

export default PermitDetail
