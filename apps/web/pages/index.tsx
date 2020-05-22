// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import '@island.is/island-ui/core/reset'
import React from 'react'
import {
  ContentBlock,
  Box,
  Logo,
  Tiles,
  Accordion,
  AccordionItem,
} from '@island.is/island-ui/core'

export const Index = () => {
  return (
    <ContentBlock width="large">
      <Box padding={['smallGutter', 'containerGutter']}>
        <Accordion>
          <AccordionItem id="id_1" label="Hvenær þarf að skila umsókn?">
            Hægt er að senda umsóknir og önnur gögn með pósti, tölvupósti eða
            faxi. Læknisvottorð verða að berast með pósti þar sem við þurfum
            frumritið.
          </AccordionItem>
          <AccordionItem
            id="id_2"
            label="Er hægt að leggja inn greiðslur á bankareikning maka?"
          >
            Hægt er að senda umsóknir og önnur gögn með pósti, tölvupósti eða
            faxi. Læknisvottorð verða að berast með pósti þar sem við þurfum
            frumritið.
          </AccordionItem>
          <AccordionItem id="id_3" label="Hvernig kem ég umsókninni til ykkar?">
            Hægt er að senda umsóknir og önnur gögn með pósti, tölvupósti eða
            faxi. Læknisvottorð verða að berast með pósti þar sem við þurfum
            frumritið.
          </AccordionItem>
        </Accordion>
      </Box>
      <Box background="blue200" padding={['smallGutter', 'containerGutter']}>
        <Tiles space={['smallGutter', 'gutter']} columns={[1, 2, 3, 4, 5]}>
          <Box background="white" padding="gutter">
            <div>
              <h3>Stuff here</h3>
              <Logo width={140} />
            </div>
          </Box>
          <Box background="white" padding="gutter">
            <div>
              <h3>Stuff here</h3>
              <Logo width={140} />
            </div>
          </Box>
          <Box background="white" padding="gutter">
            <div>
              <h3>Stuff here</h3>
              <Logo width={140} />
            </div>
          </Box>
          <Box background="white" padding="gutter">
            <div>
              <h3>Stuff here</h3>
              <Logo width={140} />
            </div>
          </Box>
          <Box background="white" padding="gutter">
            <div>
              <h3>Stuff here</h3>
              <Logo width={140} />
            </div>
          </Box>
          <Box background="white" padding="gutter">
            <div>
              <h3>Stuff here</h3>
              <Logo width={140} />
            </div>
          </Box>
          <Box background="white" padding="gutter">
            <div>
              <h3>Stuff here</h3>
              <Logo width={140} />
            </div>
          </Box>
          <Box background="white" padding="gutter">
            <div>
              <h3>Stuff here</h3>
              <Logo width={140} />
            </div>
          </Box>
          <Box background="white" padding="gutter">
            <div>
              <h3>Stuff here</h3>
              <Logo width={140} />
            </div>
          </Box>
          <Box background="white" padding="gutter">
            <div>
              <h3>Stuff here</h3>
              <Logo width={140} />
            </div>
          </Box>
          <Box background="white" padding="gutter">
            <div>
              <h3>Stuff here</h3>
              <Logo width={140} />
            </div>
          </Box>
          <Box background="white" padding="gutter">
            <div>
              <h3>Stuff here</h3>
              <Logo width={140} />
            </div>
          </Box>
          <Box background="white" padding="gutter">
            <div>
              <h3>Stuff here</h3>
              <Logo width={140} />
            </div>
          </Box>
        </Tiles>
      </Box>
    </ContentBlock>
  )
}

export default Index
