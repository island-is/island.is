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
  PrintableFiles,
} from '@island.is/financial-aid-web/veita/src/components'
import { Box } from '@island.is/island-ui/core'
import { AdminContext } from '@island.is/financial-aid-web/veita/src/components/AdminProvider/AdminProvider'

interface ApplicantData {
  application: Application
}

const PrintableApplication = () => {
  const router = useRouter()

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
    <LoadingContainer isLoading={loading} loader={<ApplicationSkeleton />}>
      {application && applicationMunicipality ? (
        <>
          <ApplicationProfile
            application={application}
            setApplication={setApplication}
            setIsLoading={() => false}
            isPrint={true}
            applicationMunicipality={applicationMunicipality}
          />
          {application?.files && (
            <Box marginTop={20}>
              <PrintableFiles applicationId={application.id} />
            </Box>
          )}
        </>
      ) : (
        <ProfileNotFound backButtonHref="/nymal" />
      )}
    </LoadingContainer>
  )
}

export default PrintableApplication
