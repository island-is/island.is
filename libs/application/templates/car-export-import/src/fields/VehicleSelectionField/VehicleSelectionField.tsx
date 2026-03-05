import { FieldBaseProps } from '@island.is/application/types'
import { getValueViaPath } from '@island.is/application/core'
import { useLocale } from '@island.is/localization'
import {
  Box,
  Checkbox,
  Input,
  LoadingDots,
  Pagination,
  Stack,
  Table as T,
  Text,
} from '@island.is/island-ui/core'
import { FC, useCallback, useEffect, useMemo, useState } from 'react'
import { useFormContext } from 'react-hook-form'
import { useDebounce } from 'react-use'
import { useVehicles } from '../../hooks/useVehicles'
import { VehicleWithMileage } from '../../lib/types'

const PAGE_SIZE = 10
const SEARCH_DEBOUNCE_MS = 250

interface VehicleSelectionFieldProps {
  answerKey: string
  detailsKey: string
  messages: {
    searchLabel: { id: string; defaultMessage: string }
    searchPlaceholder: { id: string; defaultMessage: string }
    emptyState: { id: string; defaultMessage: string }
    tableHeaderPermno: { id: string; defaultMessage: string }
    tableHeaderType: { id: string; defaultMessage: string }
    tableHeaderMileage: { id: string; defaultMessage: string }
    selectedCount: { id: string; defaultMessage: string }
  }
}

export const VehicleSelectionField: FC<
  FieldBaseProps & { field: { props: VehicleSelectionFieldProps } }
> = ({ application, field }) => {
  const { answerKey, detailsKey, messages } = field.props
  const { register, setValue, unregister } = useFormContext()
  const { formatMessage } = useLocale()
  const { getVehicles, data, loading } = useVehicles()

  const [inputValue, setInputValue] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [page, setPage] = useState(1)
  const [selectedPermnos, setSelectedPermnos] = useState<Set<string>>(new Set())
  const [selectedDetails, setSelectedDetails] = useState<
    Map<string, VehicleWithMileage>
  >(new Map())

  const existingPermnos = useMemo(
    () => getValueViaPath<string[]>(application.answers, answerKey) ?? [],
    [application.answers, answerKey],
  )

  const existingDetails = useMemo(
    () =>
      getValueViaPath<VehicleWithMileage[]>(application.answers, detailsKey) ??
      [],
    [application.answers, detailsKey],
  )

  useEffect(() => {
    if (existingPermnos.length > 0) {
      setSelectedPermnos(new Set(existingPermnos))
      const detailsMap = new Map<string, VehicleWithMileage>()
      for (const detail of existingDetails) {
        if (detail.permno) {
          detailsMap.set(detail.permno, detail)
        }
      }
      setSelectedDetails(detailsMap)
    }
  }, [])

  useEffect(() => {
    register(answerKey)
    register(detailsKey)
    return () => {
      unregister(answerKey)
      unregister(detailsKey)
    }
  }, [answerKey, detailsKey, register, unregister])

  useDebounce(
    () => {
      setDebouncedSearch(inputValue)
      setPage(1)
    },
    SEARCH_DEBOUNCE_MS,
    [inputValue],
  )

  useEffect(() => {
    getVehicles(page, PAGE_SIZE, debouncedSearch)
  }, [page, debouncedSearch])

  useEffect(() => {
    getVehicles(1, PAGE_SIZE)
  }, [])

  const vehicleList = data?.vehiclesListV2?.vehicleList ?? []
  const paging = data?.vehiclesListV2?.paging
  const totalPages = paging?.totalPages ?? 1

  const handleToggle = useCallback(
    (vehicle: { permno?: string; make?: string; latestMileage?: number }) => {
      if (!vehicle.permno) return

      const permno = vehicle.permno

      setSelectedPermnos((prev) => {
        const next = new Set(prev)
        if (next.has(permno)) {
          next.delete(permno)
        } else {
          next.add(permno)
        }
        const permnos = Array.from(next)
        setValue(answerKey, permnos, {
          shouldDirty: true,
          shouldTouch: true,
        })
        return next
      })

      setSelectedDetails((prev) => {
        const next = new Map(prev)
        if (next.has(permno)) {
          next.delete(permno)
        } else {
          next.set(permno, {
            permno: vehicle.permno ?? null,
            milage:
              typeof vehicle.latestMileage === 'number'
                ? vehicle.latestMileage
                : null,
            type: vehicle.make ?? null,
          })
        }
        const details = Array.from(next.values())
        setValue(detailsKey, details, {
          shouldDirty: true,
          shouldTouch: true,
        })
        return next
      })
    },
    [answerKey, detailsKey, setValue],
  )

  const formatMileage = (mileage?: number) => {
    if (typeof mileage !== 'number') return '—'
    return `${mileage.toLocaleString('is-IS')} km`
  }

  return (
    <Stack space={3}>
      <Input
        name={`${answerKey}Search`}
        label={formatMessage(messages.searchLabel)}
        placeholder={formatMessage(messages.searchPlaceholder)}
        icon={{ name: 'search' }}
        backgroundColor="blue"
        size="sm"
        value={inputValue}
        onChange={(event) => setInputValue(event.target.value)}
      />

      {selectedPermnos.size > 0 && (
        <Text variant="small" fontWeight="semiBold">
          {formatMessage(messages.selectedCount)}: {selectedPermnos.size}
        </Text>
      )}

      {loading ? (
        <Box display="flex" justifyContent="center" padding={4}>
          <LoadingDots />
        </Box>
      ) : (
        <T.Table>
          <T.Head>
            <T.Row>
              <T.HeadData />
              <T.HeadData>
                {formatMessage(messages.tableHeaderPermno)}
              </T.HeadData>
              <T.HeadData>
                {formatMessage(messages.tableHeaderType)}
              </T.HeadData>
              <T.HeadData>
                {formatMessage(messages.tableHeaderMileage)}
              </T.HeadData>
            </T.Row>
          </T.Head>
          <T.Body>
            {vehicleList.length > 0 ? (
              vehicleList.map((vehicle) => {
                if (!vehicle.permno) return null
                const isSelected = selectedPermnos.has(vehicle.permno)
                return (
                  <T.Row key={vehicle.permno}>
                    <T.Data>
                      <Checkbox
                        id={`${answerKey}-${vehicle.permno}`}
                        name={`${answerKey}-${vehicle.permno}`}
                        checked={isSelected}
                        onChange={() => handleToggle(vehicle)}
                        aria-label={`${formatMessage(messages.tableHeaderPermno)} ${vehicle.permno}`}
                      />
                    </T.Data>
                    <T.Data>{vehicle.permno}</T.Data>
                    <T.Data>{vehicle.make ?? ''}</T.Data>
                    <T.Data>{formatMileage(vehicle.latestMileage)}</T.Data>
                  </T.Row>
                )
              })
            ) : (
              <T.Row>
                <T.Data colSpan={4}>
                  <Text>{formatMessage(messages.emptyState)}</Text>
                </T.Data>
              </T.Row>
            )}
          </T.Body>
        </T.Table>
      )}

      {totalPages > 1 && (
        <Pagination
          page={page}
          totalPages={totalPages}
          renderLink={(nextPage, className, children) => (
            <Box
              component="button"
              type="button"
              cursor="pointer"
              className={className}
              onClick={() => setPage(nextPage)}
            >
              {children}
            </Box>
          )}
        />
      )}
    </Stack>
  )
}
