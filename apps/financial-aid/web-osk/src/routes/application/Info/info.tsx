import React, { useContext, useState } from 'react'
import { Text, Icon, Box, Checkbox } from '@island.is/island-ui/core'

import {
  ContentContainer,
  Footer,
  Logo,
} from '@island.is/financial-aid-web/osk/src/components'
import * as styles from './info.css'
import { useRouter } from 'next/router'

import useFormNavigation from '@island.is/financial-aid-web/osk/src/utils/hooks/useFormNavigation'

import {
  getNextPeriod,
  NationalRegistryData,
  NavigationProps,
  Routes,
  useAsyncLazyQuery,
} from '@island.is/financial-aid/shared/lib'

import { NationalRegistryUserQuery } from '@island.is/financial-aid-web/osk/graphql'
import { useLogOut } from '@island.is/financial-aid-web/osk/src/utils/hooks/useLogOut'
import { AppContext } from '@island.is/financial-aid-web/osk/src/components/AppProvider/AppProvider'

const ApplicationInfo = () => {
  const router = useRouter()
  const {
    user,
    setNationalRegistryData,
    setMunicipalityById,
    loadingMuncipality,
  } = useContext(AppContext)

  const [accept, setAccept] = useState(false)
  const [hasError, setHasError] = useState(false)

  const nationalRegistryQuery = useAsyncLazyQuery<
    {
      nationalRegistryUserV2: NationalRegistryData
    },
    { input: { ssn: string } }
  >(NationalRegistryUserQuery)

  const logOut = useLogOut()

  const navigation: NavigationProps = useFormNavigation(
    router.pathname,
  ) as NavigationProps

  // TODO: Add once national registry is connected to x-road
  // const { data } = await nationalRegistryQuery({
  //   input: { ssn: user?.nationalId },
  // })

  const data: { nationalRegistryUserV2: NationalRegistryData } = {
    nationalRegistryUserV2: {
      nationalId: user?.nationalId ?? '',
      fullName: user?.name ?? '',
      address: {
        streetName: 'Hafnargata 7',
        postalCode: '200',
        city: 'Hafnarfjörður',
        municipalityCode: '1400',
      },
      spouse: {
        nationalId: undefined,
        maritalStatus: undefined,
        name: undefined,
      },
    },
  }

  if (!data || !data.nationalRegistryUserV2.address) {
    return
  }

  const errorCheck = async () => {
    if (!accept || !user) {
      setHasError(true)
      return
    }

    setNationalRegistryData(data.nationalRegistryUserV2)

    await setMunicipalityById(
      data.nationalRegistryUserV2.address.municipalityCode,
    ).then((municipality) => {
      if (navigation.nextUrl && municipality && municipality.active) {
        router.push(navigation?.nextUrl)
      } else {
        router.push(
          Routes.serviceCenter(
            data.nationalRegistryUserV2.address.municipalityCode,
          ),
        )
      }
    })
  }

  return (
    <>
      <ContentContainer>
        <Text as="h1" variant="h2" marginBottom={[3, 3, 5]}>
          Gagnaöflun
        </Text>

        <Box className={styles.textIconContainer} marginBottom={3}>
          <Icon
            color="blue400"
            icon="fileTrayFull"
            size="large"
            type="outline"
          />

          <Text as="h2" variant="h4">
            Eftirfarandi gögn verða sótt rafrænt með þínu samþykki.
          </Text>
        </Box>

        <Text marginBottom={3}>
          Við þurfum að afla gagna frá eftirfarandi opinberum aðilum til að
          einfalda umsóknarferlið, staðfesta réttleika upplýsinga og reikna út
          áætlaðar greiðslur.
        </Text>

        <Text as="h3" variant="h5" color="blue400">
          Þjóðskrá Íslands
        </Text>
        <Text marginBottom={3}>Lögheimili, hjúskaparstaða</Text>

        <Text marginBottom={[4, 4, 5]}>
          Við þurfum að fá þig til að renna yfir nokkur atriði varðandi þína
          persónuhagi og fjármál til að reikna út fjárhagsaðstoð til útgreiðslu
          í byrjun {getNextPeriod.month}. Í lok umsóknar getur þú sent hana inn
          eða eytt henni og öllum tengdum gögnum.
        </Text>

        <Box marginBottom={[5, 5, 10]} cursor="pointer">
          <Checkbox
            name={'accept'}
            backgroundColor="blue"
            label="Ég skil að ofangreindra gagna verður aflað í umsóknar- og staðfestingarferlinu"
            large
            checked={accept}
            onChange={(event) => {
              setHasError(false)

              setAccept(event.target.checked)
            }}
            hasError={hasError}
            errorMessage={'Þú þarft að samþykkja gagnaöflun'}
          />
        </Box>

        <Box
          className={styles.logoContainer}
          alignItems="center"
          justifyContent="center"
          marginBottom={5}
        >
          <Logo className={styles.logo} />
        </Box>
      </ContentContainer>
      <Footer
        onPrevButtonClick={() => logOut()}
        previousIsDestructive={true}
        prevButtonText="Hætta við"
        nextButtonText="Staðfesta"
        nextButtonIcon="checkmark"
        onNextButtonClick={errorCheck}
        nextIsLoading={loadingMuncipality}
      />
    </>
  )
}

export default ApplicationInfo
