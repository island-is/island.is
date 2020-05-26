import React from 'react'
import Accordion from './Accordion'
import { ContentBlock } from '../ContentBlock'
import { Box } from '../Box'
import { AccordionItem } from '../AccordionItem/AccordionItem'
import { Typography } from '../Typography/Typography'
import { boolean } from '@storybook/addon-knobs'

export default {
  title: 'Components/Accordion',
  component: Accordion,
}

export const Basic = () => {
  const singleExpand = boolean('Single expand?', true)

  return (
    <ContentBlock>
      <Box paddingY={[1, 2]}>
        <Accordion singleExpand={singleExpand}>
          <AccordionItem id="id_1" label="Hvenær þarf að skila umsókn?">
            <Typography variant="p" as="p">
              Hægt er að senda umsóknir og önnur gögn með pósti, tölvupósti eða
              faxi. Læknisvottorð verða að berast með pósti þar sem við þurfum
              frumritið.
            </Typography>
          </AccordionItem>
          <AccordionItem
            id="id_2"
            label="Er hægt að leggja inn greiðslur á bankareikning maka?"
          >
            <Typography variant="p" as="p">
              Hægt er að senda umsóknir og önnur gögn með pósti, tölvupósti eða
              faxi. Læknisvottorð verða að berast með pósti þar sem við þurfum
              frumritið.
            </Typography>
          </AccordionItem>
          <AccordionItem id="id_3" label="Hvernig kem ég umsókninni til ykkar?">
            <Typography variant="p" as="p">
              Hægt er að senda umsóknir og önnur gögn með pósti, tölvupósti eða
              faxi. Læknisvottorð verða að berast með pósti þar sem við þurfum
              frumritið.
            </Typography>
          </AccordionItem>
        </Accordion>
      </Box>
    </ContentBlock>
  )
}
