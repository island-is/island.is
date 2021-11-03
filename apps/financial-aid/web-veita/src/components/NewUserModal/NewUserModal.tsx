import React, { useState } from 'react'
import { Box, Checkbox, Input, Text } from '@island.is/island-ui/core'
import { ActionModal } from '@island.is/financial-aid-web/veita/src/components'
import { StaffMutation } from '@island.is/financial-aid-web/veita/graphql'
import { useMutation } from '@apollo/client'
import { isEmailValid, StaffRole } from '@island.is/financial-aid/shared/lib'

interface Props {
  isVisible: boolean
  setIsVisible: React.Dispatch<React.SetStateAction<boolean>>
}

const NewUserModal = ({ isVisible, setIsVisible }: Props) => {
  const [staffNationalId, setStaffNationalId] = useState<string>()
  const [staffName, setStaffName] = useState<string>()
  const [staffEmail, setStaffEmail] = useState<string>()
  const [hasError, setHasError] = useState(false)
  const [hasSubmitError, setHasSubmitError] = useState(false)
  const [createStaff] = useMutation(StaffMutation)
  const [roles, setRoles] = useState<StaffRole[]>([])

  const changeStaffAccess = (role: StaffRole, isAddingRole: boolean) => {
    isAddingRole
      ? setRoles((roles) => [...roles, role])
      : setRoles(roles.filter((item) => item !== role))
  }

  const areRequiredFieldsFilled =
    !staffEmail ||
    !staffName ||
    !staffNationalId ||
    roles.length === 0 ||
    !isEmailValid(staffEmail) ||
    staffNationalId.length !== 10

  const submit = async () => {
    if (areRequiredFieldsFilled) {
      setHasError(true)
      return
    }

    try {
      return await createStaff({
        variables: {
          input: {
            name: staffName,
            email: staffEmail,
            nationalId: staffNationalId,
            roles: roles,
          },
        },
      })
    } catch (e) {
      setHasSubmitError(true)
    }
  }

  return (
    <ActionModal
      isVisible={isVisible}
      setIsVisible={setIsVisible}
      header={'Nýr notandi'}
      hasError={hasSubmitError}
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
          value={staffNationalId}
          onChange={(event) => {
            setHasError(false)
            if (event.currentTarget.value.length <= 10) {
              setStaffNationalId(event.currentTarget.value)
            }
          }}
          hasError={
            hasError && (!staffNationalId || staffNationalId.length !== 10)
          }
        />
      </Box>
      <Box marginBottom={3}>
        <Input
          label="Nafn"
          name="staffName"
          value={staffName}
          placeholder="Sláðu inn fullt nafn"
          backgroundColor="blue"
          onChange={(event) => {
            setHasError(false)
            setStaffName(event.currentTarget.value)
          }}
          hasError={hasError && !staffName}
        />
      </Box>
      <Box marginBottom={2}>
        <Input
          label="Netfang"
          name="staffEmail"
          value={staffEmail}
          placeholder="Sláðu inn netfang"
          backgroundColor="blue"
          type={'email'}
          onChange={(event) => {
            setHasError(false)
            setStaffEmail(event.currentTarget.value)
          }}
          hasError={hasError && (!staffEmail || !isEmailValid(staffEmail))}
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
          checked={roles.includes(StaffRole.EMPLOYEE)}
          strong={false}
          hasError={hasError && roles.length === 0}
          onChange={(event) => {
            setHasError(false)
            changeStaffAccess(StaffRole.EMPLOYEE, event.target.checked)
          }}
          filled={false}
        />
      </Box>
      <Box marginBottom={2}>
        <Checkbox
          name={'admin'}
          label="Stjórnandi (admin)"
          checked={roles.includes(StaffRole.ADMIN)}
          hasError={hasError && roles.length === 0}
          onChange={(event) => {
            setHasError(false)
            changeStaffAccess(StaffRole.ADMIN, event.target.checked)
          }}
          strong={false}
        />
      </Box>
      {hasError && roles.length === 0 && (
        <Text color="red600" fontWeight="semiBold" variant="small">
          Það þarf að velja réttindi
        </Text>
      )}
    </ActionModal>
  )
}

export default NewUserModal
