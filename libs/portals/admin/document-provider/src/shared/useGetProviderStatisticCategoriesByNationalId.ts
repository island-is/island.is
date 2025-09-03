import { useEffect } from 'react'
import { toast } from '@island.is/island-ui/core'
import { useQuery } from '@apollo/client'
import { ApiV1StatisticsNationalIdCategoriesGetRequest } from '@island.is/api/schema'
import { GET_STATISTIC_PROVIDER_CATEGORIES_BY_NATIONALID } from '../queries'
import { useLocale } from '@island.is/localization'
import { m } from '../lib/messages'
import {
  GetProviderStatisticCategoriesReturnType,
  ProviderStatisticCategory,
} from '../lib/types'
import { formatDateYYYYMMDD } from '../lib/utils'

export const useGetProviderStatisticCategoriesByNationalId = (
  nationalId?: string,
  fromDate?: Date,
  toDate?: Date,
): GetProviderStatisticCategoriesReturnType => {
  const statisticsInput: ApiV1StatisticsNationalIdCategoriesGetRequest = {
    nationalId: (nationalId ?? '') as string,
    from: fromDate ? formatDateYYYYMMDD(fromDate) : undefined,
    to: toDate ? formatDateYYYYMMDD(toDate) : undefined,
  }

  const { data, loading, error } = useQuery(
    GET_STATISTIC_PROVIDER_CATEGORIES_BY_NATIONALID,
    {
      variables: {
        input: statisticsInput,
      },
      fetchPolicy: 'cache-and-network',
      skip: !nationalId,
    },
  )

  const { formatMessage } = useLocale()
  useEffect(() => {
    if (!loading && error) {
      toast.error(formatMessage(m.statisticsBoxNetworkError))
    }
  }, [error, loading, nationalId, fromDate, toDate, formatMessage])

  const rawCategories = (data?.statisticsCategories ?? []) as Array<{
    categoryId: string
    name: string
    published: number
  }>

  const totalPublished = rawCategories.reduce(
    (sum, item) => sum + (item.published ?? 0),
    0,
  )

  const COLORS = [
    '#007bff', // red
    '#ff2d55', // blue
    '#6f42c1', // yellow
    '#d6b3ff', // teal
    '#9966FF', // purple
  ]

  const categories: Array<
    ProviderStatisticCategory & { value: number; color: string }
  > = rawCategories.map((item, idx) => ({
    name: item.name,
    published: item.published,
    categoryId: item.categoryId,
    color: COLORS[idx % COLORS.length],
    value:
      totalPublished > 0
        ? Math.round((item.published / totalPublished) * 100)
        : 0,
  }))

  return {
    categories,
    loading,
  }
}
