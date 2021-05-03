import React, { useState } from 'react'
import {
  FeaturedArticles,
  Query,
  QueryGetArticlesArgs,
  SortField,
} from '@island.is/web/graphql/schema'
import {
  Box,
  Button,
  FocusableBox,
  Input,
  Link,
  LinkCard,
  Stack,
  Text,
} from '@island.is/island-ui/core'
import { LinkType, useLinkResolver } from '@island.is/web/hooks/useLinkResolver'
import { useNamespace } from '@island.is/web/hooks'
import { Namespace } from '@island.is/api/schema'
import { useWindowSize } from 'react-use'
import { theme } from '@island.is/island-ui/theme'
import { useQuery } from '@apollo/client'
import { GET_ORGANIZATION_SERVICES_QUERY } from '@island.is/web/screens/queries'

interface SliceProps {
  slice: FeaturedArticles
  namespace?: Namespace
}

export const FeaturedArticlesSlice: React.FC<SliceProps> = ({
  slice,
  namespace,
}) => {
  const n = useNamespace(namespace)
  const { linkResolver } = useLinkResolver()
  const { width } = useWindowSize()
  const isMobile = width < theme.breakpoints.md

  const [query, setQuery] = useState('')

  const { data } = useQuery<Query, QueryGetArticlesArgs>(
    GET_ORGANIZATION_SERVICES_QUERY,
    {
      variables: {
        input: {
          lang: 'is',
          organization: 'syslumenn',
          sort: SortField.Popular,
        },
      },
    },
  )

  const results = data?.getArticles.filter((x) =>
    x.title.toLowerCase().includes(query.toLowerCase()),
  )

  return (
    !!slice.articles.length && (
      <section key={slice.id} aria-labelledby={'sliceTitle-' + slice.id}>
        <Box
          borderTopWidth="standard"
          borderColor="standard"
          paddingTop={[8, 6, 8]}
          paddingBottom={[8, 6, 6]}
        >
          <Text as="h2" variant="h3" paddingBottom={4}>
            {slice.title}
          </Text>
          <Box marginBottom={4}>
            <Input
              id="featured-search"
              placeholder={'Leit'}
              backgroundColor={['blue', 'blue', 'white']}
              size="sm"
              icon="search"
              iconType="outline"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </Box>
          {!results?.length && <Text>Ekkert fannst</Text>}
          <Stack space={2}>
            {results?.slice(0, 5).map(({ title, slug, processEntry }) => {
              const url = linkResolver('Article' as LinkType, [slug])
              return (
                <FocusableBox
                  key={slug}
                  href={url.href}
                  target={isMobile ? '' : '_blank'}
                  borderRadius="large"
                >
                  {({ isFocused }) => (
                    <LinkCard
                      isFocused={isFocused}
                      tag={!!processEntry && n('applicationProcess', 'Umsókn')}
                    >
                      {title}
                    </LinkCard>
                  )}
                </FocusableBox>
              )
            })}
          </Stack>
          {!!slice.link && (
            <Box display="flex" justifyContent="flexEnd" paddingTop={6}>
              <Link href={slice.link.url}>
                <Button
                  icon="arrowForward"
                  iconType="filled"
                  type="button"
                  variant="text"
                >
                  {n('seeAllServices', 'Sjá allt efni')}
                </Button>
              </Link>
            </Box>
          )}
        </Box>
      </section>
    )
  )
}
