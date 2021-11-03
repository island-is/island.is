import React, { useState } from 'react'
import { Box, Checkbox, Input, Text } from '@island.is/island-ui/core'
import { ActionModal } from '@island.is/financial-aid-web/veita/src/components'
import { StaffMutation } from '@island.is/financial-aid-web/veita/graphql'
import { useMutation } from '@apollo/client'
import { isEmailValid, StaffRole } from '@island.is/financial-aid/shared/lib'

interface Props {
  isVisible: boolean
  setIsVisible: React.Dispatch<React.SetStateAction<boolean>>
  onStaffCreated: () => void
}

interface newUsersModalState {
  staffNationalId: string
  staffName: string
  staffEmail: string
  hasError: boolean
  hasSubmitError: boolean
  roles: StaffRole[]
}

const NewUserModal = ({ isVisible, setIsVisible, onStaffCreated }: Props) => {
  const [state, setState] = useState<newUsersModalState>({
    staffNationalId: '',
    staffName: '',
    staffEmail: '',
    hasError: false,
    hasSubmitError: false,
    roles: [],
  })
  const [createStaff] = useMutation(StaffMutation)

  const changeStaffAccess = (role: StaffRole, isAddingRole: boolean) => {
    isAddingRole
      ? setState({ ...state, roles: [...state.roles, role], hasError: false })
      : setState({
          ...state,
          roles: state.roles.filter((item) => item !== role),
        })
  }

  const areRequiredFieldsFilled =
    !state.staffEmail ||
    !state.staffName ||
    !state.staffNationalId ||
    state.roles.length === 0 ||
    !isEmailValid(state.staffEmail) ||
    state.staffNationalId.length !== 10

  const submit = async () => {
    if (areRequiredFieldsFilled) {
      setState({ ...state, hasError: true })
      return
    }

    try {
      return await createStaff({
        variables: {
          input: {
            name: state.staffName,
            email: state.staffEmail,
            nationalId: state.staffNationalId,
            roles: state.roles,
          },
        },
      }).then(() => {
        onStaffCreated()
      })
    } catch (e) {
      setState({ ...state, hasSubmitError: true })
    }
  }

  return (
    <ActionModal
      isVisible={isVisible}
      setIsVisible={setIsVisible}
      header={'Nýr notandi'}
      hasError={state.hasSubmitError}
      errorMessage={'Eitthvað fór úrskeiðis, vinsamlega reynið aftur síðar'}
      submitButtonText={'Stofna notanda'}
      onSubmit={submit}
    >
      <Box marginBottom={3}>
        <Input
          label="Kennitala"
          name="staffNationalId"
          type={'number'}
          placeholder="Sláðu inn kennitölu"
          backgroundColor="blue"
          value={state.staffNationalId}
          onChange={(event) => {
            if (event.currentTarget.value.length <= 10) {
              setState({
                ...state,
                staffNationalId: event.currentTarget.value,
                hasError: false,
              })
            }
          }}
          hasError={
            state.hasError &&
            (!state.staffNationalId || state.staffNationalId.length !== 10)
          }
        />
      </Box>
      <Box marginBottom={3}>
        <Input
          label="Nafn"
          name="staffName"
          value={state.staffName}
          placeholder="Sláðu inn fullt nafn"
          backgroundColor="blue"
          onChange={(event) => {
            setState({
              ...state,
              hasError: false,
              staffName: event.currentTarget.value,
            })
          }}
          hasError={state.hasError && !state.staffName}
        />
      </Box>
      <Box marginBottom={2}>
        <Input
          label="Netfang"
          name="staffEmail"
          value={state.staffEmail}
          placeholder="Sláðu inn netfang"
          backgroundColor="blue"
          type={'email'}
          onChange={(event) => {
            setState({
              ...state,
              hasError: false,
              staffEmail: event.currentTarget.value,
            })
          }}
          hasError={
            state.hasError &&
            (!state.staffEmail || !isEmailValid(state.staffEmail))
          }
        />
      </Box>
      <Text marginBottom={5} variant="small">
        Notandi fær sendan tölvupóst með hlekk til að skrá sig inn með rafrænum
        skilríkjum.
      </Text>
      <Text marginBottom={3} variant="h4">
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
          filled={false}
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
      {state.hasError && state.roles.length === 0 && (
        <Text color="red600" fontWeight="semiBold" variant="small">
          Það þarf að velja réttindi
        </Text>
      )}
    </ActionModal>
  )
}

export default NewUserModal
