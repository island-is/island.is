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
import { DrivingLicensePenaltyPointDetail } from '@island.is/api/schema'
import { messages } from '../../lib/messages'
import { useGetDriversPenaltyPointsQuery } from './DriversPoints.generated'
import { useGetDriversDeprivationsQuery } from '../DriversDeprivations/DriversDeprivations.generated'

const columnHelper =
  createColumnHelper<
    Pick<DrivingLicensePenaltyPointDetail, 'offenseDate' | 'penalty' | 'points'>
  >()

const DriversPoints = () => {
  useNamespaces('sp.law-and-order')
  const { formatMessage } = useLocale()

  const { data, loading, error } = useGetDriversPenaltyPointsQuery()
  const {
    data: deprivationsData,
    loading: deprivationsLoading,
    error: deprivationsError,
  } = useGetDriversDeprivationsQuery()

  const isPenaltyPointsOk = !(
    data?.drivingLicensePenaltyPoints?.isDeprived ?? false
  )
  const details = data?.drivingLicensePenaltyPoints?.details ?? []

  const totalPoints = details.reduce((sum, d) => sum + (d.points ?? 0), 0)

  const isEmpty = !loading && !error && details.length === 0

  const currentDeprivation = deprivationsData?.drivingLicenseDeprivations?.current

  const deprivationAlert =
    !deprivationsLoading && !deprivationsError && currentDeprivation
      ? currentDeprivation.active === true
        ? {
            type: 'error' as const,
            title: formatMessage(messages.driversDeprivationsActiveTitle),
            message: currentDeprivation.dateTo
              ? formatMessage(messages.driversDeprivationsActiveDescription, {
                  dateTo: formatDate(currentDeprivation.dateTo),
                })
              : undefined,
          }
        : currentDeprivation.active === false &&
          currentDeprivation.retakeRequired === true
        ? {
            type: 'warning' as const,
            title: formatMessage(
              messages.driversDeprivationsRetakeRequiredTitle,
            ),
            message: formatMessage(
              messages.driversDeprivationsRetakeRequiredDescription,
            ),
          }
        : undefined
      : undefined

  const columns = useMemo(
    () => [
      columnHelper.accessor('offenseDate', {
        header: formatMessage(messages.driversPointsColumnOffenseDate),
        cell: ({ getValue }) => {
          const value = getValue()
          return value ? formatDate(value) : undefined
        },
        footer: () => formatMessage(messages.driversPointsTotalPoints),
      }),
      columnHelper.accessor('penalty', {
        header: formatMessage(messages.driversPointsColumnPenalty),
        cell: ({ getValue }) => getValue() ?? undefined,
      }),
      columnHelper.accessor('points', {
        header: formatMessage(messages.driversPointsColumnPoints),
        cell: ({ getValue }) => getValue()?.toString() ?? undefined,
        footer: () => totalPoints.toString(),
      }),
      columnHelper.display({
        id: 'expiresDate',
        header: formatMessage(messages.driversPointsColumnExpiresDate),
        // TODO: implement when API exposes expiry date field on PenaltyPointDetail
        cell: () => '-',
      }),
    ],
    [formatMessage, totalPoints],
  )

  return (
    <IntroWrapper
      title={messages.driversPointsTitle}
      intro={messages.driversPointsDescription}
      serviceProvider={{
        slug: RIKISLOGREGLUSTJORI_SLUG,
        tooltip: formatMessage(coreMessages.nationalPoliceCommissionerTooltip),
      }}
      buttonGroup={{
        actions: [
          <LinkButton
            key="learn-more"
            to={formatMessage(messages.driversPointsLearnMoreUrl)}
            text={formatMessage(messages.driversPointsLearnMoreText)}
            icon="open"
            variant="utility"
          />,
        ],
      }}
      desktopContentSpan="10/12"
    >
      {(loading || deprivationsLoading) && !error && (
        <Box width="full">
          <CardLoader />
        </Box>
      )}

      {error && !loading && <Problem error={error} noBorder={false} />}

      {!loading && !deprivationsLoading && !error && (
        <>
          {deprivationAlert && (
            <Box marginBottom={3}>
              <AlertMessage
                type={deprivationAlert.type}
                title={deprivationAlert.title}
                message={deprivationAlert.message}
              />
            </Box>
          )}

          {isEmpty ? (
            <Problem
              type="no_data"
              noBorder={false}
              title={formatMessage(messages.driversPointsEmptyTitle)}
              message={formatMessage(messages.driversPointsEmptyDescription)}
              imgSrc="./assets/images/sofa.svg"
            />
          ) : (
            <Box>
              {!isPenaltyPointsOk && (
                <Box marginBottom={3}>
                  {/* TODO: confirm alert type and message copy with business — isDeprived means threshold crossed, not approaching */}
                  <AlertMessage
                    type="warning"
                    title={formatMessage(messages.driversPointsWarningTitle)}
                    message={formatMessage(
                      messages.driversPointsWarningDescription,
                    )}
                  />
                </Box>
              )}

              <PortalTable
                columns={columns}
                data={details}
                emptyMessage={formatMessage(
                  messages.driversPointsEmptyDescription,
                )}
                mobileTitleKey="offenseDate"
              />
            </Box>
          )}
        </>
      )}
    </IntroWrapper>
  )
}

export default DriversPoints
