import get from 'lodash/get'
import dropWhile from 'lodash/dropWhile'
import dropRightWhile from 'lodash/dropRightWhile'
import lastDayOfMonth from 'date-fns/lastDayOfMonth'

import {
  GetSingleStatisticQuery,
  GetStatisticsQuery,
  SourceValue,
  StatisticSourceData,
} from './types'
import {
  DEFAULT_NUMBER_OF_DATA_POINTS,
  MONTH_NAMES,
} from './statistics.constants'
import { EnhancedFetchAPI } from '@island.is/clients/middlewares'

export const _tryToGetDate = (value: string | null) => {
  if (!value) {
    return null
  }

  const splitChar = value.includes(' ') ? ' ' : value.includes('-') ? '-' : null

  if (splitChar === null) {
    return null
  }

  const split = value.split(splitChar)

  const yearIndex = !Number.isNaN(Number(split[0])) ? 0 : 1
  const monthNameIndex = yearIndex === 0 ? 1 : 0

  const year = Number(
    split[yearIndex].length === 2 ? `20${split[yearIndex]}` : split[yearIndex],
  )

  if (year < 2000 || year > 3000) {
    return null
  }

  const monthName = split[monthNameIndex].toLowerCase()

  for (let i = 0; i < 12; i += 1) {
    for (let j = 0; j < MONTH_NAMES.length; j += 1) {
      const monthTest = MONTH_NAMES[j][i]

      if (monthName.startsWith(monthTest)) {
        return lastDayOfMonth(new Date(year, i))
      }
    }
  }

  return null
}

const processDataFromSource = (data: string) => {
  const lines = data.split('\r\n')

  const headers = lines[0].split(',')
  const dataLines = lines.slice(1).map((line) => line.split(','))

  const result: StatisticSourceData['data'] = {}

  // Start at i = 3 to start at dates
  for (let i = 3; i < headers.length; i += 1) {
    const currentDate = headers[i]

    const asDate = _tryToGetDate(currentDate)

    if (!asDate) {
      continue
    }

    for (const lineColumns of dataLines) {
      const key = lineColumns[0]

      if (!key) {
        continue
      }

      if (!result[key]) {
        result[key] = []
      }

      const isPercentage = lineColumns[i].endsWith('%')
      const rawValue = lineColumns[i].replace('%', '')

      const isInvalidValue =
        (typeof rawValue === 'string' && rawValue.length === 0) ||
        rawValue === null

      const valueAsNumber =
        isInvalidValue || Number.isNaN(Number(rawValue))
          ? null
          : Number(rawValue)

      const value =
        valueAsNumber !== null
          ? isPercentage
            ? valueAsNumber / 100
            : valueAsNumber
          : null

      result[key].push({
        date: asDate,
        value,
      })
    }
  }

  return {
    data: result,
  }
}

const handleResponse = (response: Response) => {
  if (!response.ok) {
    throw new Error('Could not fetch statistic source data')
  }
  return response.text()
}

const processResponse = (result: StatisticSourceData, response: string) => {
  const processed = processDataFromSource(response)
  return {
    ...result,
    data: {
      ...result.data,
      ...processed.data,
    },
  }
}

let fetchStatisticsPromise: Promise<StatisticSourceData> | undefined

export const getStatisticsFromSource = (
  fetchClient: EnhancedFetchAPI,
  dataSources: string[],
): Promise<StatisticSourceData> => {
  if (fetchStatisticsPromise) {
    return fetchStatisticsPromise
  }

  // Let subsequent requests that arrive while the request
  // is in progress reuse the same promise
  fetchStatisticsPromise = new Promise((resolve, reject) => {
    Promise.all<Promise<string>[]>(
      dataSources.map((source) => fetchClient(source).then(handleResponse)),
    )
      .then((responses) =>
        resolve(
          responses.reduce(
            (result, response) => processResponse(result, response),
            {} as StatisticSourceData,
          ),
        ),
      )
      .catch((e) => reject(e))
      .finally(() => {
        // Reset the promise for when the next request
        // comes in after the cache expires
        fetchStatisticsPromise = undefined
      })
  })

  return fetchStatisticsPromise
}

const _valueIsNotDefined = (item: SourceValue) => {
  return typeof item.value !== 'number'
}

export const getStatistics = ({
  sourceDataKey,
  dateFrom,
  dateTo,
  sourceData,
}: GetSingleStatisticQuery): SourceValue[] => {
  const allSourceDataForKey = get(sourceData.data, sourceDataKey) as
    | SourceValue[]
    | undefined

  if (!allSourceDataForKey) {
    return []
  }

  const mapped = allSourceDataForKey.map((item) => ({
    ...item,
    date: new Date(item.date),
  }))

  const dropLeft = (item: SourceValue) => {
    if (dateFrom && item.date < dateFrom) {
      return true
    }

    if (_valueIsNotDefined(item)) {
      return true
    }

    return false
  }

  const dropRight = (item: SourceValue) => {
    if (dateTo && item.date > dateTo) {
      return true
    }

    if (_valueIsNotDefined(item)) {
      return true
    }

    return false
  }

  // After running this we have only valid dates if range is selected
  // And we have trimmed non numerical values from left and right ends
  return dropWhile(dropRightWhile(mapped, dropRight), dropLeft)
}

export const getMultipleStatistics = async (
  query: GetStatisticsQuery,
  sourceData: StatisticSourceData,
) => {
  const data = query.sourceDataKeys.map((key) =>
    getStatistics({
      ...query,
      sourceDataKey: key,
      sourceData,
    }),
  )

  const byDate = data.reduce((result, d, i) => {
    const sourceDataKey = query.sourceDataKeys[i]

    for (const dataPoint of d) {
      const dateAsString = dataPoint.date.toISOString()

      if (!result[dateAsString]) {
        result[dateAsString] = {}
      }

      result[dateAsString][sourceDataKey] = dataPoint.value
    }
    return result
  }, {} as Record<string, Record<string, SourceValue['value']>>)

  const dates = Object.keys(byDate)
  dates.sort((a, b) => new Date(a).getTime() - new Date(b).getTime())

  const result = dates.map((d) => ({
    statisticsForDate: Object.keys(byDate[d]).map((key) => ({
      key,
      value: byDate[d][key],
    })),
    date: new Date(d),
  }))

  const dropIncompleteEntries = (item: typeof result[number]) =>
    item.statisticsForDate.length !== query.sourceDataKeys.length

  // Trim from both ends results that do not have data for all keys
  const trimmedResult = dropRightWhile(
    dropWhile(result, dropIncompleteEntries),
    dropIncompleteEntries,
  )

  const { dateFrom, dateTo, numberOfDataPoints } = query

  const numberOfDataPointsToUse =
    numberOfDataPoints ?? DEFAULT_NUMBER_OF_DATA_POINTS

  if (!dateFrom && !dateTo) {
    // If we dont have date from or to, get X most recent data points
    return trimmedResult.slice(numberOfDataPointsToUse * -1)
  } else if (dateFrom) {
    // If we have only date from, get the X number of data points from that date
    return trimmedResult.slice(numberOfDataPointsToUse)
  } else if (dateTo) {
    // If we only have date to, get X most recent data points
    return trimmedResult.slice(numberOfDataPointsToUse * -1)
  }

  return trimmedResult
}
