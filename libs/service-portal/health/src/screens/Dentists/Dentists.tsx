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
  Text,
} from '@island.is/island-ui/core'
import { IntroHeader } from '@island.is/portals/core'
import { messages } from '../../lib/messages'
import { useState } from 'react'
import BillsTable from './BillsTable'
import add from 'date-fns/add'
import sub from 'date-fns/sub'
import { HealthPaths } from '../../lib/paths'

const Dentists = () => {
  useNamespaces('sp.health')
  const { formatMessage } = useLocale()

  const [selectedDateFrom, setSelectedDateFrom] = useState(
    sub(new Date(), { years: 5 }),
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

  const { dentist, history } = data?.rightsPortalUserDentistRegistration ?? {}
  const canRegister = dentist?.status?.canRegister ?? false

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

  return (
    <Box marginBottom={[6, 6, 10]}>
      <IntroHeader
        title={formatMessage(messages.dentistsTitle)}
        intro={formatMessage(messages.dentistsDescription)}
      />

      {!loading && !dentist && (
        <Box width="full" marginTop={4} display="flex" justifyContent="center">
          <Box marginTop={8}>
            <EmptyState />
          </Box>
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
                    icon: 'open',
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
              maxDate={sub(selectedDateTo, { days: 1 })}
            />
            <DatePicker
              size="sm"
              label={formatMessage(m.dateTo)}
              placeholderText={undefined}
              selected={selectedDateTo}
              handleChange={(e) => setSelectedDateTo(e)}
              minDate={add(selectedDateFrom, { days: 1 })}
            />
          </Inline>
        </Stack>
      )}

      {loading && <SkeletonLoader space={1} height={30} repeat={4} />}

      {!loading && !error && history && <BillsTable bills={history} />}
    </Box>
  )
}

export default Dentists
