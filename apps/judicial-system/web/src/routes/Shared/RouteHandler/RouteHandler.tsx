import { FC, useCallback, useContext, useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/router'

import { Box, LoadingDots, Text } from '@island.is/island-ui/core'
import {
  FormContext,
  UserContext,
} from '@island.is/judicial-system-web/src/components'
import { Case } from '@island.is/judicial-system-web/src/graphql/schema'

import { getRoute } from './RouteHandler.logic'
import * as styles from './RouteHandler.css'

export const policeDigitalCaseFileNotPublishedResult = Object.freeze({
  kind: 'police_digital_case_file_not_published' as const,
})

export type PoliceDigitalCaseFileNotPublishedResult =
  typeof policeDigitalCaseFileNotPublishedResult

export type RouteHandlerResolveResult =
  | string
  | null
  | undefined
  | PoliceDigitalCaseFileNotPublishedResult

const isPoliceDigitalCaseFileNotPublishedResult = (
  value: RouteHandlerResolveResult,
): value is PoliceDigitalCaseFileNotPublishedResult =>
  typeof value === 'object' &&
  value !== null &&
  'kind' in value &&
  value.kind === 'police_digital_case_file_not_published'

interface Props {
  resolve?: () => Promise<RouteHandlerResolveResult>
}

const RouteHandler: FC<Props> = ({ resolve }) => {
  const router = useRouter()
  const { user } = useContext(UserContext)
  const { getCase } = useContext(FormContext)
  const [caseToOpen, setCaseToOpen] = useState<Case>()
  const [resolveView, setResolveView] = useState<'loading' | 'notPublished'>(
    'loading',
  )
  const resolveRef = useRef(resolve)

  resolveRef.current = resolve

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
    if (!resolveRef.current) return
    resolveRef.current().then((result) => {
      if (result === undefined) {
        return
      }
      if (isPoliceDigitalCaseFileNotPublishedResult(result)) {
        setResolveView('notPublished')
        return
      }
      if (typeof result === 'string' && result) {
        window.location.href = result
        return
      }
      new BroadcastChannel('police-digital-file-redirect').postMessage({
        type: 'error',
      })
      window.close()
    })
  }, [router])

  useEffect(() => {
    if (resolve) return
    handleGetCase(router.query.id?.toString())
  }, [resolve, handleGetCase, router.query.id])

  useEffect(() => {
    if (resolve || !caseToOpen || !user) return
    router.push(getRoute(caseToOpen, user))
  }, [resolve, caseToOpen, router, user])

  return (
    <Box className={styles.loadingContainer}>
      {resolveView === 'notPublished' ? (
        <Text>
          Tenging við öruggt gagnasvæði í vinnslu. Reynið aftur síðar.
        </Text>
      ) : (
        <LoadingDots />
      )}
    </Box>
  )
}

export default RouteHandler
