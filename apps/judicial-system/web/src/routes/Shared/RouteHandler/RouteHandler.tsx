import { useCallback, useContext, useEffect, useState } from 'react'
import { useRouter } from 'next/router'

import { Box, LoadingDots } from '@island.is/island-ui/core'
import {
  CLOSED_INDICTMENT_OVERVIEW_ROUTE,
  INDICTMENTS_OVERVIEW_ROUTE,
} from '@island.is/judicial-system/consts'
import {
  isCompletedCase,
  isIndictmentCase,
  isProsecutionUser,
} from '@island.is/judicial-system/types'
import {
  FormContext,
  UserContext,
} from '@island.is/judicial-system-web/src/components'
import { useCaseLazyQuery } from '@island.is/judicial-system-web/src/components/FormProvider/case.generated'
import { Case } from '@island.is/judicial-system-web/src/graphql/schema'

import * as styles from './RouteHandler.css'

const RouteHandler: React.FC = () => {
  const router = useRouter()
  const { user } = useContext(UserContext)
  const { getCase } = useContext(FormContext)
  const [caseToOpen, setCaseToOpen] = useState<Case>()
  const [queryCase] = useCaseLazyQuery({
    fetchPolicy: 'no-cache',
    errorPolicy: 'all',
  })

  const handleGetCase = useCallback(
    (caseId?: string) => {
      if (!caseId) {
        router.push('/')
        return
      }

      if (!caseToOpen) {
        getCase(
          caseId,
          (caseData) => setCaseToOpen(caseData),
          () => router.push('/'),
        )
      }
    },
    [caseToOpen, getCase, router],
  )

  useEffect(() => {
    handleGetCase(router.query.id?.toString())

    if (caseToOpen) {
      if (isIndictmentCase(caseToOpen.type)) {
        if (isProsecutionUser(user)) {
          if (isCompletedCase(caseToOpen.state)) {
            router.push(
              `${CLOSED_INDICTMENT_OVERVIEW_ROUTE}/${router.query.id}`,
            )
            return
          } else {
            router.push(`${INDICTMENTS_OVERVIEW_ROUTE}/${router.query.id}`)
            return
          }
        } else {
          router.push('/e')
          return
        }
      }
    }
  }, [caseToOpen, handleGetCase, queryCase, router, user])

  return (
    <Box className={styles.loadingContainer}>
      <LoadingDots />
    </Box>
  )
}

export default RouteHandler
