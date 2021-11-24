import React, { useContext } from 'react'
import { Box, Text } from '@island.is/island-ui/core'
import {
  formatHomeAddress,
  formatNationalId,
} from '@island.is/financial-aid/shared/lib'

import * as styles from './summary.css'
import cn from 'classnames'

import { AppContext } from '@island.is/financial-aid-web/osk/src/components/AppProvider/AppProvider'

const UserInfo = () => {
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

          {nationalRegistryData && (
            <>
              <Text fontWeight="semiBold">Heimili</Text>
              <Text>{formatHomeAddress(nationalRegistryData)}</Text>
            </>
          )}
        </Box>
      )}

      <Box className={styles.contactInfo}>
        {user && (
          <>
            <Text fontWeight="semiBold">Kennitala</Text>
            <Text>{formatNationalId(user.nationalId)}</Text>
          </>
        )}
      </Box>
    </Box>
  )
}

export default UserInfo
