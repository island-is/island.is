import React, { useContext, useEffect } from 'react'
import { useQuery } from '@apollo/client'
import {
  GetApplicationQuery,
  GetCurrentUserQuery,
} from '@island.is/financial-aid-web/osk/graphql/sharedGql'
import { Application } from '@island.is/financial-aid/shared'
import { Button, GridContainer } from '@island.is/island-ui/core'
import { useRouter } from 'next/router'

interface ApplicationData {
  applications: Application[]
}

const Index = () => {
  const router = useRouter()
  // const { data, error, loading } = useQuery<ApplicationData>(
  //   GetApplicationQuery,
  //   {
  //     fetchPolicy: 'no-cache',
  //     errorPolicy: 'all',
  //   },
  // )

  useEffect(() => {
    document.title = 'Umsókn um fjárhagsaðstoð'
  }, [])

  const { data, error, loading } = useQuery(GetCurrentUserQuery, {
    fetchPolicy: 'no-cache',
    errorPolicy: 'all',
  })

  return (
    <div className="">
      <GridContainer>
        <Button
          onClick={() => {
            router.push('/api/auth/login?nationalId=0000000000')
          }}
          data-testid="logout-button"
          preTextIconType="filled"
          size="small"
          type="button"
          variant="primary"
        >
          Login
        </Button>
      </GridContainer>
    </div>
  )
}

export default Index
