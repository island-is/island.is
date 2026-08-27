import { useMemo } from 'react'
import { useLocale, useNamespaces } from '@island.is/localization'
import { AlertMessage, Box } from '@island.is/island-ui/core'
import {
  CardLoader,
  createColumnHelper,
  formatDate,
  InfoLine,
  InfoLineStack,
  IntroWrapper,
  LinkButton,
  m as coreMessages,
  PortalTable,
  RIKISLOGREGLUSTJORI_SLUG,
} from '@island.is/portals/my-pages/core'
import { Problem } from '@island.is/react-spa/shared'
import { isDefined } from '@island.is/shared/utils'
import { messages } from '../../lib/messages'
import { useGetDriversDeprivationsQuery } from './DriversDeprivations.generated'
import { DrivingLicenseDeprivation } from '@island.is/api/schema'

const columnHelper =
  createColumnHelper<
    Pick<DrivingLicenseDeprivation, 'name' | 'dateFrom' | 'dateTo'>
  >()

const DriversDeprivations = () => {
  useNamespaces('sp.law-and-order')
  const { formatMessage } = useLocale()

  const { data, loading, error } = useGetDriversDeprivationsQuery()

  const current = data?.drivingLicenseDeprivations?.current
  const history = data?.drivingLicenseDeprivations?.history ?? []

  const total = (current ? 1 : 0) + history.length

  const isEmpty = !loading && !error && total === 0

  const columns = useMemo(
    () => [
      columnHelper.accessor('name', {
        header: formatMessage(messages.driversDeprivationsColumnType),
      }),
      columnHelper.display({
        id: 'reason',
        header: formatMessage(messages.driversDeprivationsColumnReason),
        // TODO: implement when API exposes a human-readable reason string on Deprivation (currently only deprivationType: Int is available)
        cell: () => '-',
      }),
      columnHelper.accessor('dateFrom', {
        header: formatMessage(messages.driversDeprivationsColumnDateFrom),
        cell: ({ getValue }) => {
          const value = getValue()
          return value ? formatDate(value) : undefined
        },
      }),
      columnHelper.accessor('dateTo', {
        header: formatMessage(messages.driversDeprivationsColumnDateTo),
        cell: ({ getValue }) => {
          const value = getValue()
          return value ? formatDate(value) : undefined
        },
      }),
    ],
    [formatMessage],
  )

  return (
    <IntroWrapper
      title={messages.driversDeprivationsTitle}
      intro={messages.driversDeprivationsDescription}
      serviceProvider={{
        slug: RIKISLOGREGLUSTJORI_SLUG,
        tooltip: formatMessage(coreMessages.nationalPoliceCommissionerTooltip),
      }}
      buttonGroup={{
        actions: [
          <LinkButton
            key="learn-more"
            to={formatMessage(messages.driversDeprivationsLearnMoreUrl)}
            text={formatMessage(messages.driversDeprivationsLearnMoreText)}
            icon="open"
            variant="utility"
          />,
          <LinkButton
            key="restore-license"
            to={formatMessage(messages.driversDeprivationsRestoreLicenseUrl)}
            text={formatMessage(messages.driversDeprivationsRestoreLicenseText)}
            icon="open"
            variant="utility"
          />,
        ],
      }}
      desktopContentSpan="10/12"
    >
      {loading && !error && (
        <Box width="full">
          <CardLoader />
        </Box>
      )}

      {error && !loading && <Problem error={error} noBorder={false} />}

      {isEmpty && (
        <Problem
          type="no_data"
          noBorder={false}
          title={formatMessage(messages.driversDeprivationsEmptyTitle)}
          message={formatMessage(messages.driversDeprivationsEmptyDescription)}
          imgSrc="./assets/images/sofa.svg"
        />
      )}

      {!loading && !error && total > 0 && (
        <Box>
          {current?.active === true && (
            <Box marginBottom={3}>
              <AlertMessage
                type="error"
                title={formatMessage(messages.driversDeprivationsActiveTitle)}
                message={
                  current.dateTo
                    ? formatMessage(
                        messages.driversDeprivationsActiveDescription,
                        {
                          dateTo: formatDate(current.dateTo),
                        },
                      )
                    : undefined
                }
              />
            </Box>
          )}

          {current?.active === false && current.retakeRequired === true && (
            <Box marginBottom={3}>
              <AlertMessage
                type="warning"
                title={formatMessage(
                  messages.driversDeprivationsRetakeRequiredTitle,
                )}
                message={formatMessage(
                  messages.driversDeprivationsRetakeRequiredDescription,
                )}
              />
            </Box>
          )}

          {total === 1 && current ? (
            <InfoLineStack space={1} marginBottom={0}>
              <InfoLine
                label={formatMessage(messages.driversDeprivationsColumnType)}
                labelColumnSpan="5/12"
                content={current.name ?? undefined}
              />
              <InfoLine
                label={formatMessage(
                  messages.driversDeprivationsColumnDateFrom,
                )}
                labelColumnSpan="5/12"
                content={
                  current.dateFrom ? formatDate(current.dateFrom) : undefined
                }
              />
              <InfoLine
                label={formatMessage(messages.driversDeprivationsColumnDateTo)}
                labelColumnSpan="5/12"
                content={
                  current.dateTo ? formatDate(current.dateTo) : undefined
                }
              />
            </InfoLineStack>
          ) : (
            <PortalTable
              columns={columns}
              data={[current, ...history].filter(isDefined)}
              emptyMessage={formatMessage(
                messages.driversDeprivationsEmptyDescription,
              )}
              mobileTitleKey="name"
            />
          )}
        </Box>
      )}
    </IntroWrapper>
  )
}

export default DriversDeprivations
