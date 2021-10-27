import React, { useContext } from 'react'
import { Text, BulletList, Bullet, Box, Link } from '@island.is/island-ui/core'

import { currentMonth } from '@island.is/financial-aid/shared/lib'
import { AppContext } from '@island.is/financial-aid-web/osk/src/components/AppProvider/AppProvider'

const AboutFormApplicant = () => {
  const { municipality } = useContext(AppContext)

  return (
    <>
      <Text as="h1" variant="h2" marginBottom={2}>
        Varðandi rétt til fjárhagsaðstoðar
      </Text>

      <Text variant="h3" fontWeight="light" marginBottom={3}>
        Þú ert að sækja um{' '}
        <strong>fjárhagsaðstoð hjá {municipality?.name}</strong> fyrir{' '}
        {currentMonth()}. Áður en þú heldur áfram er gott að hafa eftirfarandi í
        huga:
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
            <Link
              href="https://www.stjornarradid.is/verkefni/almannatryggingar-og-lifeyrir/almannatryggingar/"
              color="blue400"
              underline="small"
              underlineVisibility="always"
            >
              almannatryggingar
            </Link>
            {', '}
            <Link
              href="https://vinnumalastofnun.is/umsoknir/umsokn-um-atvinnuleysisbaetur"
              color="blue400"
              underline="small"
              underlineVisibility="always"
            >
              atvinnuleysisbætur
            </Link>
            {', '}
            <Link
              href="https://www.lifeyrismal.is/is/sjodirnir"
              color="blue400"
              underline="small"
              underlineVisibility="always"
            >
              lífeyrissjóðir
            </Link>
            {', '}
            <Link
              href="https://www.sjukra.is/"
              color="blue400"
              underline="small"
              underlineVisibility="always"
            >
              Sjúkratryggingar Íslands
            </Link>{' '}
            og sjúkrasjóðir stéttarfélaga.
          </Bullet>
          <Bullet>
            Ef þú ert í lánshæfu námi gætir þú átt rétt á námsláni hjá{' '}
            <Link
              href="https://menntasjodur.is/"
              color="blue400"
              underline="small"
              underlineVisibility="always"
            >
              Menntasjóði námsmanna
            </Link>
            .
          </Bullet>
        </BulletList>
      </Box>
    </>
  )
}

export default AboutFormApplicant
