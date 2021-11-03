import React, { useEffect, useState } from 'react'
import { useQuery } from '@apollo/client'

import { Text, Box, Divider, Input, Checkbox } from '@island.is/island-ui/core'
import * as styles from './user.css'
import cn from 'classnames'
import { UserProfile } from '../../components'

export const User = () => {
  const inputFields = [
    {
      label: 'Kennitala',
    },
    {
      label: 'Netfang',
      bgIsBlue: true,
    },
    {
      label: 'Stutt nafn',
    },
  ]

  return (
    <>
      <UserProfile />
    </>
  )
}

export default User
