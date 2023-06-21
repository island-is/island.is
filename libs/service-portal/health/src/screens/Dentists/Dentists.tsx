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
import add from 'date-fns/add'
import { useState } from 'react'
import BillsTable from './BillsTable'
import addYears from 'date-fns/addYears'

const Dentists = () => {
  useNamespaces('sp.health')
  const { formatMessage } = useLocale()

  const [selectedDateFrom, setSelectedDateFrom] = useState(
    addYears(new Date(), -5),
  )
  const [selectedDateTo, setSelectedDateTo] = useState(new Date())
  const [dentistName, setDentistName] = useState('')

  const { loading, error, data } = useGetDentistsQuery({
    variables: {
      input: {
        dateFrom: selectedDateFrom,
        dateTo: selectedDateTo,
      },
    },
  })

  const dentistData = data?.rightsPortalDentists

  if (!dentistName && dentistData?.currentDentistName) {
    setDentistName(dentistData.currentDentistName)
  }

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

      {!loading && !data?.rightsPortalDentists && (
        <Box width="full" marginTop={4} display="flex" justifyContent="center">
          <Box marginTop={8}>
            <EmptyState />
          </Box>
        </Box>
      )}

      {dentistName && (
        <Stack space={5}>
          <Box>
            <UserInfoLine
              title={formatMessage(messages.yourInformation)}
              label={formatMessage(messages.dentist)}
              content={dentistName}
              titlePadding={[2, 2, 4]}
              paddingY={2}
            />
            <Divider />
          </Box>
          <Text variant="h5">{formatMessage(messages.yourDentistBills)}</Text>
          <Inline space={4}>
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
      )}

      {loading && <SkeletonLoader space={1} height={30} repeat={4} />}

      {!loading && !error && dentistData?.billHistory && (
        <BillsTable bills={dentistData.billHistory} />
      )}
    </Box>
  )
}

export default Dentists
