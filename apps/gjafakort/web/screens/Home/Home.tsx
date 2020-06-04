import React from 'react'

import {
  Accordion,
  AccordionItem,
  Box,
  Hidden,
  Stack,
  Typography,
  Breadcrumbs,
} from '@island.is/island-ui/core'

import { GiftCTA } from './components'
import Link from 'next/link'
import { Layout } from '../../components'

const mockAccordion = [
  {
    label: 'Hverjir fá Ferðagjöf?',
    content:
      'Allir einstaklingar með íslenska kennitölu og eru fæddir árið 2002 eða fyrr fá Ferðagjöf.',
  },
  {
    label: 'Hvernig nota ég Ferðagjöfina?',
    content: (
      <Stack space={1}>
        <Typography variant="p">
          Til að nýta Ferðagjöfina þarf að sækja gjöfina hér á Ísland.is með
          innskráningu. Sótt er smáforritið Ferðagjöf í App eða Play store og
          strikamerki skannað við kaupa á þjónustu.
        </Typography>
        <Typography variant="p">
          Einnig er hægt að nýta Ferðagjöfina beint inn á Ísland.is fyrir þá sem
          ekki eru með snjallsíma.
        </Typography>
      </Stack>
    ),
  },
  {
    label: 'Hvar get ég notað Ferðagjöfina?',
    content:
      'Ferðagjöfina má nýta hjá Ferðaþjónustufyrirtækjum viðsvegar um landið.  Sjá má yfirlit yfir fyrirtæki sem hafa skráð sig til þátttöku á Ferðalag.is og í smáforritinu Ferðagjöf',
  },
  {
    label: 'Get ég gefið Ferðagjöfina áfram?',
    content:
      'Allir eru hvattir til að nýta gjöfina en heimilt er að gefa eigin gjöf, hver einstaklingur getur þó að hámarki nýtt 15 Ferðagjafir.',
  },
  {
    label: 'Hver er gildistími Ferðagjafarinnar?',
    content: 'Ferðagjöfin er í gildi til 31.desember 2020.  ',
  },
]

function Home() {
  return (
    <Layout
      left={
        <Box>
          <Box marginBottom={4}>
            <Breadcrumbs>
              <Link href="/">
                <a>Ísland.is</a>
              </Link>
              <span>Ferðagjöf</span>
            </Breadcrumbs>
          </Box>
          <Box marginBottom={[3, 3, 3, 12]} marginTop={1}>
            <Stack space={3}>
              <Typography variant="h1" as="h1">
                Gjöf til ferðalaga innanlands
              </Typography>
              <Typography variant="intro">
                Búum til minningar á ferðalagi innanlands og styðjum við bakið á
                íslenskri ferðaþjónustu
              </Typography>
              <Typography variant="p">
                Allir einstaklingar 18 ára og eldri fá Ferðagjöf að andvirði
                5.000 kr. Gjöfin er liður í því að styðja við bakið á íslenskri
                ferðaþjónustu í kjölfar kórónufaraldurs og efla þannig íslenska
                ferðaþjónustu sem og hvetja landsmenn til að eiga góðar stundir
                á ferðalagi víðsvegar um landið.
              </Typography>
            </Stack>
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
                key={index}
                label={accordionItem.label}
                id={index.toString()}
              >
                {typeof accordionItem.content === 'string' ? (
                  <Typography variant="p">{accordionItem.content}</Typography>
                ) : (
                  accordionItem.content
                )}
              </AccordionItem>
            ))}
          </Accordion>
        </Box>
      }
      right={
        <Hidden below="lg">
          <GiftCTA />
        </Hidden>
      }
    />
  )
}

export default Home
