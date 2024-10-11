import get from 'lodash/get'
import dropWhile from 'lodash/dropWhile'
import dropRightWhile from 'lodash/dropRightWhile'
import endOfMonth from 'date-fns/endOfMonth'
import endOfDay from 'date-fns/endOfDay'
import parse from 'date-fns/parse'

import { GetSingleStatisticQuery, GetStatisticsQuery } from './types'
import {
  DEFAULT_NUMBER_OF_DATA_POINTS,
  MONTH_NAMES,
} from './statistics.constants'
import { EnhancedFetchAPI } from '@island.is/clients/middlewares'
import type {
  StatisticSourceData,
  StatisticSourceValue,
} from '@island.is/shared/types'

export const _tryToGetDate = (value: string | null) => {
  if (!value) {
    return null
  }

  const trimmedValue = value?.trim()

  if (trimmedValue?.length === 0) {
    return null
  }

  const splitChar = trimmedValue.includes('-')
    ? '-'
    : trimmedValue.includes(' ')
    ? ' '
    : null

  if (splitChar === null) {
    return null
  }

  const split = trimmedValue.split(splitChar)?.filter((s) => s?.length > 0)

  if (split.length === 3) {
    const hasTime = split[2]?.split(' ')?.length > 1
    const dateFormat = hasTime ? 'yyyy-MM-dd HH:mm' : 'yyyy-MM-dd'

    const defaultDate = new Date(3000, 0, 1)
    const parsed = parse(value, dateFormat, defaultDate)

    if (parsed !== defaultDate && !Number.isNaN(parsed.getTime())) {
      return hasTime ? parsed : endOfDay(parsed)
    }
  }

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
        return endOfMonth(new Date(year, i))
      }
    }
  }

  return null
}

// This function splits a string into a list of strings. The split
// is done by commas that are not inside quotes. This is useful when
// parsing CSV files since commas inside quotes should not be used
// as a separator. This function is used in the processDataFromSource
// function to split each line of the CSV file into an array of strings
export const splitCsvLine = (line: string) => {
  const result: string[] = []
  let current = ''
  let inQuote = false

  for (const char of line) {
    if (char === '"') {
      inQuote = !inQuote
    } else if (char === ',' && !inQuote) {
      result.push(current)
      current = ''
    } else {
      current += char
    }
  }

  if (current.length > 0) {
    // Add the last segment
    result.push(current)
  }

  return result
}

