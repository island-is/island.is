import React, { useContext } from 'react'
import {
  ContentContainer,
  Footer,
} from '@island.is/financial-aid-web/osk/src/components'

import { useRouter } from 'next/router'
import useFormNavigation from '@island.is/financial-aid-web/osk/src/utils/hooks/useFormNavigation'

import { NavigationProps } from '@island.is/financial-aid/shared/lib'

import { AppContext } from '@island.is/financial-aid-web/osk/src/components/AppProvider/AppProvider'
import SpouseDataGathering from './spouseDataGathering'
import ApplicantDataGathering from './applicantDataGathering'

const DataGathering = () => {
  const router = useRouter()
  const { user } = useContext(AppContext)

  const navigation: NavigationProps = useFormNavigation(
    router.pathname,
  ) as NavigationProps

  return (
    <ContentContainer>
      {user?.spouse?.hasPartnerApplied ? (
        <SpouseDataGathering />
      ) : (
        <ApplicantDataGathering />
      )}
    </ContentContainer>
  )
}

export default DataGathering
