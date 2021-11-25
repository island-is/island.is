import React, { useEffect, useMemo, useState } from 'react'
import {
  AsyncSearchInput,
  Box,
  Button,
  Text,
  Link,
} from '@island.is/island-ui/core'
import { useQuery } from '@apollo/client'
import {
  Query,
  QueryGetArticlesArgs,
  SortField,
} from '@island.is/web/graphql/schema'
import { GET_ORGANIZATION_SERVICES_QUERY } from '@island.is/web/screens/queries'
import { LinkType, useLinkResolver } from '@island.is/web/hooks/useLinkResolver'
import { useRouter } from 'next/router'

interface SearchBoxProps {
  organizationPage: Query['getOrganizationPage']
  placeholder: string
  noResultsText: string
  searchAllText: string
}

export const SearchBox = ({
  organizationPage,
  placeholder,
  noResultsText,
  searchAllText,
}: SearchBoxProps) => {
  const { linkResolver } = useLinkResolver()
  const Router = useRouter()

  const { data } = useQuery<Query, QueryGetArticlesArgs>(
    GET_ORGANIZATION_SERVICES_QUERY,
    {
      variables: {
        input: {
          lang: 'is',
          organization: organizationPage.slug,
          size: 500,
          sort: SortField.Popular,
        },
      },
    },
  )

  const items = useMemo(
    () =>
      data?.getArticles
        .map((o) => ({
          type: 'article',
          label: o.title,
          value: o.slug,
        }))
        .concat(
          ...organizationPage.menuLinks.map((x) => [
            {
              type: 'url',
              label: x.primaryLink.text,
              value: x.primaryLink.url,
            },
            ...x.childrenLinks.map((y) => ({
              type: 'url',
              label: y.text,
              value: y.url,
            })),
          ]),
        ) ?? [],
    [data],
  )

  const [value, setValue] = useState('')
  const [options, setOptions] = useState([])

  const [hasFocus, setHasFocus] = useState(false)

  useEffect(() => {
    const newOpts = items
      .filter(
        (item) =>
          value && item.label.toLowerCase().includes(value.toLowerCase()),
      )
      .slice(0, 5)

    if (!value) {
      setOptions([])
    }

    setOptions(newOpts)
  }, [value])

  const onBlur = () => {
    setTimeout(() => {
      setHasFocus(false)
    }, 100)
  }
  return (
    <Box marginTop={3}>
      <AsyncSearchInput
        rootProps={{
          'aria-controls': '-menu',
        }}
        hasFocus={hasFocus}
        menuProps={{
          comp: 'div',
        }}
        buttonProps={{
          onClick: () => {
            value &&
              Router.push({
                pathname: linkResolver('search').href,
                query: { q: value },
              }).then(() => window.scrollTo(0, 0))
          },
        }}
        inputProps={{
          inputSize: 'medium',
          onFocus: () => setHasFocus(true),
          onBlur,
          placeholder,
          value,
          onChange: (e) => setValue(e.target.value),
        }}
      >
        {!!value && (
          <Box padding={2} onClick={(e) => e.stopPropagation()}>
            {options?.map((x) => (
              <Box paddingY={1}>
                <Link
                  key={x.value}
                  href={
                    x.type === 'url'
                      ? x.value
                      : linkResolver('Article' as LinkType, [x.value]).href
                  }
                  underline="normal"
                >
                  <Text key={x.value} as="span">
                    {x.label}
                  </Text>
                </Link>
              </Box>
            ))}
            {!options?.length && (
              <Box paddingY={1}>
                <Text as="span">{noResultsText}</Text>
              </Box>
            )}
            <Box paddingY={2}>
              <Button
                type="button"
                variant="text"
                onClick={() =>
                  Router.push({
                    pathname: linkResolver('search').href,
                    query: { q: value },
                  })
                }
              >
                {searchAllText}
              </Button>
            </Box>
          </Box>
        )}
      </AsyncSearchInput>
    </Box>
  )
}
