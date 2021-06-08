import React, { useEffect, useState, useContext, useReducer } from 'react'
import { Logo, Text, Box, Link } from '@island.is/island-ui/core'
import { useRouter } from 'next/router'
import {
  AdminLayout,
  ApplicationTable,
  GeneratedProfile,
  GenerateName,
  LogoHfj,
} from '../../components'

import * as styles from './login.treat'
import cn from 'classnames'

const Login = () => {
  return (
    <div className={` wrapper ${styles.gridWrapper}`}>
      <div className={styles.logo}>
        <Box className={`logoContainer`}>
          <Logo />
        </Box>
      </div>
      <Box display="flex" className={`${styles.logoHfjContainer} `}>
        <Box className={`logoHfj`}>
          <LogoHfj />
        </Box>

        <Box paddingLeft={2} marginLeft={2} className={`headLine`}>
          <Text as="h1" lineHeight="sm">
            <strong>Sveita</strong> • Umsóknir um <br /> fjárhagsaðstoð
          </Text>
        </Box>
      </Box>

      <Box className={styles.loginContainer}>
        <Text as="h1" variant="h1" marginBottom={2}>
          Skráðu þig inn til að vinna úr umsóknum um fjárhagsaðstoð.
        </Text>
        <Text marginBottom={[2, 2, 4]}>
          Skráðu þig inn til að vinna úr umsóknum um fjárhagsaðstoð.
        </Text>

        <Link href="/api/auth/login?nationalId=0000000000">innskraning</Link>

        {/* <Button
          onClick={() => {
            // router.push('/api/auth/login?nationalId=0000000000')
          }}
        >
          Innskráning
        </Button> */}
      </Box>
    </div>
  )
}

export default Login
