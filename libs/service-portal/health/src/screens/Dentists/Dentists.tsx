import { useState } from 'react'
import { useLocale, useNamespaces } from '@island.is/localization'
import {
  m,
  ErrorScreen,
  EmptyState,
  UserInfoLine,
  IntroHeader,
  SJUKRATRYGGINGAR_ID,
} from '@island.is/service-portal/core'
import { useLocation } from 'react-router-dom'
import { useGetDentistsQuery } from './Dentists.generated'
import {
  AlertMessage,
  Box,
  DatePicker,
  Divider,
  Inline,
  SkeletonLoader,
  Stack,
} from '@island.is/island-ui/core'
import { messages } from '../../lib/messages'
import BillsTable from './BillsTable'
import add from 'date-fns/add'
import sub from 'date-fns/sub'
import { HealthPaths } from '../../lib/paths'

const Dentists = () => {
  useNamespaces('sp.health')
  const { formatMessage } = useLocale()
  const location = useLocation()
  // Check if the user was transfered from another health center
  const wasSuccessfulTransfer = location?.state?.transferSuccess

  const [selectedDateFrom, setSelectedDateFrom] = useState<Date>(
    sub(new Date(), { years: 5 }),
  )
  const [selectedDateTo, setSelectedDateTo] = useState<Date>(new Date())

  const { loading, error, data } = useGetDentistsQuery({
    variables: {
      input: {
        dateFrom: selectedDateFrom,
        dateTo: selectedDateTo,
      },
    },
    fetchPolicy: 'no-cache',
  })

  const { dentist, history } = data?.rightsPortalUserDentistRegistration ?? {}

  const canRegister = dentist?.status?.canRegister ?? false

  if (error) {
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

  return (
    <Box marginBottom={[6, 6, 10]}>
      <IntroHeader
        title={formatMessage(messages.dentistsTitle)}
        intro={formatMessage(messages.dentistsDescription)}
        serviceProviderID={SJUKRATRYGGINGAR_ID}
        serviceProviderTooltip={formatMessage(m.healthTooltip)}
      />

      {!loading && !dentist && (
        <Box width="full" marginTop={4} display="flex" justifyContent="center">
          <Box marginTop={8}>
            <EmptyState />
          </Box>
        </Box>
      )}

      {wasSuccessfulTransfer && !loading && (
        <Box width="full" marginTop={4} marginBottom={4}>
          <AlertMessage
            type="success"
            title={formatMessage(messages.dentistTransferSuccessTitle)}
            message={`${formatMessage(messages.dentistTransferSuccessInfo, {
              name: dentist?.name,
            })}`}
          />
        </Box>
      )}

      {dentist?.name && dentist?.id && (
        <Stack space={2}>
          <UserInfoLine
            title={formatMessage(messages.yourInformation)}
            label={formatMessage(messages.dentist)}
            content={dentist.name}
            editLink={
              canRegister
                ? {
                    url: HealthPaths.HealthDentistRegistration,
                    title: messages.changeRegistration,
                  }
                : undefined
            }
          />
          <Divider />
          <UserInfoLine
            label={formatMessage(messages.dentistNumber)}
            content={`${dentist.id}`}
          />
          <Divider />
          <UserInfoLine
            label={formatMessage(messages.yourDentistBills)}
            labelColumnSpan={['12/12']}
          />
          <Inline space={4}>
            <DatePicker
              size="sm"
              label={formatMessage(m.dateFrom)}
              placeholderText={undefined}
              selected={selectedDateFrom}
              handleChange={(e) => setSelectedDateFrom(e)}
              maxDate={sub(selectedDateTo ? selectedDateTo : new Date(), {
                days: 1,
              })}
            />
            <DatePicker
              size="sm"
              label={formatMessage(m.dateTo)}
              placeholderText={undefined}
              selected={selectedDateTo}
              handleChange={(e) => setSelectedDateTo(e)}
              minDate={add(selectedDateFrom ? selectedDateFrom : new Date(), {
                days: 1,
              })}
            />
          </Inline>
        </Stack>
      )}

      {loading && <SkeletonLoader space={1} height={30} repeat={4} />}

      {!!history?.length && <BillsTable bills={history} />}
    </Box>
  )
}

export default Dentists
