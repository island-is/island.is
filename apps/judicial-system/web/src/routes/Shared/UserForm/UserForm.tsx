import React, { useEffect, useState } from 'react'
import {
  AlertMessage,
  Box,
  Checkbox,
  Input,
  Option,
  RadioButton,
  Select,
  Text,
} from '@island.is/island-ui/core'
import InputMask from 'react-input-mask'
import { ValueType } from 'react-select/src/types'
import {
  FormFooter,
  Loading,
} from '@island.is/judicial-system-web/src/shared-components'
import { Institution, User, UserRole } from '@island.is/judicial-system/types'
import { ReactSelectOption } from '../../../types'
import { validate, Validation } from '../../../utils/validate'
import * as styles from './UserForm.treat'
import { useQuery } from '@apollo/client'
import { InstitutionsQuery } from '@island.is/judicial-system-web/src/utils/mutations'

interface Props {
  user: User
  onSave: (user: User) => void
  loading: boolean
}

interface FieldValidation {
  validations: Validation[]
  errorMessage?: string | undefined
  setErrorMessage?: React.Dispatch<React.SetStateAction<string | undefined>>
}

interface InstitutionData {
  institutions: Institution[]
}

export const UserForm: React.FC<Props> = (props) => {
  const [user, setUser] = useState<User>(props.user)
  const [nameErrorMessage, setNameErrorMessage] = useState<string>()
  const [nationalIdErrorMessage, setNationalIdErrorMessage] = useState<string>()
  const [titleErrorMessage, setTitleErrorMessage] = useState<string>()
  const [mobileNumberErrorMessage, setMobileNumberErrorMessage] = useState<
    string
  >()
  const [emailErrorMessage, setEmailErrorMessage] = useState<string>()
  const [institutions, setInstitutions] = useState<Option[]>()

  const { data, loading, error } = useQuery<InstitutionData>(
    InstitutionsQuery,
    {
      fetchPolicy: 'no-cache',
      errorPolicy: 'all',
    },
  )

  useEffect(() => {
    if (data) {
      setInstitutions(
        data.institutions.map((institution) => {
          return {
            label: institution.name,
            value: institution.id,
          }
        }),
      )
    }
  }, [data, setInstitutions])

  const usersInstitution = institutions?.find(
    (institution) => institution.label === user?.institution?.name,
  )

  const validations: { [key: string]: FieldValidation } = {
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
        validation.validations.some((v) => validate(value, v).isValid === false)
      ) {
        return false
      }
    }

    return true
  }

  const storeAndRemoveErrorIfValid = (field: string, value: string) => {
    setUser({
      ...user,
      [field]: value,
    })

    const fieldValidation = validations[field]

    if (
      !fieldValidation.validations.some(
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
      .map((v) => validate(value, v))
      .find((v) => v.isValid === false)

    if (error && fieldValidation.setErrorMessage) {
      fieldValidation.setErrorMessage(error.errorMessage)
    }
  }

  return (
    <div>
      {institutions && (
        <>
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
              defaultValue={user.name}
              onChange={(event) =>
                storeAndRemoveErrorIfValid('name', event.target.value)
              }
              onBlur={(event) =>
                validateAndSetError('name', event.target.value)
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
              onChange={(event) =>
                storeAndRemoveErrorIfValid('nationalId', event.target.value)
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
                  onChange={() =>
                    setUser({ ...user, role: UserRole.PROSECUTOR })
                  }
                  large
                  filled
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
                  filled
                />
              </Box>
              <Box className={styles.roleColumn}>
                <RadioButton
                  name="role"
                  id="roleRegistrar"
                  label="Dómritari"
                  checked={user.role === UserRole.REGISTRAR}
                  onChange={() =>
                    setUser({ ...user, role: UserRole.REGISTRAR })
                  }
                  large
                  filled
                />
              </Box>
            </Box>
          </Box>
          <Box marginBottom={2}>
            <Select
              name="institution"
              label="Veldu stofnun"
              defaultValue={usersInstitution}
              options={institutions}
              onChange={(selectedOption: ValueType<ReactSelectOption>) =>
                setUser({
                  ...user,
                  institution: data?.institutions.find(
                    (institution) =>
                      institution.id ===
                      ((selectedOption as ReactSelectOption).value as string),
                  ),
                })
              }
              required
            />
          </Box>
          <Box marginBottom={2}>
            <Input
              name="title"
              label="Titill"
              defaultValue={user.title}
              onChange={(event) =>
                storeAndRemoveErrorIfValid('title', event.target.value)
              }
              onBlur={(event) =>
                validateAndSetError('title', event.target.value)
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
              onChange={(event) =>
                storeAndRemoveErrorIfValid('mobileNumber', event.target.value)
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
              defaultValue={user.email}
              onChange={(event) =>
                storeAndRemoveErrorIfValid('email', event.target.value)
              }
              onBlur={(event) =>
                validateAndSetError('email', event.target.value)
              }
              required
              hasError={emailErrorMessage !== undefined}
              errorMessage={emailErrorMessage}
            />
          </Box>
          <Box marginBottom={2}>
            <Checkbox
              name="active"
              label="Virkja notandann"
              checked={user.active}
              onChange={({ target }) =>
                setUser({ ...user, active: target.checked })
              }
              large
              filled
            />
          </Box>
          <FormFooter
            onNextButtonClick={() => props.onSave(user)}
            nextIsDisabled={!isValid()}
            nextIsLoading={props.loading}
            nextButtonText="Vista"
          />
        </>
      )}
      {loading && (
        <Box>
          <Loading />
        </Box>
      )}
      {error && (
        <div data-testid="user-form-error">
          <AlertMessage
            title="Ekki tókst að sækja gögn úr gagnagrunni"
            message="Ekki tókst að ná sambandi við gagnagrunn. Málið hefur verið skráð og viðeigandi aðilar látnir vita. Vinsamlega reynið aftur síðar."
            type="error"
          />
        </div>
      )}
    </div>
  )
}

export default UserForm
