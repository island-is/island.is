import React from 'react'
import { FeaturedArticles } from '@island.is/web/graphql/schema'
import {
  Box,
  Button,
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
import Link from 'next/link'
import { useNamespace } from '@island.is/web/hooks'
import { Namespace } from '@island.is/api/schema'

interface SliceProps {
  slice: FeaturedArticles
  namespace?: Namespace
}

export const FeaturedArticlesSlice: React.FC<SliceProps> = ({ slice, namespace }) => {
  const n = useNamespace(namespace)
  const { linkResolver } = useLinkResolver()
  return (
    <>
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
                  <h2
                    className={styles.popularTitle}
                    id={'sliceTitle-' + slice.id}
                  >
                    {slice.title}
                  </h2>
                  <Box display={['none', 'none', 'block']}>
                    <img src={slice.image.url} alt="" />
                  </Box>
                </Box>
              </GridColumn>
              <GridColumn span={['12/12', '12/12', '7/12']}>
                <Stack space={2}>
                  {slice.articles.map(({ title, slug, isApplication }) => {
                    const url = linkResolver('Article' as LinkType, [slug])
                    return (
                      <FocusableBox
                        key={slug}
                        href={url.href}
                        as={url.as}
                        borderRadius="large"
                      >
                        {({ isFocused }) => (
                          <LinkCard
                            isFocused={isFocused}
                            tag={
                              !!isApplication &&
                              n('applicationProcess', 'Umsókn')
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
            <Box
              display="flex"
              justifyContent="flexEnd"
              paddingTop={4}
              paddingBottom={1}
            >
              <Text variant="h5" as="p">
                <Link href="#">
                  <Button
                    icon="arrowForward"
                    iconType="filled"
                    type="button"
                    variant="text"
                  >
                    {n('seeAllServices', 'Sjá allt efni')}
                  </Button>
                </Link>
              </Text>
            </Box>
          </Box>
        </GridContainer>
      </section>
    </>
  )
}
