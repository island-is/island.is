import React, { useCallback, useEffect, useState } from 'react'
import InputMask from 'react-input-mask'

import {
  Box,
  Checkbox,
  Input,
  RadioButton,
  Select,
  Text,
} from '@island.is/island-ui/core'
import * as constants from '@island.is/judicial-system/consts'
import { isCoreUser } from '@island.is/judicial-system/types'
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
import useNationalRegistry from '@island.is/judicial-system-web/src/utils/hooks/useNationalRegistry'

import { ReactSelectOption } from '../../../types'
import {
  isAdminUserFormValid,
  validate,
  Validation,
} from '../../../utils/validate'
import * as styles from './UserForm.css'

type ExtendedOption = ReactSelectOption & { institution: Institution }

interface Props {
  user: User
  institutions: Institution[]
  onSave: (user: User) => void
  loading: boolean
}

export const UserForm: React.FC<React.PropsWithChildren<Props>> = (props) => {
  const [user, setUser] = useState<User>(props.user)

  const { personData, personError } = useNationalRegistry(user.nationalId)

  const [nameErrorMessage, setNameErrorMessage] = useState<string>()
  const [nationalIdErrorMessage, setNationalIdErrorMessage] = useState<string>()

  const [titleErrorMessage, setTitleErrorMessage] = useState<string>()
  const [mobileNumberErrorMessage, setMobileNumberErrorMessage] =
    useState<string>()
  const [emailErrorMessage, setEmailErrorMessage] = useState<string>()

  const setName = useCallback(
    (name: string) => {
      if (name !== user.name) {
        setUser({
          ...user,
          name: name,
        })
      }
    },
    [user],
  )

  useEffect(() => {
    if (personError || (personData && personData.items?.length === 0)) {
      setNationalIdErrorMessage('Kennitala fannst ekki í þjóðskrá')
      return
    }

    if (personData && personData.items && personData.items.length > 0) {
      setNationalIdErrorMessage(undefined)
      setName(personData.items[0].name)
    }
  }, [personData, personError, setName])

  const selectInstitutions = props.institutions.map((institution) => ({
    label: institution.name,
    value: institution.id,
    institution,
  }))

  const usersInstitution = selectInstitutions.find(
    (institution) => institution.value === user.institution?.id,
  )

  const isValid = () => {
    return isAdminUserFormValid(user) && isCoreUser(user)
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
    <div className={styles.userFormContainer}>
      <FormContentContainer>
        <Box marginBottom={7}>
          <Text as="h1" variant="h1">
            Notandi
          </Text>
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
          <Select
            name="institution"
            label="Veldu stofnun"
            value={usersInstitution}
            options={selectInstitutions}
            onChange={(selectedOption) =>
              setUser({
                ...user,
                institution: (selectedOption as ExtendedOption).institution,
              })
            }
            required
          />
        </Box>
        {user.institution?.type === InstitutionType.PROSECUTORS_OFFICE ? (
          <Box display="flex" marginBottom={2}>
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
                id="roleProsecutorRepresentative"
                label="Fulltrúi"
                checked={user.role === UserRole.PROSECUTOR_REPRESENTATIVE}
                onChange={() =>
                  setUser({ ...user, role: UserRole.PROSECUTOR_REPRESENTATIVE })
                }
                large
              />
            </Box>
          </Box>
        ) : user.institution?.type === InstitutionType.DISTRICT_COURT ? (
          <Box display="flex" marginBottom={2}>
            <Box className={styles.roleColumn}>
              <RadioButton
                name="role"
                id="roleJudge"
                label="Dómari"
                checked={user.role === UserRole.DISTRICT_COURT_JUDGE}
                onChange={() =>
                  setUser({ ...user, role: UserRole.DISTRICT_COURT_JUDGE })
                }
                large
              />
            </Box>
            <Box className={styles.roleColumn}>
              <RadioButton
                name="role"
                id="roleRegistrar"
                label="Dómritari"
                checked={user.role === UserRole.DISTRICT_COURT_REGISTRAR}
                onChange={() =>
                  setUser({ ...user, role: UserRole.DISTRICT_COURT_REGISTRAR })
                }
                large
              />
            </Box>
            <Box className={styles.roleColumn}>
              <RadioButton
                name="role"
                id="roleAssistant"
                label="Aðstoðarmaður dómara"
                checked={user.role === UserRole.DISTRICT_COURT_ASSISTANT}
                onChange={() =>
                  setUser({ ...user, role: UserRole.DISTRICT_COURT_ASSISTANT })
                }
                large
              />
            </Box>
          </Box>
        ) : user.institution?.type === InstitutionType.COURT_OF_APPEALS ? (
          <Box display="flex" marginBottom={2}>
            <Box className={styles.roleColumn}>
              <RadioButton
                name="role"
                id="roleJudge"
                label="Dómari"
                checked={user.role === UserRole.COURT_OF_APPEALS_JUDGE}
                onChange={() =>
                  setUser({ ...user, role: UserRole.COURT_OF_APPEALS_JUDGE })
                }
                large
              />
            </Box>
            <Box className={styles.roleColumn}>
              <RadioButton
                name="role"
                id="roleRegistrar"
                label="Dómritari"
                checked={user.role === UserRole.COURT_OF_APPEALS_REGISTRAR}
                onChange={() =>
                  setUser({
                    ...user,
                    role: UserRole.COURT_OF_APPEALS_REGISTRAR,
                  })
                }
                large
              />
            </Box>
            <Box className={styles.roleColumn}>
              <RadioButton
                name="role"
                id="roleAssistant"
                label="Aðstoðarmaður dómara"
                checked={user.role === UserRole.COURT_OF_APPEALS_ASSISTANT}
                onChange={() =>
                  setUser({
                    ...user,
                    role: UserRole.COURT_OF_APPEALS_ASSISTANT,
                  })
                }
                large
              />
            </Box>
          </Box>
        ) : user.institution?.type === InstitutionType.PRISON ||
          user.institution?.type === InstitutionType.PRISON_ADMIN ? (
          <Box display="flex" marginBottom={2}>
            <Box className={styles.roleColumn}>
              <RadioButton
                name="role"
                id="rolePrisonSystemStaff"
                label="Fangelsisyfirvöld"
                checked={user.role === UserRole.PRISON_SYSTEM_STAFF}
                onChange={() =>
                  setUser({ ...user, role: UserRole.PRISON_SYSTEM_STAFF })
                }
                large
              />
            </Box>
          </Box>
        ) : null}
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
          nextButtonIcon="arrowForward"
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
