import React from 'react'
import Link from 'next/link'

import {
  Box,
  Button,
  Typography,
  BulletList,
  Bullet,
  Stack,
} from '@island.is/island-ui/core'
import { FormLayout } from '@island.is/gjafakort-web/components'

function NoConnection() {
  return (
    <FormLayout>
      <Box marginBottom={2}>
        <Typography variant="h1" as="h1">
          Því miður
        </Typography>
      </Box>
      <Box marginBottom={6}>
        <Stack space={3}>
          <Typography variant="intro">
            Því miður fellur fyrirtæki þitt ekki undir skilyrði til þátttöku
            fyrirtæka í Ferðagjöfinni.
          </Typography>
          <Typography variant="p">
            Einstaklingur getur notað ferðagjöf til greiðslu hjá fyrirtækjum sem
            uppfylla eitt af eftirfarandi skilyrðum og hafa starfsstöð á
            Íslandi:
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
              Fyrirtækjum með gilt starfsleyfi frá viðeigandi heilbrigðisnefnd
              sem hefur verið gefið út vegna veitingastaða í flokki I, sbr. 3.
              mgr. 4. gr. laga um veitingastaði, gististaði og skemmtanahald,
              nr. 85/2007.
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
          <Typography variant="p">
            Nánari upplýsingar og spurningar varðandi þátttöku fyrirtækja
            beinast til Ferðamálastofu,{' '}
            <a href="mailto:grunnur@ferdamalastofa.is">
              grunnur@ferdamalastofa.is
            </a>
          </Typography>
        </Stack>
      </Box>
      <Link href="/fyrirtaeki/umsokn">
        <span>
          <Button variant="text">Tilbaka</Button>
        </span>
      </Link>
    </FormLayout>
  )
}

export default NoConnection
