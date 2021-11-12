import React from 'react'
import {
  Text,
  GridContainer,
  GridRow,
  GridColumn,
  Box,
  Stack,
  Inline,
  Tag,
  Link,
} from '@island.is/island-ui/core'
import { Locale } from '@island.is/shared/types'
import { SearchInput } from '@island.is/web/components'
import { LinkType, useLinkResolver } from '@island.is/web/hooks/useLinkResolver'
import { GetFrontpageQuery } from '@island.is/web/graphql/schema'

import * as styles from './SearchSection.css'

type SearchSectionProps = Pick<
  GetFrontpageQuery['getFrontpage'],
  'featured' | 'image' | 'heading'
> & {
  headingId: string
  activeLocale: Locale
  quickContentLabel: string
  placeholder: string
}

export const SearchSection = ({
  heading,
  headingId,
  featured = [],
  image,
  activeLocale,
  quickContentLabel = '',
  placeholder = '',
}: SearchSectionProps) => {
  const { linkResolver } = useLinkResolver()

  return (
    <GridContainer>
      <GridRow marginTop={4} marginBottom={[0, 0, 4]}>
        <GridColumn span={['12/12', '12/12', '7/12', '6/12']}>
          <Box display="flex" height="full" alignItems="center">
            <Stack space={[3, 3, 5]}>
              <Text variant="h1" id={headingId}>
                {heading ?? ''}
              </Text>
              <SearchInput
                id="search_input_home"
                size="large"
                activeLocale={activeLocale}
                quickContentLabel={quickContentLabel}
                placeholder={placeholder}
                openOnFocus
                colored
              />
              <Inline space={2}>
                {featured.map(({ title, attention, thing }) => {
                  const cardUrl = linkResolver(thing?.type as LinkType, [
                    thing?.slug,
                  ])
                  return cardUrl?.href && cardUrl?.href.length > 0 ? (
                    <Tag
                      key={title}
                      {...(cardUrl.href.startsWith('/')
                        ? {
                            CustomLink: ({ children, ...props }) => (
                              <Link key={title} {...props} {...cardUrl}>
                                {children}
                              </Link>
                            ),
                          }
                        : { href: cardUrl.href })}
                      variant="blue"
                      attention={attention}
                    >
                      {title}
                    </Tag>
                  ) : (
                    <Tag key={title} variant="blue" attention={attention}>
                      {title}
                    </Tag>
                  )
                })}
              </Inline>
            </Stack>
          </Box>
        </GridColumn>
        <GridColumn
          offset={['0', '0', '0', '1/12']}
          span={['12/12', '12/12', '5/12', '4/12']}
        >
          {image?.url && (
            <Box
              display="flex"
              width="full"
              height="full"
              justifyContent="center"
              alignItems="center"
              aria-hidden="true"
            >
              <img
                src={image?.url}
                alt="front page"
                className={styles.illustration}
              />
            </Box>
          )}
        </GridColumn>
      </GridRow>
    </GridContainer>
  )
}

export default SearchSection
