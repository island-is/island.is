import React, { FC } from 'react'
import { Button, Typography, Stack } from '@island.is/island-ui/core'
import BigLink from './BigLink'
import IconBullet from './IconBullet'
import { Hand } from './images'
import * as styles from './ProjectStories.treat'

export interface ProjectStoriesProps {
  stories: StoryProps[]
}

const ProjectStories: FC<ProjectStoriesProps> = ({ stories }) => (
  <Stack space={8}>
    {stories.map((story, i) => (
      <Story key={i} {...story} />
    ))}
    {stories.length > 0 && (
      <div className={styles.margin}>
        <Button variant="ghost">Sjá fleiri verkefnasögur</Button>
      </div>
    )}
  </Stack>
)

export interface StoryProps {
  logo: string
  label: string
  title: string
  intro: string
}

const Story: FC<StoryProps> = ({ logo, label, title, intro }) => (
  <div className={styles.margin}>
    <div className={styles.icon}>
      <IconBullet variant="gradient" image={logo} />
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
      <BigLink color="white" href="/">
        Nánar um verkefnið
      </BigLink>
    </Stack>
  </div>
)

export default ProjectStories
