import React, { useContext, useState } from 'react'
import {
  Box,
  Divider,
  Input,
  Text,
  Checkbox,
  Button,
  ToastContainer,
  Option,
  Select,
} from '@island.is/island-ui/core'

import * as styles from './Profile.css'

import * as headerStyles from '@island.is/financial-aid-web/veita/src/components/ApplicationHeader/ApplicationHeader.css'
import {
  InputType,
  isEmailValid,
  Staff,
  StaffRole,
} from '@island.is/financial-aid/shared/lib'

import cn from 'classnames'
import { useStaff } from '@island.is/financial-aid-web/veita/src/utils/useStaff'
import { AdminContext } from '@island.is/financial-aid-web/veita/src/components/AdminProvider/AdminProvider'
import MultiSelection from '../MultiSelection/MultiSelection'
import { isString } from 'lodash'

interface EmployeeProfileProps {
  user: Staff
}

interface EmployeeProfileInfo {
  nationalId: string
  email?: string
  nickname?: string
  hasError: boolean
  roles: StaffRole[]
  municipalityIds: string[]
  serviceCenter: Option[]
}

const EmployeeProfile = ({ user }: EmployeeProfileProps) => {
  const { admin, municipality } = useContext(AdminContext)

  const isLoggedInUser = (staff: Staff) =>
    admin?.nationalId === staff.nationalId

  const [state, setState] = useState<EmployeeProfileInfo>({
    nationalId: user.nationalId,
    nickname: user?.nickname ?? '',
    email: user.email ?? '',
    hasError: false,
    roles: user.roles,
    municipalityIds: user.municipalityIds,
    serviceCenter: municipality
      .filter((el) => !user.municipalityIds.includes(el.municipalityId))
      .map((el) => {
        return { label: el.name, value: el.municipalityId }
      }),
  })

  const { changeUserActivity, staffActivationLoading, updateInfo } = useStaff()

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
      type: 'number' as InputType,
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
      value: state.email,
      bgIsBlue: true,
      type: 'email' as InputType,
      onchange: (
        event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
      ) => {
        setState({ ...state, email: event.target.value, hasError: false })
      },
      error: !state.email || !isEmailValid(state.email),
    },
    {
      label: 'Stutt nafn',
      bgIsBlue: true,
      value: state.nickname,
      type: 'text' as InputType,
      onchange: (
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

  const areRequiredFieldsFilled =
    !state.email ||
    !state.nationalId ||
    state.roles.length === 0 ||
    !isEmailValid(state.email) ||
    state.nationalId.length !== 10

  const onSubmitUpdate = async () => {
    if (areRequiredFieldsFilled) {
      setState({ ...state, hasError: true })
      return
    }

    await updateInfo(
      user.id,
      state.nationalId,
      state.roles,
      state.nickname,
      state.email,
      undefined,
      undefined,
      state.municipalityIds,
    )
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
              {isLoggedInUser(user) === false && (
                <button
                  onClick={() => changeUserActivity(!user.active, user.id)}
                  disabled={staffActivationLoading}
                  className={headerStyles.button}
                >
                  {user.active ? 'Óvirkja' : 'Virkja'}
                </button>
              )}
            </Box>
          </Box>

          {inputFields.map((item, index) => {
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
                  onChange={item.onchange}
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
            <Box display="block" marginTop={3} marginBottom={[3, 3, 5]}>
              <Text as="h2" variant="h3" color="dark300" marginBottom={3}>
                Sveitarfélög notanda
              </Text>
              <MultiSelection
                options={state.serviceCenter}
                active={municipality
                  .filter((el) =>
                    state.municipalityIds.includes(el.municipalityId),
                  )
                  .map((el) => {
                    return { label: el.name, value: el.municipalityId }
                  })}
                onSelected={(option: any) => {
                  if ((option?.value as unknown) && isString(option?.value)) {
                    setState({
                      ...state,
                      municipalityIds: [
                        ...state.municipalityIds,
                        option?.value,
                      ],
                      serviceCenter: state.serviceCenter.filter(
                        (el) => el.value !== option.value,
                      ),
                    })
                  }
                }}
                unSelected={(value: string, name: string) => {
                  setState({
                    ...state,
                    municipalityIds: state.municipalityIds.filter(
                      (muni) => muni != value,
                    ),
                    serviceCenter: [
                      ...state.serviceCenter,
                      { label: name, value: value },
                    ],
                  })
                }}
              />
            </Box>

            <Text as="h2" variant="h3" color="dark300" marginBottom={3}>
              Réttindi notanda
            </Text>
            <Box marginBottom={3}>
              <Checkbox
                name={'employee'}
                label="Vinnsluaðili"
                checked={state.roles.includes(StaffRole.EMPLOYEE)}
                strong={false}
                hasError={state.hasError && state.roles.length === 0}
                onChange={(event) => {
                  changeStaffAccess(StaffRole.EMPLOYEE, event.target.checked)
                }}
              />
            </Box>
            <Box marginBottom={2}>
              <Checkbox
                name={'admin'}
                label="Stjórnandi (admin)"
                checked={state.roles.includes(StaffRole.ADMIN)}
                hasError={state.hasError && state.roles.length === 0}
                onChange={(event) => {
                  changeStaffAccess(StaffRole.ADMIN, event.target.checked)
                }}
                strong={false}
              />
            </Box>
            <div
              className={cn({
                [`errorMessage`]: true,
                [`showErrorMessage`]:
                  state.hasError && state.roles.length === 0,
              })}
            >
              <Text color="red600" fontWeight="semiBold" variant="small">
                Þú þarft að velja önnur hvor réttindin fyrir þennan notanda
              </Text>
            </div>
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
              loading={staffActivationLoading}
              icon="checkmark"
              onClick={onSubmitUpdate}
            >
              Vista stillingar
            </Button>
          </Box>
        </Box>
      </Box>
      <ToastContainer />
    </>
  )
}

export default EmployeeProfile
