import { HealthDirectorateAppointmentStatus } from '@island.is/api/schema'
import {
  Box,
  Checkbox,
  DatePicker,
  Filter,
  Input,
  Text,
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import {
  HEALTH_DIRECTORATE_SLUG,
  IntroWrapper,
  m,
} from '@island.is/portals/my-pages/core'
import { Problem } from '@island.is/react-spa/shared'
import { useMemo, useState } from 'react'
import { messages } from '../../lib/messages'
import Appointments from '../HealthOverview/components/Appointments'
import { useGetAppointmentsQuery } from './Appointments.generated'

interface Filter {
  statuses: HealthDirectorateAppointmentStatus[]
  dates?: {
    from?: Date
  }
}

const AppointmentsOverview = () => {
  const { formatMessage } = useLocale()
  const [filter, setFilter] = useState<Filter>({
    statuses: [],
    dates: {},
  })
  const [searchTerm, setSearchTerm] = useState<string>('')

  const { data, loading, error } = useGetAppointmentsQuery({
    variables: {
      from: filter.dates?.from,
      status: filter.statuses.length > 0 ? filter.statuses : undefined,
    },
  })

  const appointments = data?.healthDirectorateAppointments

  const filteredAppointments = useMemo(() => {
    if (!appointments?.data) return appointments

    let filtered = [...appointments.data]

    if (searchTerm) {
      const searchLower = searchTerm.trim().toLowerCase()
      filtered = filtered.filter(
        (appointment) =>
          appointment?.title?.toLowerCase().includes(searchLower) ||
          appointment?.date?.toLowerCase().includes(searchLower) ||
          appointment?.weekday?.toLowerCase().includes(searchLower) ||
          appointment?.location?.address?.toLowerCase().includes(searchLower) ||
          appointment?.location?.name?.toLowerCase().includes(searchLower) ||
          appointment?.practitioners.some((p) =>
            p.toLowerCase().includes(searchLower),
          ),
      )
    }
    return {
      ...appointments,
      data: filtered,
    }
  }, [appointments, searchTerm])

  const mapLabel = (status: HealthDirectorateAppointmentStatus): string => {
    switch (status) {
      case HealthDirectorateAppointmentStatus.PENDING:
        return formatMessage(messages.appointmentStatusPending)
      case HealthDirectorateAppointmentStatus.BOOKED:
        return formatMessage(messages.appointmentStatusBooked)
      case HealthDirectorateAppointmentStatus.CANCELLED:
        return formatMessage(messages.appointmentStatusCancelled)
      case HealthDirectorateAppointmentStatus.FULFILLED:
        return formatMessage(messages.appointmentStatusFulfilled)
      default:
        return status
    }
  }

  return (
    <IntroWrapper
      title={messages.appointments}
      intro={messages.appointmentsIntro}
      serviceProviderSlug={HEALTH_DIRECTORATE_SLUG}
      serviceProviderTooltip={formatMessage(
        messages.landlaeknirMedicineDelegationTooltip,
      )}
      loading={loading}
    >
      {!loading && error && (
        <Problem type="internal_service_error" noBorder={false} />
      )}

      <Box
        display="flex"
        flexDirection="row"
        justifyContent="spaceBetween"
        alignItems="center"
        flexWrap={['wrap', 'wrap', 'nowrap']}
        rowGap={2}
      >
        {!loading && !error && (appointments?.data?.length ?? 0) > 0 && (
          <Box marginBottom={[1, 1, 3]}>
            <Filter
              labelClearAll={formatMessage(m.clearAllFilters)}
              labelClear={formatMessage(m.clearFilter)}
              labelOpen={formatMessage(m.openFilter)}
              reverse
              variant="popover"
              align="left"
              filterInput={
                <Input
                  name="nameSearch"
                  placeholder={formatMessage(
                    messages.appointmentSearchPlaceholder,
                  )}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  icon={{ type: 'outline', name: 'search' }}
                  size="xs"
                  backgroundColor="blue"
                />
              }
              onFilterClear={() =>
                setFilter({ statuses: [], dates: undefined })
              }
            >
              <Box
                display="flex"
                flexDirection="column"
                justifyContent="spaceBetween"
                paddingX={3}
                marginTop={3}
                marginBottom={1}
              >
                <Text variant={'h5'} as="span" color={'blue400'}>
                  {formatMessage(messages.status)}
                </Text>
                {[
                  HealthDirectorateAppointmentStatus.BOOKED,
                  HealthDirectorateAppointmentStatus.CANCELLED,
                  HealthDirectorateAppointmentStatus.FULFILLED,
                ]
                  .sort((a, b) => mapLabel(a).localeCompare(mapLabel(b)))
                  .map((status) => (
                    <Box key={status} paddingTop={2}>
                      <Checkbox
                        name={status}
                        label={mapLabel(status)}
                        checked={filter.statuses.includes(status)}
                        onChange={(event) => {
                          const isChecked = event.target.checked
                          setFilter((prev) => {
                            let updatedStatuses = [...prev.statuses]
                            if (isChecked) {
                              updatedStatuses.push(status)
                            } else {
                              updatedStatuses = updatedStatuses.filter(
                                (s) => s !== status,
                              )
                            }
                            return { ...prev, statuses: updatedStatuses }
                          })
                        }}
                      />
                    </Box>
                  ))}
              </Box>
              <Box
                display="flex"
                flexDirection="column"
                justifyContent="spaceBetween"
                paddingX={3}
                marginBottom={3}
              >
                <Box display="flex" flexDirection="column">
                  <Box>
                    <DatePicker
                      label={formatMessage(m.datepickerFromLabel)}
                      placeholderText={formatMessage(m.datepickLabel)}
                      locale="is"
                      backgroundColor="blue"
                      size="xs"
                      selected={filter.dates?.from}
                      handleChange={(from) => {
                        setFilter((prev) => ({
                          ...prev,
                          dates: { from: from as Date },
                        }))
                      }}
                      appearInline
                    />
                  </Box>
                </Box>
              </Box>
            </Filter>
          </Box>
        )}
      </Box>
      {!error && (
        <Appointments
          data={{
            data: filteredAppointments,
            loading,
            error: error ? true : false,
          }}
          showLinkButton={false}
        />
      )}
    </IntroWrapper>
  )
}

export default AppointmentsOverview
