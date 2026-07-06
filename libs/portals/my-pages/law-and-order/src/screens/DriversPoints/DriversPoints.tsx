import { useLocale, useNamespaces } from '@island.is/localization'
import { AlertMessage, Box, Table as T, Text } from '@island.is/island-ui/core'
import {
  CardLoader,
  formatDate,
  IntroWrapper,
  LinkButton,
  m as coreMessages,
  RIKISLOGREGLUSTJORI_SLUG,
} from '@island.is/portals/my-pages/core'
import { Problem } from '@island.is/react-spa/shared'
import { messages } from '../../lib/messages'
import { useGetDriversPenaltyPointsQuery } from './DriversPoints.generated'

const DriversPoints = () => {
  useNamespaces('sp.law-and-order')
  const { formatMessage } = useLocale()

  const { data, loading, error } = useGetDriversPenaltyPointsQuery()

  const isPenaltyPointsOk = !(data?.driversPenaltyPoints?.isDeprived ?? false)
  const details = data?.driversPenaltyPoints?.details ?? []

  const totalPoints = details.reduce((sum, d) => sum + (d.points ?? 0), 0)

  const isEmpty = !loading && !error && details.length === 0

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

          <T.Table>
            <T.Head>
              <T.Row>
                <T.HeadData>
                  {formatMessage(messages.driversPointsColumnOffenseDate)}
                </T.HeadData>
                <T.HeadData>
                  {formatMessage(messages.driversPointsColumnPenalty)}
                </T.HeadData>
                <T.HeadData>
                  {formatMessage(messages.driversPointsColumnPoints)}
                </T.HeadData>
                <T.HeadData>
                  {/* TODO: implement when API exposes expiry date field on PenaltyPointDetail */}
                  {formatMessage(messages.driversPointsColumnExpiresDate)}
                </T.HeadData>
              </T.Row>
            </T.Head>
            <T.Body>
              {details.map((detail, index) => (
                <T.Row key={index}>
                  <T.Data>
                    {detail.offenseDate
                      ? formatDate(detail.offenseDate)
                      : undefined}
                  </T.Data>
                  <T.Data>{detail.penalty ?? undefined}</T.Data>
                  <T.Data>{detail.points?.toString() ?? undefined}</T.Data>
                  <T.Data>
                    {/* TODO: implement when API exposes expiry date field on PenaltyPointDetail */}
                    —
                  </T.Data>
                </T.Row>
              ))}
            </T.Body>
            <T.Foot>
              <T.Row>
                <T.Data>
                  <Text fontWeight="semiBold">
                    {formatMessage(messages.driversPointsTotalPoints)}
                  </Text>
                </T.Data>
                <T.Data />
                <T.Data>
                  <Text fontWeight="semiBold">{totalPoints.toString()}</Text>
                </T.Data>
                <T.Data />
              </T.Row>
            </T.Foot>
          </T.Table>
        </Box>
      )}
    </IntroWrapper>
  )
}

export default DriversPoints
