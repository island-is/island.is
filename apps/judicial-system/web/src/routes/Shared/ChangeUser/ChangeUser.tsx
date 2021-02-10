import React, { useEffect, useState, useContext, useMemo } from 'react'
import cn from 'classnames'
import {
  AlertMessage,
  Box,
  Checkbox,
  Input,
  RadioButton,
  Select,
  Text,
} from '@island.is/island-ui/core'
import {
  BlueBox,
  FormFooter,
  Loading,
  PageLayout,
} from '@island.is/judicial-system-web/src/shared-components'
import { User, UserRole } from '@island.is/judicial-system/types'
import * as styles from './ChangeUser.treat'
import * as Constants from '@island.is/judicial-system-web/src/utils/constants'
import { useQuery } from '@apollo/client'
import { useHistory, useParams } from 'react-router-dom'
import { UsersQuery } from '@island.is/judicial-system-web/src/utils/mutations'
import InputMask from 'react-input-mask'
import { ReactSelectOption } from '../../../types'
import { ValueType } from 'react-select/src/types'

interface UserData {
  users: User[]
}

export const ChangeUser: React.FC = () => {
  const history = useHistory()

  const { data, loading } = useQuery<UserData>(UsersQuery, {
    fetchPolicy: 'no-cache',
    errorPolicy: 'all',
  })

  const { id } = useParams<{ id: string }>()

  const [user, setUser] = useState<User>()

  const [nationalIdErrorMessage, setNationalIdErrorMessage] = useState<string>(
    '',
  )

  const [mobileNumberErrorMessage, setMobileNumberErrorMessage] = useState<
    string
  >('')

  useEffect(() => {
    if (data && id) {
      setUser(data.users.find((u) => u.id === id))
    }
  }, [data, id, setUser])

  useEffect(() => {
    document.title = 'Breyta notenda - Réttarvörslugátt'
  }, [])

  const institutions = [
    {
      label: 'Héraðsdómur Reykjavíkur',
      value: 'Héraðsdómur Reykjavíkur',
    },
    {
      label: 'Lögreglustjórinn á höfuðborgarsvæðinu',
      value: 'Lögreglustjórinn á höfuðborgarsvæðinu',
    }
  ]

  const defaultInstitution = institutions.find(
    (institution) => institution.label === user?.institution,
  )

  const saveUser = async () => {
    
  }

  return (
    <PageLayout
      showSidepanel={false}
      isLoading={loading}
      notFound={!data?.users}
    >
      {user && (
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
                setUser({ ...user, name: event.target.value })
              }
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
            >
              <Input
                data-testid="nationalId"
                name="nationalId"
                label="Kennitala"
                placeholder="Kennitala"
                defaultValue={user.nationalId}
                errorMessage={nationalIdErrorMessage}
                hasError={nationalIdErrorMessage !== ''}
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
              defaultValue={defaultInstitution}
              options={institutions}
              onChange={(selectedOption: ValueType<ReactSelectOption>) =>
                setUser({ ...user, institution: (selectedOption as ReactSelectOption).label })
              }
            />
          </Box>
          <Box marginBottom={2}>
            <Input
              name="title"
              label="Titill"
              placeholder=""
              defaultValue={user.title}
              onChange={(event) =>
                setUser({ ...user, title: event.target.value })
              }
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
                errorMessage={mobileNumberErrorMessage}
                hasError={mobileNumberErrorMessage !== ''}
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
              onChange={(event) =>
                setUser({ ...user, email: event.target.value })
              }
            />
          </Box>
          <Box marginBottom={2}>
            <Checkbox
                  name="active"
                  label="Notandinn er virkur"
                  checked={user.active}
                  onChange={({ target }) => setUser({ ...user, active: target.checked })}
                  large
                  filled
                />
          </Box>
        </>
      )}
      <FormFooter
            onNextButtonClick={async () => await saveUser()}
            nextIsDisabled={false}
            nextIsLoading={true}
          />
    </PageLayout>
  )
}

export default ChangeUser
