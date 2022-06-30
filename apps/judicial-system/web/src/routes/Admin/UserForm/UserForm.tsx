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
} from '@island.is/judicial-system-web/src/components'
import { InstitutionType, UserRole } from '@island.is/judicial-system/types'
import type { Institution, User } from '@island.is/judicial-system/types'
import { ReactSelectOption } from '../../../types'
import {
  isAdminUserFormValid,
  validate,
  Validation,
} from '../../../utils/validate'
import * as styles from './UserForm.css'
import * as constants from '@island.is/judicial-system/consts'
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

  const isValid = () => {
    // TODO: Find a better way to validate the match between user role and institution type
    if (!isAdminUserFormValid(user)) {
      return false
    }

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

  const storeAndRemoveErrorIfValid = (
    field: string,
    value: string,
    validations: Validation[],
    setErrorMessage: (value: React.SetStateAction<string | undefined>) => void,
  ) => {
    setUser({
      ...user,
      [field]: value,
    })

    validations.forEach((validation) => {
      if (validate(value, validation).isValid) {
        setErrorMessage(undefined)
      }
    })
  }

  const validateAndSetError = (
    field: string,
    value: string,
    validations: Validation[],
    setErrorMessage: (value: React.SetStateAction<string | undefined>) => void,
  ) => {
    const error = validations
      .map((v) => validate(value, v))
      .find((v) => v.isValid === false)

    if (error) {
      setErrorMessage(error.errorMessage)
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
            value={user.name || ''}
            onChange={(event) =>
              storeAndRemoveErrorIfValid(
                'name',
                event.target.value,
                ['empty'],
                setNameErrorMessage,
              )
            }
            onBlur={(event) =>
              validateAndSetError(
                'name',
                event.target.value,
                ['empty'],
                setNameErrorMessage,
              )
            }
            hasError={nameErrorMessage !== undefined}
            errorMessage={nameErrorMessage}
            required
          />
        </Box>
        <Box marginBottom={2}>
          <InputMask
            mask="999999-9999"
            maskPlaceholder={null}
            value={user.nationalId || ''}
            onChange={(event) =>
              storeAndRemoveErrorIfValid(
                'nationalId',
                event.target.value.replace('-', ''),
                ['empty', 'national-id'],
                setNationalIdErrorMessage,
              )
            }
            onBlur={(event) =>
              validateAndSetError(
                'nationalId',
                event.target.value.replace('-', ''),
                ['empty', 'national-id'],
                setNationalIdErrorMessage,
              )
            }
            readOnly={user.id.length > 0 ? true : false}
          >
            <Input
              data-testid="nationalId"
              name="nationalId"
              label="Kennitala"
              placeholder="Kennitala"
              autoComplete="off"
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
            value={usersInstitution}
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
            value={user.title || ''}
            onChange={(event) =>
              storeAndRemoveErrorIfValid(
                'title',
                event.target.value,
                ['empty'],
                setTitleErrorMessage,
              )
            }
            onBlur={(event) =>
              validateAndSetError(
                'title',
                event.target.value,
                ['empty'],
                setTitleErrorMessage,
              )
            }
            required
            hasError={titleErrorMessage !== undefined}
            errorMessage={titleErrorMessage}
          />
        </Box>
        <Box marginBottom={2}>
          <InputMask
            mask="999-9999"
            maskPlaceholder={null}
            value={user.mobileNumber || ''}
            onChange={(event) =>
              storeAndRemoveErrorIfValid(
                'mobileNumber',
                event.target.value.replace('-', ''),
                ['empty'],
                setMobileNumberErrorMessage,
              )
            }
            onBlur={(event) =>
              validateAndSetError(
                'mobileNumber',
                event.target.value.replace('-', ''),
                ['empty'],
                setMobileNumberErrorMessage,
              )
            }
          >
            <Input
              data-testid="mobileNumber"
              name="mobileNumber"
              label="Símanúmer"
              placeholder="Símanúmer"
              autoComplete="off"
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
            value={user.email || ''}
            onChange={(event) =>
              storeAndRemoveErrorIfValid(
                'email',
                event.target.value,
                ['empty', 'email-format'],
                setEmailErrorMessage,
              )
            }
            onBlur={(event) =>
              validateAndSetError(
                'email',
                event.target.value,
                ['empty', 'email-format'],
                setEmailErrorMessage,
              )
            }
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
