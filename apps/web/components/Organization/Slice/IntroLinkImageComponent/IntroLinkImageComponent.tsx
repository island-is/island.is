import React from 'react'

import type { SliceType } from '@island.is/island-ui/contentful'
import {
  Box,
  Button,
  GridColumn,
  GridRow,
  Hyphen,
  Link,
  Text,
} from '@island.is/island-ui/core'
import { type IntroLinkImage } from '@island.is/web/graphql/schema'
import { LinkType, useLinkResolver } from '@island.is/web/hooks/useLinkResolver'
import { webRichText } from '@island.is/web/utils/richText'

import * as styles from './IntroLinkImageComponent.css'

interface IntroLinkImageComponentProps {
  item: IntroLinkImage
  id?: string | null
}

export const IntroLinkImageComponent = ({
  item: {
    leftImage,
    linkTitle,
    image,
    openLinkInNewTab,
    title,
    intro,
    link,
    linkHref: linkHrefFromCms,
  },
  id,
}: IntroLinkImageComponentProps) => {
  const { linkResolver } = useLinkResolver()
  const linkHref = linkHrefFromCms
    ? linkHrefFromCms
    : link?.type && link.slug
    ? linkResolver(link.type as LinkType, [link.slug]).href
    : ''
  return (
    <GridRow direction={leftImage ? 'row' : 'rowReverse'} rowGap={1}>
      {image?.url && (
        <GridColumn span={['8/8', '3/8', '4/8', '3/8']}>
          <Box
            width="full"
            position="relative"
            paddingLeft={leftImage ? undefined : [0, 0, 0, 0, 6]}
            paddingRight={leftImage ? [10, 0, 0, 0, 6] : [10, 0]}
          >
            <img
              className={styles.image}
              src={`${image.url}?w=774&fm=webp&q=80`}
              alt={image.description ?? ''}
            />
          </Box>
        </GridColumn>
      )}
      <GridColumn span={['8/8', '5/8', '4/8', '5/8']}>
        <Box
          display="flex"
          flexDirection="column"
          justifyContent="center"
          height="full"
        >
          <Box>
            <Text
              as="h2"
              variant="h2"
              marginBottom={2}
              id={id ? 'sliceTitle-' + id : undefined}
            >
              {!leftImage ? <Hyphen>{title}</Hyphen> : title}
            </Text>
            {Boolean(intro) && (
              <Box marginBottom={4}>
                {webRichText(
                  [
                    {
                      __typename: 'Html',
                      id: intro?.id,
                      document: intro?.document,
                    },
                  ] as SliceType[],
                  undefined,
                )}
              </Box>
            )}
            {linkHref && (
              <Link href={linkHref} skipTab newTab={openLinkInNewTab ?? true}>
                <Button icon="arrowForward" variant="text">
                  {linkTitle}
                </Button>
              </Link>
            )}
          </Box>
        </Box>
      </GridColumn>
    </GridRow>
  )
}
