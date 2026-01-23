import { useState, useCallback } from 'react'

export interface ScopeSelection {
  scopeName: string
  displayName: string
  description: string | null | undefined
  categoryId: string
  categoryTitle: string
  validTo?: Date
}

interface UseScopeSelectionReturn {
  selectedScopes: Map<string, ScopeSelection>
  isSelected: (scopeName: string) => boolean
  toggleScope: (
    scopeName: string,
    displayName: string,
    description: string | null | undefined,
    categoryId: string,
    categoryTitle: string,
  ) => void
  clearSelection: () => void
  selectAllInCategory: (
    categoryId: string,
    categoryTitle: string,
    scopes: Array<{ name: string; displayName: string; description?: string | null }>,
  ) => void
  deselectAllInCategory: (
    scopes: Array<{ name: string }>,
  ) => void
  setValidityForScope: (scopeName: string, validTo: Date | undefined) => void
  getSelectionArray: () => ScopeSelection[]
}

/**
 * Custom hook for managing scope selection state
 * 
 * Features:
 * - Toggle individual scopes
 * - Select/deselect all in category
 * - Per-scope validity dates (optional)
 * - Get selection as array for mutation
 */
export const useScopeSelection = (): UseScopeSelectionReturn => {
  const [selectedScopes, setSelectedScopes] = useState<
    Map<string, ScopeSelection>
  >(new Map())

  const isSelected = useCallback(
    (scopeName: string): boolean => {
      return selectedScopes.has(scopeName)
    },
    [selectedScopes],
  )

  const toggleScope = useCallback(
    (
      scopeName: string,
      displayName: string,
      description: string | null | undefined,
      categoryId: string,
      categoryTitle: string,
    ) => {
      setSelectedScopes((prev) => {
        const next = new Map(prev)

        if (next.has(scopeName)) {
          // Deselect
          next.delete(scopeName)
        } else {
          // Select
          next.set(scopeName, {
            scopeName,
            displayName,
            description,
            categoryId,
            categoryTitle,
          })
        }

        return next
      })
    },
    [],
  )

  const clearSelection = useCallback(() => {
    setSelectedScopes(new Map())
  }, [])

  const selectAllInCategory = useCallback(
    (
      categoryId: string,
      categoryTitle: string,
      scopes: Array<{ name: string; displayName: string; description?: string | null }>,
    ) => {
      setSelectedScopes((prev) => {
        const next = new Map(prev)

        scopes.forEach((scope) => {
          if (!next.has(scope.name)) {
            next.set(scope.name, {
              scopeName: scope.name,
              displayName: scope.displayName,
              description: scope.description,
              categoryId,
              categoryTitle,
            })
          }
        })

        return next
      })
    },
    [],
  )

  const deselectAllInCategory = useCallback(
    (scopes: Array<{ name: string }>) => {
      setSelectedScopes((prev) => {
        const next = new Map(prev)

        scopes.forEach((scope) => {
          next.delete(scope.name)
        })

        return next
      })
    },
    [],
  )

  const setValidityForScope = useCallback(
    (scopeName: string, validTo: Date | undefined) => {
      setSelectedScopes((prev) => {
        const next = new Map(prev)
        const existing = next.get(scopeName)

        if (existing) {
          next.set(scopeName, {
            ...existing,
            validTo,
          })
        }

        return next
      })
    },
    [],
  )

  const getSelectionArray = useCallback((): ScopeSelection[] => {
    return Array.from(selectedScopes.values())
  }, [selectedScopes])

  return {
    selectedScopes,
    isSelected,
    toggleScope,
    clearSelection,
    selectAllInCategory,
    deselectAllInCategory,
    setValidityForScope,
    getSelectionArray,
  }
}
