import {
  Dispatch,
  FC,
  SetStateAction,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react'
import { InputMask } from '@react-input/mask'

import {
  Box,
  Checkbox,
  Input,
  RadioButton,
  Select,
} from '@island.is/island-ui/core'
import * as constants from '@island.is/judicial-system/consts'
import {
  formatNationalId,
  formatPhoneNumber,
} from '@island.is/judicial-system/formatters'
import {
  getAdminUserInstitutionScope,
  getAdminUserInstitutionUserRoles,
  isCoreUser,
  isProsecutorsOffice,
} from '@island.is/judicial-system/types'
import {
  FormContentContainer,
  FormFooter,
  PageTitle,
  UserContext,
} from '@island.is/judicial-system-web/src/components'
import {
  Institution,
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

interface UserRoleRadioButtonProps {
  userRole: UserRole
  user: User
  setUser: Dispatch<SetStateAction<User>>
  disabled?: boolean
}

const UserRoleRadioButton: FC<UserRoleRadioButtonProps> = ({
  userRole,
  user,
  setUser,
  disabled,
}) => {
  return (
    <RadioButton
      name="role"
      id={userRole}
      label={userRoleToString(userRole)}
      checked={user.role === userRole}
      onChange={() => setUser((prevUser) => ({ ...prevUser, role: userRole }))}
      disabled={disabled}
      large
    />
  )
}

interface UserRolePairProps {
  userRole1: UserRole
  userRole2: UserRole
  user: User
  setUser: Dispatch<SetStateAction<User>>
  disabled?: boolean
}

const UserRolePair: FC<UserRolePairProps> = ({
  userRole1,
  userRole2,
  user,
  setUser,
  disabled,
}) => {
  return (
    <Box className={styles.roleRow}>
      <Box className={styles.roleColumn}>
        <UserRoleRadioButton
          userRole={userRole1}
          user={user}
          setUser={setUser}
          disabled={disabled}
        />
      </Box>
      <Box className={styles.roleColumn}>
        {userRole2 && (
          <UserRoleRadioButton
            userRole={userRole2}
            user={user}
            setUser={setUser}
            disabled={disabled}
          />
        )}
      </Box>
    </Box>
  )
}

interface RolesRadioButtonsProps {
  userRoles: UserRole[]
  user: User
  setUser: Dispatch<SetStateAction<User>>
  disabled?: boolean
}

const RolesRadioButtons: FC<RolesRadioButtonsProps> = ({
  userRoles,
  user,
  setUser,
  disabled,
}) => {
  const rolePairs = []

  for (let i = 0; i < userRoles.length; i += 2) {
    const userRole1 = userRoles[i]
    const userRole2 = userRoles[i + 1] // may be undefined if odd number of roles

    rolePairs.push(
      <UserRolePair
        key={userRole1}
        userRole1={userRole1}
        userRole2={userRole2}
        user={user}
        setUser={setUser}
        disabled={disabled}
      />,
    )
  }

  return rolePairs
}

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
  const { user: admin } = useContext(UserContext)

  const [user, setUser] = useState<User>({
    ...existingUser,
    nationalId: existingUser.nationalId,
    mobileNumber: existingUser.mobileNumber,
  })

  const { personData, error } = useNationalRegistry(user.nationalId)

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
        setUser((prevUser) => ({ ...prevUser, name: name }))
      }
    },
    [user],
  )

  useEffect(() => {
    if (error || (personData && personData.items?.length === 0)) {
      setNationalIdErrorMessage('Kennitala fannst ekki í þjóðskrá')
      return
    }

    if (personData && personData.items && personData.items.length > 0) {
      setNationalIdErrorMessage(undefined)
      setName(personData.items[0].name)
    }
  }, [personData, error, setName])

  const selectInstitutions = institutions
    .filter(
      (institution) =>
        institution.type &&
        getAdminUserInstitutionScope(admin).includes(institution.type),
    )
    .map((institution) => ({
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
    setUser((prevUser) => ({ ...prevUser, [field]: value }))

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
            component={Input}
            mask={constants.SSN}
            replacement={{ _: /\d/ }}
            value={formatNationalId(user.nationalId)}
            onChange={(event) =>
              storeAndRemoveErrorIfValid(
                'nationalId',
                event.target.value,
                ['empty', 'national-id'],
                setNationalIdErrorMessage,
              )
            }
            onBlur={(event) =>
              validateAndSetError(
                event.target.value,
                ['empty', 'national-id'],
                setNationalIdErrorMessage,
              )
            }
            readOnly={!isNewUser}
            data-testid="nationalId"
            name="nationalId"
            label="Kennitala"
            placeholder="Kennitala"
            autoComplete="off"
            required
            hasError={nationalIdErrorMessage !== undefined}
            errorMessage={nationalIdErrorMessage}
          />
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
              setUser((prevUser) => ({
                ...prevUser,
                institution: (selectedOption as ExtendedOption).institution,
              }))
            }
            isDisabled={!isNewUser}
            required
          />
        </Box>
        {user.institution?.type && (
          <RolesRadioButtons
            userRoles={getAdminUserInstitutionUserRoles(
              admin,
              user.institution?.type,
            )}
            user={user}
            setUser={setUser}
            disabled={!isNewUser}
          />
        )}
        {isProsecutorsOffice(user.institution?.type) &&
          user.role === UserRole.PROSECUTOR && (
            <Box marginBottom={2}>
              <Checkbox
                name="canConfirmIndictment"
                label="Notandi getur staðfest ákærur"
                checked={Boolean(user.canConfirmIndictment)}
                onChange={({ target }) =>
                  setUser((prevUser) => ({
                    ...prevUser,
                    canConfirmIndictment: target.checked,
                  }))
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
            component={Input}
            mask={constants.PHONE_NUMBER}
            replacement={{ _: /\d/ }}
            value={formatPhoneNumber(user.mobileNumber)}
            onChange={(event) =>
              storeAndRemoveErrorIfValid(
                'mobileNumber',
                event.target.value,
                ['empty'],
                setMobileNumberErrorMessage,
              )
            }
            onBlur={(event) =>
              validateAndSetError(
                event.target.value,
                ['empty'],
                setMobileNumberErrorMessage,
              )
            }
            data-testid="mobileNumber"
            name="mobileNumber"
            label="Símanúmer"
            placeholder="Símanúmer"
            autoComplete="off"
            required
            hasError={mobileNumberErrorMessage !== undefined}
            errorMessage={mobileNumberErrorMessage}
          />
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
              setUser((prevUser) => ({ ...prevUser, active: target.checked }))
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
