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

import packageSvg from '@island.is/gjafakort-web/assets/ferdagjof-pakki.svg'
import Layout from '@island.is/gjafakort-web/components/Layout/Layout'

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
    <Layout
      left={
        <Box>
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
                <Icon type="arrowRight" width={16} />
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
      }
      right={
        <Box textAlign="center" padding={3}>
          <img src={packageSvg} alt="" />
        </Box>
      }
    />
  )
}

export default Congratulations
