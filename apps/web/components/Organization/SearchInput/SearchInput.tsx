import { SearchInput } from "@island.is/web/components"
import { useI18n } from "@island.is/web/i18n"

interface Props {
  placeholder?: string
  organizationSlug?: string
}

export const OrganizationSearchInput = ({placeholder,organizationSlug}: Props) => {
  const { activeLocale } = useI18n()

  const placeholderText = placeholder ?? activeLocale === "is" ? "Leita" : "Search"

  return (
    <SearchInput
      id="sidebar_search_input"
      size="medium"
      activeLocale={activeLocale}
      placeholder={placeholderText}
      autocomplete={true}
      autosuggest={true}
      organization={organizationSlug}
    />
  )
}
