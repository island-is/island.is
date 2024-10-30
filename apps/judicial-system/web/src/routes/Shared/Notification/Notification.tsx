import { useContext, useEffect, useState } from 'react'
import { useRouter } from 'next/router'

import { LoadingDots } from '@island.is/island-ui/core'
import {
  CLOSED_INDICTMENT_OVERVIEW_ROUTE,
  INDICTMENTS_OVERVIEW_ROUTE,
} from '@island.is/judicial-system/consts'
import {
  isCompletedCase,
  isProsecutionUser,
} from '@island.is/judicial-system/types'
import {
  FormContext,
  UserContext,
} from '@island.is/judicial-system-web/src/components'
import { useCaseLazyQuery } from '@island.is/judicial-system-web/src/components/FormProvider/case.generated'
import { Case } from '@island.is/judicial-system-web/src/graphql/schema'

const Notification: React.FC = () => {
  const router = useRouter()
  const { user } = useContext(UserContext)
  const [c, setC] = useState<Case>()
  const [queryCase] = useCaseLazyQuery({
    fetchPolicy: 'no-cache',
    errorPolicy: 'all',
  })

  useEffect(() => {
    queryCase({
      variables: { input: { id: router.query.id?.toString() || '' } },
    }).then((cData) => setC(cData.data as Case))
  }, [queryCase, router.query.id])

  useEffect(() => {
    if (c) {
      console.log(isCompletedCase(c.state), c.state)
      if (isProsecutionUser(user)) {
        if (isCompletedCase(c.state)) {
          router.push(`${CLOSED_INDICTMENT_OVERVIEW_ROUTE}/${router.query.id}`)
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
  }, [c, queryCase, router, user])

  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        background: 'white',
        width: '100vw',
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <LoadingDots />
    </div>
  )
}

export default Notification
