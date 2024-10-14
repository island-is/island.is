import { useMemo, useState } from 'react'
import { HousingBenefitsPaymentsInput } from '@island.is/api/schema'
import { useGetHousingBenefitsListLazyQuery } from './HousingBenefits.generated'

export const DEFAULT_ITEMS_ON_PAGE = 12
export const MAX_ITEMS_ON_PAGE = 75
export const DEFAULT_PAYMENT_ORIGIN = '1'

const DEFAULT_FILTER_VALUE: HousingBenefitsPaymentsInput = {
  dateFrom: undefined,
  dateTo: undefined,
  pageSize: DEFAULT_ITEMS_ON_PAGE,
  pageNumber: 1,
  month: undefined,
  paymentOrigin: Number(DEFAULT_PAYMENT_ORIGIN),
  payments: false,
}

export const useHousingBenefitsFilters = () => {
  const [filterValue, setFilterValue] =
    useState<HousingBenefitsPaymentsInput>(DEFAULT_FILTER_VALUE)
  const [fromDate, setFromDate] = useState<Date>()
  const [toDate, setToDate] = useState<Date>()
  const [page, setPage] = useState(1)

  const setSelectedMonth = (value: string | undefined) => {
    setPage(1)
    setFilterValue({
      ...filterValue,
      month: value,
      pageSize: /^\d+$/.test(value ?? '')
        ? MAX_ITEMS_ON_PAGE
        : DEFAULT_ITEMS_ON_PAGE,
    })
  }

  const setDates = (fDate: Date | undefined, tDate: Date | undefined) => {
    setPage(1)
    setFilterValue((oldState) => {
      const today = new Date()
      let dateTo: string | undefined
      if (!toDate && fromDate) {
        dateTo = today.toISOString()
      } else if (toDate && fromDate) {
        dateTo = toDate.toISOString()
      }

      setFromDate(fDate)
      setToDate(tDate)

      return {
        ...oldState,
        dateFrom: dateTo && fromDate ? fromDate.toISOString() : undefined,
        dateTo: dateTo,
      }
    })
  }

  const setShowFinalPayments = (value: boolean) => {
    setPage(1)
    setFilterValue({
      ...filterValue,
      payments: value,
    })
  }

  const setPaymentOrigin = (value: string) => {
    setPage(1)
    setFilterValue({
      ...filterValue,
      paymentOrigin: Number(value),
    })
  }

  const resetFilter = () => {
    setPage(1)
    setFromDate(undefined)
    setToDate(undefined)
    setFilterValue(DEFAULT_FILTER_VALUE)
  }

  const [loadHousingPayments, { data, loading, error }] =
    useGetHousingBenefitsListLazyQuery()

  useMemo(() => {
    loadHousingPayments({
      variables: {
        input: {
          ...filterValue,
          pageNumber: page,
        },
      },
    })
  }, [page, filterValue])

  return {
    page,
    data,
    loading,
    error,
    fromDate,
    toDate,
    filterValue,
    resetFilter,
    setPaymentOrigin,
    setShowFinalPayments,
    setDates,
    setSelectedMonth,
    setPage,
  }
}
