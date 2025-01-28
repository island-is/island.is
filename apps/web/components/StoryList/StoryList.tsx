import React from 'react'

import { Box, Button, Link, Stack, Text } from '@island.is/island-ui/core'
import { ContentLink } from '@island.is/web/components'
import { PROJECT_STORIES_TAG_ID } from '@island.is/web/constants'
import { useLinkResolver } from '@island.is/web/hooks/useLinkResolver'

import IconBullet from '../IconBullet/IconBullet'
import * as styles from './StoryList.css'

export interface StoryProps {
  logoUrl: string
  label: string
  title: string
  intro: string
  readMoreText: string
  link?: string
  linkedPage?: string
  variant: 'light' | 'dark'
}

export interface StoryListProps {
  readMoreText: string
  stories: StoryProps[]
  variant?: 'light' | 'dark'
}

export const StoryList = ({
  readMoreText,
  stories = [],
  variant = 'light',
}: StoryListProps) => {
  const { linkResolver } = useLinkResolver()

  return (
    <Stack space={8}>
      {stories.map((story, i) => {
        const props = {
          ...story,
          variant: story.variant ? story.variant : variant,
        }

        return <Story key={i} {...props} />
      })}
      {stories.length > 0 ? (
        <Box className={styles.margin} display="inlineBlock">
          <Link
            href={{
              pathname: linkResolver('newsoverview').href,
              query: { tag: PROJECT_STORIES_TAG_ID },
            }}
            skipTab
          >
            <Button
              as="span"
              variant="ghost"
              colorScheme={variant === 'light' ? 'negative' : 'default'}
            >
              {readMoreText}
            </Button>
          </Link>
        </Box>
      ) : null}
    </Stack>
  )
}

const Story = ({
  logoUrl,
  label,
  title,
  intro,
  readMoreText,
  linkedPage,
  link,
  variant,
}: StoryProps) => {
  return (
    <div className={styles.margin}>
      <div className={styles.icon}>
        <IconBullet variant="gradient" image={logoUrl} />
      </div>
      <Stack space={2}>
        <Text
          variant="eyebrow"
          color={variant === 'light' ? 'white' : 'dark400'}
        >
          {label}
        </Text>
        <Text
          variant="h2"
          as="h2"
          color={variant === 'light' ? 'white' : 'dark400'}
        >
          {title}
        </Text>
        <Text color={variant === 'light' ? 'white' : 'dark400'}>{intro}</Text>
        {!!(linkedPage || link) && (
          <ContentLink
            pageData={linkedPage ? linkedPage : ''}
            fallbackLink={link}
          >
            <Button
              as="span"
              variant="text"
              colorScheme={variant === 'light' ? 'negative' : 'default'}
              icon="arrowForward"
            >
              {readMoreText}
            </Button>
          </ContentLink>
        )}
      </Stack>
    </div>
  )
}

export default StoryList
