import React, { useContext, useState } from 'react'
import { Text } from '@island.is/island-ui/core'

import {
  AboutDataGathering,
  ContentContainer,
  DataGatheringCheckbox,
  Footer,
  TaxDataGathering,
  DataGatheringHeader,
} from '@island.is/financial-aid-web/osk/src/components'
import { useRouter } from 'next/router'

import useFormNavigation from '@island.is/financial-aid-web/osk/src/utils/hooks/useFormNavigation'

import {
  NationalRegistryData,
  NavigationProps,
  Routes,
  useAsyncLazyQuery,
} from '@island.is/financial-aid/shared/lib'

import { NationalRegistryUserQuery } from '@island.is/financial-aid-web/osk/graphql'
import { useLogOut } from '@island.is/financial-aid-web/osk/src/utils/hooks/useLogOut'
import { AppContext } from '@island.is/financial-aid-web/osk/src/components/AppProvider/AppProvider'
import useTaxData from '@island.is/financial-aid-web/osk/src/utils/hooks/useTaxData'

const ApplicantDataGathering = () => {
  const router = useRouter()
  const {
    user,
    setNationalRegistryData,
    setMunicipalityById,
    loadingMunicipality,
  } = useContext(AppContext)

  const [accept, setAccept] = useState(false)
  const [hasError, setHasError] = useState(false)
  const [error, setError] = useState(false)
  const [loading, setLoading] = useState(false)

  const nationalRegistryQuery = useAsyncLazyQuery<
    {
      municipalityNationalRegistryUserV2: NationalRegistryData
    },
    { input: { ssn: string } }
  >(NationalRegistryUserQuery)

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

    const { data: nationalRegistry } = await nationalRegistryQuery({
      input: { ssn: user?.nationalId },
    }).catch(() => {
      return {
        data: undefined,
      }
    })

    if (
      !nationalRegistry ||
      !nationalRegistry.municipalityNationalRegistryUserV2.address
    ) {
      setError(true)
      setLoading(false)
      return
    }

    setNationalRegistryData(nationalRegistry.municipalityNationalRegistryUserV2)

    await setMunicipalityById(
      nationalRegistry.municipalityNationalRegistryUserV2.address
        .municipalityCode,
    ).then(async (municipality) => {
      if (navigation.nextUrl && municipality && municipality.active) {
        await gatherTaxData()
        router.push(navigation?.nextUrl)
      } else {
        router.push(
          Routes.serviceCenter(
            nationalRegistry.municipalityNationalRegistryUserV2.address
              .municipalityCode,
          ),
        )
      }
    })
  }

  return (
    <>
      <ContentContainer>
        <DataGatheringHeader />

        <Text marginBottom={3}>
          Við þurfum að afla gagna frá eftirfarandi opinberum aðilum til að
          einfalda umsóknarferlið, staðfesta réttleika upplýsinga og reikna út
          áætlaðar greiðslur.
        </Text>

        <Text as="h3" variant="h5" color="blue400">
          Þjóðskrá Íslands
        </Text>
        <Text marginBottom={3}>Lögheimili, hjúskaparstaða</Text>

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
        nextIsLoading={loadingMunicipality || loading}
      />
    </>
  )
}

export default ApplicantDataGathering
