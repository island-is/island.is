import { useMemo } from 'react'
import { useLocale, useNamespaces } from '@island.is/localization'
import { AlertMessage, Box } from '@island.is/island-ui/core'
import {
  CardLoader,
  createColumnHelper,
  formatDate,
  IntroWrapper,
  LinkButton,
  m as coreMessages,
  PortalTable,
  RIKISLOGREGLUSTJORI_SLUG,
} from '@island.is/portals/my-pages/core'
import { Problem } from '@island.is/react-spa/shared'
import { messages } from '../../lib/messages'
import { useGetDriversDeprivationsQuery } from './DriversDeprivations.generated'
import {
  DrivingLicenseDeprivation,
  DrivingLicenseDeprivationStatus,
} from '@island.is/api/schema'

const columnHelper =
  createColumnHelper<
    Pick<DrivingLicenseDeprivation, 'name' | 'dateFrom' | 'dateTo'>
  >()

const DriversDeprivations = () => {
  useNamespaces('sp.law-and-order')
  const { formatMessage } = useLocale()

  const { data, loading, error } = useGetDriversDeprivationsQuery()

  const deprivations = data?.drivingLicenseDeprivations ?? []

  const isEmpty = !loading && !error && deprivations.length === 0

  // Find the most recent active deprivation (license lost) to show in alert
  const sortedDeprivations = [...deprivations].sort((a, b) => {
    const aDate = a.dateTo ?? a.dateFrom
    const bDate = b.dateTo ?? b.dateFrom
    return new Date(bDate ?? 0).getTime() - new Date(aDate ?? 0).getTime()
  })
  const activeDeprivation = sortedDeprivations.find(
    (d) =>
      d.status === DrivingLicenseDeprivationStatus.LOST ||
      d.status === DrivingLicenseDeprivationStatus.LOSTANDEXPIRED,
  )

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

      {!loading && !error && deprivations.length > 0 && (
        <Box>
          {activeDeprivation && (
            <Box marginBottom={3}>
              <AlertMessage
                type="error"
                title={formatMessage(messages.driversDeprivationsActiveTitle)}
                message={
                  activeDeprivation.dateTo
                    ? formatMessage(
                        messages.driversDeprivationsActiveDescription,
                        {
                          dateTo: formatDate(activeDeprivation.dateTo),
                        },
                      )
                    : undefined
                }
              />
            </Box>
          )}

          <PortalTable
            columns={columns}
            data={deprivations}
            emptyMessage={formatMessage(
              messages.driversDeprivationsEmptyDescription,
            )}
            mobileTitleKey="name"
          />
        </Box>
      )}
    </IntroWrapper>
  )
}

export default DriversDeprivations
