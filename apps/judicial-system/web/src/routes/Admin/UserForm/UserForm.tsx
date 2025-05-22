import { FC, SetStateAction, useCallback, useEffect, useState } from 'react'
import InputMask from 'react-input-mask'

import {
  Box,
  Checkbox,
  Input,
  RadioButton,
  Select,
} from '@island.is/island-ui/core'
import * as constants from '@island.is/judicial-system/consts'
import {
  isCoreUser,
  isProsecutorsOffice,
  prosecutorsOfficeTypes,
} from '@island.is/judicial-system/types'
import {
  FormContentContainer,
  FormFooter,
  PageTitle,
} from '@island.is/judicial-system-web/src/components'
import {
  Institution,
  InstitutionType,
  User,
  UserRole,
} from '@island.is/judicial-system-web/src/graphql/schema'
import { useNationalRegistry } from '@island.is/judicial-system-web/src/utils/hooks'

import { ReactSelectOption } from '../../../types'
import {
  isAdminUserFormValid,
  validate,
  Validation,
} from '../../../utils/validate'
import { userRoleToString } from '../userRoleToString'
import * as styles from './UserForm.css'

type ExtendedOption = ReactSelectOption & { institution: Institution }

interface Props {
  user: User
  institutions: Institution[]
  onSave: (user: User) => void
  loading: boolean
}

