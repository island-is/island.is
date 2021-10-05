import React, { useContext } from 'react'
import { Input, Checkbox, Box } from '@island.is/island-ui/core'

import { UserContext } from '@island.is/financial-aid-web/osk/src/components/UserProvider/UserProvider'
import {
  focusOnNextInput,
  isEmailValid,
  sanitizeNationalId,
} from '@island.is/financial-aid/shared/lib'

interface Props {
  hasError: boolean
  acceptData: boolean
  setAcceptData: (event: React.ChangeEvent<HTMLInputElement>) => void
  removeError: () => void
}

const SpouseInfo = ({
  hasError,
  acceptData,
  setAcceptData,
  removeError,
}: Props) => {
  const { user, setUser } = useContext(UserContext)

  if (!user) {
    return null
  }
  return (
    <>
      <Box marginBottom={[2, 2, 3]} marginTop={[1, 1, 0]}>
        <Input
          label="Kennitala maka"
          name="nationalIdSpouse"
          placeholder="Sláðu inn kennitölu maka"
          backgroundColor="blue"
          hasError={
            (hasError && !user?.spouse?.nationalId) ||
            (hasError && user?.spouse?.nationalId?.length !== 10)
          }
          value={user?.spouse?.nationalId}
          maxLength={10}
          onChange={(event) => {
            setUser({
              ...user,
              spouse: {
                ...user.spouse,
                nationalId: sanitizeNationalId(event.target.value),
              },
            })
            removeError()

            focusOnNextInput(event, 'email')
          }}
        />
      </Box>

      <Box marginBottom={[2, 2, 3]}>
        <Input
          label="Netfang maka"
          name="emailSpouse"
          id="email"
          placeholder="Sláðu inn netfang maka"
          backgroundColor="blue"
          hasError={
            (hasError && !user?.spouse?.email) ||
            (hasError && !isEmailValid(user?.spouse?.email))
          }
          type="email"
          value={user?.spouse?.email}
          onChange={(event) => {
            removeError()
            setUser({
              ...user,
              spouse: {
                ...user.spouse,
                email: event.target.value,
              },
            })
          }}
        />
      </Box>

      <Box marginBottom={[5, 5, 10]}>
        <Checkbox
          name={'accept'}
          id="accept"
          backgroundColor="blue"
          label="Ég skil að maki minn þarf líka að skila inn umsókn áður en úrvinnsla hefst"
          large
          checked={acceptData}
          onChange={setAcceptData}
          hasError={hasError && !acceptData}
          errorMessage={'Verður að samþykkja'}
        />
      </Box>
    </>
  )
}

export default SpouseInfo
