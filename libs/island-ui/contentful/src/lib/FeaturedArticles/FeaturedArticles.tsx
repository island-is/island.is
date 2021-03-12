import React from 'react'
import {
  Box,
  Button,
  FocusableBox,
  Link,
  LinkCard,
  Stack,
  Text,
} from '@island.is/island-ui/core'
import { LinkType, useLinkResolver } from '@island.is/web/hooks/useLinkResolver'
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
}

export const FeaturedArticles: React.FC<FeaturedArticlesProps> = ({
  title,
  articles,
  link,
}) => {
  const { linkResolver } = useLinkResolver()
  const { width } = useWindowSize()
  const isMobile = width < theme.breakpoints.md
  return (
    <Box
      borderTopWidth="standard"
      borderColor="standard"
      paddingTop={[8, 6, 8]}
      paddingBottom={[8, 6, 6]}
    >
      <Text as="h2" variant="h3" paddingBottom={6}>
        {title}
      </Text>
      <Stack space={2}>
        {articles.map(({ title, slug, processEntry }) => {
          const url = linkResolver('Article' as LinkType, [slug])
          return (
            <FocusableBox
              key={slug}
              href={url.href}
              target={isMobile ? '' : '_blank'}
              borderRadius="large"
            >
              {({ isFocused }) => (
                <LinkCard isFocused={isFocused} tag="Umsókn">
                  {title}
                </LinkCard>
              )}
            </FocusableBox>
          )
        })}
      </Stack>
      {!!link && (
        <Box display="flex" justifyContent="flexEnd" paddingTop={6}>
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
