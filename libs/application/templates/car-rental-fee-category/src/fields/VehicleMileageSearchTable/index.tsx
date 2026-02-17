import { getValueViaPath } from '@island.is/application/core'
import { UPDATE_APPLICATION } from '@island.is/application/graphql'
import { FieldBaseProps } from '@island.is/application/types'
import { useMutation } from '@apollo/client'
import { EntryModel } from '@island.is/clients-rental-day-rate'
import {
  Box,
  Input,
  Pagination,
  Stack,
  Table as T,
  Text,
} from '@island.is/island-ui/core'
import {
  ChangeEvent,
  FC,
  PropsWithChildren,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { useLocale } from '@island.is/localization'
import { useFormContext } from 'react-hook-form'
import { m } from '../../lib/messages'
import { buildCurrentCarMap } from '../../utils/carCategoryUtils'
import { RateCategory } from '../../utils/constants'
import { CurrentVehicleWithMilage } from '../../utils/types'

const PAGE_SIZE = 10

type VehicleLatestMilageRow = {
  permno: string
  latestMilage: number
}

type FormValues = {
  vehicleLatestMilageRows?: VehicleLatestMilageRow[]
  carsToChangeCount?: number
}

const paginate = <TItem,>(
  items: TItem[],
  pageSize: number,
  page: number,
): TItem[] => {
  const startIndex = (page - 1) * pageSize
  return items.slice(startIndex, startIndex + pageSize)
}

export const VehicleMileageSearchTable: FC<
  PropsWithChildren<FieldBaseProps>
> = ({ application, setBeforeSubmitCallback }) => {
  const { register, setValue, unregister } = useFormContext<FormValues>()
  const { lang, formatMessage } = useLocale()
  const [updateApplication] = useMutation(UPDATE_APPLICATION)
  const [searchTerm, setSearchTerm] = useState('')
  const [page, setPage] = useState(1)
  const [mileageByPermno, setMileageByPermno] = useState<
    Record<string, string>
  >({})
  const hasInitializedFromAnswersRef = useRef(false)

  const vehicles = useMemo(
    () =>
      getValueViaPath<CurrentVehicleWithMilage[]>(
        application.externalData,
        'getCurrentVehicles.data',
      ) ?? [],
    [application.externalData],
  )
  const rates = useMemo(
    () =>
      getValueViaPath<EntryModel[]>(
        application.externalData,
        'getCurrentVehiclesRateCategory.data',
      ) ?? [],
    [application.externalData],
  )
  const rateToChangeTo = getValueViaPath<RateCategory>(
    application.answers,
    'categorySelectionRadio',
  )

  useEffect(() => {
    register('vehicleLatestMilageRows')
    register('carsToChangeCount')

    return () => {
      unregister('vehicleLatestMilageRows')
      unregister('carsToChangeCount')
    }
  }, [register, unregister])

  useEffect(() => {
    if (hasInitializedFromAnswersRef.current) {
      return
    }

    const existingRows =
      getValueViaPath<VehicleLatestMilageRow[]>(
        application.answers,
        'vehicleLatestMilageRows',
      ) ?? []

    if (!existingRows.length) {
      hasInitializedFromAnswersRef.current = true
      return
    }

    const initialMileageByPermno = existingRows.reduce<Record<string, string>>(
      (accumulator, row) => {
        if (!row.permno && row.latestMilage !== 0) {
          return accumulator
        }

        accumulator[row.permno] = row.latestMilage.toString()
        return accumulator
      },
      {},
    )

    setMileageByPermno(initialMileageByPermno)
    hasInitializedFromAnswersRef.current = true
  }, [application.answers])

  const vehiclesToShow = useMemo(() => {
    if (!rateToChangeTo) {
      return vehicles
    }

    const currentCarMap = buildCurrentCarMap(vehicles, rates)

    return vehicles.filter((vehicle) => {
      if (!vehicle.permno) {
        return false
      }

      const currentCar = currentCarMap[vehicle.permno]
      if (!currentCar) {
        return false
      }

      return currentCar.category !== rateToChangeTo
    })
  }, [rateToChangeTo, rates, vehicles])

  const filteredVehicles = useMemo(() => {
    if (!searchTerm.trim()) {
      return vehiclesToShow
    }

    const normalizedSearchTerm = searchTerm.trim().toLowerCase()

    return vehiclesToShow.filter((vehicle) =>
      (vehicle.permno ?? '').toLowerCase().includes(normalizedSearchTerm),
    )
  }, [searchTerm, vehiclesToShow])

  const totalPages = useMemo(() => {
    return Math.max(1, Math.ceil(filteredVehicles.length / PAGE_SIZE))
  }, [filteredVehicles.length])

  useEffect(() => {
    if (page <= totalPages) {
      return
    }

    setPage(totalPages)
  }, [page, totalPages])

  const pagedVehicles = useMemo(() => {
    return paginate(filteredVehicles, PAGE_SIZE, page)
  }, [filteredVehicles, page])

  const latestMilageRows = useMemo(() => {
    return Object.entries(mileageByPermno)
      .map(([permno, latestMilage]) => {
        const parsedLatestMilage = Number(latestMilage)

        if (
          !permno ||
          latestMilage === '' ||
          Number.isNaN(parsedLatestMilage)
        ) {
          return null
        }

        return {
          permno,
          latestMilage: parsedLatestMilage,
        }
      })
      .filter((row): row is VehicleLatestMilageRow => row !== null)
  }, [mileageByPermno])

  const latestMilageRowsRef = useRef<VehicleLatestMilageRow[]>(latestMilageRows)
  useEffect(() => {
    latestMilageRowsRef.current = latestMilageRows
  }, [latestMilageRows])

  useEffect(() => {
    if (!setBeforeSubmitCallback) {
      return
    }

    setBeforeSubmitCallback(
      async () => {
        const rowsToPersist = latestMilageRowsRef.current
        const carsToChangeCount = rowsToPersist.length

        setValue('vehicleLatestMilageRows', rowsToPersist, {
          shouldDirty: true,
          shouldTouch: true,
        })
        setValue('carsToChangeCount', carsToChangeCount, {
          shouldDirty: true,
          shouldTouch: true,
        })

        try {
          await updateApplication({
            variables: {
              input: {
                id: application.id,
                answers: {
                  vehicleLatestMilageRows: rowsToPersist,
                  carsToChangeCount,
                },
              },
              locale: lang,
            },
          })

          return [true, null]
        } catch {
          return [false, 'Ekki tókst að vista kílómetrastöðu. Reyndu aftur.']
        }
      },
      {
        allowMultiple: true,
        customCallbackId: 'vehicleLatestMilageRowsPersist',
      },
    )
  }, [
    application.id,
    lang,
    setBeforeSubmitCallback,
    setValue,
    updateApplication,
  ])

  const handleLatestMilageChange =
    (permno: string) =>
    (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { value } = event.target

      setMileageByPermno((previousMileageByPermno) => {
        if (value === '') {
          const nextMileageByPermno = { ...previousMileageByPermno }
          delete nextMileageByPermno[permno]
          return nextMileageByPermno
        }

        return {
          ...previousMileageByPermno,
          [permno]: value,
        }
      })
    }

  return (
    <Stack space={3}>
      <Input
        name="vehicleLatestMilageSearch"
        label={formatMessage(m.tableView.searchLabel)}
        placeholder={formatMessage(m.tableView.searchPlaceholder)}
        icon={{ name: 'search' }}
        backgroundColor="blue"
        size="sm"
        value={searchTerm}
        onChange={(event) => {
          setSearchTerm(event.target.value)
          setPage(1)
        }}
      />

      <T.Table>
        <T.Head>
          <T.Row>
            <T.HeadData>
              {formatMessage(m.tableView.tableHeaderPermno)}
            </T.HeadData>
            <T.HeadData>
              {formatMessage(m.tableView.tableHeaderMileage)}
            </T.HeadData>
          </T.Row>
        </T.Head>
        <T.Body>
          {pagedVehicles.length > 0 ? (
            pagedVehicles.map((vehicle, index) => {
              const permno = vehicle.permno ?? `unknown-${page}-${index}`
              const value = mileageByPermno[permno] ?? ''

              return (
                <T.Row key={permno}>
                  <T.Data>{vehicle.permno ?? '-'}</T.Data>
                  <T.Data>
                    <Input
                      name={`vehicleLatestMilage.${permno}`}
                      label=""
                      type="number"
                      min={0}
                      size="xs"
                      backgroundColor="white"
                      value={value}
                      onChange={handleLatestMilageChange(permno)}
                    />
                  </T.Data>
                </T.Row>
              )
            })
          ) : (
            <T.Row>
              <T.Data colSpan={2}>
                <Text>{formatMessage(m.tableView.emptyState)}</Text>
              </T.Data>
            </T.Row>
          )}
        </T.Body>
      </T.Table>

      {filteredVehicles.length > PAGE_SIZE && (
        <Pagination
          page={page}
          totalPages={totalPages}
          renderLink={(nextPage, className, children) => (
            <Box
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
