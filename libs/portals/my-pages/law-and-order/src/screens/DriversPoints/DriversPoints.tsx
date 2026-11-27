import { useMemo } from 'react'

import { DrivingLicensePenaltyPointDetail } from '@island.is/api/schema'
import { AlertMessage, Box, Text } from '@island.is/island-ui/core'
import { useLocale, useNamespaces } from '@island.is/localization'
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
import { useGetDriversDeprivationQuery } from '../DriversDeprivations/DriversDeprivations.generated'
import { useGetDriversPenaltyPointsQuery } from './DriversPoints.generated'

const columnHelper =
  createColumnHelper<
    Pick<
      DrivingLicensePenaltyPointDetail,
      'offenseDate' | 'penalty' | 'points' | 'expiryDate'
    >
  >()

const DriversPoints = () => {
  useNamespaces('sp.law-and-order')
  const { formatMessage } = useLocale()

  const { data, loading, error } = useGetDriversPenaltyPointsQuery()
  const {
    data: deprivationsData,
    loading: deprivationsLoading,
    error: deprivationsError,
  } = useGetDriversDeprivationQuery()

  const details = data?.drivingLicensePenaltyPoints?.details ?? []

  const totalPoints = details.reduce((sum, d) => sum + (d.points ?? 0), 0)

  const isEmpty = !loading && !error && details.length === 0

  const currentDeprivation = deprivationsData?.drivingLicenseDeprivation

  const deprivationAlert =
    !deprivationsLoading && !deprivationsError && currentDeprivation
      ? {
          title: formatMessage(messages.driversDeprivationsActiveTitle),
          message: currentDeprivation.dateTo
            ? formatMessage(messages.driversDeprivationsActiveDescription, {
                dateTo: formatDate(currentDeprivation.dateTo),
              })
            : undefined,
        }
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
      columnHelper.accessor('expiryDate', {
        id: 'expiresDate',
        header: formatMessage(messages.driversPointsColumnExpiresDate),
        cell: ({ getValue }) => {
          const value = getValue()
          return value ? formatDate(value) : '-'
        },
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
                type="error"
                title={
                  <Text
                    as="h2"
                    variant="h5"
                    marginBottom={deprivationAlert.message ? 1 : 0}
                  >
                    {deprivationAlert.title}
                  </Text>
                }
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
