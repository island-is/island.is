import { useEffect } from 'react'
import { toast } from '@island.is/island-ui/core'
import { useQuery } from '@apollo/client'
import { GetStatisticsCategoriesByNationalId } from '@island.is/api/schema'
import { GET_STATISTIC_PROVIDER_CATEGORIES_BY_NATIONALID } from '../queries'
import { useLocale } from '@island.is/localization'
import { m } from '../lib/messages'
import {
  GetProviderStatisticCategoriesReturnType,
  ProviderStatisticCategory,
} from '../lib/types'
import format from 'date-fns/format'

export const useGetProviderStatisticCategoriesByNationalId = (
  fromDate?: Date,
  toDate?: Date,
): GetProviderStatisticCategoriesReturnType => {
  const statisticsInput: GetStatisticsCategoriesByNationalId = {
    from: fromDate ? format(fromDate, 'yyyy-MM-dd') : undefined,
    to: toDate ? format(toDate, 'yyyy-MM-dd') : undefined,
  }

  const { data, loading, error } = useQuery(
    GET_STATISTIC_PROVIDER_CATEGORIES_BY_NATIONALID,
    {
      variables: {
        input: statisticsInput,
      },
      fetchPolicy: 'cache-and-network',
    },
  )

  const { formatMessage } = useLocale()
  useEffect(() => {
    if (!loading && error) {
      toast.error(formatMessage(m.statisticsBoxNetworkError))
    }
  }, [error, loading, fromDate, toDate, formatMessage])

  const rawCategories = (data?.statisticsCategories ?? []) as Array<{
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

  const categories: ProviderStatisticCategory[] = rawCategories.map((item, idx) => ({
    name: item.name,
    published: item.published,
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
