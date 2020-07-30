import React, { FC } from 'react'
import { Button, Typography, Stack } from '@island.is/island-ui/core'
import { StorySlice as ApiStorySlice, Story as ApiStory } from '@island.is/api/schema'
import IconBullet from '@island.is/web/screens/About/IconBullet'
import * as styles from './StorySlice.treat'

export const StorySlice: FC<ApiStorySlice> = ({ readMoreText, stories }) => (
  <Stack space={8}>
    {stories.map((story, i) => (
      <Story key={i} {...story} />
    ))}
    {stories.length > 0 && (
      <div className={styles.margin}>
        <Button variant="ghost">{readMoreText}</Button>
      </div>
    )}
  </Stack>
)

const Story: FC<ApiStory> = ({ logo, label, title, intro, readMoreText }) => (
  <div className={styles.margin}>
    <div className={styles.icon}>
      <IconBullet variant="gradient" image={logo.url} />
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
      <Button variant="text" size="medium">
        {readMoreText}
      </Button>
    </Stack>
  </div>
)

export default StorySlice
