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

const columnHelper =
  createColumnHelper<
    Pick<DrivingLicensePenaltyPointDetail, 'offenseDate' | 'penalty' | 'points'>
  >()

const DriversPoints = () => {
  useNamespaces('sp.law-and-order')
  const { formatMessage } = useLocale()

  const { data, loading, error } = useGetDriversPenaltyPointsQuery()

  const isPenaltyPointsOk = !(
    data?.drivingLicensePenaltyPoints?.isDeprived ?? false
  )
  const details = data?.drivingLicensePenaltyPoints?.details ?? []

  const totalPoints = details.reduce((sum, d) => sum + (d.points ?? 0), 0)

  const isEmpty = !loading && !error && details.length === 0

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
          title={formatMessage(messages.driversPointsEmptyTitle)}
          message={formatMessage(messages.driversPointsEmptyDescription)}
          imgSrc="./assets/images/sofa.svg"
        />
      )}

      {!loading && !error && details.length > 0 && (
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
            emptyMessage={formatMessage(messages.driversPointsEmptyDescription)}
            mobileTitleKey="offenseDate"
          />
        </Box>
      )}
    </IntroWrapper>
  )
}

export default DriversPoints
