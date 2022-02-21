import React, { useContext, useState } from 'react'

import {
  AboutDataGathering,
  ContentContainer,
  DataGatheringCheckbox,
  DataGatheringHeader,
  Footer,
  TaxDataGathering,
} from '@island.is/financial-aid-web/osk/src/components'
import { useRouter } from 'next/router'

import useFormNavigation from '@island.is/financial-aid-web/osk/src/utils/hooks/useFormNavigation'

import { NavigationProps, Routes } from '@island.is/financial-aid/shared/lib'

import { useLogOut } from '@island.is/financial-aid-web/osk/src/utils/hooks/useLogOut'
import { AppContext } from '@island.is/financial-aid-web/osk/src/components/AppProvider/AppProvider'
import useTaxData from '@island.is/financial-aid-web/osk/src/utils/hooks/useTaxData'

const SpouseDataGathering = () => {
  const router = useRouter()
  const { user } = useContext(AppContext)

  const [accept, setAccept] = useState(false)
  const [hasError, setHasError] = useState(false)
  const [error, setError] = useState(false)
  const [loading, setLoading] = useState(false)

  const gatherTaxData = useTaxData()
  const logOut = useLogOut()

  const navigation: NavigationProps = useFormNavigation(
    router.pathname,
  ) as NavigationProps

  const errorCheck = async () => {
    if (!accept || !user) {
      setHasError(true)
      return
    }

    setError(false)
    setLoading(true)

    await gatherTaxData()
    setLoading(false)

    router.push(navigation?.nextUrl ?? Routes.form.info)
  }

  return (
    <>
      <ContentContainer>
        <DataGatheringHeader />

        <TaxDataGathering />

        <AboutDataGathering />

        <DataGatheringCheckbox
          accept={accept}
          setHasError={setHasError}
          setAccept={setAccept}
          hasError={hasError}
          error={error}
        />
      </ContentContainer>
      <Footer
        onPrevButtonClick={() => logOut()}
        previousIsDestructive={true}
        prevButtonText="Hætta við"
        nextButtonText="Staðfesta"
        nextButtonIcon="checkmark"
        onNextButtonClick={errorCheck}
        nextIsLoading={loading}
      />
    </>
  )
}

export default SpouseDataGathering
