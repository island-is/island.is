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
import { redirect } from 'react-router-dom'
import { InformationPaths } from '../../../lib/paths'
import { isDefined } from '@island.is/shared/utils'
import { useState } from 'react'

const UserContractsOverview = () => {
  useNamespaces('sp.contracts')
  const { formatMessage } = useLocale()

  const { data, loading, error } = useUserContractsOverviewQuery()

  const [hideInactiveContracts, setHideInactiveContracts] = useState(false)

  return (
    <IntroWrapper
      title={cm.contractsOverviewTitle}
      intro={cm.contractsOverviewSubtitle}
      serviceProviderSlug={HMS_SLUG}
      serviceProviderTooltip={formatMessage(m.rentalAgreementsTooltip)}
      buttonGroup={[
        <LinkButton
          to="/"
          text={formatMessage(cm.registerRentalAgreement)}
          icon="document"
          variant="utility"
        />,
      ]}
    >
      {error && !loading && <Problem error={error} noBorder={false} />}
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
        <Box>
          <Box display="flex" justifyContent="spaceBetween" marginTop={6}>
            <Text>
              {formatMessage(cm.recordsFound, {
                count: data.hmsRentalAgreements.totalCount,
              })}
            </Text>
            <Box>
              <ToggleSwitchButton
                aria-controls="contracts-area"
                onChange={() => {
                  setHideInactiveContracts(!hideInactiveContracts)
                }}
                label={formatMessage(cm.hideInactiveContracts)}
                checked={hideInactiveContracts}
              />
            </Box>
          </Box>
          <Box id="contracts-area" marginTop={2}>
            <Stack space={2}>
              {data.hmsRentalAgreements.data
                .map((contract) => {
                  const { id, status, contractType, contractProperty } =
                    contract
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
                      text={address}
                      cta={{
                        label: formatMessage(cm.seeInfo),
                        onClick: () =>
                          redirect(
                            InformationPaths.MyContractsDetail.replace(
                              ':id',
                              id,
                            ),
                          ),
                      }}
                      subText={contractType ?? undefined}
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
        </Box>
      )}
    </IntroWrapper>
  )
}
export default UserContractsOverview
