import React, { useContext, useState } from 'react'
import { Text, Icon, Box, Checkbox } from '@island.is/island-ui/core'

import {
  ContentContainer,
  Footer,
  Logo,
} from '@island.is/financial-aid-web/osk/src/components'
import * as styles from './info.treat'
import { useRouter } from 'next/router'

import useFormNavigation from '@island.is/financial-aid-web/osk/src/utils/useFormNavigation'

import {
  getNextPeriod,
  NavigationProps,
  useLazyQuery,
} from '@island.is/financial-aid/shared/lib'

import { useLogOut } from '@island.is/financial-aid-web/osk/src/utils/useLogOut'
import { NationalRegistryUserQuery } from '@island.is/financial-aid-web/osk/graphql'
import { UserContext } from '../../../components/UserProvider/UserProvider'

const ApplicationInfo = () => {
  const router = useRouter()
  const { user } = useContext(UserContext)

  const [accept, setAccept] = useState(false)
  const [hasError, setHasError] = useState(false)

  const nationalRegistryQuery = useLazyQuery<
    {
      nationalRegistryUserV2: {
        nationalId: string
        fullName: string
        address: {
          streetName: string
          postalCode: string
          city: string
          municipalityCode: string
        }
        spouse: {
          nationalId: string
          maritalStatus: string
          name: string
        }
      }
    },
    { input: { ssn: string } }
  >(NationalRegistryUserQuery)

  const logOut = useLogOut()

  const navigation: NavigationProps = useFormNavigation(
    router.pathname,
  ) as NavigationProps

  const errorCheck = async () => {
    if (!accept) {
      setHasError(true)
      return
    }

    const data = await nationalRegistryQuery({
      input: { ssn: '0901951589' },
    })

    console.log('user data', data)

    if (navigation?.nextUrl) {
      router.push(navigation?.nextUrl)
    }
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

        <Text marginBottom={2}>
          Við þurfum að fá þig til að renna yfir nokkur atriði og gefa
          upplýsingar um búsetu og laun yfir síðustu 2 mánuði, ef einhver, til
          að reikna út aðstoð til útgreiðslu í byrjun {getNextPeriod.month}.
        </Text>
        <Text marginBottom={3}>
          Í lokin velurðu að senda inn umsóknina eða eyða henni og öllum tengdum
          gögnum.
        </Text>

        <Text as="h3" variant="h5" color="blue400">
          Upplýsingar um styrki og bætur
        </Text>
        <Text marginBottom={2}>
          T.a.m. hjá Vinnumálastofnun, Sjúkratryggingum Íslands, o.fl.
        </Text>

        <Text as="h3" variant="h5" color="blue400">
          Upplýsingar um stöðu og eignir
        </Text>
        <Text marginBottom={[4, 4, 5]}>T.a.m. hjá þjóðskrá og Skattinum.</Text>

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
      />
    </>
  )
}

export default ApplicationInfo
