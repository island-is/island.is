import React, { useState } from 'react'
import InputMask from 'react-input-mask'
import { ValueType } from 'react-select/src/types'

import {
  Box,
  Checkbox,
  Input,
  RadioButton,
  Select,
  Text,
} from '@island.is/island-ui/core'
import {
  FormContentContainer,
  FormFooter,
} from '@island.is/judicial-system-web/src/components'
import {
  Institution,
  InstitutionType,
  User,
  UserRole,
} from '@island.is/judicial-system-web/src/graphql/schema'
import * as constants from '@island.is/judicial-system/consts'

import { ReactSelectOption } from '../../../types'
import {
  isAdminUserFormValid,
  validate,
  Validation,
} from '../../../utils/validate'
import * as styles from './UserForm.css'
import {
  isCourtRole,
  isProsecutionRole,
} from '@island.is/judicial-system/types'

type ExtendedOption = ReactSelectOption & { institution: Institution }

interface Props {
  user: User
  courts: Institution[]
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

  const selectInstitutions = (isProsecutionRole(user.role)
    ? props.prosecutorsOffices
    : isCourtRole(user.role)
    ? props.allCourts
    : user.role === UserRole.Assistant
    ? props.courts
    : user.role === UserRole.Staff
    ? props.prisonInstitutions
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

    return isProsecutionRole(user.role)
      ? user.institution?.type === InstitutionType.ProsecutorsOffice
      : isCourtRole(user.role)
      ? user.institution?.type === InstitutionType.Court ||
        user.institution?.type === InstitutionType.HighCourt
      : user.role === UserRole.Assistant
      ? user.institution?.type === InstitutionType.Court
      : user.role === UserRole.Staff
      ? user.institution?.type === InstitutionType.Prison ||
        user.institution?.type === InstitutionType.PrisonAdmin
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

    if (validate([[value, validations]]).isValid) {
      setErrorMessage(undefined)
    }
  }

  const validateAndSetError = (
    value: string,
    validations: Validation[],
    setErrorMessage: (value: React.SetStateAction<string | undefined>) => void,
  ) => {
    const validation = validate([[value, validations]])

    if (!validation.isValid) {
      setErrorMessage(validation.errorMessage)
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
            // eslint-disable-next-line local-rules/disallow-kennitalas
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
                checked={user.role === UserRole.Prosecutor}
                onChange={() => setUser({ ...user, role: UserRole.Prosecutor })}
                large
              />
            </Box>
            <Box className={styles.roleColumn}>
              <RadioButton
                name="role"
                id="roleRepresentative"
                label="Fulltrúi"
                checked={user.role === UserRole.Representative}
                onChange={() =>
                  setUser({ ...user, role: UserRole.Representative })
                }
                large
              />
            </Box>
          </Box>
          <Box marginBottom={2} className={styles.roleContainer}>
            <Box className={styles.roleColumn}>
              <RadioButton
                name="role"
                id="roleJudge"
                label="Dómari"
                checked={user.role === UserRole.Judge}
                onChange={() => setUser({ ...user, role: UserRole.Judge })}
                large
              />
            </Box>
            <Box className={styles.roleColumn}>
              <RadioButton
                name="role"
                id="roleRegistrar"
                label="Dómritari"
                checked={user.role === UserRole.Registrar}
                onChange={() => setUser({ ...user, role: UserRole.Registrar })}
                large
              />
            </Box>
          </Box>
          <Box marginBottom={2} className={styles.roleContainer}>
            <Box className={styles.roleColumn}>
              <RadioButton
                name="role"
                id="roleAssistant"
                label="Aðstoðarmaður dómara"
                checked={user.role === UserRole.Assistant}
                onChange={() => setUser({ ...user, role: UserRole.Assistant })}
                large
              />
            </Box>
            <Box className={styles.roleColumn}>
              <RadioButton
                name="role"
                id="roleStaff"
                label="Fangelsisyfirvöld"
                checked={user.role === UserRole.Staff}
                onChange={() => setUser({ ...user, role: UserRole.Staff })}
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
          previousUrl={constants.USERS_ROUTE}
        />
      </FormContentContainer>
    </div>
  )
}

export default UserForm
