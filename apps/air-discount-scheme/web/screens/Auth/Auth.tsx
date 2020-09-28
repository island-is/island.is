import React, { useEffect } from 'react'
import { useRouter } from 'next/router'

import {
  Box,
  SkeletonLoader,
  GridContainer,
  GridRow,
  GridColumn,
} from '@island.is/island-ui/core'
import { useI18n } from '@island.is/air-discount-scheme-web/i18n'
import { REDIRECT_KEY } from '@island.is/air-discount-scheme-web/consts'

function Auth() {
  const { toRoute } = useI18n()
  const router = useRouter()
  useEffect(() => {
    const redirectUrl =
      localStorage.getItem(REDIRECT_KEY) ?? toRoute('myBenefits', 'is')
    router.replace(redirectUrl)
  }, [router, toRoute])

  return (
    <GridContainer>
      <GridRow>
        <GridColumn span={['12/12', '12/12', '7/12', '8/12', '9/12']}>
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
        </GridColumn>
        <GridColumn span={['12/12', '12/12', '5/12', '4/12', '3/12']}>
          <Box>
            <Box marginBottom={6}>
              <SkeletonLoader height={200} />
            </Box>
            <SkeletonLoader height={150} />
          </Box>
        </GridColumn>
      </GridRow>
    </GridContainer>
  )
}

export default Auth
