import React, { useState } from 'react'
import {
  Box,
  Checkbox,
  Input,
  RadioButton,
  Select,
  Text,
} from '@island.is/island-ui/core'
import { FormFooter } from '@island.is/judicial-system-web/src/shared-components'
import { User, UserRole } from '@island.is/judicial-system/types'
import * as styles from './UserForm.treat'
import InputMask from 'react-input-mask'
import { ReactSelectOption } from '../../../types'
import { ValueType } from 'react-select/src/types'
import { isNextDisabled } from '../../../utils/stepHelper'
import { validate, Validation } from '../../../utils/validate'

interface Props {
  user: User
  onSave: (user: User) => void
  loading: boolean
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

  const institutions = [
    {
      label: 'Héraðsdómur Reykjavíkur',
      value: 'Héraðsdómur Reykjavíkur',
    },
    {
      label: 'Lögreglustjórinn á höfuðborgarsvæðinu',
      value: 'Lögreglustjórinn á höfuðborgarsvæðinu',
    },
    {
      label: 'Bráðabirgðadómstóllinn',
      value: 'Bráðabirgðadómstóllinn',
    },
    {
      label: 'Bráðabirgðalögreglustjórinn',
      value: 'Bráðabirgðalögreglustjórinn',
    },
  ]

  const usersInstitution = institutions.find(
    (institution) => institution.label === user?.institution,
  )

  const isSaveDisabled = () => {
    return isNextDisabled([
      {
        value: user.name,
        validations: ['empty'],
      },
      {
        value: user.nationalId,
        validations: ['empty', 'national-id'],
      },
      {
        value: user.institution,
        validations: ['empty'],
      },
      {
        value: user.title,
        validations: ['empty'],
      },
      {
        value: user.mobileNumber,
        validations: ['empty'],
      },
      {
        value: user.email,
        validations: ['empty', 'email-format'],
      },
    ])
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

    const isValid = !validations.some(
      (validation) => validate(value, validation).isValid === false,
    )

    if (isValid) {
      setErrorMessage(undefined)
    }
  }

  const validateAndSetError = (
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
          mask="999999-9999"
          maskPlaceholder={null}
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
              onChange={() => setUser({ ...user, role: UserRole.PROSECUTOR })}
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
              onChange={() => setUser({ ...user, role: UserRole.REGISTRAR })}
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
              institution: (selectedOption as ReactSelectOption).label,
            })
          }
          required
        />
      </Box>
      <Box marginBottom={2}>
        <Input
          name="title"
          label="Titill"
          placeholder=""
          defaultValue={user.title}
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
        >
          <Input
            data-testid="mobileNumber"
            name="mobileNumber"
            label="Síma númer"
            placeholder="Síma númer"
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
          label="Virkja notendan"
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
        nextIsDisabled={isSaveDisabled()}
        nextIsLoading={props.loading}
        nextButtonText="Vista"
      />
    </>
  )
}

export default UserForm
