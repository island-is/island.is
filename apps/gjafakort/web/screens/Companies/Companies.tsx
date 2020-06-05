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
          Fyrirtæki sem uppfylla eitt af eftirtöldum skilyrðum og eru með
          starfsstöð á Íslandi geta skráð sig í Ferðagjöfina:
        </Typography>
        <BulletList type="ol">
          <Bullet>
            Fyrirtæki með gilt leyfi Ferðamálastofu skv. III. kafla laga um
            Ferðamálastofu, nr. 96/2018.
          </Bullet>
          <Bullet>
            Fyrirtæki með gilt rekstrarleyfi skv. 7. gr. laga um veitingastaði,
            gististaði og skemmtanahald, nr. 85/2007.
          </Bullet>
          <Bullet>
            Fyrirtæki með gilt starfsleyfi frá viðeigandi heilbrigðisnefnd sem
            hefur verið gefið út vegna veitingastaða í flokki I, sbr. 3. mgr. 4.
            gr. laga um veitingastaði, gististaði og skemmtanahald, nr. 85/2007.
          </Bullet>
          <Bullet>
            Ökutækjaleigur með gilt starfsleyfi frá Samgöngustofu skv. 1. mgr.
            3. gr. laga um leigu skráningarskyldra ökutækja, nr. 65/2015.
          </Bullet>
          <Bullet>
            Söfn og fyrirtæki sem bjóða sýningu gegn endurgjaldi þar sem áhersla
            er á íslenska menningu, sögu eða náttúru.
          </Bullet>
        </BulletList>
        <Typography variant="p">
          Nánari upplýsingar og spurningar varðandi þátttöku fyrirtækja beinast
          til Ferðamálastofu,{' '}
          <a href="mailto:grunnur@ferdamalastofa.is">
            grunnur@ferdamalastofa.is
          </a>
          .
        </Typography>
      </Stack>
    ),
  },
  {
    label: 'Hver er hámarksfjárhæð fyrirtækja?',
    content: (
      <Stack space={3}>
        <Typography variant="p">
          Ferðagjöfin felur í sér ríkisaðstoð í skilningi EES-samningsins.
          Samkvæmt tímabundnum reglum um ríkisaðstoð til stuðnings hagkerfisins
          vegna yfirstandandi Covid-19 heimsfaraldurs, frá 19. mars 2020, er
          fyrirtæki heimilt að taka við samanlagt allt að 100 millj. kr.
          greiðslu í formi ferðagjafa, að meðtalinni annarri ríkisaðstoð.
          Fyrirtæki sem var í rekstrarerfiðleikum 31. desember 2019 í skilningi
          hópundanþágureglugerðar (ESB) nr. 651/2014 getur að hámarki tekið við
          samanlagt 25 millj. kr. greiðslu í formi ferðagjafa, að meðtalinni
          annarri ríkisaðstoð.
        </Typography>
        <Typography variant="p">
          Fyrirtæki telst hafa verið í fjárhagserfiðleikum á þeim tímapunkti ef
          a.m.k. eitt af eftirfarandi skilyrðum er uppfyllt, samanber skilyrði í
          tímabundnum reglum um ríkisaðstoð til stuðnings hagkerfisins vegna
          yfirstandandi heimsfaraldurs, frá 19. mars 2020:
        </Typography>
        <BulletList type="ol">
          <Bullet>
            Um er að ræða félag með takmarkaðri ábyrgð og bókfært eigið fé þess,
            samkvæmt viðurkenndum reikningsskilaaðferðum, er orðið lægra en
            nemur helmingi innborgaðs hlutafjár að meðtöldum yfirverðsreikningi.
          </Bullet>
          <Bullet>
            Um er að ræða félag þar sem a.m.k. einn aðili ber ótakmarkaða ábyrgð
            á skuldum félagsins og bókfært eigið fé þess, samkvæmt viðurkenndum
            reikningsskilaaðferðum, er orðið lægra en nemur helmingi innborgaðs
            hlutafjár að meðtöldum yfirverðsreikningi.
          </Bullet>
          <Bullet>
            Um er að ræða fyrirtæki sem sætir gjaldþrotameðferð eða uppfyllir
            skilyrði um að vera tekið til gjaldþrotameðferðar að beiðni
            kröfuhafa.
          </Bullet>
          <Bullet>
            Um er að ræða fyrirtæki sem hefur fengið björgunaraðstoð í skilningi
            leiðbeinandi reglna Eftirlitsstofnunar EFTA (ESA) um björgun og
            endurskipulagningu fyrirtækja, og hefur enn ekki endurgreitt lánið
            eða aflétt ábyrgðinni eða hefur fengið aðstoð til
            endurskipulagningar og er því enn bundið af samþykktri áætlun um
            endurskipulagningu.
          </Bullet>
          <Bullet>
            Eftirtalin skilyrði hafa átt við síðustu tvö reikningsár: a)
            hlutfall milli bókfærðra skulda fyrirtækisins og eigin fjár hefur
            verið hærra en 7,5 og b) hagnaður fyrir afskriftir og vexti (EBITDA)
            nemur lægri fjárhæð en nettófjármagnskostnaður ársins.
          </Bullet>
        </BulletList>
        <Typography variant="p">
          Skilyrði (1) og (2) eiga ekki við um fyrirtæki sem er lítið eða
          meðalstórt, hafi starfsemi þess staðið yfir í þrjú ár eða skemur.
        </Typography>
        <Typography variant="p">
          Skilyrði (5) á ekki við um fyrirtæki sem er lítið eða meðalstórt.
        </Typography>
        <Typography variant="p">
          Um skilgreiningu á litlum og meðalstórum fyrirtækjum fer eftir lögum
          um ársreikninga nr. 3/2006.
        </Typography>
      </Stack>
    ),
  },
  /*{
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
  }, */
  {
    label: 'Hvernig beintengi ég við bókunarkerfi?',
    content: (
      <Typography variant="p">
        Fyrirtæki geta beintengt Ferðagjöfina við kassa- og/eða bókunarkerfi.
        Með beintengingu má nýta Ferðagjöfina sem gjafakóða þegar bókað er á
        vef. <br />
        Nánari upplýsingar varðandi beintengingu má finna hjá{' '}
        <a href="mailto:info@yay.is">info@yay.is</a>
      </Typography>
    ),
  },
  {
    label: 'Hvernig er uppgjörsferlið á Ferðagjöfinni?',
    content: (
      <Stack space={3}>
        <Typography variant="p">
          Umsýsla með uppgjöri á Ferðagjöfinni.
        </Typography>
        <BulletList type="ol">
          <Bullet>
            Ferðaþjónustufyrirtæki fá mánaðarlega sendar söluskýrslu um nýtingu
            á Ferðagjöfinni
          </Bullet>
          <Bullet>
            Ferðaþjónustufyrirtæki frá greitt mánaðarlega skv. söluskýrslu
          </Bullet>
        </BulletList>
      </Stack>
    ),
  },
  {
    label: 'Hvar er hægt að fylgjast með nýtingu á Ferðagjöfinni?',
    content:
      'Öll fyrirtæki sem skrá sig til þátttöku í Ferðagjöfinni fá aðgang að vefsvæði til að geta fylgst með innlausnum á Ferðagjöfinni. Um leið og gjöf er nýtt kemur hún inn á notkunarskýrslu fyrirtækis.',
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
                Ferðaþjónustufyrirtæki eru hvött til að taka þátt í
                Ferðagjöfinni og taka á móti landsmönnum á ferðalagi innanlands.
              </Typography>
              <Typography variant="p">
                Skráning fyrirtækja í Ferðagjöfina fer fram hér á Ísland.is.
                Prókúruhafi fyrirtækis þarf að skrá þátttöku með innskráningu.
                Fyrirtæki fá sjálfvirka staðfestingu á skráningu og aðgang að
                vefsvæði þar sem hægt er að fylgjast með hversu margir hafa nýtt
                Ferðagjöfina hjá viðkomandi fyrirtæki.
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
          <CompanyCTA />
        </Hidden>
      }
    />
  )
}

export default Companies
