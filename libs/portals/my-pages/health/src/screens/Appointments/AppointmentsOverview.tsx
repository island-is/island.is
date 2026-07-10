import { HealthDirectorateAppointmentStatus } from '@island.is/api/schema'
import {
  Box,
  DatePicker,
  Filter,
  Pagination,
} from '@island.is/island-ui/core'
import { useLocale, useNamespaces } from '@island.is/localization'
import {
  CardLoader,
  HEALTH_DIRECTORATE_SLUG,
  IntroWrapper,
  m,
} from '@island.is/portals/my-pages/core'
import { Problem } from '@island.is/react-spa/shared'
import { useEffect, useState } from 'react'
import { messages } from '../../lib/messages'
import { DEFAULT_APPOINTMENTS_STATUS } from '../../utils/constants'
import Appointments from '../HealthOverview/components/Appointments'
import { useGetAppointmentsQuery } from './Appointments.generated'
import { useHealthPlausibleSwap } from '../../utils/useHealthPlausibleSwap'
import * as styles from './AppointmentsOverview.css'

const DEFAULT_PAGE_SIZE = 10

interface Filter {
  statuses: HealthDirectorateAppointmentStatus[]
  dates?: {
    from?: Date
  }
}

const AppointmentsOverview = () => {
  useNamespaces('sp.health')
  const { formatMessage } = useLocale()
  useHealthPlausibleSwap()

  const [page, setPage] = useState(1)
  const [filter, setFilter] = useState<Filter>({
    statuses: [],
    dates: {},
  })
  useEffect(() => {
    setPage(1)
  }, [filter])

  const { data, loading, error } = useGetAppointmentsQuery({
    variables: {
      from: filter.dates?.from,
      status:
        filter.statuses.length > 0
          ? filter.statuses
          : DEFAULT_APPOINTMENTS_STATUS,
      page,
      pageSize: DEFAULT_PAGE_SIZE,
    },
  })

  const appointments = data?.healthDirectorateAppointments
  const hasAppointments = (appointments?.data?.length ?? 0) > 0

  const totalCount = appointments?.totalCount ?? 0
  const totalPages =
    totalCount > DEFAULT_PAGE_SIZE
      ? Math.ceil(totalCount / DEFAULT_PAGE_SIZE)
      : 0

  return (
    <IntroWrapper
      title={messages.appointmentsOverviewTitle}
      intro={messages.appointmentsIntro}
      serviceProvider={{
        slug: HEALTH_DIRECTORATE_SLUG,
        tooltip: formatMessage(messages.landlaeknirMedicineDelegationTooltip),
      }}
    >
      <Box
        display="flex"
        flexDirection="row"
        justifyContent="spaceBetween"
        alignItems="center"
        flexWrap={['wrap', 'wrap', 'nowrap']}
        rowGap={2}
      >
        {!loading &&
          !error &&
          (hasAppointments ||
            filter.statuses.length > 0 ||
            filter.dates?.from) && (
            <Box marginBottom={[1, 1, 3]}>
              <Filter
                labelClearAll={formatMessage(m.clearAllFilters)}
                labelClear={formatMessage(m.clearFilter)}
                labelOpen={formatMessage(m.openFilter)}
                reverse
                variant="popover"
                align="left"
                onFilterClear={() => {
                  setFilter({ statuses: [], dates: undefined })
                }}
              >
                {/* Hide until we decide to display more than booked (upcoming) appointments */}
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
                    <Box className={styles.datePickerWrapper}>
                      <DatePicker
                        label={formatMessage(m.datepickerFromLabel)}
                        placeholderText={formatMessage(m.datepickLabel)}
                        locale="is"
                        size="xs"
                        backgroundColor="blue"
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
        <Problem type="internal_service_error" noBorder={false} error={error} />
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
            data: appointments,
            loading,
            error: error ? true : false,
          }}
          showLinkButton={false}
        />
      )}
      {totalPages > 0 ? (
        <Box paddingTop={8}>
          <Pagination
            page={page}
            totalPages={totalPages}
            renderLink={(page, className, children) => (
              <Box
                cursor="pointer"
                className={className}
                onClick={() => setPage(page)}
                component="button"
              >
                {children}
              </Box>
            )}
          />
        </Box>
      ) : null}
    </IntroWrapper>
  )
}

export default AppointmentsOverview
