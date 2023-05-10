import { useLocale, useNamespaces } from '@island.is/localization'
import {
  m,
  ErrorScreen,
  EmptyState,
  UserInfoLine,
} from '@island.is/service-portal/core'
import { useGetDentistsQuery } from './Dentists.generated'
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
import { DentistBill } from '@island.is/api/schema'

const Dentists = () => {
  useNamespaces('sp.health')
  const { formatMessage } = useLocale()

  const { loading, error, data } = useGetDentistsQuery()

  const dentistData = data?.getRightsPortalDentists

  if (!error && !loading) {
    return (
      <ErrorScreen
        figure="./assets/images/hourglass.svg"
        tagVariant="red"
        tag={formatMessage(m.errorTitle)}
        title={formatMessage(m.somethingWrong)}
        children={formatMessage(m.errorFetchModule, {
          module: formatMessage(m.dentists).toLowerCase(),
        })}
      />
    )
  }

  const generateRow = (rowItem: DentistBill) => {
    const row = (
      <T.Row key={rowItem.number}>
        <T.Data>
          <Text variant="medium">{rowItem.number}</Text>
        </T.Data>
        <T.Data>
          <Text variant="medium">{rowItem.date}</Text>
        </T.Data>
        <T.Data>
          <Text variant="medium">{rowItem.refundDate}</Text>
        </T.Data>
        <T.Data>
          <Text variant="medium">{`${rowItem.amount} kr.`}</Text>
        </T.Data>
        <T.Data>
          <Text variant="medium">{rowItem.coveredAmount}</Text>
        </T.Data>
      </T.Row>
    )

    return row
  }

  return (
    <Box marginBottom={[6, 6, 10]}>
      <IntroHeader
        title={formatMessage(messages.dentistsTitle)}
        intro={formatMessage(messages.dentistsDescription)}
      />
      {loading && <SkeletonLoader space={1} height={30} repeat={4} />}

      {!loading && !data && (
        <Box width="full" marginTop={4} display="flex" justifyContent="center">
          <Box marginTop={8}>
            <EmptyState />
          </Box>
        </Box>
      )}

      {!loading && !error && dentistData && (
        <Box width="full" marginTop={[1, 1, 4]}>
          <Stack space={2}>
            <UserInfoLine
              title={formatMessage(messages.yourInformation)}
              label={formatMessage(messages.dentist)}
              content={dentistData.currentDentistName ?? ''}
            />
            <Divider />
            <Text variant="h3">{messages.yourDentistBills}</Text>
            <Inline>
              <DatePicker
                label={formatMessage(m.dateFrom)}
                placeholderText={undefined}
              ></DatePicker>
              <DatePicker
                label={formatMessage(m.dateFrom)}
                placeholderText={undefined}
              ></DatePicker>
            </Inline>
          </Stack>
          <Box marginTop={2}>
            <T.Table>
              <T.Head>
                <T.Row>
                  <T.HeadData>
                    <Text variant="medium" fontWeight="semiBold">
                      {formatMessage(m.number)}
                    </Text>
                  </T.HeadData>
                  <T.HeadData>
                    <Text variant="medium" fontWeight="semiBold">
                      {formatMessage(m.date)}
                    </Text>
                  </T.HeadData>
                  <T.HeadData>
                    <Text variant="medium" fontWeight="semiBold">
                      {formatMessage(m.refundDate)}
                    </Text>
                  </T.HeadData>
                  <T.HeadData>
                    <Text variant="medium" fontWeight="semiBold">
                      {formatMessage(messages.dentistCharge)}
                    </Text>
                  </T.HeadData>
                  <T.HeadData>
                    <Text variant="medium" fontWeight="semiBold">
                      {formatMessage(messages.amountRefundedByInsurance)}
                    </Text>
                  </T.HeadData>
                  <T.HeadData />
                </T.Row>
              </T.Head>
              <T.Body>
                {dentistData.billHistory?.map((rowItem) =>
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

export default Dentists
