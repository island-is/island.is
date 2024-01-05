import React, { useContext, useEffect, useState } from 'react'

import { useRouter } from 'next/router'

import { useQuery } from '@apollo/client'
import { ApplicationQuery } from '@island.is/financial-aid-web/veita/graphql/sharedGql'

import { Application, Municipality } from '@island.is/financial-aid/shared/lib'

import {
  ApplicationSkeleton,
  LoadingContainer,
  ProfileNotFound,
  ApplicationProfile,
} from '@island.is/financial-aid-web/veita/src/components'

import { AdminContext } from '@island.is/financial-aid-web/veita/src/components/AdminProvider/AdminProvider'

interface ApplicantData {
  application: Application
}

const UserApplication = () => {
  const router = useRouter()

  const [isLoading, setIsLoading] = useState(false)

  const { data, loading } = useQuery<ApplicantData>(ApplicationQuery, {
    variables: { input: { id: router.query.id } },
    fetchPolicy: 'no-cache',
    errorPolicy: 'all',
  })
  const { municipality } = useContext(AdminContext)

  const [application, setApplication] = useState<Application>()
  const [applicationMunicipality, setApplicationMunicipality] =
    useState<Municipality>()

  useEffect(() => {
    if (data?.application) {
      setApplication(data.application)
      setApplicationMunicipality(
        municipality?.find(
          (muni) => muni.municipalityId === data.application.municipalityCode,
        ),
      )
    }
  }, [data])

  return (
    <LoadingContainer
      isLoading={loading || isLoading}
      loader={<ApplicationSkeleton />}
    >
      {application && applicationMunicipality ? (
        <ApplicationProfile
          application={application}
          setApplication={setApplication}
          setIsLoading={setIsLoading}
          applicationMunicipality={applicationMunicipality}
        />
      ) : (
        <ProfileNotFound backButtonHref="/nymal" />
      )}
    </LoadingContainer>
  )
}

export default UserApplication
