import React, { useContext } from 'react'
import {
  Text,
  BulletList,
  Bullet,
  Box,
  LinkV2,
} from '@island.is/island-ui/core'

import { currentMonth } from '@island.is/financial-aid/shared/lib'
import { AppContext } from '@island.is/financial-aid-web/osk/src/components/AppProvider/AppProvider'
import { PrivacyPolicyAccordion } from '@island.is/financial-aid-web/osk/src/components'

const AboutFormApplicant = () => {
  const { municipality } = useContext(AppContext)

  return (
    <>
      <Text as="h1" variant="h2" marginBottom={2}>
        Upplýsingar varðandi umsóknina
      </Text>

      <Text variant="h3" fontWeight="light" marginBottom={3}>
        Þú ert að sækja um fjárhagsaðstoð hjá þínu sveitarfélagi fyrir{' '}
        {currentMonth()} mánuð. Áður en þú heldur áfram er gott að hafa
        eftirfarandi í huga:
      </Text>

      <Box marginBottom={5}>
        <BulletList type={'ul'} space={2}>
          <Bullet>
            Til að eiga rétt á fjárhagsaðstoð þurfa tekjur og eignir þínar að
            vera undir ákveðnum viðmiðunarmörkum.
          </Bullet>
          <Bullet>Fjárhagsaðstoð getur verið í formi láns eða styrks.</Bullet>

          <Bullet>
            Áður en þú sækir um fjárhagsaðstoð skaltu athuga hvort þú eigir rétt
            á annarskonar aðstoð. Dæmi um önnur úrræði eru{' '}
            <LinkV2
              href="https://www.stjornarradid.is/verkefni/almannatryggingar-og-lifeyrir/almannatryggingar/"
              color="blue400"
              underline="small"
              underlineVisibility="always"
            >
              almannatryggingar
            </LinkV2>
            {', '}
            <LinkV2
              href="https://vinnumalastofnun.is/umsoknir/umsokn-um-atvinnuleysisbaetur"
              color="blue400"
              underline="small"
              underlineVisibility="always"
            >
              atvinnuleysisbætur
            </LinkV2>
            {', '}
            <LinkV2
              href="https://www.lifeyrismal.is/is/sjodirnir"
              color="blue400"
              underline="small"
              underlineVisibility="always"
            >
              lífeyrissjóðir
            </LinkV2>
            {', '}
            <LinkV2
              href="https://www.sjukra.is/"
              color="blue400"
              underline="small"
              underlineVisibility="always"
            >
              Sjúkratryggingar Íslands
            </LinkV2>{' '}
            og sjúkrasjóðir stéttarfélaga.
          </Bullet>
          <Bullet>
            Ef þú ert í lánshæfu námi gætir þú átt rétt á námsláni hjá{' '}
            <LinkV2
              href="https://menntasjodur.is/"
              color="blue400"
              underline="small"
              underlineVisibility="always"
            >
              Menntasjóði námsmanna
            </LinkV2>
            .
          </Bullet>
        </BulletList>
      </Box>
      <Text as="h2" variant="h3" marginBottom={2}>
        Vinnsla persónuupplýsinga
      </Text>

      <PrivacyPolicyAccordion municipalityHomePage={municipality?.homepage} />
    </>
  )
}

export default AboutFormApplicant
