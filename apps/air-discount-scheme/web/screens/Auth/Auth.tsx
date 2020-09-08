import React, { useEffect } from 'react'
import { useRouter } from 'next/router'

import {
  Box,
  SkeletonLoader,
  GridRow,
  GridColumn,
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
    router.replace(redirectUrl)
  }, [router, toRoute])

  return (
    <Layout
      main={
        <GridRow>
          <GridColumn
            span={['12/12', '12/12', '12/12', '12/12', '7/9']}
            offset={[null, null, null, null, '1/9']}
          >
            <Box marginBottom={[3, 3, 3, 12]}>
              <Box marginBottom={6}>
                <SkeletonLoader height={300} />
              </Box>
              <Box marginBottom={10}>
                <SkeletonLoader height={250} />
              </Box>
              <SkeletonLoader height={300} />
            </Box>
          </GridColumn>
        </GridRow>
      }
      aside={
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
