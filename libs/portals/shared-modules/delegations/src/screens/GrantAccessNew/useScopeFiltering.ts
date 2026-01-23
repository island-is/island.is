import { useMemo } from 'react'

interface Scope {
  name: string
  displayName: string
  description?: string | null
}

interface Category {
  id: string
  title: string
  description?: string | null
  slug: string
  scopes: Scope[]
}

interface Tag {
  id: string
  title: string
  intro?: string | null
  slug: string
  scopes: Scope[]
}

interface Domain {
  name: string
  displayName: string
  description?: string | null
  nationalId?: string | null
}

interface UseScopeFilteringProps {
  categories: Category[]
  tags: Tag[]
  domains: Domain[]
  searchQuery: string
  selectedTagIds: string[]
}

interface FilteredCategory extends Category {
  matchReason?: 'category' | 'scope' | 'domain'
}

/**
 * Custom hook for filtering scopes based on search query and selected tags
 * 
 * Search logic:
 * - Category name
 * - Scope name (displayName)
 * - Scope description
 * - Domain name (e.g., "Skatturinn", "island.is")
 * - Tag name
 * 
 * Tag filter logic:
 * - Only show scopes that belong to ALL selected tags (AND logic)
 */
export const useScopeFiltering = ({
  categories,
  tags,
  domains,
  searchQuery,
  selectedTagIds,
}: UseScopeFilteringProps): FilteredCategory[] => {
  return useMemo(() => {
    let filtered = categories

    // Step 1: Apply tag filter first (if any tags selected)
    if (selectedTagIds.length > 0) {
      // Get scopes that belong to ALL selected tags (AND logic)
      const scopesByTag = selectedTagIds.map((tagId) => {
        const tag = tags.find((t) => t.id === tagId)
        return new Set(tag?.scopes.map((s) => s.name) || [])
      })

      // Intersection of all sets - scope must be in ALL selected tags
      const scopesInAllTags = new Set<string>()
      if (scopesByTag.length > 0) {
        const firstSet = scopesByTag[0]
        firstSet.forEach((scopeName) => {
          const inAllTags = scopesByTag.every((set) => set.has(scopeName))
          if (inAllTags) {
            scopesInAllTags.add(scopeName)
          }
        })
      }

      // Filter categories to only show scopes in selected tags
      filtered = filtered
        .map((category) => ({
          ...category,
          scopes: category.scopes.filter((scope) =>
            scopesInAllTags.has(scope.name),
          ),
        }))
        .filter((cat) => cat.scopes.length > 0)
    }

    // Step 2: Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim()

      // Create a map of scope name to domain for quick lookup
      const scopeToDomainMap = new Map<string, Domain>()
      domains.forEach((domain) => {
        // In the real implementation, you'd get scopes per domain from the API
        // For now, we'll match based on scope name pattern (e.g., @skatturinn/...)
        filtered.forEach((category) => {
          category.scopes.forEach((scope) => {
            if (scope.name.includes(domain.name)) {
              scopeToDomainMap.set(scope.name, domain)
            }
          })
        })
      })

      const searchResults: FilteredCategory[] = []
      
      for (const category of filtered) {
        // Check if category title matches
        const categoryMatches = category.title.toLowerCase().includes(query)

        if (categoryMatches) {
          searchResults.push({
            ...category,
            matchReason: 'category' as const,
          })
          continue
        }

        // Filter scopes based on multiple criteria
        const matchingScopes = category.scopes.filter((scope) => {
          // Scope displayName matches
          if (scope.displayName.toLowerCase().includes(query)) {
            return true
          }

          // Scope description matches
          if (scope.description?.toLowerCase().includes(query)) {
            return true
          }

          // Scope name (technical name) matches
          if (scope.name.toLowerCase().includes(query)) {
            return true
          }

          // Domain matches
          const domain = scopeToDomainMap.get(scope.name)
          if (domain) {
            if (
              domain.displayName.toLowerCase().includes(query) ||
              domain.name.toLowerCase().includes(query)
            ) {
              return true
            }
          }

          // Check if scope is in any tag that matches
          const matchingTags = tags.filter(
            (tag) =>
              tag.title.toLowerCase().includes(query) &&
              tag.scopes.some((s) => s.name === scope.name),
          )
          if (matchingTags.length > 0) {
            return true
          }

          return false
        })

        if (matchingScopes.length > 0) {
          searchResults.push({
            ...category,
            scopes: matchingScopes,
            matchReason: 'scope' as const,
          })
        }
      }
      
      filtered = searchResults
    }

    return filtered
  }, [categories, tags, domains, searchQuery, selectedTagIds])
}

/**
 * Helper to get count of total scopes across all categories
 */
export const getTotalScopeCount = (categories: Category[]): number => {
  return categories.reduce((sum, category) => sum + category.scopes.length, 0)
}

/**
 * Helper to check if a scope is in specific tags
 */
export const getScopeTagIds = (
  scopeName: string,
  tags: Tag[],
): string[] => {
  return tags
    .filter((tag) => tag.scopes.some((s) => s.name === scopeName))
    .map((tag) => tag.id)
}
