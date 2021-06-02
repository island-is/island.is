import React, { useContext } from 'react'
import {
  Logo,
  Text,
  Box,
  Button,
  GridContainer,
  ButtonProps,
} from '@island.is/island-ui/core'
import { useRouter } from 'next/router'
import Link from 'next/link'

import * as styles from './Profile.treat'
import cn from 'classnames'

interface Props {
  heading: string
  info: [
    {
      title: string
      content: string
    },
  ]
}

const Profile: React.FC<Props> = ({ heading, info }) => {
  const router = useRouter()
  // const { isAuthenticated, setUser, user } = useContext(UserContext)

  return (
    <>
      {' '}
      <Text as="h2" variant="h3" marginBottom={[2, 2, 3]} color="dark300">
        {heading}
      </Text>
      <div className={styles.container}>
        {info.map((item) => {
          return (
            <Box>
              <Text fontWeight="semiBold" marginBottom={1}>
                {item.title}
              </Text>
              <Text>{item.content}</Text>
            </Box>
          )
        })}
      </div>
    </>
  )
}

export default Profile
