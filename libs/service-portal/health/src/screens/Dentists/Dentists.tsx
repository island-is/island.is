import { useLocale, useNamespaces } from '@island.is/localization'
import {
  m,
  ErrorScreen,
  EmptyState,
  UserInfoLine,
  formatDate,
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
import { RightsPortalDentistBill } from '@island.is/service-portal/graphql'
import add from 'date-fns/add'
import { useState } from 'react'

const Dentists = () => {
  useNamespaces('sp.health')
  const { formatMessage } = useLocale()

  const [selectedDateFrom, setSelectedDateFrom] = useState(
    add(new Date(), { years: -1 }),
  )
  const [selectedDateTo, setSelectedDateTo] = useState(new Date())

  const { loading, error, data } = useGetDentistsQuery({
    variables: {
      input: {
        dateFrom: selectedDateFrom,
        dateTo: selectedDateTo,
      },
    },
  })

  const dentistData = data?.rightsPortalDentists

  if (error && !loading) {
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

  const generateRow = (rowItem: RightsPortalDentistBill) => {
    const row = (
      <T.Row key={rowItem.number}>
        <T.Data>
          <Text variant="medium">{rowItem.number}</Text>
        </T.Data>
        <T.Data>
          <Text variant="medium">
            {rowItem.date ? formatDate(rowItem.date) : ''}
          </Text>
        </T.Data>
        <T.Data>
          <Text variant="medium">
            {rowItem.refundDate ? formatDate(rowItem.refundDate) : ''}
          </Text>
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
            <Text variant="h3">{formatMessage(messages.yourDentistBills)}</Text>
            <Inline space={2}>
              <DatePicker
                size="sm"
                label={formatMessage(m.dateFrom)}
                placeholderText={undefined}
                selected={selectedDateFrom}
                handleChange={(e) => setSelectedDateFrom(e)}
                maxDate={add(selectedDateTo, { days: -1 })}
              />
              <DatePicker
                size="sm"
                label={formatMessage(m.dateTo)}
                placeholderText={undefined}
                selected={selectedDateTo}
                handleChange={(e) => setSelectedDateTo(e)}
                minDate={add(selectedDateFrom, { days: 1 })}
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
                  generateRow(rowItem as RightsPortalDentistBill),
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
