import React, { useContext } from 'react'
import { GridContainer, Link, Button, Box } from '@island.is/island-ui/core'
import { GetNewsQuery } from '@island.is/web/graphql/schema'
import { GlobalContext } from '@island.is/web/context/GlobalContext/GlobalContext'
import { useNamespace } from '@island.is/web/hooks'
import { theme } from '@island.is/island-ui/theme'
import { NewsCard, SimpleSlider } from '@island.is/web/components'
import { LinkType, useLinkResolver } from '@island.is/web/hooks/useLinkResolver'

interface LatestNewsProps {
  label: string
  items: GetNewsQuery['getNews']['items']
  linkType?: LinkType
  overview?: LinkType
  parameters?: Array<string>
  readMoreText?: string
}

export const LatestNewsSectionSlider: React.FC<LatestNewsProps> = ({
  label,
  items = [],
  linkType = 'news',
  overview = 'newsoverview',
  parameters = [],
  readMoreText,
}) => {
  const newsItems = items.slice(0, 3)
  const { globalNamespace } = useContext(GlobalContext)
  const n = useNamespace(globalNamespace)
  const { linkResolver } = useLinkResolver()

  return (
    <GridContainer>
      <Box marginTop={[4, 4, 10]}>
        <SimpleSlider
          title={label}
          breakpoints={{
            0: {
              gutterWidth: theme.grid.gutter.mobile,
              slideCount: 1,
              slideWidthOffset: 100,
            },
            [theme.breakpoints.sm]: {
              gutterWidth: theme.grid.gutter.mobile,
              slideCount: 1,
              slideWidthOffset: 200,
            },
            [theme.breakpoints.md]: {
              gutterWidth: theme.spacing[3],
              slideCount: 1,
              slideWidthOffset: 300,
            },
            [theme.breakpoints.xl]: {
              gutterWidth: theme.spacing[3],
              slideCount: 1,
              slideWidthOffset: 400,
            },
          }}
          items={newsItems
            .filter((x) => x.slug && x.title)
            .map(({ title, image, intro, slug, date }, index) => {
              return (
                <NewsCard
                  key={index}
                  title={title}
                  introduction={intro}
                  image={image}
                  date={date}
                  href={linkResolver(linkType, [...parameters, slug]).href}
                />
              )
            })}
        />
        <Box display={'flex'} justifyContent="flexEnd" marginTop={[3, 3, 4]}>
          <Link {...linkResolver(overview, parameters)} skipTab>
            <Button
              icon="arrowForward"
              iconType="filled"
              variant="text"
              as="span"
            >
              {readMoreText ?? n('seeMore')}
            </Button>
          </Link>
        </Box>
      </Box>
    </GridContainer>
  )
}

export default LatestNewsSectionSlider
