import React from 'react'
import { Text, BulletList, Bullet, Box, Link } from '@island.is/island-ui/core'

import {
  ContentContainer,
  Footer,
} from '@island.is/financial-aid-web/osk/src/components'

import { useRouter } from 'next/router'
import useFormNavigation from '@island.is/financial-aid-web/osk/src/utils/useFormNavigation'

import {
  NavigationProps,
  currentMonth,
} from '@island.is/financial-aid/shared/lib'

const AboutForm = () => {
  const router = useRouter()

  const navigation: NavigationProps = useFormNavigation(
    router.pathname,
  ) as NavigationProps

  return (
    <>
      <ContentContainer>
        <Text as="h1" variant="h2" marginBottom={2}>
          Varðandi rétt til fjárhagsaðstoðar
        </Text>

        <Text variant="h3" fontWeight="light" marginBottom={3}>
          Þú ert að sækja um <strong>fjárhagsaðstoð hjá Hafnarfirði</strong>{' '}
          fyrir {currentMonth()}. Áður en þú heldur áfram er gott að hafa
          eftirfarandi í huga:
        </Text>

        <Box marginBottom={5}>
          <BulletList type={'ul'} space={2}>
            <Bullet>
              Fjárhagsaðstoð sveitarfélaga er ætluð fólki sem er ekki með vinnu,
              í óstyrkhæfu námi og hefur ekki rétt á örorkubótum.
            </Bullet>
            <Bullet>
              Til að eiga rétt á fjárhagsaðstoð þurfa tekjur og eignir þínar að
              vera undir ákveðnum viðmiðunarmörkum.
            </Bullet>
            <Bullet>Fjárhagsaðstoð getur verið í formi láns eða styrks.</Bullet>

            <Bullet>
              Áður en þú sækir um fjárhagsaðstoð skaltu athuga hvort þú eigir
              rétt á annarskonar aðstoð. Dæmi um önnur úrræði eru{' '}
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
      </ContentContainer>

      <Footer previousUrl={navigation?.prevUrl} nextUrl={navigation?.nextUrl} />
    </>
  )
}

export default AboutForm
