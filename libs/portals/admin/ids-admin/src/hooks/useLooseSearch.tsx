import get from 'lodash/get'
import { useMemo, useState } from 'react'

import { pseudolocalizeString } from '../utils/forms'

/**
 * This hook allows you to filter a list of objects and search through multiple keys and paths.
 * The search is tokenized, case-insensitive and pseudo localized.
 *
 * @param fullList
 * @param searchPaths Uses the lodash get syntax to search through nested objects.
 * @param keyPath Uses the lodash get syntax to search through nested objects.
 */
export function useLooseSearch<T>(
  fullList: T[],
  searchPaths: string[],
  keyPath: string,
): [T[], (searchValue: string) => void] {
  const [filteredList, setFilteredList] = useState(fullList)

  // Populate the search map with the full list.
  const searchMap = useMemo(() => {
    const map = new Map<string, string>()

    fullList.forEach((item) => {
      const key = get(item, keyPath)

      if (!key) {
        return
      }

      const concatenatedString = searchPaths.reduce((acc, path) => {
        const value = get(item, path)

        if (!value) {
          return acc
        }
        return `${acc} ${value}`
      }, '')

      map.set(
        get(item, keyPath),
        pseudolocalizeString(concatenatedString).toLowerCase(),
      )
    })

    return map
  }, [fullList, keyPath, searchPaths])

  const filterList = (searchValue = '') => {
    if (searchValue.length === 0) {
      setFilteredList(fullList)
      return
    }

    const tokens = pseudolocalizeString(searchValue).toLowerCase().split(' ')

    setFilteredList(
      fullList.filter((item) => {
        const key = get(item, keyPath)

        if (!key) {
          return false
        }

        const concatenatedStr = searchMap.get(key)

        if (!concatenatedStr) {
          return false
        }

        return tokens.every((token) => concatenatedStr.includes(token))
      }),
    )
  }

  return [filteredList, filterList]
}
