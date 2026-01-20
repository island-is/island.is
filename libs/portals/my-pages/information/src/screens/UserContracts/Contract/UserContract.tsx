import { Box, Button, Tag } from '@island.is/island-ui/core'
import { useLocale, useNamespaces } from '@island.is/localization'
import {
  IntroWrapper,
  m,
  HMS_SLUG,
  LinkButton,
  InfoLineStack,
  InfoLine,
  formatDate,
  formSubmit,
} from '@island.is/portals/my-pages/core'
import { Problem } from '@island.is/react-spa/shared'
import { contractsMessages as cm } from '../../../lib/messages'
import { mapStatusTypeToTag } from '../../../utils/mapStatusTypeToTag'
import { useParams } from 'react-router-dom'
import { useMemo } from 'react'
import { useUserContractQuery } from './UserContract.generated'
import {
  HmsRentalAgreement,
  HmsRentalAgreementStatusType,
} from '@island.is/api/schema'
import { mapTemporalTypeToMessage } from '../../../utils/mapTemporalTypeToMessage'
import { generateRentalAgreementAddress } from '../../../utils/mapAddress'
import { getApplicationsBaseUrl } from '@island.is/portals/core'

const UserContract = () => {
  useNamespaces('sp.contracts')
  const { formatMessage } = useLocale()

  const { id } = useParams<'id'>()

  const { data, loading, error } = useUserContractQuery({
    variables: {
      id: id ?? '0',
    },
  })

  const contract: HmsRentalAgreement | undefined =
    data?.hmsRentalAgreement ?? undefined

  const address = useMemo(() => {
    if (data?.hmsRentalAgreement?.contractProperty) {
      return generateRentalAgreementAddress(
        data.hmsRentalAgreement.contractProperty ?? undefined,
      )
    }
  }, [data?.hmsRentalAgreement?.contractProperty])

  const agreementLengthMessage = useMemo(() => {
    if (data?.hmsRentalAgreement?.contractType) {
      return mapTemporalTypeToMessage(data.hmsRentalAgreement.contractType)
    }
  }, [data?.hmsRentalAgreement?.contractType])

  const status = useMemo(() => {
    if (
      data?.hmsRentalAgreement?.status &&
      data.hmsRentalAgreement.status !== HmsRentalAgreementStatusType.UNKNOWN
    ) {
      return mapStatusTypeToTag(data.hmsRentalAgreement.status)
    }
  }, [data?.hmsRentalAgreement?.status])

  return (
    <IntroWrapper
      title={address ?? cm.contractsOverviewTitle}
      intro={cm.contractDetailSubtitle}
      serviceProviderSlug={HMS_SLUG}
      serviceProviderTooltip={formatMessage(m.rentalAgreementsTooltip)}
      buttonGroup={[
        <Button
          key="download-button"
          title={formatMessage(cm.downloadAsPdf)}
          icon="download"
          iconType="outline"
          disabled={
            !!error || loading || !data?.hmsRentalAgreement?.downloadUrl
          }
          onClick={() =>
            formSubmit(data?.hmsRentalAgreement?.downloadUrl ?? '')
          }
          variant="utility"
        >
          {formatMessage(cm.downloadAsPdf)}
        </Button>,
        <LinkButton
          key="terminate-button"
          to={`${getApplicationsBaseUrl()}/uppsogn-eda-riftun-leigusamnings`}
          text={formatMessage(cm.terminateRentalAgreement)}
          icon="open"
          variant="utility"
        />,
      ]}
    >
      {error && !loading && <Problem error={error} noBorder={false} />}
      {!error && !loading && !contract && (
        <Problem
          type="no_data"
          noBorder={false}
          title={formatMessage(m.noData)}
          message={formatMessage(m.noDataFoundDetail)}
          imgSrc="./assets/images/sofa.svg"
        />
      )}

      {!error && (loading || contract) && (
        <Box>
          <InfoLineStack label={m.info}>
            <InfoLine
              loading={loading}
              label={cm.agreementNumber}
              content={contract?.id}
            />
            <InfoLine
              loading={loading}
              label={cm.landlords}
              content={
                contract?.landlords?.map((l) => l.name).join(', ') ?? undefined
              }
            />
            <InfoLine
              loading={loading}
              label={cm.tenants}
              content={
                contract?.tenants?.map((l) => l.name).join(', ') ?? undefined
              }
            />
            <InfoLine loading={loading} label={cm.location} content={address} />
            <InfoLine
              loading={loading}
              label={cm.lengthOfRentalAgreement}
              content={
                agreementLengthMessage
                  ? formatMessage(agreementLengthMessage)
                  : undefined
              }
            />
            <InfoLine
              loading={loading}
              label={cm.registrationDate}
              content={
                contract?.signatureDate
                  ? formatDate(contract?.signatureDate)
                  : undefined
              }
            />
            <InfoLine
              loading={loading}
              label={cm.status}
              content={
                status?.message ? (
                  <Tag outlined variant={status.variant} disabled>
                    {formatMessage(status.message)}
                  </Tag>
                ) : undefined
              }
            />
          </InfoLineStack>
        </Box>
      )}
    </IntroWrapper>
  )
}
export default UserContract
