import React from 'react'
import { Button, Text, Stack, Link } from '@island.is/island-ui/core'
import IconBullet from '../IconBullet/IconBullet'
import { ContentLink } from '@island.is/web/components'
import { PROJECT_STORIES_TAG_ID } from '@island.is/web/constants'
import * as styles from './StoryList.treat'
import { useLinkResolver } from '@island.is/web/hooks/useLinkResolver'

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
      {stories.map((story, i) => (
        <Story key={i} variant={variant} {...story} />
      ))}
      {stories.length > 0 ? (
        <div className={styles.margin}>
          <Link
            href={{
              pathname: linkResolver('newsoverview').href,
              query: { tag: PROJECT_STORIES_TAG_ID },
            }}
            pureChildren
          >
            <Button
              variant="ghost"
              colorScheme={variant === 'light' ? 'negative' : 'default'}
            >
              {readMoreText}
            </Button>
          </Link>
        </div>
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
          <ContentLink pageData={linkedPage} fallbackLink={link}>
            <Button
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
