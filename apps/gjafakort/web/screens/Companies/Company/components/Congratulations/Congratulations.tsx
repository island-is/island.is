import React from 'react'
import {
  ContentBlock,
  Columns,
  Column,
  Box,
  Typography,
  Stack,
  Accordion,
  AccordionItem,
  Button,
  Icon,
} from '@island.is/island-ui/core'

import packageSvg from '../../../../../assets/ferdagjof-pakki.svg'

const mockAccordion = [
  {
    label: 'Hvernig tengi ég við kerfið?',
    content: '',
  },
  {
    label: 'Hvaða fyrirtæki mega taka þátt?',
    content: '',
  },
]

function Congratulations() {
  return (
    <Box marginTop={12}>
      <ContentBlock width="large">
        <Columns space={15} collapseBelow="lg">
          <Column width="2/3">
            <Box paddingLeft={[0, 0, 0, 9]}>
              <Box marginBottom={6}>
                <Stack space={3}>
                  <Typography variant="h1" as="h1">
                    Til hamingju
                  </Typography>
                  <Typography variant="intro">
                    Til þess að sjá nánar skráir þú þig inná kerfið hjá Yay
                  </Typography>
                </Stack>
              </Box>
              <Box marginBottom={15}>
                <Button variant="text" size="large">
                  Áfram til Yay{' '}
                  <Box marginLeft={1} alignItems="center" display="flex">
                    <Icon type="arrow" width={16} />
                  </Box>
                </Button>
              </Box>
              <Accordion dividerOnTop={false}>
                {mockAccordion.map((accordionItem, index) => (
                  <AccordionItem
                    key={index}
                    label={accordionItem.label}
                    id={index.toString()}
                  >
                    <Typography variant="p">{accordionItem.content}</Typography>
                  </AccordionItem>
                ))}
              </Accordion>
            </Box>
          </Column>

          <Column width="1/3">
            <Box textAlign="center" padding={3}>
              <img src={packageSvg} alt="" />
            </Box>
          </Column>
        </Columns>
      </ContentBlock>
    </Box>
  )
}

export default Congratulations
