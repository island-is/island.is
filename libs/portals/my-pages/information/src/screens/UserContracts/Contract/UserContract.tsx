import { Box, DropdownMenu, Tag } from '@island.is/island-ui/core'
import { useLocale, useNamespaces } from '@island.is/localization'
import {
  IntroWrapper,
  m,
  HMS_SLUG,
  LinkButton,
  InfoLineStack,
  InfoLine,
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
import { generateRentalAgreementAddress } from '../../../utils/mapAddress'
import { getApplicationsBaseUrl } from '@island.is/portals/core'
import { TERMINATED_STATUSES } from './constants'
import { isDefined } from '@island.is/shared/utils'

const UserContract = () => {
  useNamespaces('sp.contracts')
  const { formatMessage, formatDate } = useLocale()

  const { id } = useParams<'id'>()

  const { data, loading, error } = useUserContractQuery({
    variables: {
      id: id ?? '0',
    },
  })

  const contract: HmsRentalAgreement | undefined =
    data?.hmsRentalAgreement ?? undefined

  const address = useMemo(() => {
    if (data?.hmsRentalAgreement?.property) {
      return generateRentalAgreementAddress(
        data.hmsRentalAgreement.property ?? undefined,
      )
    }
  }, [data?.hmsRentalAgreement?.property])

  const status = useMemo(() => {
    if (
      data?.hmsRentalAgreement?.status &&
      data.hmsRentalAgreement.status !== HmsRentalAgreementStatusType.UNKNOWN
    ) {
      return mapStatusTypeToTag(data.hmsRentalAgreement.status)
    }
  }, [data?.hmsRentalAgreement?.status])

  const documentItems = useMemo(
    () =>
      data?.hmsRentalAgreement?.documents
        ?.map(({ name, downloadUrl }) => {
          if (!name || !downloadUrl) {
            return null
          }
          return {
            title: name,
            onClick: () => formSubmit(downloadUrl),
          }
        })
        .filter(isDefined) ?? [],
    [data?.hmsRentalAgreement?.documents],
  )

  return (
    <IntroWrapper
      title={address ?? cm.contractsOverviewTitle}
      intro={cm.contractDetailSubtitle}
      serviceProviderSlug={HMS_SLUG}
      serviceProviderTooltip={formatMessage(m.rentalAgreementsTooltip)}
      loading={loading}
      buttonGroup={[
        <DropdownMenu
          icon="download"
          iconType="outline"
          key="download-template"
          title={formatMessage(cm.downloadFiles)}
          menuLabel={formatMessage(cm.downloadFiles)}
          loading={loading}
          disabled={!!error || documentItems.length === 0}
          items={documentItems}
        />,
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
                contract?.dateFrom
                  ? formatMessage(cm.rentalAgreementDate, {
                      from: new Date(contract.dateFrom),
                      to: contract.dateTo
                        ? new Date(contract.dateTo)
                        : undefined,
                    })
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
            {contract?.status && TERMINATED_STATUSES.includes(contract.status) && (
              <InfoLine
                loading={loading}
                label={cm.terminationDate}
                content={
                  contract?.terminationDate
                    ? formatDate(new Date(contract.terminationDate), {
                        dateStyle: 'long',
                      })
                    : undefined
                }
              />
            )}
          </InfoLineStack>
        </Box>
      )}
    </IntroWrapper>
  )
}
export default UserContract
