import { useEffect, useState } from 'react'
import { useDebounce } from 'react-use'
import { useRouter } from 'next/router'
import { useLazyQuery } from '@apollo/client'

import {
  AsyncSearch,
  AsyncSearchOption,
  AsyncSearchProps,
  Box,
  Text,
} from '@island.is/island-ui/core'
import { trackSearchQuery } from '@island.is/plausible'
import {
  ContentLanguage,
  GetSupportSearchResultsQuery,
  GetSupportSearchResultsQueryVariables,
  SearchableContentTypes,
  SupportQna,
} from '@island.is/web/graphql/schema'
import { useLinkResolver } from '@island.is/web/hooks/useLinkResolver'
import { useI18n } from '@island.is/web/i18n'
import { GET_SUPPORT_SEARCH_RESULTS_QUERY } from '@island.is/web/screens/queries'
import {
  getServiceWebSearchTagQuery,
  getSlugPart,
} from '@island.is/web/screens/ServiceWeb/utils'

const unused = ['.', '?', ':', ',', ';', '!', '-', '_', '#', '~', '|']

export const ModifySearchTerms = (searchTerms: string) =>
  searchTerms
    .split(' ')
    .filter((x) => x)
    .reduce((sum, cur) => {
      const s = unused.reduce((a, b) => {
        return a.replace(b, '')
      }, cur)
      const f = s.length > 3 ? Math.floor(0.3 * s.length) : ''
      const add = s ? `${s}~${f}|${s}` : ''
      return sum ? `${sum}|${add}` : add
    }, '')

interface SearchInputProps {
  title?: string
  size?: AsyncSearchProps['size']
  logoTitle?: string
  logoUrl?: string
  colored?: boolean
  initialInputValue?: string
  placeholder?: string
  nothingFoundText?: string
}

export const SearchInput = ({
  colored = false,
  size = 'large',
  initialInputValue = '',
  placeholder = 'Leitaðu á þjónustuvefnum',
  nothingFoundText = 'Ekkert fannst',
}: SearchInputProps) => {
  const [searchTerms, setSearchTerms] = useState<string>('')
  const [activeItem, setActiveItem] = useState<SupportQna>()
  const [lastSearchTerms, setLastSearchTerms] = useState<string>('')
  const [options, setOptions] = useState<AsyncSearchOption[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const { linkResolver } = useLinkResolver()
  const Router = useRouter()
  const { activeLocale } = useI18n()

  const institutionSlug = getSlugPart(
    Router.asPath,
    activeLocale === 'is' ? 2 : 3,
  )

  const [fetch, { loading, data }] = useLazyQuery<
    GetSupportSearchResultsQuery,
    GetSupportSearchResultsQueryVariables
  >(GET_SUPPORT_SEARCH_RESULTS_QUERY, {
    onCompleted: (newData) => {
      updateOptions(newData)
    },
  })

  useDebounce(
    () => {
      if (searchTerms) {
        const queryString = searchTerms

        if (searchTerms.trim() === lastSearchTerms.trim()) {
          updateOptions()
        } else {
          fetch({
            variables: {
              query: {
                highlightResults: true,
                useQuery: 'suggestions',
                language: activeLocale as ContentLanguage,
                queryString,
                types: [SearchableContentTypes['WebQna']],
                ...getServiceWebSearchTagQuery(institutionSlug),
              },
            },
          })
        }

        setLastSearchTerms(searchTerms)
      }
    },
    300,
    [searchTerms],
  )

  const clearAll = () => {
    setIsLoading(false)
    setOptions([])
  }

  useEffect(() => {
    if (!searchTerms) {
      clearAll()
    }
  }, [searchTerms])

  const onSelect = ({ slug, organization, category }: SupportQna) => {
    const organizationSlug = organization?.slug ?? ''
    const categorySlug = category?.slug ?? ''

    if (organizationSlug && categorySlug) {
      trackSearchQuery(searchTerms, 'Service Web Suggestion')
      Router.push(
        linkResolver('supportqna', [organizationSlug, categorySlug, slug]).href,
      )
    }
  }

  const updateOptions = (newData?: GetSupportSearchResultsQuery) => {
    const options = (
      ((newData ?? data)?.searchResults?.items as Array<SupportQna>) || []
    )
      .filter(
        (item) => item.category?.slug && item.organization?.slug && item.slug,
      )
      .map((item, index) => ({
        label: item.title,
        value: item.slug,
        component: ({ active }: { active: boolean }) => {
          if (active) {
            setActiveItem(item)
          }

          return (
            <Box
              key={index}
              cursor="pointer"
              outline="none"
              padding={2}
              role="button"
              background={active ? 'white' : 'blue100'}
              onClick={() => {
                setOptions([])
                onSelect(item)
              }}
            >
              <span dangerouslySetInnerHTML={{ __html: item.title }} />
            </Box>
          )
        },
      }))

    setOptions(
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore make web strict
      options.length
        ? options
        : [
            {
              label: searchTerms,
              value: searchTerms,
              component: () => (
                <Box
                  padding={2}
                  background="blue100"
                  disabled
                  onClick={() => null}
                >
                  <Text as="span">{nothingFoundText}</Text>
                </Box>
              ),
            },
          ],
    )
    setIsLoading(false)
  }

  const busy = loading || isLoading

  return (
    <AsyncSearch
      size={size}
      colored={colored}
      key="island-serviceweb"
      placeholder={placeholder}
      options={options}
      loading={busy}
      initialInputValue={initialInputValue}
      inputValue={searchTerms}
      onInputValueChange={(value) => {
        setSearchTerms((prevValue) => {
          setIsLoading(value !== prevValue)
          return value
        })
      }}
      closeMenuOnSubmit
      onSubmit={(value, selectedOption) => {
        setOptions([])

        if (selectedOption && activeItem) {
          return onSelect(activeItem)
        }

        const defaultInstitutionSlug =
          activeLocale === 'en' ? 'digital-iceland' : 'stafraent-island'

        let slug = institutionSlug

        if (
          institutionSlug === 'leit' ||
          institutionSlug === 'search' ||
          !institutionSlug
        ) {
          slug = defaultInstitutionSlug
        }

        Router.push({
          pathname: linkResolver('serviceweborganizationsearch', [slug]).href,
          query: { q: value },
        })
      }}
    />
  )
}
