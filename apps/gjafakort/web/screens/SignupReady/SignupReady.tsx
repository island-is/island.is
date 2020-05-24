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
import packageSvg from '../../assets/ferdagjof-pakki.svg'

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

function SignupReady() {
  return (
    <Box marginTop="spacer12">
      <ContentBlock width="large">
        <Columns space="spacer15" collapseBelow="lg">
          <Column width="2/3">
            <Box paddingLeft={['spacer0', 'spacer0', 'spacer0', 'spacer9']}>
              <Box marginBottom="spacer6">
                <Stack space="spacer3">
                  <Typography variant="h1" as="h1">
                    Til hamingju
                  </Typography>
                  <Typography variant="intro">
                    Til þess að sjá nánar skráir þú þig inná kerfið hjá Yay
                  </Typography>
                </Stack>
              </Box>
              <Box marginBottom="spacer15">
                <Button variant="text" size="large">
                  Áfram til Yay{' '}
                  <Box marginLeft="spacer1" alignItems="center" display="flex">
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
            <Box textAlign="center" padding="spacer3">
              <img src={packageSvg} alt="" />
            </Box>
          </Column>
        </Columns>
      </ContentBlock>
    </Box>
  )
}

export default SignupReady
