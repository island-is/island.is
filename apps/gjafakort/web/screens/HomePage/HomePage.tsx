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
  Hidden,
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
    <Box marginTop={12}>
      <ContentBlock width="large">
        <Columns space={15} collapseBelow="lg">
          <Column width="2/3">
            <Box paddingLeft={[0, 0, 0, 9]}>
              <Stack space={3}>
                <Typography variant="h1" as="h1">
                  Gjöf til ferðalaga innanlands
                </Typography>
                <Typography variant="intro">
                  Allir íbúar á Íslandi 18 ára og eldri fá Ferðagjöf, stafrænt
                  gjafabréf sem hægt er að nota á ferðalögum innanlands.
                </Typography>
              </Stack>
              <Box marginBottom={[3, 3, 3, 12]} marginTop={1}>
                <Typography variant="p">
                  Ferðagjöfin er liður í aðgerðum stjórnvalda til eflingar á
                  hagkerfinu í kjölfar kórónuveirufaraldursins, og er ætlað að
                  styðja við íslenska ferðaþjónustu.
                </Typography>
              </Box>
              <Hidden above="md">
                <Box marginBottom={3}>
                  <GiftCTA />
                </Box>
              </Hidden>
              <Box marginBottom={3}>
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
            <Hidden below="lg">
              <GiftCTA />
            </Hidden>
          </Column>
        </Columns>
      </ContentBlock>
    </Box>
  )
}

const GiftCTA = () => (
  <Box>
    <Box background="purple100" padding={4} marginBottom={3}>
      <Box marginBottom={2}>
        <Typography variant="h4">Einstaklingar</Typography>
      </Box>
      <Button width="fluid">Sækja Ferðagjöf</Button>
    </Box>
    <Box background="purple100" padding={4} marginBottom={3}>
      <Box marginBottom={2}>
        <Typography variant="h4">Einstaklingar</Typography>
      </Box>
      <Button width="fluid" variant="ghost">
        Skrá fyrirtæki
      </Button>
    </Box>
    <Box textAlign="center" padding={3}>
      <img src={packageSvg} alt="" />
    </Box>
  </Box>
)

export default HomePage
