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
import {
  InstitutionType,
  isCourtRole,
  isProsecutionRole,
  UserRole,
} from '@island.is/judicial-system/types'
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
    : user.role === UserRole.ASSISTANT
    ? props.courts
    : user.role === UserRole.STAFF
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
      ? user.institution?.type === InstitutionType.PROSECUTORS_OFFICE
      : isCourtRole(user.role)
      ? user.institution?.type === InstitutionType.COURT ||
        user.institution?.type === InstitutionType.HIGH_COURT
      : user.role === UserRole.ASSISTANT
      ? user.institution?.type === InstitutionType.COURT
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
                checked={user.role === UserRole.PROSECUTOR}
                onChange={() => setUser({ ...user, role: UserRole.PROSECUTOR })}
                large
              />
            </Box>
            <Box className={styles.roleColumn}>
              <RadioButton
                name="role"
                id="roleRepresentative"
                label="Fulltrúi"
                checked={user.role === UserRole.REPRESENTATIVE}
                onChange={() =>
                  setUser({ ...user, role: UserRole.REPRESENTATIVE })
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
                id="roleAssistant"
                label="Aðstoðarmaður dómara"
                checked={user.role === UserRole.ASSISTANT}
                onChange={() => setUser({ ...user, role: UserRole.ASSISTANT })}
                large
              />
            </Box>
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
