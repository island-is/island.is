import React from 'react'

import {
  Accordion,
  AccordionItem,
  Box,
  Hidden,
  Stack,
  Typography,
  Breadcrumbs,
  BulletList,
  Bullet,
  VideoIframe,
} from '@island.is/island-ui/core'

import { CompanyCTA } from './components'
import Link from 'next/link'
import { Layout } from '@island.is/gjafakort-web/components'

const mockAccordion = [
  {
    label: 'Hvaða fyrirtæki mega taka þátt:',
    content: (
      <Stack space={3}>
        <Typography variant="p">
          Fyrirtæki sem uppfylla eitt af eftirtöldum skilyrðum og er með
          starfsstöð á Íslandi geta skráð sig í Ferðagjöfina
        </Typography>
        <BulletList type="ol">
          <Bullet>
            Fyrirtækjum með gilt leyfi Ferðamálastofu skv. III. kafla laga um
            Ferðamálastofu, nr. 96/2018.
          </Bullet>
          <Bullet>
            Fyrirtækjum með gilt rekstrarleyfi skv. 7. gr. laga um
            veitingastaði, gististaði og skemmtanahald, nr. 85/2007.
          </Bullet>
          <Bullet>
            Fyrirtækjum með gilt starfsleyfi frá viðeigandi heilbrigðisnefnd sem
            hefur verið gefið út vegna veitingastaða í flokki I, sbr. 3. mgr. 4.
            gr. laga um veitingastaði, gististaði og skemmtanahald, nr. 85/2007.
          </Bullet>
          <Bullet>
            Ökutækjaleigum með gilt starfsleyfi frá Samgöngustofu skv. 1. mgr.
            3. gr. laga um leigu skráningarskyldra ökutækja, nr. 65/2015.
          </Bullet>
          <Bullet>
            Söfnum og fyrirtækjum sem bjóða sýningu gegn endurgjaldi þar sem
            áhersla er á íslenska menningu, sögu eða náttúru.
          </Bullet>
        </BulletList>
      </Stack>
    ),
  },
  {
    label: 'Hver er hámarksfjárhæð fyrirtækja?',
    content:
      'Ferðagjöfin felur í sér ríkisaðstoð í samræmi við orðsendingu framkvæmdastjórnar Evrópusambandsins frá 19. mars 2020 (tímabundinn rammi um ríkisaðstoð til stuðnings hagkerfisins vegna yfirstandandi COVID-19-heimsfaraldurs). Samkvæmt orðsendingunni er fyrirtæki heimilt að taka við samanlagt allt að 100 millj. kr. greiðslu í formi ferðagjafa. Fyrirtæki sem metið var í rekstrarerfiðleikum 31. desember 2019 í skilningi hópundanþágureglugerðar (ESB) nr. 651/2014 getur að hámarki tekið við samanlagt 25 millj. kr. greiðslu í formi ferðagjafa.',
  },
  {
    label: 'Hvernig skanna ég gjöf með smáforriti?',
    content: (
      <VideoIframe
        src="https://www.youtube.com/embed/JqV0zeeyu9s"
        title="ísland"
      />
    ),
  },
  {
    label: 'Hvernig slæ ég inn númer gjafabréfs í vafra?',
    content: (
      <VideoIframe
        src="https://www.youtube.com/embed/JqV0zeeyu9s"
        title="ísland"
      />
    ),
  },
  {
    label: 'Hvernig beintengi ég við bókunarkerfi?',
    content: '',
  },
  {
    label: 'Hvernig er uppgjörsferlið á Ferðagjöfinni?',
    content: (
      <Stack space={3}>
        <Typography variant="p">
          Umsýsla með uppgjöri á Ferðagjöfinni fer fram í gegnum YaY ehf.
        </Typography>
        <BulletList type="ol">
          <Bullet>
            Ferðaþjónustufyrirtæki fá mánaðarlega senda söluskýrslu frá YaY ehf.
          </Bullet>
          <Bullet>
            Ferðaþjónustufyrirtæki senda reikning á YaY fyrir Ferðagjöfum
            síðasta mánaðar
          </Bullet>
          <Bullet>
            Ferðaþjónustufyrirtæki fá reikning greiddan í upphafi mánaðar
          </Bullet>
        </BulletList>
        <Typography variant="p">
          Nánari útfærsla og spurningar varðandi uppgjör má finna hjá{' '}
          <a href="mailto:info@yay.is">info@yay.is</a>
        </Typography>
      </Stack>
    ),
  },
  {
    label: 'Hvað er YaY?',
    content:
      'YaY er íslenskt frumkvöðlafyrirtæki sem sér um tæknilega umsýslu á Ferðagjöfinni.',
  },
  {
    label: 'Hvernig virkar YaY vefsvæði?',
    content:
      'Öll fyrirtæki sem skrá sig til þátttöku í Ferðagjöfinni fá aðgang að YaY vefsvæði.',
  },
]

function Companies() {
  return (
    <Layout
      left={
        <Box>
          <Box marginBottom={4}>
            <Breadcrumbs>
              <Link href="/">
                <a>Ísland.is</a>
              </Link>
              <span>Ferðaþjónustufyrirtæki</span>
            </Breadcrumbs>
          </Box>
          <Box marginBottom={[3, 3, 3, 12]}>
            <Stack space={3}>
              <Typography variant="h1" as="h1">
                Ferðaþjónustufyrirtæki
              </Typography>
              <Typography variant="intro">
                Ferðaþjónustufyrirtæki er hvött til að taka þátt í Ferðagjöfinni
                og taka á móti landsmönnum á ferðalagi innanlands.
              </Typography>
              <Typography variant="p">
                Skráning fyrirtækja í Ferðagjöfina fer fram hér á Ísland.is.
                Prókúruhafi fyrirtækis þarf að skrá þátttöku með innskráningu.
                Fyrirtæki fá sjálfvirka staðfestingu á skráningu og aðgang að
                YaY vefsvæði þar sem hægt er að fylgjast með hversu margir hafa
                nýtt Ferðagjöfina hjá viðkomandi fyrirtæki.
              </Typography>
            </Stack>
          </Box>
          <Box marginBottom={[3, 3, 3, 12]}>
            <Stack space={2}>
              <Typography variant="h4" as="h2">
                Fyrirtæki hafa þrjár leiðir til að móttaka Ferðagjöf:
              </Typography>
              <BulletList>
                <Bullet>Skanna strikamerki með smáforriti</Bullet>
                <Bullet>Slá inn númer gjafabréfs í vafra</Bullet>
                <Bullet>Beintenging við bókunarkerfi</Bullet>
              </BulletList>
            </Stack>
          </Box>
          <Hidden above="md">
            <Box marginBottom={3}>
              <CompanyCTA />
            </Box>
          </Hidden>
          <Box marginBottom={3}>
            <Typography variant="h2" as="h2">
              Algengar Spurningar
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
          <CompanyCTA />
        </Hidden>
      }
    />
  )
}

export default Companies
