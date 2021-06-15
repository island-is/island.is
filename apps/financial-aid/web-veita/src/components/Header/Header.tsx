import React, { useContext } from 'react'
import {
  Logo,
  Text,
  Box,
  Button,
  GridContainer,
} from '@island.is/island-ui/core'
import { useRouter } from 'next/router'
import Link from 'next/link'

import * as styles from './Header.treat'

const Header: React.FC = () => {
  const router = useRouter()
  // const { isAuthenticated, setUser, user } = useContext(UserContext)

  return <header>header</header>
}

export default Header
