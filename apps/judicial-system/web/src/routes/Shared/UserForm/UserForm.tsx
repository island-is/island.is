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

interface props {
  user: User
  onSave: (user: User) => void
  loading: boolean
}

export const UserForm: React.FC<props> = (props) => {
  const [user, setUser] = useState<User>(props.user)

  const institutions = [
    {
      label: 'Héraðsdómur Reykjavíkur',
      value: 'Héraðsdómur Reykjavíkur',
    },
    {
      label: 'Lögreglustjórinn á höfuðborgarsvæðinu',
      value: 'Lögreglustjórinn á höfuðborgarsvæðinu',
    },
  ]

  const usersInstitution = institutions.find(
    (institution) => institution.label === user?.institution,
  )

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
          onChange={(event) => setUser({ ...user, name: event.target.value })}
          required
        />
      </Box>
      <Box marginBottom={2}>
        <InputMask
          mask="999999-9999"
          maskPlaceholder={null}
          onChange={(event) =>
            setUser({ ...user, nationalId: event.target.value })
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
        />
      </Box>
      <Box marginBottom={2}>
        <Input
          name="title"
          label="Titill"
          placeholder=""
          defaultValue={user.title}
          onChange={(event) => setUser({ ...user, title: event.target.value })}
          required
        />
      </Box>
      <Box marginBottom={2}>
        <InputMask
          mask="999-9999"
          maskPlaceholder={null}
          onChange={(event) =>
            setUser({ ...user, mobileNumber: event.target.value })
          }
        >
          <Input
            data-testid="mobileNumber"
            name="mobileNumber"
            label="Síma númer"
            placeholder="Síma númer"
            defaultValue={user.mobileNumber}
            required
          />
        </InputMask>
      </Box>
      <Box marginBottom={2}>
        <Input
          name="email"
          label="Netfang"
          placeholder=""
          defaultValue={user.email}
          onChange={(event) => setUser({ ...user, email: event.target.value })}
          required
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
        onNextButtonClick={async () => await props.onSave(user)}
        nextIsDisabled={false}
        nextIsLoading={props.loading}
        nextButtonText="Vista"
      />
    </>
  )
}

export default UserForm
