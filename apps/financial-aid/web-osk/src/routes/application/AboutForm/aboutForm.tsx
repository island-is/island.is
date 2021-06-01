import React, { useEffect, useState, useCallback, useContext } from 'react'
import { Text, BulletList, Bullet, Box, Link } from '@island.is/island-ui/core'

import {
  FormContentContainer,
  FormFooter,
  FormLayout,
} from '@island.is/financial-aid-web/osk/src/components'

import { FormContext } from '@island.is/financial-aid-web/osk/src/components/FormProvider/FormProvider'

import * as styles from './aboutForm.treat'
import cn from 'classnames'

import { useRouter } from 'next/router'
import useFormNavigation from '@island.is/financial-aid-web/osk/src/utils/useFormNavigation'

import { NavigationProps } from '@island.is/financial-aid/shared'

const AddressForm = () => {
  const router = useRouter()

  const { form, updateForm } = useContext(FormContext)
  const [error, setError] = useState(false)

  const navigation: NavigationProps = useFormNavigation(
    router.pathname,
  ) as NavigationProps

  const bulletPoints = [
    'Fjárhagsaðstoð sveitarfélaga er ætlað fólki sem er ekki með vinnu, í óstyrkhæfu námi og hefur ekki rétt á örorkubótum.',
    'Til að eiga rétt á fjárhagsaðstoð þurfa tekjur og eignir þínar að vera undir ákveðnum viðmiðunarmörkum.',
    'Fjárhagsaðstoð getur verið í formi láns eða styrks.',
  ]

  const suggestedLinks = [
    {
      text: 'almannatryggingar',
      url:
        'https://www.stjornarradid.is/verkefni/almannatryggingar-og-lifeyrir/almannatryggingar/',
    },
    {
      text: 'atvinnuleysisbætur',
      url: 'https://vinnumalastofnun.is/umsoknir/umsokn-um-atvinnuleysisbaetur',
    },
    {
      text: 'lífeyrissjóðir',
      url: 'https://www.lifeyrismal.is/is/sjodirnir',
    },
  ]
  return (
    <FormLayout
      activeSection={navigation?.activeSectionIndex}
      activeSubSection={navigation?.activeSubSectionIndex}
    >
      <FormContentContainer>
        <Text as="h1" variant="h2" marginBottom={2}>
          Varðandi rétt til fjárhagsaðstoðar
        </Text>

        <Text variant="h3" fontWeight="light" marginBottom={3}>
          Þú ert að sækja um <strong>fjárhagsaðstoð hjá Hafnarfirði</strong>.
          Áður en þú heldur áfram er gott að hafa eftirfarandi í huga:
        </Text>

        <Box marginBottom={5}>
          <BulletList type={'ul'} space={2}>
            {bulletPoints.map((item) => {
              return <Bullet>{item}</Bullet>
            })}
            <Bullet>
              Áður en þú sækir um fjárhagsaðstoð skaltu athuga hvort þú eigir
              rétt á annarskonar aðstoð. Dæmi um önnur úrræði eru{' '}
              {suggestedLinks.map((item, index) => {
                return (
                  <>
                    <Link
                      href={item.url}
                      color="blue400"
                      underline="small"
                      underlineVisibility="always"
                    >
                      {item.text}
                    </Link>
                    {index !== suggestedLinks.length - 1 ? ', ' : ' '}
                  </>
                )
              })}
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
      </FormContentContainer>

      <FormFooter
        previousUrl={navigation?.prevUrl ?? '/'}
        nextUrl={navigation?.nextUrl ?? '/'}
      />
    </FormLayout>
  )
}

export default AddressForm