export const UserForm: FC<Props> = ({
  user: existingUser,
  institutions,
  onSave,
  loading,
}) => {
  const [user, setUser] = useState<User>(existingUser)

  const { personData, personError } = useNationalRegistry(user.nationalId)

  const [nameErrorMessage, setNameErrorMessage] = useState<string>()
  const [nationalIdErrorMessage, setNationalIdErrorMessage] = useState<string>()

  const [titleErrorMessage, setTitleErrorMessage] = useState<string>()
  const [mobileNumberErrorMessage, setMobileNumberErrorMessage] =
    useState<string>()
  const [emailErrorMessage, setEmailErrorMessage] = useState<string>()

  const isNewUser = user.id.length === 0

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

  const selectInstitutions = institutions.map((institution) => ({
    label: institution.name ?? '',
    value: institution.id,
    institution,
  }))

  const usersInstitution = selectInstitutions.find(
    (institution) => institution.value === user.institution?.id,
  )

  const isValid = isAdminUserFormValid(user) && isCoreUser(user)

  const storeAndRemoveErrorIfValid = (
    field: string,
    value: string,
    validations: Validation[],
    setErrorMessage: (value: SetStateAction<string | undefined>) => void,
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
    setErrorMessage: (value: SetStateAction<string | undefined>) => void,
  ) => {
    const validation = validate([[value, validations]])

    if (!validation.isValid) {
      setErrorMessage(validation.errorMessage)
    }
  }

  const saveUser = () => {
    onSave({
      ...user,
      // Make sure only prosecutors can confirm indictments
      canConfirmIndictment:
        user.role === UserRole.PROSECUTOR && user.canConfirmIndictment,
    })
  }

  return (
    <div className={styles.userFormContainer}>
      <FormContentContainer>
        <PageTitle>Notandi</PageTitle>
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
            readOnly={!isNewUser}
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
            isDisabled={!isNewUser}
            required
          />
        </Box>
        {isProsecutorsOffice(user.institution?.type) ? (
          <>
            <Box className={styles.roleRow}>
              <Box className={styles.roleColumn}>
                <RadioButton
                  name="role"
                  id="roleProsecutor"
                  label={userRoleToString(UserRole.PROSECUTOR)}
                  checked={user.role === UserRole.PROSECUTOR}
                  onChange={() =>
                    setUser({ ...user, role: UserRole.PROSECUTOR })
                  }
                  large
                />
              </Box>
              <Box className={styles.roleColumn}>
                <RadioButton
                  name="role"
                  id="roleProsecutorRepresentative"
                  label={userRoleToString(UserRole.PROSECUTOR_REPRESENTATIVE)}
                  checked={user.role === UserRole.PROSECUTOR_REPRESENTATIVE}
                  onChange={() =>
                    setUser({
                      ...user,
                      role: UserRole.PROSECUTOR_REPRESENTATIVE,
                    })
                  }
                  large
                />
              </Box>
            </Box>
            <Box className={styles.roleRow}>
              {user.institution?.type ===
              InstitutionType.PUBLIC_PROSECUTORS_OFFICE ? (
                <>
                  <Box className={styles.roleColumn}>
                    <RadioButton
                      name="role"
                      id="rolePublicProsecutorStaff"
                      label={userRoleToString(UserRole.PUBLIC_PROSECUTOR_STAFF)}
                      checked={user.role === UserRole.PUBLIC_PROSECUTOR_STAFF}
                      onChange={() =>
                        setUser({
                          ...user,
                          role: UserRole.PUBLIC_PROSECUTOR_STAFF,
                        })
                      }
                      large
                    />
                  </Box>
                  <Box className={styles.roleColumn}>
                    <RadioButton
                      name="role"
                      id="roleLocalAdmin"
                      label={userRoleToString(UserRole.LOCAL_ADMIN)}
                      checked={user.role === UserRole.LOCAL_ADMIN}
                      onChange={() =>
                        setUser({ ...user, role: UserRole.LOCAL_ADMIN })
                      }
                      large
                    />
                  </Box>
                </>
              ) : (
                <>
                  <Box className={styles.roleColumn}>
                    <RadioButton
                      name="role"
                      id="roleLocalAdmin"
                      label={userRoleToString(UserRole.LOCAL_ADMIN)}
                      checked={user.role === UserRole.LOCAL_ADMIN}
                      onChange={() =>
                        setUser({ ...user, role: UserRole.LOCAL_ADMIN })
                      }
                      large
                    />
                  </Box>
                  <Box className={styles.roleColumn} />
                </>
              )}
            </Box>
          </>
        ) : user.institution?.type === InstitutionType.DISTRICT_COURT ? (
          <>
            <Box className={styles.roleRow}>
              <Box className={styles.roleColumn}>
                <RadioButton
                  name="role"
                  id="roleJudge"
                  label={userRoleToString(UserRole.DISTRICT_COURT_JUDGE)}
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
                  label={userRoleToString(UserRole.DISTRICT_COURT_REGISTRAR)}
                  checked={user.role === UserRole.DISTRICT_COURT_REGISTRAR}
                  onChange={() =>
                    setUser({
                      ...user,
                      role: UserRole.DISTRICT_COURT_REGISTRAR,
                    })
                  }
                  large
                />
              </Box>
            </Box>
            <Box className={styles.roleRow}>
              <Box className={styles.roleColumn}>
                <RadioButton
                  name="role"
                  id="roleAssistant"
                  label={userRoleToString(UserRole.DISTRICT_COURT_ASSISTANT)}
                  checked={user.role === UserRole.DISTRICT_COURT_ASSISTANT}
                  onChange={() =>
                    setUser({
                      ...user,
                      role: UserRole.DISTRICT_COURT_ASSISTANT,
                    })
                  }
                  large
                />
              </Box>
              <Box className={styles.roleColumn}>
                <RadioButton
                  name="role"
                  id="roleLocalAdmin"
                  label={userRoleToString(UserRole.LOCAL_ADMIN)}
                  checked={user.role === UserRole.LOCAL_ADMIN}
                  onChange={() =>
                    setUser({ ...user, role: UserRole.LOCAL_ADMIN })
                  }
                  large
                />
              </Box>
            </Box>
          </>
        ) : user.institution?.type === InstitutionType.COURT_OF_APPEALS ? (
          <>
            <Box className={styles.roleRow}>
              <Box className={styles.roleColumn}>
                <RadioButton
                  name="role"
                  id="roleJudge"
                  label={userRoleToString(UserRole.COURT_OF_APPEALS_JUDGE)}
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
                  label={userRoleToString(UserRole.COURT_OF_APPEALS_REGISTRAR)}
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
            </Box>
            <Box className={styles.roleRow}>
              <Box className={styles.roleColumn}>
                <RadioButton
                  name="role"
                  id="roleAssistant"
                  label={userRoleToString(UserRole.COURT_OF_APPEALS_ASSISTANT)}
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
              <Box className={styles.roleColumn}>
                <RadioButton
                  name="role"
                  id="roleLocalAdmin"
                  label={userRoleToString(UserRole.LOCAL_ADMIN)}
                  checked={user.role === UserRole.LOCAL_ADMIN}
                  onChange={() =>
                    setUser({ ...user, role: UserRole.LOCAL_ADMIN })
                  }
                  large
                />
              </Box>
            </Box>
          </>
        ) : user.institution?.type === InstitutionType.PRISON ||
          user.institution?.type === InstitutionType.PRISON_ADMIN ? (
          <Box className={styles.roleRow}>
            <Box className={styles.roleColumn}>
              <RadioButton
                name="role"
                id="rolePrisonSystemStaff"
                label={userRoleToString(UserRole.PRISON_SYSTEM_STAFF)}
                checked={user.role === UserRole.PRISON_SYSTEM_STAFF}
                onChange={() =>
                  setUser({ ...user, role: UserRole.PRISON_SYSTEM_STAFF })
                }
                large
              />
            </Box>
            <Box className={styles.roleColumn}>
              <RadioButton
                name="role"
                id="roleLocalAdmin"
                label={userRoleToString(UserRole.LOCAL_ADMIN)}
                checked={user.role === UserRole.LOCAL_ADMIN}
                onChange={() =>
                  setUser({ ...user, role: UserRole.LOCAL_ADMIN })
                }
                large
              />
            </Box>
          </Box>
        ) : null}
        {isProsecutorsOffice(user.institution?.type) &&
          user.role === UserRole.PROSECUTOR && (
            <Box marginBottom={2}>
              <Checkbox
                name="canConfirmIndictment"
                label="Notandi getur staðfest kærur"
                checked={Boolean(user.canConfirmIndictment)}
                onChange={({ target }) =>
                  setUser({ ...user, canConfirmIndictment: target.checked })
                }
                large
                filled
              />
            </Box>
          )}
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
            checked={Boolean(user.active)}
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
          onNextButtonClick={saveUser}
          nextIsDisabled={!isValid}
          nextIsLoading={loading}
          nextButtonText="Vista"
          previousUrl={constants.USERS_ROUTE}
        />
      </FormContentContainer>
    </div>
  )
}

export default UserForm
