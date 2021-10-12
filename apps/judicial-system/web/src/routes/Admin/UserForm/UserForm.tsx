import React, { useState } from 'react'
import {
  Box,
  Checkbox,
  Input,
  RadioButton,
  Select,
  Text,
} from '@island.is/island-ui/core'
import InputMask from 'react-input-mask'
import { ValueType } from 'react-select/src/types'
import {
  FormContentContainer,
  FormFooter,
} from '@island.is/judicial-system-web/src/shared-components'
import { InstitutionType, UserRole } from '@island.is/judicial-system/types'
import type { Institution, User } from '@island.is/judicial-system/types'
import { FormSettings } from '@island.is/judicial-system-web/src/utils/useFormHelper'
import { ReactSelectOption } from '../../../types'
import { validate } from '../../../utils/validate'
import * as styles from './UserForm.treat'
import * as constants from '@island.is/judicial-system-web/src/utils/constants'

type ExtendedOption = ReactSelectOption & { institution: Institution }

interface Props {
  user: User
  allCourts: Institution[]
  prosecutorsOffices: Institution[]
  prisonInstitutions: Institution[]
  onSave: (user: User) => void
  loading: boolean
}

export const UserForm: React.FC<Props> = (props) => {
  const [user, setUser] = useState<User>(props.user)

  const [nameErrorMessage, setNameErrorMessage] = useState<string>()
  const [nationalIdErrorMessage, setNationalIdErrorMessage] = useState<string>()
  const [titleErrorMessage, setTitleErrorMessage] = useState<string>()
  const [
    mobileNumberErrorMessage,
    setMobileNumberErrorMessage,
  ] = useState<string>()
  const [emailErrorMessage, setEmailErrorMessage] = useState<string>()

  const selectInstitutions = (user.role === UserRole.PROSECUTOR
    ? props.prosecutorsOffices
    : user.role === UserRole.STAFF
    ? props.prisonInstitutions
    : user.role === UserRole.REGISTRAR || user.role === UserRole.JUDGE
    ? props.allCourts
    : []
  ).map((institution) => ({
    label: institution.name,
    value: institution.id,
    institution,
  }))

  const usersInstitution = selectInstitutions.find(
    (institution) => institution.value === user.institution?.id,
  )

  const validations: FormSettings = {
    name: {
      validations: ['empty'],
      errorMessage: nameErrorMessage,
      setErrorMessage: setNameErrorMessage,
    },
    nationalId: {
      validations: ['empty', 'national-id'],
      errorMessage: nationalIdErrorMessage,
      setErrorMessage: setNationalIdErrorMessage,
    },
    institution: {
      validations: ['empty'],
    },
    title: {
      validations: ['empty'],
      errorMessage: titleErrorMessage,
      setErrorMessage: setTitleErrorMessage,
    },
    mobileNumber: {
      validations: ['empty'],
      errorMessage: mobileNumberErrorMessage,
      setErrorMessage: setMobileNumberErrorMessage,
    },
    email: {
      validations: ['empty', 'email-format'],
      errorMessage: emailErrorMessage,
      setErrorMessage: setEmailErrorMessage,
    },
  }

  const isValid = () => {
    for (const fieldName in validations) {
      const validation = validations[fieldName]

      const value = user[fieldName as keyof User] as string

      if (
        validation.validations?.some(
          (v) => validate(value, v).isValid === false,
        )
      ) {
        return false
      }
    }

    // TODO: Find a better way to validate the match between user role and institution type
    return user.role === UserRole.PROSECUTOR
      ? user.institution?.type === InstitutionType.PROSECUTORS_OFFICE
      : user.role === UserRole.REGISTRAR || user.role === UserRole.JUDGE
      ? user.institution?.type === InstitutionType.COURT ||
        user.institution?.type === InstitutionType.HIGH_COURT
      : user.role === UserRole.STAFF
      ? user.institution?.type === InstitutionType.PRISON ||
        user.institution?.type === InstitutionType.PRISON_ADMIN
      : false
  }

  const storeAndRemoveErrorIfValid = (field: string, value: string) => {
    setUser({
      ...user,
      [field]: value,
    })

    const fieldValidation = validations[field]

    if (
      !fieldValidation.validations?.some(
        (v) => validate(value, v).isValid === false,
      ) &&
      fieldValidation.setErrorMessage
    ) {
      fieldValidation.setErrorMessage(undefined)
    }
  }

  const validateAndSetError = (field: string, value: string) => {
    const fieldValidation = validations[field]

    const error = fieldValidation.validations
      ?.map((v) => validate(value, v))
      .find((v) => v.isValid === false)

    if (error && fieldValidation.setErrorMessage) {
      fieldValidation.setErrorMessage(error.errorMessage)
    }
  }

  return (
    <div>
      <FormContentContainer>
        <Box marginBottom={7}>
          <Text as="h1" variant="h1">
            Notandi
          </Text>
        </Box>
        <Box marginBottom={2}>
          <Input
            name="name"
            label="Nafn"
            placeholder="Fullt nafn"
            autoComplete="off"
            defaultValue={user.name}
            onChange={(event) =>
              storeAndRemoveErrorIfValid('name', event.target.value)
            }
            onBlur={(event) => validateAndSetError('name', event.target.value)}
            hasError={nameErrorMessage !== undefined}
            errorMessage={nameErrorMessage}
            required
          />
        </Box>
        <Box marginBottom={2}>
          <InputMask
            mask="999999-9999"
            maskPlaceholder={null}
            onChange={(event) =>
              storeAndRemoveErrorIfValid(
                'nationalId',
                event.target.value.replace('-', ''),
              )
            }
            onBlur={(event) =>
              validateAndSetError('nationalId', event.target.value)
            }
            readOnly={user.id.length > 0 ? true : false}
          >
            <Input
              data-testid="nationalId"
              name="nationalId"
              label="Kennitala"
              placeholder="Kennitala"
              autoComplete="off"
              defaultValue={user.nationalId}
              required
              hasError={nationalIdErrorMessage !== undefined}
              errorMessage={nationalIdErrorMessage}
            />
          </InputMask>
        </Box>
        <Box>
          <Box marginBottom={2} className={styles.roleContainer}>
            <Box className={styles.roleColumn}>
              <RadioButton
                name="role"
                id="roleProsecutor"
                label="Saksóknari"
                checked={user.role === UserRole.PROSECUTOR}
                onChange={() => setUser({ ...user, role: UserRole.PROSECUTOR })}
                large
              />
            </Box>
            <Box className={styles.roleColumn}>
              <RadioButton
                name="role"
                id="roleJudge"
                label="Dómari"
                checked={user.role === UserRole.JUDGE}
                onChange={() => setUser({ ...user, role: UserRole.JUDGE })}
                large
              />
            </Box>
            <Box className={styles.roleColumn}>
              <RadioButton
                name="role"
                id="roleRegistrar"
                label="Dómritari"
                checked={user.role === UserRole.REGISTRAR}
                onChange={() => setUser({ ...user, role: UserRole.REGISTRAR })}
                large
              />
            </Box>
          </Box>
          <Box marginBottom={2} className={styles.roleContainer}>
            <Box className={styles.roleColumn}>
              <RadioButton
                name="role"
                id="roleStaff"
                label="Fangelsisyfirvöld"
                checked={user.role === UserRole.STAFF}
                onChange={() => setUser({ ...user, role: UserRole.STAFF })}
                large
              />
            </Box>
          </Box>
        </Box>
        <Box marginBottom={2}>
          <Select
            name="institution"
            label="Veldu stofnun"
            defaultValue={usersInstitution}
            options={selectInstitutions}
            onChange={(selectedOption: ValueType<ReactSelectOption>) =>
              setUser({
                ...user,
                institution: (selectedOption as ExtendedOption).institution,
              })
            }
            required
          />
        </Box>
        <Box marginBottom={2}>
          <Input
            name="title"
            label="Titill"
            autoComplete="off"
            defaultValue={user.title}
            onChange={(event) =>
              storeAndRemoveErrorIfValid('title', event.target.value)
            }
            onBlur={(event) => validateAndSetError('title', event.target.value)}
            required
            hasError={titleErrorMessage !== undefined}
            errorMessage={titleErrorMessage}
          />
        </Box>
        <Box marginBottom={2}>
          <InputMask
            mask="999-9999"
            maskPlaceholder={null}
            onChange={(event) =>
              storeAndRemoveErrorIfValid(
                'mobileNumber',
                event.target.value.replace('-', ''),
              )
            }
            onBlur={(event) =>
              validateAndSetError('mobileNumber', event.target.value)
            }
          >
            <Input
              data-testid="mobileNumber"
              name="mobileNumber"
              label="Símanúmer"
              placeholder="Símanúmer"
              autoComplete="off"
              defaultValue={user.mobileNumber}
              required
              hasError={mobileNumberErrorMessage !== undefined}
              errorMessage={mobileNumberErrorMessage}
            />
          </InputMask>
        </Box>
        <Box marginBottom={2}>
          <Input
            name="email"
            label="Netfang"
            placeholder=""
            autoComplete="off"
            defaultValue={user.email}
            onChange={(event) =>
              storeAndRemoveErrorIfValid('email', event.target.value)
            }
            onBlur={(event) => validateAndSetError('email', event.target.value)}
            required
            hasError={emailErrorMessage !== undefined}
            errorMessage={emailErrorMessage}
          />
        </Box>
        <Box marginBottom={2}>
          <Checkbox
            name="active"
            label="Virkur notandi"
            checked={user.active}
            onChange={({ target }) =>
              setUser({ ...user, active: target.checked })
            }
            large
            filled
          />
        </Box>
      </FormContentContainer>
      <FormContentContainer isFooter>
        <FormFooter
          onNextButtonClick={() => props.onSave(user)}
          nextIsDisabled={!isValid()}
          nextIsLoading={props.loading}
          nextButtonText="Vista"
          previousUrl={constants.USER_LIST_ROUTE}
        />
      </FormContentContainer>
    </div>
  )
}

export default UserForm
