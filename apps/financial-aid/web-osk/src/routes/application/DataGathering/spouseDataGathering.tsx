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

import {
  FileType,
  getNextPeriod,
  NavigationProps,
  PersonalTaxReturn,
  Routes,
  useAsyncLazyQuery,
} from '@island.is/financial-aid/shared/lib'

import { PersonalTaxReturnQuery } from '@island.is/financial-aid-web/osk/graphql'
import { useLogOut } from '@island.is/financial-aid-web/osk/src/utils/hooks/useLogOut'
import { AppContext } from '@island.is/financial-aid-web/osk/src/components/AppProvider/AppProvider'
import { FormContext } from '@island.is/financial-aid-web/osk/src/components/FormProvider/FormProvider'

const SpouseDataGathering = () => {
  const router = useRouter()
  const { user } = useContext(AppContext)
  const { form, updateForm } = useContext(FormContext)

  const [accept, setAccept] = useState(false)
  const [hasError, setHasError] = useState(false)
  const [error, setError] = useState(false)
  const [loading, setLoading] = useState(false)

  const personalTaxReturnQuery = useAsyncLazyQuery<{
    municipalitiesPersonalTaxReturn: PersonalTaxReturn
  }>(PersonalTaxReturnQuery)

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

    const { data: personalTaxReturn } = await personalTaxReturnQuery({}).catch(
      () => {
        return { data: undefined }
      },
    )

    updateForm({
      ...form,
      taxReturnFromRskFile: [
        personalTaxReturn
          ? {
              ...personalTaxReturn.municipalitiesPersonalTaxReturn,
              type: FileType.SPOUSEFILES,
            }
          : undefined,
      ],
    })

    setLoading(false)

    router.push(navigation?.nextUrl ?? Routes.form.info)
  }

  return (
    <>
      <ContentContainer>
        <DataGatheringHeader />

        <TaxDataGathering />

        <AboutDataGathering nextMonth={getNextPeriod.month} />

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
