import { useLocale, useNamespaces } from '@island.is/localization'
import {
  m,
  ErrorScreen,
  EmptyState,
  UserInfoLine,
} from '@island.is/service-portal/core'
import { useGetHealthCenterQuery } from './HealthCenter.generated'
import {
  Box,
  DatePicker,
  Divider,
  Inline,
  SkeletonLoader,
  Stack,
  Table as T,
  Text,
} from '@island.is/island-ui/core'
import { IntroHeader } from '@island.is/portals/core'
import { messages } from '../../lib/messages'
import { HealthCenterHistoryEntry } from '@island.is/api/schema'

const HealthCenter = () => {
  useNamespaces('sp.health')
  const { formatMessage } = useLocale()

  const { loading, error, data } = useGetHealthCenterQuery()

  const healthCenterData = data?.getRightsPortalHealthCenterHistory

  if (!error && !loading) {
    return (
      <ErrorScreen
        figure="./assets/images/hourglass.svg"
        tagVariant="red"
        tag={formatMessage(m.errorTitle)}
        title={formatMessage(m.somethingWrong)}
        children={formatMessage(m.errorFetchModule, {
          module: formatMessage(m.healthCenter).toLowerCase(),
        })}
      />
    )
  }

  const generateRow = (rowItem: HealthCenterHistoryEntry) => {
    const row = (
      <T.Row>
        <T.Data>
          <Text variant="medium">{rowItem.dateFrom ?? '-'}</Text>
        </T.Data>
        <T.Data>
          <Text variant="medium">{rowItem.dateTo ?? '-'}</Text>
        </T.Data>
        <T.Data>
          <Text variant="medium">{rowItem.healthCenter?.name ?? '-'}</Text>
        </T.Data>
        <T.Data>
          <Text variant="medium">{rowItem.healthCenter?.doctor ?? '-'}</Text>
        </T.Data>
      </T.Row>
    )

    return row
  }

  return (
    <Box marginBottom={[6, 6, 10]}>
      <IntroHeader
        title={formatMessage(messages.healthCenterTitle)}
        intro={formatMessage(messages.healthCenterDescription)}
      />
      {loading && <SkeletonLoader space={1} height={30} repeat={4} />}

      {!loading && !data && (
        <Box width="full" marginTop={4} display="flex" justifyContent="center">
          <Box marginTop={8}>
            <EmptyState />
          </Box>
        </Box>
      )}

      {!loading && !error && healthCenterData && (
        <Box width="full" marginTop={[1, 1, 4]}>
          <Stack space={2}>
            <UserInfoLine
              title={formatMessage(messages.yourInformation)}
              label={formatMessage(messages.healthCenterTitle)}
              content={healthCenterData.current?.name ?? ''}
            />
            <Divider />
            <UserInfoLine
              label={formatMessage(messages.personalDoctor)}
              content={healthCenterData.current?.doctor ?? ''}
            />
          </Stack>

          <Box marginTop={2}>
            <Text variant="h3">{messages.checkInHistory}</Text>
            <T.Table>
              <T.Head>
                <T.Row>
                  <T.HeadData>
                    <Text variant="medium" fontWeight="semiBold">
                      {formatMessage(m.dateFrom)}
                    </Text>
                  </T.HeadData>
                  <T.HeadData>
                    <Text variant="medium" fontWeight="semiBold">
                      {formatMessage(m.dateTo)}
                    </Text>
                  </T.HeadData>
                  <T.HeadData>
                    <Text variant="medium" fontWeight="semiBold">
                      {formatMessage(messages.healthCenterTitle)}
                    </Text>
                  </T.HeadData>
                  <T.HeadData>
                    <Text variant="medium" fontWeight="semiBold">
                      {formatMessage(messages.doctor)}
                    </Text>
                  </T.HeadData>
                  <T.HeadData />
                </T.Row>
              </T.Head>
              <T.Body>
                {healthCenterData.history?.map((rowItem) =>
                  generateRow(rowItem),
                )}
              </T.Body>
            </T.Table>
          </Box>
        </Box>
      )}
    </Box>
  )
}

export default HealthCenter
