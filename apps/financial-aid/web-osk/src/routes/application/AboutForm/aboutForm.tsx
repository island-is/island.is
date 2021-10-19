import React from 'react'
import { Text, BulletList, Bullet, Box, Link } from '@island.is/island-ui/core'

import {
  ContentContainer,
  Footer,
} from '@island.is/financial-aid-web/osk/src/components'

import { useRouter } from 'next/router'
import useFormNavigation from '@island.is/financial-aid-web/osk/src/utils/hooks/useFormNavigation'

import {
  NavigationProps,
  currentMonth,
} from '@island.is/financial-aid/shared/lib'
import {
  AboutFormApplicant,
  AboutFormSpouse,
} from '@island.is/financial-aid-web/osk/src/routes/application/AboutForm'

const AboutForm = () => {
  const router = useRouter()

  const navigation: NavigationProps = useFormNavigation(
    router.pathname,
  ) as NavigationProps

  return (
    <>
      <ContentContainer>
        {/* <AboutFormApplicant /> */}
        <AboutFormSpouse />
      </ContentContainer>

      <Footer previousUrl={navigation?.prevUrl} nextUrl={navigation?.nextUrl} />
    </>
  )
}

export default AboutForm
