import React from 'react'

import { withFigma } from '../../utils/withFigma'
import { Tabs } from './Tabs'
import { Stack } from '../Stack/Stack'
import { Typography } from '../Typography/Typography'
import { ContentBlock } from '../ContentBlock/ContentBlock'

export default {
  title: 'Navigation/Tabs',
  component: Tabs,
  parameters: withFigma('Tabs'),
}

const content1 = (
  <Stack space="gutter">
    <Typography variant="h3">Eitthvað um niðurfellingu réttar</Typography>
    <Typography variant="p">
      Réttur til fæðingarorlofs vegna fæðingar fellur niður er barnið nær 24
      mánaða aldri.
    </Typography>
    <Typography variant="p">
      Réttur til fæðingarorlofs vegna ættleiðingar eða varanlegs fóstur fellur
      niður 24 mánuðum eftir að barnið kom inn á heimilið.
    </Typography>
    <Typography variant="p">
      Réttur foreldris til fæðingarorlofs er bundinn því að það fari sjálft með
      forsjá barnsins eða hafi sameiginlega forsjá ásamt hinu foreldri þess
      þegar taka fæðingarorlofs hefst.
    </Typography>
  </Stack>
)

const content2 = (
  <Stack space="gutter">
    <Typography variant="h3">Second tab title</Typography>
    <Typography variant="p">Second tab content</Typography>
  </Stack>
)

const content3 = (
  <Stack space="gutter">
    <Typography variant="h3">Third tab title</Typography>
    <Typography variant="p">Third tab content</Typography>
  </Stack>
)

const tabs = [
  {
    label: 'Niðurfelling réttar',
    content: content1,
  },
  { label: 'Second tab', content: content2 },
  { label: 'Third tab', content: content3 },
]

export const Default = () => (
  <ContentBlock>
    <Tabs label="This is used as the aria-label as well" tabs={tabs} />
  </ContentBlock>
)
