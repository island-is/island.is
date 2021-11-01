import React, { useContext } from 'react'
import {
  ContentContainer,
  Footer,
} from '@island.is/financial-aid-web/osk/src/components'

import { useRouter } from 'next/router'
import useFormNavigation from '@island.is/financial-aid-web/osk/src/utils/hooks/useFormNavigation'

import { NavigationProps } from '@island.is/financial-aid/shared/lib'
import {
  AboutFormApplicant,
  AboutFormSpouse,
} from '@island.is/financial-aid-web/osk/src/routes/application/AboutForm'
import { AppContext } from '@island.is/financial-aid-web/osk/src/components/AppProvider/AppProvider'

const AboutForm = () => {
  const router = useRouter()
  const { user } = useContext(AppContext)

  const { nationalRegistryData } = useContext(AppContext)

  const navigation: NavigationProps = useFormNavigation(
    router.pathname,
  ) as NavigationProps

  return (
    <>
      <ContentContainer>
        {user?.isSpouse?.HasApplied ? (
          <AboutFormSpouse />
        ) : (
          <AboutFormApplicant />
        )}
      </ContentContainer>

      <Footer previousUrl={navigation?.prevUrl} nextUrl={navigation?.nextUrl} />
    </>
  )
}

export default AboutForm
