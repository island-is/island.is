import { AlertMessage, Box, Text } from '@island.is/island-ui/core'
import { useLocale, useNamespaces } from '@island.is/localization'
import {
  CardLoader,
  formatDate,
  InfoLine,
  InfoLineStack,
  IntroWrapper,
  LinkButton,
  m as coreMessages,
  RIKISLOGREGLUSTJORI_SLUG,
} from '@island.is/portals/my-pages/core'
import { Problem } from '@island.is/react-spa/shared'

import { messages } from '../../lib/messages'
import { useGetDriversDeprivationQuery } from './DriversDeprivations.generated'

const DriversDeprivations = () => {
  useNamespaces('sp.law-and-order')
  const { formatMessage } = useLocale()

  const { data, loading, error } = useGetDriversDeprivationQuery()

  const deprivation = data?.drivingLicenseDeprivation

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
      <Box role="status" aria-live="polite">
        {loading && !error && (
          <Box width="full">
            <CardLoader />
          </Box>
        )}

        {error && !loading && <Problem error={error} noBorder={false} />}

        {!loading && !error && !deprivation && (
          <Problem
            type="no_data"
            noBorder={false}
            title={formatMessage(messages.driversDeprivationsEmptyTitle)}
            message={formatMessage(
              messages.driversDeprivationsEmptyDescription,
            )}
            imgSrc="./assets/images/sofa.svg"
          />
        )}

        {!loading && !error && deprivation && (
          <Box marginBottom={3}>
            <AlertMessage
              type="error"
              title={
                <Text
                  as="h2"
                  variant="h5"
                  marginBottom={deprivation.dateTo ? 1 : 0}
                >
                  {formatMessage(messages.driversDeprivationsActiveTitle)}
                </Text>
              }
              message={
                deprivation.dateTo
                  ? formatMessage(
                      messages.driversDeprivationsActiveDescription,
                      {
                        dateTo: formatDate(deprivation.dateTo),
                      },
                    )
                  : undefined
              }
            />
          </Box>
        )}
      </Box>

      {!loading && !error && deprivation && (
        <InfoLineStack space={1} marginBottom={0}>
          <InfoLine
            label={formatMessage(messages.driversDeprivationsColumnType)}
            labelColumnSpan="5/12"
            content={deprivation.name ?? undefined}
          />
          <InfoLine
            label={formatMessage(messages.driversDeprivationsColumnDateFrom)}
            labelColumnSpan="5/12"
            content={formatDate(deprivation.dateFrom)}
          />
          <InfoLine
            label={formatMessage(messages.driversDeprivationsColumnDateTo)}
            labelColumnSpan="5/12"
            content={
              deprivation.dateTo ? formatDate(deprivation.dateTo) : undefined
            }
          />
        </InfoLineStack>
      )}
    </IntroWrapper>
  )
}

export default DriversDeprivations
