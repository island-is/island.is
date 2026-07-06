import { useLocale, useNamespaces } from '@island.is/localization'
import { AlertMessage, Box, Table as T } from '@island.is/island-ui/core'
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
import { useGetDriversDeprivationsQuery } from './DriversDeprivations.generated'
import { DrivingLicenseDeprivationStatus } from '@island.is/api/schema'

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

          <T.Table>
            <T.Head>
              <T.Row>
                <T.HeadData>
                  {formatMessage(messages.driversDeprivationsColumnType)}
                </T.HeadData>
                <T.HeadData>
                  {/* TODO: implement when API exposes a human-readable reason string on Deprivation (currently only deprivationType: Int is available) */}
                  {formatMessage(messages.driversDeprivationsColumnReason)}
                </T.HeadData>
                <T.HeadData>
                  {formatMessage(messages.driversDeprivationsColumnDateFrom)}
                </T.HeadData>
                <T.HeadData>
                  {formatMessage(messages.driversDeprivationsColumnDateTo)}
                </T.HeadData>
              </T.Row>
            </T.Head>
            <T.Body>
              {deprivations.map((deprivation, index) => (
                <T.Row key={index}>
                  <T.Data>{deprivation.name ?? undefined}</T.Data>
                  <T.Data>
                    {/* TODO: implement when API exposes a human-readable reason string on Deprivation */}
                    —
                  </T.Data>
                  <T.Data>
                    {deprivation.dateFrom
                      ? formatDate(deprivation.dateFrom)
                      : undefined}
                  </T.Data>
                  <T.Data>
                    {deprivation.dateTo
                      ? formatDate(deprivation.dateTo)
                      : undefined}
                  </T.Data>
                </T.Row>
              ))}
            </T.Body>
          </T.Table>
        </Box>
      )}
    </IntroWrapper>
  )
}

export default DriversDeprivations
