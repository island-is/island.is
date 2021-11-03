import React, { useState } from 'react'
import {
  Box,
  Divider,
  Input,
  Text,
  Checkbox,
  Button,
} from '@island.is/island-ui/core'

import * as styles from './Profile.css'

import * as headerStyles from '@island.is/financial-aid-web/veita/src/components/ApplicationHeader/ApplicationHeader.css'
import {
  isEmailValid,
  Staff,
  StaffRole,
} from '@island.is/financial-aid/shared/lib'

interface UserProps {
  user: Staff
}

interface UserInfo {
  nationalId: string
  email?: string
  nickname?: string
  hasError: boolean
  roles: StaffRole[]
}

const UserProfile = ({ user }: UserProps) => {
  const [state, setState] = useState<UserInfo>({
    nationalId: user.nationalId,
    nickname: user?.nickname,
    hasError: false,
    roles: [],
  })

  const changeStaffAccess = (role: StaffRole, isAddingRole: boolean) => {
    isAddingRole
      ? setState({
          ...state,
          roles: [...state.roles, role],
          hasError: false,
        })
      : setState({
          ...state,
          roles: state.roles.filter((item) => item !== role),
        })
  }

  const inputFields = [
    {
      label: 'Kennitala',
      value: state.nationalId,
      onchange: (
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
      bgIsBlue: true,
      onchange: (
        event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
      ) => {
        setState({ ...state, email: event.target.value, hasError: false })
      },
      error: !state.email || !isEmailValid(state.email),
    },
    {
      label: 'Stutt nafn',
      value: state.nickname,
      onchange: (
        event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
      ) => {
        setState({ ...state, nickname: event.target.value, hasError: false })
      },
    },
  ]

  const areRequiredFieldsFilled =
    !state.email ||
    !state.nickname ||
    !state.nationalId ||
    state.roles.length === 0 ||
    !isEmailValid(state.email) ||
    state.nationalId.length !== 10

  const onSubmitUpdate = async () => {
    if (areRequiredFieldsFilled) {
      setState({ ...state, hasError: true })
      return
    }

    // try {
    //   return await createStaff({
    //     variables: {
    //       input: {
    //         name: state.staffName,
    //         email: state.staffEmail,
    //         nationalId: state.staffNationalId,
    //         roles: state.roles,
    //       },
    //     },
    //   }).then(() => {
    //     onStaffCreated()
    //   })
    // } catch (e) {
    //   setState({ ...state, hasSubmitError: true })
    // }
  }

  return (
    <>
      <Box
        marginTop={15}
        marginBottom={15}
        className={`${styles.applicantWrapper} ${styles.widthAlmostFull}`}
      >
        <Box className={`${styles.widthAlmostFull}`}>
          <Box className={`contentUp delay-25`} marginBottom={[3, 3, 7]}>
            <Text as="h1" variant="h1" marginBottom={2}>
              {user.name}
            </Text>

            <Divider />

            <Box display="flex" marginRight={1} marginTop={5}>
              <Box marginRight={1}>
                <Text variant="small" fontWeight="semiBold" color="dark300">
                  Staða
                </Text>
              </Box>
              <Box marginRight={1}>
                <Text variant="small">
                  Notandi er {user.active ? 'virkur' : 'óvirkur'}
                </Text>
              </Box>
              <button className={headerStyles.button}>Sjá um</button>
            </Box>
          </Box>

          {inputFields.map((item, index) => {
            return (
              <Box
                className={`contentUp`}
                marginBottom={3}
                style={{ animationDelay: index * 10 + 30 + 'ms' }}
              >
                <Input
                  label={item.label}
                  name=""
                  value={item.value}
                  onClick={item.onchange}
                  backgroundColor={item.bgIsBlue ? 'blue' : 'white'}
                  hasError={state.hasError && item.error}
                />
              </Box>
            )
          })}

          <Box
            className={`contentUp delay-75`}
            marginTop={3}
            marginBottom={[3, 3, 5]}
          >
            {' '}
            <Text as="h2" variant="h3" color="dark300" marginBottom={3}>
              Réttindi notanda
            </Text>
            <Box marginBottom={3}>
              <Checkbox label="Vinnsluaðili" />
            </Box>
            <Box marginBottom={2}>
              <Checkbox label="Stjórnandi (Admin)" />
            </Box>
            <Text variant="small">
              Stjórnandi í Veitu hefur aðgang að stillingum sveitarfélagsins þar
              sem vefslóðir, netföng og upphæðir eru skilgreindar. Þessar
              stillingar hafa áhrif á Veitu, Ósk og Stöðusíðu auk þess sem þær
              koma einnig við sögu í sumum sjálfvirkum tölvupóstum til
              umsækjenda.
            </Text>
          </Box>
          <Box
            className={`contentUp delay-100`}
            marginTop={3}
            display="flex"
            justifyContent="flexEnd"
          >
            <Button
              icon="checkmark"
              onClick={() => console.log('hérna gerist magic')}
            >
              Vista stillingar
            </Button>
          </Box>
        </Box>
      </Box>
    </>
  )
}

export default UserProfile
