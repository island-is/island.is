import React from 'react'
import {
  Box,
  Button,
  FocusableBox,
  GridColumn,
  GridRow,
  Link,
  LinkCard,
  Stack,
  Text,
} from '@island.is/island-ui/core'
import * as styles from './FeaturedArticles.treat'
import { Article } from '@island.is/api/schema'
import { useWindowSize } from 'react-use'
import { theme } from '@island.is/island-ui/theme'

export interface FeaturedArticlesProps {
  title: string
  articles: Array<Article>
  link?: {
    url: string
    text: string
  }
  applicationLabel: string
}

export const FeaturedArticles: React.FC<FeaturedArticlesProps> = ({
  title,
  articles,
  link,
  applicationLabel,
}) => {
  const { width } = useWindowSize()
  const isMobile = width < theme.breakpoints.md
  return (
    <Box
      borderTopWidth="standard"
      borderColor="standard"
      paddingTop={[8, 6, 8]}
      paddingBottom={[4, 5, 10]}
    >
      <GridRow>
        <GridColumn span={['10/10', '10/10', '3/10']}>
          <Box className={styles.popularTitleWrap}>
            <Text variant="h2" as="h2" marginBottom={4}>
              {title}
            </Text>
          </Box>
        </GridColumn>
        <GridColumn span={['10/10', '10/10', '7/10']}>
          <Stack space={2}>
            {articles.map(({ title, slug, processEntry }) => {
              return (
                <FocusableBox
                  key={slug}
                  href={`/${slug}`}
                  target={isMobile ? '' : '_blank'}
                  borderRadius="large"
                >
                  {({ isFocused }) => (
                    <LinkCard
                      isFocused={isFocused}
                      tag={
                        !!processEntry &&
                        (applicationLabel !== '' ? applicationLabel : 'Umsókn')
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
      {!!link && (
        <Box
          display="flex"
          justifyContent="flexEnd"
          paddingTop={4}
          paddingBottom={1}
        >
          <Link href={link.url}>
            <Button
              icon="arrowForward"
              iconType="filled"
              type="button"
              variant="text"
            >
              {link.text}
            </Button>
          </Link>
        </Box>
      )}
    </Box>
  )
}
