import React from 'react'
import { FeaturedArticles } from '@island.is/web/graphql/schema'
import {
  Box,
  FocusableBox,
  GridColumn,
  GridContainer,
  GridRow,
  LinkCard,
  Stack,
  Text,
} from '@island.is/island-ui/core'
import * as styles from './FeaturedArticlesSlice.treat'
import { LinkType, useLinkResolver } from '@island.is/web/hooks/useLinkResolver'
import { useNamespace } from '@island.is/web/hooks'
import { Namespace } from '@island.is/api/schema'
import { useWindowSize } from 'react-use'
import { theme } from '@island.is/island-ui/theme'

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
  return (
    <section key={slice.id} aria-labelledby={'sliceTitle-' + slice.id}>
      <GridContainer>
        <Box
          borderTopWidth="standard"
          borderColor="standard"
          paddingTop={[8, 6, 10]}
          paddingBottom={[4, 5, 10]}
        >
          <GridRow>
            <GridColumn span={['12/12', '12/12', '5/12']}>
              <Box className={styles.popularTitleWrap}>
                <Text variant="h2" as="h2" marginBottom={4}>
                  {slice.title}
                </Text>
                <Box display={['none', 'none', 'block']}>
                  <img src={slice.image.url} alt="" />
                </Box>
              </Box>
            </GridColumn>
            <GridColumn span={['12/12', '12/12', '7/12']}>
              <Stack space={2}>
                {slice.articles.map(({ title, slug, processEntry }) => {
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
                          tag={
                            !!processEntry && n('applicationProcess', 'Umsókn')
                          }
                        >
                          {title}
                        </LinkCard>
                      )}
                    </FocusableBox>
                  )
                })}
              </Stack>
            </GridColumn>
          </GridRow>
        </Box>
      </GridContainer>
    </section>
  )
}
