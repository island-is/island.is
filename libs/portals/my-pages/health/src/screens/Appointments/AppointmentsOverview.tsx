import { HealthDirectorateAppointmentStatus } from '@island.is/api/schema'
import { Box, DatePicker, Filter, Input } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import {
  CardLoader,
  HEALTH_DIRECTORATE_SLUG,
  IntroWrapper,
  m,
} from '@island.is/portals/my-pages/core'
import { Problem } from '@island.is/react-spa/shared'
import { useState } from 'react'
import { messages } from '../../lib/messages'
import { DEFAULT_APPOINTMENTS_STATUS } from '../../utils/constants'
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
      status:
        filter.statuses.length > 0
          ? filter.statuses
          : DEFAULT_APPOINTMENTS_STATUS,
    },
  })

  const appointments = data?.healthDirectorateAppointments
  const hasAppointments = (appointments?.data?.length ?? 0) > 0

  const filteredData = (() => {
    if (!appointments?.data || !searchTerm) return appointments?.data ?? []

    const search = searchTerm.trim().toLowerCase()

    return appointments.data.filter((a) =>
      [
        a.title,
        a.date,
        a.location?.address,
        a.location?.name,
        ...(a.practitioners ?? []),
      ]
        .filter(Boolean)
        .some((value) => value?.toLowerCase().includes(search)),
    )
  })()

  return (
    <IntroWrapper
      title={messages.appointments}
      intro={messages.appointmentsIntro}
      serviceProviderSlug={HEALTH_DIRECTORATE_SLUG}
      serviceProviderTooltip={formatMessage(
        messages.landlaeknirMedicineDelegationTooltip,
      )}
    >
      <Box
        display="flex"
        flexDirection="row"
        justifyContent="spaceBetween"
        alignItems="center"
        flexWrap={['wrap', 'wrap', 'nowrap']}
        rowGap={2}
      >
        {!loading && !error && (hasAppointments || filter.statuses.length > 0) && (
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
              {/* Hide until we decide to display more then booked (upcoming) appointments */}
              {/* <Box
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
                  {DEFAULT_APPOINTMENTS_STATUS.sort((a, b) =>
                    mapLabel(a).localeCompare(mapLabel(b)),
                  ).map((status) => (
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
                </Box> */}
              <Box
                display="flex"
                flexDirection="column"
                justifyContent="spaceBetween"
                paddingX={3}
                marginY={3}
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
      {!loading && error && (
        <Problem type="internal_service_error" noBorder={false} />
      )}
      {!loading && !error && !hasAppointments && (
        <Problem
          type="no_data"
          noBorder={false}
          title={formatMessage(messages.noAppointmentsTitle)}
          message={formatMessage(messages.noAppointmentsText)}
          imgSrc="./assets/images/nodata.svg"
        />
      )}
      {!error && loading && <CardLoader />}
      {!error && !loading && hasAppointments && (
        <Appointments
          data={{
            data: { data: filteredData },
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
