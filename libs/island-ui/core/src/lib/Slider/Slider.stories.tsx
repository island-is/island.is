import React from 'react'
import { ContentBlock, Box, SlideCard } from '../..'
import { Slider } from './Slider'

import imgFerdagjof from '../../assets/ferdagjof.jpg'
import img1 from '../../assets/image1.jpg'
import img2 from '../../assets/image2.jpg'
import img3 from '../../assets/image3.jpg'

export default {
  title: 'Components/Slider',
  component: Slider,
}

const defaults = {
  title: 'Ferðumst innanlands í sumar',
  subTitle: 'Ferðagjöf',
  description:
    'Allir íbúar á Íslandi 18 ára og eldri fá Ferðagjöf, stafrænt gjafabréf sem hægt er að nota á ferðalögum innanlands.',
  linkText: 'Nánar um ferðagjöf',
  link: '#',
}

const cards = [
  {
    img: imgFerdagjof,
    ...defaults,
  },
  {
    img: imgFerdagjof,
    ...defaults,
    description: 'A small description...',
  },
  {
    img: img1,
    subTitle: 'Opniberir vefir',
    title: 'Heilsuvera',
    description:
      'Vefur fyrir almenning um heilsu og áhrifaþætti hennar, þar sem hægt er að eiga í samskiptum við starfsfólk heilbrigðisþjónustunnar og nálgast gögn úr eigin sjúkraskrá.',
    linkText: 'Heilsuvera.is',
    link: '//heilsuvera.is',
  },
  {
    img: img2,
    subTitle: 'Opniberir vefir',
    title: 'Opinber nýsköpun',
    description:
      'Nýsköpun innan opinberra vinnustaða er margvísleg og getur verið allt frá því að breyta verkferlum yfir í að vinna að stórum markmiðum samfélagsins.',
    linkText: 'Opinbernyskopun.island.is',
    link: '//opinbernyskopun.island.is',
  },
  {
    img: img3,
    subTitle: 'Opniberir vefir',
    title: 'Samráðsgátt',
    description:
      'Samráðsgátt greiðir leið hagsmunaaðila, almennings og félagasamtaka að opinberum samráðsferlum sem mögulegt er að taka þátt í.',
    linkText: 'Samradsgatt.island.is',
    link: '//samradsgatt.island.is',
  },
  {
    img: img1,
    ...defaults,
  },
  {
    img: img2,
    ...defaults,
  },
  {
    img: img3,
    ...defaults,
  },
]

export const Basic = () => {
  return (
    <ContentBlock>
      <Box width="full" paddingY={6} overflow="hidden">
        <Slider
          title="Vefir hins opinbera"
          boxProps={{
            paddingLeft: [3, 3, 6],
            paddingRight: [8, 8, 6],
          }}
        >
          {cards.map((card, index) => (
            <SlideCard key={index} {...card} />
          ))}
        </Slider>
      </Box>
    </ContentBlock>
  )
}
