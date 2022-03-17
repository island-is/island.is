import React, { useEffect, useState } from 'react'

import { useRouter } from 'next/router'

import { useQuery } from '@apollo/client'
import { ApplicationQuery } from '@island.is/financial-aid-web/veita/graphql/sharedGql'

import {
  Application,
  getFileType,
  isImage,
} from '@island.is/financial-aid/shared/lib'

import {
  ApplicationSkeleton,
  LoadingContainer,
  ProfileNotFound,
  ApplicationProfile,
  PrintableFiles,
} from '@island.is/financial-aid-web/veita/src/components'

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

  const [application, setApplication] = useState<Application>()

  useEffect(() => {
    if (data?.application) {
      setApplication(data.application)
    }
  }, [data])

  return (
    <LoadingContainer
      isLoading={loading || isLoading}
      loader={<ApplicationSkeleton />}
    >
      {application ? (
        <>
          <ApplicationProfile
            application={application}
            setApplication={setApplication}
            setIsLoading={setIsLoading}
            isPrint={true}
          />
          {application?.files && (
            <>
              <div>
                <PrintableFiles
                  files={application?.files.filter((el) => isImage(el.name))}
                  isImages={true}
                />
                <PrintableFiles
                  files={application?.files.filter(
                    (el) => getFileType(el.name) === 'pdf',
                  )}
                />
              </div>
            </>
          )}
        </>
      ) : (
        <ProfileNotFound backButtonHref="/nymal" />
      )}
    </LoadingContainer>
  )
}

export default UserApplication
