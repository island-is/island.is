import {
  ActionCard,
  Box,
  Pagination,
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
} from '@island.is/portals/my-pages/core'
import { Problem } from '@island.is/react-spa/shared'
import { contractsMessages as cm } from '../../../lib/messages'
import { useUserContractsOverviewQuery } from './UserContractsOverview.generated'
import { mapStatusTypeToTag } from '../../../utils/mapStatusTypeToTag'
import { generateRentalAgreementAddress } from '../../../utils/mapAddress'
import { mapPropertyTypeToMessage } from '../../../utils/mapPropertyTypeToMessage'
import { InformationPaths } from '../../../lib/paths'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const DEFAULT_PAGE_SIZE = 10
const DEFAULT_PAGE_NUMBER = 1

const UserContractsOverview = () => {
  useNamespaces('sp.contracts')
  const { formatMessage } = useLocale()

  const navigate = useNavigate()

  const [hideInactiveContracts, setHideInactiveContracts] = useState(false)
  const [page, setPage] = useState(DEFAULT_PAGE_NUMBER)

  const { data, loading, error } = useUserContractsOverviewQuery({
    variables: {
      input: {
        hideInactiveAgreements: hideInactiveContracts,
        page,
        pageSize: DEFAULT_PAGE_SIZE,
      },
    },
  })

  return (
    <IntroWrapper
      title={cm.contractsOverviewTitle}
      intro={cm.contractsOverviewSubtitle}
      serviceProvider={{
        slug: HMS_SLUG,
        tooltip: formatMessage(m.rentalAgreementsTooltip),
      }}
      marginBottom={3}
      desktopContentSpan="10/12"
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
              setPage(DEFAULT_PAGE_NUMBER)
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
      {!error &&
        !loading &&
        (data?.hmsRentalAgreements?.totalCount ?? 0) === 0 && (
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
            {data.hmsRentalAgreements.data.map((contract) => {
              const { id, status, contractProperty } = contract
              const address = generateRentalAgreementAddress(
                contractProperty ?? undefined,
              )

              const { message, ...restOfTag } = mapStatusTypeToTag(status) ?? {
                message: undefined,
              }

              const propertyTypeMessage = mapPropertyTypeToMessage(
                contractProperty?.type,
              )
              const subText = propertyTypeMessage
                ? formatMessage(propertyTypeMessage)
                : undefined

              return (
                <ActionCard
                  key={id}
                  heading={address}
                  headingVariant="h4"
                  cta={{
                    label: formatMessage(cm.seeInfo),
                    onClick: () =>
                      navigate(
                        InformationPaths.MyContractsDetail.replace(':id', id),
                      ),
                    variant: 'text',
                  }}
                  subText={subText}
                  tag={
                    message && restOfTag
                      ? {
                          label: formatMessage(message),
                          ...restOfTag,
                        }
                      : undefined
                  }
                />
              )
            })}
          </Stack>
          {(data.hmsRentalAgreements.totalCount ?? 0) > DEFAULT_PAGE_SIZE && (
            <Box marginTop={3}>
              <Pagination
                page={page}
                totalPages={Math.ceil(
                  data.hmsRentalAgreements.totalCount /
                    (data.hmsRentalAgreements.pageSize ?? DEFAULT_PAGE_SIZE),
                )}
                renderLink={(page, className, children) => (
                  <button className={className} onClick={() => setPage(page)}>
                    {children}
                  </button>
                )}
              />
            </Box>
          )}
        </Box>
      )}
    </IntroWrapper>
  )
}
export default UserContractsOverview
