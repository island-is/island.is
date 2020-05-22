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
} from '@island.is/island-ui/core'
import packageSvg from '../../assets/ferdagjof-pakki.svg'

const mockAccordion = [
  {
    label: 'Hverjir fá Ferðagjöf?',
    content:
      'Allir íbúar á Íslandi með íslenska kennitölu og eru fæddir árið 2002 og fyrr fá Ferðgjöf að andvirði 5.000 kr. ',
  },
  {
    label: 'Hvernig nota ég Ferðagjöfina?',
    content:
      'Einfalt er að nýta gjöfina sem má nálgast í smáforritinu "Ferðagjöf".  Þegar nýta á gjöfina skannar ferðaþjónustufyrirtæki strikamerki í smáforritinu. Einnig má nálgast strikamerkið á island.is.',
  },
  {
    label: 'Hvar get ég notað Ferðagjöfina?',
    content:
      'Hægt er að nýta gjöfina hjá fjölmörgum ferðaþjónustufyrirtækjum viðsvegar um landið.  Á www.ferdalag.is má sjá yfirlit hvar hægt er að nýta gjöfina.',
  },
  {
    label: 'Get ég gefið Ferðagjöfina áfram?',
    content: '',
  },
  {
    label: 'Hver er gildistími Ferðagjafarinnar?',
    content: '',
  },
  {
    label: 'Hvaða fyrirtæki mega taka þátt?',
    content: '',
  },
]

function HomePage() {
  return (
    <Box marginTop="spacer12">
      <ContentBlock width="large">
        <Columns space="spacer15" collapseBelow="lg">
          <Column width="2/3">
            <Box paddingLeft={['spacer0', 'spacer9']}>
              <Stack space="spacer3">
                <Typography variant="h1" as="h1">
                  Gjöf til ferðalaga innanlands
                </Typography>
                <Typography variant="intro">
                  Allir íbúar á Íslandi 18 ára og eldri fá Ferðagjöf, stafrænt
                  gjafabréf sem hægt er að nota á ferðalögum innanlands.
                </Typography>
              </Stack>
              <Box marginBottom="spacer13" marginTop="spacer1">
                <Typography variant="p">
                  Ferðagjöfin er liður í aðgerðum stjórnvalda til eflingar á
                  hagkerfinu í kjölfar kórónuveirufaraldursins, og er ætlað að
                  styðja við íslenska ferðaþjónustu.
                </Typography>
              </Box>
              <Box marginBottom="spacer3">
                <Typography variant="h2" as="h2">
                  Algengar spurningar
                </Typography>
              </Box>
              <Accordion dividerOnTop={false}>
                {mockAccordion.map((accordionItem, index) => (
                  <AccordionItem
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
            <GiftCTA />
          </Column>
        </Columns>
      </ContentBlock>
    </Box>
  )
}

const GiftCTA = () => (
  <Box>
    <Box background="purple100" padding="spacer4" marginBottom="spacer3">
      <Box marginBottom="spacer2">
        <Typography variant="h4">Einstaklingar</Typography>
      </Box>
      <Button>Sækja Ferðagjöf</Button>
    </Box>
    <Box background="purple100" padding="spacer4" marginBottom="spacer3">
      <Box marginBottom="spacer2">
        <Typography variant="h4">Einstaklingar</Typography>
      </Box>
      <Button variant="ghost">Skrá fyrirtæki</Button>
    </Box>
    <Box textAlign="center" padding="spacer3">
      <img src={packageSvg} alt="" />
    </Box>
  </Box>
)

export default HomePage
