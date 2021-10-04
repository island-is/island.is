import React, { ChangeEvent, useCallback, useContext, useState } from 'react'
import { Input, Checkbox, Box, Text } from '@island.is/island-ui/core'

import { UserContext } from '@island.is/financial-aid-web/osk/src/components/UserProvider/UserProvider'
import {
  focusOnNextInput,
  sanitizeNationalId,
} from '@island.is/financial-aid/shared/lib'

interface Props {
  hasError: boolean
  acceptData: boolean
  setAcceptData:
    | ((event: React.ChangeEvent<HTMLInputElement>) => void)
    | undefined
}

const SpouseInfo = ({ hasError, acceptData, setAcceptData }: Props) => {
  const { user, setUser } = useContext(UserContext)

  return (
    <>
      <Box marginBottom={[2, 2, 3]}>
        <Input
          label="Kennitala maka"
          name="nationalIdSpouse"
          placeholder="Sláðu inn kennitölu maka"
          backgroundColor="blue"
          hasError={hasError && !user?.spouse?.nationalId}
          value={user?.spouse?.nationalId}
          maxLength={10}
          onChange={(event) => {
            if (user) {
              setUser({
                ...user,
                spouse: {
                  nationalId: sanitizeNationalId(event.target.value),
                },
              })
            }

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
          hasError={hasError && !user?.spouse?.email}
          type="email"
          value={user?.spouse?.email}
          onChange={(event) => {
            if (user) {
              setUser({
                ...user,
                spouse: {
                  email: event.target.value,
                },
              })
            }
          }}
        />
      </Box>
      <Box cursor="pointer" marginBottom={[5, 5, 10]}>
        <Checkbox
          name={'accept'}
          id="accept"
          backgroundColor="blue"
          label="Ég skil að ofangreindra gagna verður aflað í umsóknar- og staðfestingarferlinu"
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
