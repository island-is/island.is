import React from 'react'
import { ContentBlock, Box } from '../..'
import { SlideCard } from './SlideCard'

import ferdagjof from '../../assets/ferdagjof.jpg'

export default {
  title: 'Components/SlideCard',
  component: SlideCard,
}

export const Basic = () => {
  return (
    <ContentBlock>
      <Box padding={2}>
        <SlideCard
          img={ferdagjof}
          title="Ferðumst innanlands í sumar"
          subTitle="Ferðagjöf"
          description="Allir íbúar á Íslandi 18 ára og eldri fá Ferðagjöf, stafrænt gjafabréf sem hægt er að nota á ferðalögum innanlands."
          linkText="Nánar um ferðagjöf"
          link="#"
        />
      </Box>
    </ContentBlock>
  )
}
