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
    <Story
      logo=""
      partner="Aranja"
      title="Viðspyrna"
      intro="Í kjölfar kórónuveirufaraldursins gripu stjórnvöld til ýmissa úrræða til að aðstoða fyrirtæki við að komast yfir mesta hjallann. Þar á meðal voru stuðnings- og brúarlán, ætluð fyrirtækjum sem orðið höfðu af tekjum í samkomubanninu."
    />
    <div className={styles.margin}>
      <Button variant="ghost">Sjá fleiri verkefnasögur</Button>
    </div>
  </Stack>
)

interface StoryProps {
  logo: string
  partner: string
  title: string
  intro: string
}

const Story: FC<StoryProps> = ({ logo, partner, title, intro }) => (
  <div className={styles.margin}>
    <div className={styles.icon}>
      <IconBullet variant="gradient">
        <Hand />
      </IconBullet>
    </div>
    <Stack space={2}>
      <Typography variant="eyebrow" color="white">
        {partner}
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
