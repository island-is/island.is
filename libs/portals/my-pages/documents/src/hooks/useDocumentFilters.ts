import { useCallback, useState } from 'react'
import { useDocumentContext } from '../screens/Overview/DocumentContext'
import { documentsSearchDocumentsInitialized } from '@island.is/plausible'
import isAfter from 'date-fns/isAfter'
import { defaultFilterValues } from '../utils/types'
import { DocumentsPaths } from '../lib/paths'
import { formatPlausiblePathToParams } from '@island.is/portals/my-pages/core'

export const useDocumentFilters = () => {
  const { setFilterValue, setPage } = useDocumentContext()
  const [searchInteractionEventSent, setSearchInteractionEventSent] =
    useState(false)

  const handleDateFromInput = useCallback((value: Date | null) => {
    setPage(1)
    setFilterValue((oldState) => {
      const { dateTo } = oldState
      const dateToValue = () => {
        if (!value) {
          return dateTo
        }
        return dateTo ? (isAfter(value, dateTo) ? value : dateTo) : dateTo
      }
      return {
        ...oldState,
        dateTo: dateToValue(),
        dateFrom: value,
      }
    })
  }, [])

  const handleDateToInput = useCallback((value: Date | null) => {
    setPage(1)
    setFilterValue((oldState) => ({
      ...oldState,
      dateTo: value,
    }))
  }, [])

  const handlePageChange = useCallback((newPage: number) => {
    setPage(newPage)
  }, [])

  const handleCategoriesChange = useCallback((selected: string[]) => {
    setPage(1)
    setFilterValue((oldFilter) => ({
      ...oldFilter,
      activeCategories: [...selected],
    }))
  }, [])

  const handleSendersChange = useCallback((selected: string[]) => {
    setPage(1)
    setFilterValue((oldFilter) => ({
      ...oldFilter,
      activeSenders: [...selected],
    }))
  }, [])

  const handleClearFilters = useCallback(() => {
    setPage(1)
    setFilterValue({ ...defaultFilterValues })
  }, [])

  const handleShowUnread = useCallback((showUnread: boolean) => {
    setPage(1)
    setFilterValue((prevFilter) => ({
      ...prevFilter,
      showUnread,
    }))
  }, [])

  const handleShowArchived = useCallback((showArchived: boolean) => {
    setPage(1)
    setFilterValue((prevFilter) => ({
      ...prevFilter,
      archived: showArchived,
    }))
  }, [])

  const handleShowBookmarked = useCallback((showBookmarked: boolean) => {
    setPage(1)
    setFilterValue((prevFilter) => ({
      ...prevFilter,
      bookmarked: showBookmarked,
    }))
  }, [])

  const handleSearchChange = (e: any) => {
    setPage(1)
    if (e) {
      setFilterValue((prevFilter) => ({
        ...prevFilter,
        searchQuery: e.target?.value ?? '',
      }))
      if (!searchInteractionEventSent) {
        documentsSearchDocumentsInitialized(
          formatPlausiblePathToParams(DocumentsPaths.ElectronicDocumentsRoot),
        )
        setSearchInteractionEventSent(true)
      }
    }
  }

  return {
    handleDateFromInput,
    handleDateToInput,
    handlePageChange,
    handleCategoriesChange,
    handleSendersChange,
    handleClearFilters,
    handleShowUnread,
    handleShowArchived,
    handleShowBookmarked,
    handleSearchChange,
  }
}
