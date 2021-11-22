import React, { useEffect } from 'react'
import { useLazyQuery } from '@apollo/client'

import {
  ProfileNotFound,
  ApplicationSkeleton,
  LoadingContainer,
  MunicipalityProfile,
} from '@island.is/financial-aid-web/veita/src/components'
import { MunicipalityQuery } from '@island.is/financial-aid-web/veita/graphql'
import { useRouter } from 'next/router'
import { Municipality as MunicipalityType } from '@island.is/financial-aid/shared/lib'

export const Municipality = () => {
  const router = useRouter()

  const [getMunicipality, { data, loading }] = useLazyQuery<{
    municipality: MunicipalityType
  }>(MunicipalityQuery, {
    variables: { input: { id: router.query.id } },
    fetchPolicy: 'no-cache',
    errorPolicy: 'all',
  })

  useEffect(() => {
    getMunicipality()
  }, [])

  return (
    <LoadingContainer isLoading={loading} loader={<ApplicationSkeleton />}>
      {data ? (
        <MunicipalityProfile
          municipality={data.municipality}
          getMunicipality={getMunicipality}
        />
      ) : (
        <ProfileNotFound backButtonHref="/sveitarfelog" />
      )}
    </LoadingContainer>
  )
}

export default Municipality
