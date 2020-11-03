import React, { FC } from 'react'
import {
  ButtonDeprecated as Button,
  Text,
  Stack,
  Link,
} from '@island.is/island-ui/core'
import IconBullet from '../IconBullet/IconBullet'
import { ContentLink } from '@island.is/web/components'
import { useI18n } from '@island.is/web/i18n'
import routeNames from '@island.is/web/i18n/routeNames'
import { PROJECT_STORIES_TAG_ID } from '@island.is/web/constants'

import * as styles from './StoryList.treat'

export interface StoryProps {
  logoUrl: string
  label: string
  title: string
  intro: string
  readMoreText: string
  link?: string
  linkedPage?: string
}

export interface StoryListProps {
  readMoreText: string
  stories: StoryProps[]
}

export const StoryList: FC<StoryListProps> = ({
  readMoreText,
  stories = [],
}) => {
  const { activeLocale } = useI18n()
  const { makePath } = routeNames(activeLocale)

  return (
    <Stack space={8}>
      {stories.map((story, i) => (
        <Story key={i} {...story} />
      ))}
      {stories.length > 0 ? (
        <div className={styles.margin}>
          <Link
            href={{
              pathname: makePath('news'),
              query: { tag: PROJECT_STORIES_TAG_ID },
            }}
            as={makePath('news', `?tag=${PROJECT_STORIES_TAG_ID}`)}
            pureChildren
          >
            <Button variant="ghost" white>
              {readMoreText}
            </Button>
          </Link>
        </div>
      ) : null}
    </Stack>
  )
}

const Story: FC<StoryProps> = ({
  logoUrl,
  label,
  title,
  intro,
  readMoreText,
  linkedPage,
  link,
}) => {
  return (
    <div className={styles.margin}>
      <div className={styles.icon}>
        <IconBullet variant="gradient" image={logoUrl} />
      </div>
      <Stack space={2}>
        <Text variant="eyebrow" color="white">
          {label}
        </Text>
        <Text variant="h2" as="h2" color="white">
          {title}
        </Text>
        <Text color="white">{intro}</Text>
        {!!(linkedPage || link) && (
          <ContentLink pageData={linkedPage} fallbackLink={link}>
            <Button variant="text" size="medium" white icon="arrowRight">
              {readMoreText}
            </Button>
          </ContentLink>
        )}
      </Stack>
    </div>
  )
}

export default StoryList
