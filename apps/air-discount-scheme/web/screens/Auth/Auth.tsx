import React, { useEffect } from 'react'
import { useRouter } from 'next/router'

import {
  Box,
  ContentBlock,
  SkeletonLoader,
  Stack,
} from '@island.is/island-ui/core'
import { useI18n } from '@island.is/air-discount-scheme-web/i18n'
import { REDIRECT_KEY } from '@island.is/air-discount-scheme-web/consts'
import { Layout } from '@island.is/air-discount-scheme-web/components'

function Auth() {
  const { toRoute } = useI18n()
  const router = useRouter()
  useEffect(() => {
    const redirectUrl =
      localStorage.getItem(REDIRECT_KEY) ?? toRoute('myBenefits', 'is')
    router.push(redirectUrl)
  }, [])

  return (
    <Layout
      left={
        <Box marginBottom={[3, 3, 3, 12]}>
          <Box marginBottom={6}>
            <SkeletonLoader height={300} />
          </Box>
          <Box marginBottom={10}>
            <SkeletonLoader height={250} />
          </Box>
          <SkeletonLoader height={300} />
        </Box>
      }
      right={
        <Box>
          <Box marginBottom={6}>
            <SkeletonLoader height={200} />
          </Box>
          <SkeletonLoader height={150} />
        </Box>
      }
    />
  )
}

export default Auth