export const processDataFromSource = (data: string) => {
  const lines = data
    .replace(/\r/g, '')
    .split('\n')
    .filter((l) => l.length > 0)

  const headers = lines[0].split(',')
  const dataLines = lines.slice(1).map(splitCsvLine)

  const result: StatisticSourceData['data'] = {}

  // Start at i = 3 to start at dates
  // Row 0 is for headers
  // Column 0 in all data rows should contain id of data
  // Column 1 in all data rows should contain category
  // Column 2 in all data rows should contain subcategory
  for (let i = 3; i < headers.length; i += 1) {
    const currentHeader = headers[i]?.trim()

    const asDate = _tryToGetDate(currentHeader)
    let header = currentHeader

    if (asDate) {
      header = asDate.getTime().toString()
    }

    for (const lineColumns of dataLines) {
      const key = lineColumns[0]?.trim()

      if (!key || key?.length === 0) {
        continue
      }

      if (!result[key]) {
        result[key] = []
      }

      const isPercentage = lineColumns[i]?.endsWith('%') || false
      const rawValue = lineColumns[i]
        ?.replace(/%/g, '')
        // When we have a value like "1,000,000" it is surrounded by quotes
        ?.replace(/"/g, '')
        // We can then safely remove the commas since they are not used to
        // separate decimal digits but rather to separate thousands
        ?.replace(/,/g, '')
        ?.trim()

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
        header,
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

export const getStatisticsFromCsvUrls = (
  fetchClient: EnhancedFetchAPI,
  csvUrls: string[],
): Promise<StatisticSourceData> => {
  if (fetchStatisticsPromise) {
    return fetchStatisticsPromise
  }

  // Let subsequent requests that arrive while the request
  // is in progress reuse the same promise
  fetchStatisticsPromise = new Promise((resolve, reject) => {
    Promise.all<Promise<string>[]>(
      csvUrls.map((source) => fetchClient(source).then(handleResponse)),
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

const _valueIsNotDefined = (item: StatisticSourceValue) => {
  return typeof item.value !== 'number'
}

export const getStatistics = ({
  sourceDataKey,
  dateFrom,
  dateTo,
  sourceData,
}: GetSingleStatisticQuery): StatisticSourceValue[] => {
  const allSourceDataForKey = get(sourceData.data, sourceDataKey) as
    | StatisticSourceValue[]
    | undefined

  if (!allSourceDataForKey) {
    return []
  }

  const isDateHeader = _tryToGetDate(allSourceDataForKey[0]?.header) !== null

  const mapped = allSourceDataForKey.map((item) => ({
    ...item,
    header: item.header,
  }))

  const dropLeft = (item: StatisticSourceValue) => {
    if (isDateHeader && dateFrom && new Date(item.header) < dateFrom) {
      return true
    }

    if (_valueIsNotDefined(item)) {
      return true
    }

    return false
  }

  const dropRight = (item: StatisticSourceValue) => {
    if (isDateHeader && dateTo && new Date(item.header) > dateTo) {
      return true
    }

    if (_valueIsNotDefined(item)) {
      return true
    }

    return false
  }

  // After running this we have only valid items if range is selected
  // And we have trimmed empty values from left and right ends
  return dropWhile(dropRightWhile(mapped, dropRight), dropLeft)
}

export interface DataItem {
  statisticsForHeader: {
    key: string
    value: number | null
  }[]
  header: string
  headerType: 'date' | 'string' | 'number'
}

/**
 *
 * @param result List of DataItem
 * @param interval If > 1 then we will filter out everything but the n-th items in the list
 * @returns Possibly filtered list of DataItem
 */
export const filterByInterval = (result: DataItem[], interval: number) =>
  interval > 1
    ? result
        .reverse()
        .filter((_, i) => i % interval === 0)
        .reverse()
    : result

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

  const byHeader = data.reduce((result, d, i) => {
    const sourceDataKey = query.sourceDataKeys[i]

    for (const dataPoint of d) {
      if (!result[dataPoint.header]) {
        result[dataPoint.header] = {}
      }

      result[dataPoint.header][sourceDataKey] = dataPoint.value
    }
    return result
  }, {} as Record<string, Record<string, StatisticSourceValue['value']>>)

  const headers = Object.keys(byHeader)
  headers.sort((a, b) => new Date(a).getTime() - new Date(b).getTime())

  const result = headers.map((d) => ({
    statisticsForHeader: Object.keys(byHeader[d]).map((key) => ({
      key,
      value: byHeader[d][key],
    })),
    header: d.toString(),
    headerType: d, // TODO: type
  })) as DataItem[]

  const dropIncompleteEntries = (item: typeof result[number]) =>
    item.statisticsForHeader.length !== query.sourceDataKeys.length

  // Trim from both ends results that do not have data for all keys
  const trimmedResult = dropRightWhile(
    dropWhile(result, dropIncompleteEntries),
    dropIncompleteEntries,
  )

  const { dateFrom, dateTo, numberOfDataPoints, interval = 1 } = query

  const numberOfDataPointsToUse =
    numberOfDataPoints ?? DEFAULT_NUMBER_OF_DATA_POINTS

  if (!dateFrom && !dateTo) {
    // If we dont have date from or to, get X most recent data points
    return filterByInterval(
      trimmedResult.slice(numberOfDataPointsToUse * -1),
      interval,
    )
  } else if (dateFrom) {
    // If we have only date from, get the X number of data points from that date
    return filterByInterval(
      trimmedResult.slice(numberOfDataPointsToUse),
      interval,
    )
  } else if (dateTo) {
    // If we only have date to, get X most recent data points
    return filterByInterval(
      trimmedResult.slice(numberOfDataPointsToUse * -1),
      interval,
    )
  }

  return filterByInterval(trimmedResult, interval)
}
