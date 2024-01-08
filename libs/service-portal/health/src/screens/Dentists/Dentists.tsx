import { useEffect, useMemo, useState } from 'react'
import { useLocale, useNamespaces } from '@island.is/localization'
import {
  m,
  UserInfoLine,
  IntroHeader,
  SJUKRATRYGGINGAR_SLUG,
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
import { Problem } from '@island.is/react-spa/shared'

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
  const [dentistName, setDentistName] = useState<string>()
  const [dentistId, setDentistId] = useState<number>()

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

  useEffect(() => {
    if (dentist?.name) {
      setDentistName(dentist.name)
    }
    if (dentist?.id) {
      setDentistId(dentist.id)
    }
  }, [dentist?.name, dentist?.id])

  if (error) {
    return <Problem type="internal_service_error" error={error} />
  }

  return (
    <Box marginBottom={[6, 6, 10]}>
      <IntroHeader
        title={formatMessage(messages.dentistsTitle)}
        intro={formatMessage(messages.dentistsDescription)}
        serviceProviderSlug={SJUKRATRYGGINGAR_SLUG}
        serviceProviderTooltip={formatMessage(messages.healthTooltip)}
      />

      {!loading && !dentist && <Problem type="no_data" />}

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

      {dentistName && dentistId && (
        <Stack space={2}>
          <UserInfoLine
            title={formatMessage(messages.yourInformation)}
            label={formatMessage(messages.dentist)}
            content={dentistName}
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
            content={`${dentistId}`}
          />
          <Divider />
          <UserInfoLine
            label={formatMessage(messages.yourDentistBills)}
            labelColumnSpan={['12/12']}
          />
          <Inline space={2}>
            <DatePicker
              size="xs"
              backgroundColor="blue"
              label={formatMessage(m.dateFrom)}
              placeholderText={undefined}
              selected={selectedDateFrom}
              handleChange={(e) => setSelectedDateFrom(e)}
              maxDate={sub(selectedDateTo ? selectedDateTo : new Date(), {
                days: 1,
              })}
            />
            <DatePicker
              size="xs"
              backgroundColor="blue"
              label={formatMessage(m.dateTo)}
              placeholderText={undefined}
              selected={selectedDateTo}
              handleChange={(e) => setSelectedDateTo(e)}
              minDate={add(selectedDateFrom ? selectedDateFrom : new Date(), {
                days: 1,
              })}
            />
          </Inline>
          <BillsTable bills={history ?? []} />
        </Stack>
      )}

      {loading && <SkeletonLoader space={1} height={30} repeat={4} />}
    </Box>
  )
}

export default Dentists
