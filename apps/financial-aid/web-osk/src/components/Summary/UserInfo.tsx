import React, { useContext } from 'react'
import { Box, Text } from '@island.is/island-ui/core'
import {
  formatHomeAddress,
  formatNationalId,
  formatPhoneNumber,
} from '@island.is/financial-aid/shared/lib'

import * as styles from './summary.treat'
import cn from 'classnames'

import { AppContext } from '@island.is/financial-aid-web/osk/src/components/AppProvider/AppProvider'

interface Props {
  phoneNumber?: string
}

const UserInfo = ({ phoneNumber }: Props) => {
  const { user, nationalRegistryData } = useContext(AppContext)

  return (
    <Box
      display="flex"
      alignItems="flexStart"
      paddingY={[4, 4, 5]}
      className={cn({
        [`${styles.userInfoContainer}`]: true,
      })}
    >
      {user && (
        <Box className={styles.mainInfo}>
          <Text fontWeight="semiBold">Nafn</Text>
          <Text marginBottom={3}>{user.name}</Text>

          <Text fontWeight="semiBold">Kennitala</Text>
          <Text>{formatNationalId(user.nationalId)}</Text>
        </Box>
      )}

      <Box className={styles.contactInfo}>
        {phoneNumber && (
          <>
            <Text fontWeight="semiBold">Sími</Text>
            <Text marginBottom={3}>{formatPhoneNumber(phoneNumber)}</Text>
          </>
        )}
        {nationalRegistryData && (
          <>
            <Text fontWeight="semiBold">Heimili</Text>
            <Text>{formatHomeAddress(nationalRegistryData)}</Text>
          </>
        )}
      </Box>
    </Box>
  )
}

export default UserInfo
