import React, { useEffect } from 'react'
import { Logo, Text, Box, Link } from '@island.is/island-ui/core'

import { LogoMunicipality } from '@island.is/financial-aid-web/veita/src/components'

import * as styles from './Login.treat'

const Login = () => {
  useEffect(() => {
    document.title = 'Veita • Innskráning'
  }, [])
  return (
    <div className={` wrapper ${styles.gridWrapper}`}>
      <div className={styles.logo}>
        <Box className={`logoContainer`}>
          <Logo />
        </Box>
      </div>
      <Box display="flex" className={`${styles.logoHfjContainer} `}>
        <Box className={`logoHfj`}>
          <LogoMunicipality />
        </Box>

        <Box paddingLeft={2} marginLeft={2} className={`headLine`}>
          <Text as="h1" lineHeight="sm">
            <strong>Veita</strong> • Umsóknir um <br /> fjárhagsaðstoð
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

        <Link href="/api/auth/login?service=veita">Innskraning</Link>
        <br />
        <br />
        <Link href="/api/auth/login?nationalId=0000000002&service=veita">
          Plat notandi
        </Link>
      </Box>
    </div>
  )
}

export default Login
