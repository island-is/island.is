import {
  AsyncSearch,
  Box,
  CategoryCard,
  ColorSchemeContext,
  Icon,
  Stack,
  Text,
  usePreventBodyScroll,
  VisuallyHidden,
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { m } from '@island.is/portals/my-pages/core'
import { Problem } from '@island.is/react-spa/shared'
import cn from 'classnames'
import { RefObject, useEffect, useId, useMemo, useRef, useState } from 'react'
import { flushSync } from 'react-dom'
import { Link } from 'react-router-dom'
import { useDebounce } from 'react-use'
import { usePortalModulesSearch } from '../../hooks/usePortalModulesSearch'
import * as searchInputStyles from '../SearchInput/SearchInput.css'
import * as sidemenuStyles from '../Sidemenu/Sidemenu.css'

export const SEARCH_MENU_ID = 'search-menu-mobile'

interface Props {
  inputRef: RefObject<HTMLInputElement | null>
  onClose: () => void
  onNavigate: () => void
  onInputInitialized?: () => void
}

export const SearchMenu = ({
  inputRef,
  onClose,
  onNavigate,
  onInputInitialized,
}: Props) => {
  const { formatMessage } = useLocale()
  const search = usePortalModulesSearch()
  const [query, setQuery] = useState('')
  const inputInitializedRef = useRef(false)
  const headingId = useId()
  const [scrollLocked, setScrollLocked] = useState(true)

  usePreventBodyScroll(scrollLocked)

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [onClose])

  const searchResults = useMemo(() => {
    if (query.length > 1) {
      return search(query)
    }
    return []
  }, [search, query])

  const statusMessage = useMemo(() => {
    if (!query) {
      return formatMessage(m.searchForResults)
    }
    if (query.length < 2) {
      return undefined
    }
    if (!searchResults.length) {
      return formatMessage(m.noSearchResultsText, {
        arg: <strong>{query}</strong>,
      })
    }
    return formatMessage(
      searchResults.length === 1 ? m.resultFound : m.resultsFound,
      { arg: <strong>{searchResults.length}</strong> },
    )
  }, [formatMessage, query, searchResults])

  const [announcedMessage, setAnnouncedMessage] = useState(statusMessage)
  useDebounce(() => setAnnouncedMessage(statusMessage), 400, [statusMessage])

  return (
    <Box display="flex" justifyContent="flexEnd">
      <Box
        id={SEARCH_MENU_ID}
        role="region"
        aria-labelledby={headingId}
        position="relative"
        background="white"
        padding={2}
        display="flex"
        flexDirection="column"
        height="full"
        className={cn(sidemenuStyles.fullScreen, sidemenuStyles.container)}
      >
        <Box
          display="flex"
          flexDirection="column"
          className={sidemenuStyles.wrapper}
        >
          <Box display="flex" flexDirection="row" alignItems="center">
            <Box
              borderRadius="full"
              background="blue100"
              display="flex"
              justifyContent="center"
              alignItems="center"
              className={sidemenuStyles.overviewIcon}
              marginRight="p2"
            >
              <Icon icon="search" type="outline" color="blue400" />
            </Box>
            <Text variant="h4" id={headingId}>
              {formatMessage(m.searchLabel)}
            </Text>
          </Box>
          <Box marginTop={2} className={searchInputStyles.wrapper}>
            <ColorSchemeContext.Provider value={{ colorScheme: 'blue' }}>
              <AsyncSearch
                ref={inputRef}
                id="search-menu-mobile-input"
                ariaLabel={formatMessage(m.searchOnMyPages)}
                placeholder={formatMessage(m.searchPlaceholder)}
                size="semi-large"
                colored
                options={[]}
                inputValue={query}
                initialInputValue=""
                onSubmit={() => inputRef.current?.blur()}
                onInputValueChange={(value) => {
                  setQuery(value)
                  if (!inputInitializedRef.current && value) {
                    onInputInitialized?.()
                    inputInitializedRef.current = true
                  }
                }}
              />
            </ColorSchemeContext.Provider>
          </Box>
          <VisuallyHidden>
            <span aria-live="polite">{announcedMessage}</span>
          </VisuallyHidden>
          <Box marginTop={3}>
            {!query && (
              <Problem
                type="no_data"
                noBorder={false}
                title={formatMessage(m.nothing)}
                message={formatMessage(m.searchForResults)}
                imgSrc="./assets/images/bench.svg"
              />
            )}
            {query.length > 1 && !searchResults.length && (
              <Problem
                type="no_data"
                noBorder={false}
                title={formatMessage(m.noSearchResults)}
                message={formatMessage(m.noSearchResultsText, {
                  arg: <strong>{query}</strong>,
                })}
                imgSrc="./assets/images/sofa.svg"
              />
            )}
            {searchResults.length > 0 && <Text>{statusMessage}</Text>}
          </Box>
          {searchResults.length > 0 && (
            <Box marginTop={2} paddingBottom={3}>
              <Stack space={2}>
                {searchResults.map((result) => (
                  <Box
                    key={result.item.uri}
                    onClickCapture={() =>
                      flushSync(() => setScrollLocked(false))
                    }
                    onClick={onNavigate}
                  >
                    <CategoryCard
                      autoStack
                      hyphenate
                      truncateHeading
                      component={Link}
                      to={result.item.uri}
                      headingAs="h5"
                      headingVariant="h4"
                      heading={result.item.title}
                      text={result.item.description ?? ''}
                      icon={
                        result.item.icon ? (
                          <Icon
                            icon={result.item.icon.icon}
                            type="outline"
                            color="blue400"
                          />
                        ) : undefined
                      }
                    />
                  </Box>
                ))}
              </Stack>
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  )
}

export default SearchMenu
