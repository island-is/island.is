import React, { useContext, useState } from 'react'

import {
  ApplicationOverviewSkeleton,
  LoadingContainer,
} from '@island.is/financial-aid-web/veita/src/components'
import {
  Text,
  Box,
  Input,
  ToggleSwitchCheckbox,
} from '@island.is/island-ui/core'
import { AdminContext } from '@island.is/financial-aid-web/veita/src/components/AdminProvider/AdminProvider'

import * as profileStyles from '@island.is/financial-aid-web/veita/src/components/Profile/Profile.css'
import { InputType, isEmailValid } from '@island.is/financial-aid/shared/lib'

interface mySettingsState {
  nationalId?: string
  name?: string
  email?: string
  nickname?: string
  hasError: boolean
  hasSubmitError: boolean
}

export const MySettings = () => {
  const { admin } = useContext(AdminContext)

  const [pseudonyms, setPseudonyms] = useState<boolean>(false)

  const [state, setState] = useState<mySettingsState>({
    nationalId: admin?.staff?.nationalId,
    name: admin?.staff?.name,
    email: admin?.staff?.email,
    nickname: admin?.staff?.nickname,
    hasError: false,
    hasSubmitError: false,
  })

  const inputSettings = [
    {
      label: 'Nafn',
      value: state.name,
      bgIsBlue: true,
      type: 'text' as InputType,
      onChange: (
        event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
      ) => {
        if (event.currentTarget.value.length <= 10) {
          setState({
            ...state,
            name: event.target.value,
            hasError: false,
          })
        }
      },
      error: !state.name,
    },
    {
      label: 'Kennitala',
      value: state.nationalId,
      type: 'number' as InputType,
      onChange: (
        event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
      ) => {
        if (event.currentTarget.value.length <= 10) {
          setState({
            ...state,
            nationalId: event.target.value,
            hasError: false,
          })
        }
      },
      error: !state.nationalId || state.nationalId.length !== 10,
    },
    {
      label: 'Netfang',
      value: state.email,
      bgIsBlue: true,
      type: 'email' as InputType,
      onChange: (
        event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
      ) => {
        setState({ ...state, email: event.target.value, hasError: false })
      },
      error: !state.email || !isEmailValid(state.email),
    },
    {
      label: 'Stutt nafn',
      value: state.nickname,
      bgIsBlue: true,
      type: 'text' as InputType,
      onChange: (
        event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
      ) => {
        setState({
          ...state,
          nickname: event.currentTarget.value,
          hasError: false,
        })
      },
    },
  ]

  return (
    <LoadingContainer
      isLoading={false}
      loader={<ApplicationOverviewSkeleton />}
    >
      <Box marginTop={15} marginBottom={[4, 4, 7]} className={`contentUp`}>
        <Text as="h1" variant="h1">
          Mínar stillingar
        </Text>
      </Box>

      <Box className={`${profileStyles.applicantWrapper}`}>
        <Box className={`${profileStyles.widthAlmostFull}`}>
          {inputSettings.map((item, index) => {
            return (
              <Box
                className={`contentUp`}
                marginBottom={3}
                style={{ animationDelay: index * 10 + 30 + 'ms' }}
                key={`inputField-${index}`}
              >
                <Input
                  label={item.label}
                  name={`userInput-${index}`}
                  type={item.type}
                  value={item.value}
                  onChange={item.onChange}
                  backgroundColor={item.bgIsBlue ? 'blue' : 'white'}
                  hasError={state.hasError && item.error}
                />
              </Box>
            )
          })}
          <Box marginBottom={[4, 4, 7]} className={`contentUp delay-75`}>
            <Text variant="small">
              Stutt nöfn eru birt á yfirlitsskjám yfir mál í vinnslu til að geta
              séð í fljótu bragði hver er með hvaða mál. Fornafn þitt er notað
              sjálfkrafa sem stutt nafn en þú getur einnig notað gælunafn eða
              annað sem þitt samstarfsfólk kallar þig.
            </Text>
          </Box>

          <Box marginBottom={[2, 2, 3]} className={`contentUp delay-100`}>
            <Text as="h2" variant="h3" color="dark300">
              Dulnefni
            </Text>
          </Box>

          <Box marginBottom={[4, 4, 7]} className={`contentUp delay-100`}>
            <ToggleSwitchCheckbox
              label={
                <Text fontWeight="semiBold">
                  Nota dulnefni fyrir nöfn umsækjenda í yfirlitsskjám
                </Text>
              }
              checked={pseudonyms}
              onChange={(newChecked) => {
                setPseudonyms(newChecked)
              }}
              className={``}
            />

            <Text variant="small">
              Í Veitu er sjálfgefið að nöfn umsækjenda birtast á yfirlitsskjám.
              Ef þú vilt ekki að nöfn umsækjenda birtist á yfirlitsskjám getur
              þú virkjað þennan valmöguleika. Raunveruleg nöfn umsækjenda eru
              alltaf birt í ítarupplýsingum umsóknar þegar búið er að opna hana.
            </Text>
          </Box>
        </Box>
      </Box>
    </LoadingContainer>
  )
}

export default MySettings
