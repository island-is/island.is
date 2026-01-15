import {
  ActionCard,
  Box,
  Stack,
  Text,
  ToggleSwitchButton,
} from '@island.is/island-ui/core'
import { useLocale, useNamespaces } from '@island.is/localization'
import {
  CardLoader,
  IntroWrapper,
  m,
  HMS_SLUG,
  LinkButton,
} from '@island.is/portals/my-pages/core'
import { Problem } from '@island.is/react-spa/shared'
import { contractsMessages as cm } from '../../../lib/messages'
import { useUserContractsOverviewQuery } from './UserContractsOverview.generated'
import { mapStatusTypeToTag } from '../../../utils/mapStatusTypeToTag'
import { InformationPaths } from '../../../lib/paths'
import { isDefined } from '@island.is/shared/utils'
import { useState } from 'react'
import { getApplicationsBaseUrl } from '@island.is/portals/core'
import { useNavigate } from 'react-router-dom'

const UserContractsOverview = () => {
  useNamespaces('sp.contracts')
  const { formatMessage } = useLocale()

  const navigate = useNavigate()

  const [hideInactiveContracts, setHideInactiveContracts] = useState(false)

  const { data, loading, error } = useUserContractsOverviewQuery({
    variables: {
      hideInactiveContracts: hideInactiveContracts,
    },
  })

  return (
    <IntroWrapper
      title={cm.contractsOverviewTitle}
      intro={cm.contractsOverviewSubtitle}
      serviceProviderSlug={HMS_SLUG}
      serviceProviderTooltip={formatMessage(m.rentalAgreementsTooltip)}
      marginBottom={3}
      buttonGroup={[
        <LinkButton
          to={`${getApplicationsBaseUrl()}/leigusamningur`}
          text={formatMessage(cm.registerRentalAgreement)}
          icon="document"
          variant="utility"
        />,
      ]}
    >
      {error && !loading && <Problem error={error} noBorder={false} />}
      {!error && (
        <Box display="flex" justifyContent="spaceBetween" marginTop={3}>
          <Text variant="medium">
            {!loading &&
              formatMessage(cm.recordsFound, {
                count: data?.hmsRentalAgreements?.totalCount ?? 0,
              })}
          </Text>
          <ToggleSwitchButton
            aria-controls="contracts-area"
            onChange={() => {
              setHideInactiveContracts(!hideInactiveContracts)
            }}
            label={
              <Text variant="medium">
                {formatMessage(cm.hideInactiveContracts)}
              </Text>
            }
            checked={hideInactiveContracts}
          />
        </Box>
      )}
      {!error && !loading && !data?.hmsRentalAgreements && (
        <Problem
          type="no_data"
          noBorder={false}
          title={formatMessage(m.noData)}
          message={formatMessage(m.noDataFoundDetail)}
          imgSrc="./assets/images/sofa.svg"
        />
      )}
      {!error && loading && (
        <Stack space={2}>
          {[...Array(3)].map((_key, index) => (
            <CardLoader key={index} />
          ))}
        </Stack>
      )}

      {!error && !loading && data?.hmsRentalAgreements && (
        <Box id="contracts-area" marginTop={1}>
          <Stack space={2}>
            {data.hmsRentalAgreements.data
              .map((contract) => {
                const { id, status, contractType, contractProperty } = contract
                const address =
                  contractProperty &&
                  contractProperty.streetAndHouseNumber &&
                  contractProperty.municipality &&
                  contractProperty.postalCode
                    ? `${contractProperty.streetAndHouseNumber}, ${contractProperty.postalCode} ${contractProperty.municipality}`
                    : undefined

                const { message, ...restOfTag } = mapStatusTypeToTag(
                  status,
                ) ?? {
                  message: undefined,
                }

                if (!message || !restOfTag) {
                  return null
                }
                return (
                  <ActionCard
                    key={id}
                    heading={address}
                    headingVariant="h3"
                    cta={{
                      label: formatMessage(cm.seeInfo),
                      onClick: () =>
                        navigate(
                          InformationPaths.MyContractsDetail.replace(':id', id),
                        ),
                      variant: 'text',
                    }}
                    subText={'TODO'}
                    tag={{
                      label: formatMessage(message),
                      ...restOfTag,
                    }}
                  />
                )
              })
              .filter(isDefined)}
          </Stack>
        </Box>
      )}
    </IntroWrapper>
  )
}
export default UserContractsOverview
