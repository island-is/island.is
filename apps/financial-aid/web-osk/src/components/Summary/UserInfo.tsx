import React, { useContext } from 'react'
import { Box, Text } from '@island.is/island-ui/core'
import {
  formatNationalId,
  formatPhoneNumber,
} from '@island.is/financial-aid/shared/lib'

import * as styles from './summary.treat'
import cn from 'classnames'

import { UserContext } from '@island.is/financial-aid-web/osk/src/components/UserProvider/UserProvider'

const UserInfo = () => {
  const { user } = useContext(UserContext)

  // TODO when þjóðskrá is up and running
  return (
    <Box
      display="flex"
      alignItems="flexStart"
      paddingY={[4, 4, 5]}
      className={cn({
        [`${styles.userInfoContainer}`]: true,
      })}
    >
      <Box className={styles.mainInfo}>
        <Text fontWeight="semiBold">Nafn</Text>
        <Text marginBottom={3}>{user?.name}</Text>

        <Text fontWeight="semiBold">Kennitala</Text>
        {user?.nationalId && <Text>{formatNationalId(user.nationalId)}</Text>}
      </Box>

      <Box className={styles.contactInfo}>
        <Text fontWeight="semiBold">Sími</Text>
        {user?.phoneNumber && (
          <Text marginBottom={3}>{formatPhoneNumber(user.phoneNumber)}</Text>
        )}

        <Text fontWeight="semiBold">Heimili</Text>
        <Text>Hafnargata 3, 220 Hafnarfjörður</Text>
      </Box>
    </Box>
  )
}

export default UserInfo
