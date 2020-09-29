import React, { FC } from 'react'
import { Button, Typography, Stack, Link } from '@island.is/island-ui/core'
import IconBullet from '../IconBullet/IconBullet'
import { Link as LinkType } from '@island.is/web/graphql/schema'
import { useI18n } from '@island.is/web/i18n'
import routeNames from '@island.is/web/routes'

import * as styles from './StoryList.treat'

export interface StoryProps {
  logoUrl: string
  label: string
  title: string
  intro: string
  readMoreText: string
  storyLink?: LinkType
}

export interface StoryListProps {
  readMoreText: string
  stories: StoryProps[]
}

export const StoryList: FC<StoryListProps> = ({ stories }) => (
  <Stack space={8}>
    {stories.map((story, i) => (
      <Story key={i} {...story} />
    ))}
  </Stack>
)

const Story: FC<StoryProps> = ({
  logoUrl,
  label,
  title,
  intro,
  readMoreText,
  storyLink,
}) => {
  const { activeLocale } = useI18n()
  const { getLinkProps } = routeNames(activeLocale)

  const linkProps = storyLink?.linkReference
    ? getLinkProps(storyLink.linkReference)
    : null

  const href = storyLink?.url

  console.log(linkProps, href)

  return (
    <div className={styles.margin}>
      <div className={styles.icon}>
        <IconBullet variant="gradient" image={logoUrl} />
      </div>
      <Stack space={2}>
        <Typography variant="eyebrow" color="white">
          {label}
        </Typography>
        <Typography variant="h2" as="h2" color="white">
          {title}
        </Typography>
        <Typography variant="p" color="white">
          {intro}
        </Typography>
        {!!(href || linkProps) && (
          <Link href={href} {...linkProps} passHref pureChildren>
            <Button variant="text" size="medium" white icon="arrowRight">
              {readMoreText}
            </Button>
          </Link>
        )}
      </Stack>
    </div>
  )
}

export default StoryList
