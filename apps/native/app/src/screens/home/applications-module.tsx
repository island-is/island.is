import { EmptyCard, StatusCardSkeleton } from '@ui'
import React from 'react'
import { useIntl } from 'react-intl'
import { Image, SafeAreaView } from 'react-native'
import { ApolloError } from '@apollo/client'

import leJobss3 from '../../assets/illustrations/le-jobs-s3.png'
import {
  Application,
  ListApplicationsQuery,
  useListApplicationsQuery,
} from '../../graphql/types/schema'

import { ApplicationsPreview } from '../applications/components/applications-preview'

interface ApplicationsModuleProps {
  data: ListApplicationsQuery | undefined
  loading: boolean
  error?: ApolloError | undefined
  componentId: string
}

const validateApplicationsInitialData = ({
  data,
  loading,
}: {
  data: ListApplicationsQuery | undefined
  loading: boolean
}) => {
  if (loading) {
    return true
  }
  // Only show widget initially if there are applications
  if (data?.applicationApplications?.length !== 0) {
    return true
  }
  return false
}

const ApplicationsModule = React.memo(
  ({ data, loading, error, componentId }: ApplicationsModuleProps) => {
    const intl = useIntl()
    const applications = data?.applicationApplications ?? []
    const count = applications.length

    if (error && !data) {
      return null
    }

    return (
      <SafeAreaView>
        {loading && !data ? (
          <StatusCardSkeleton />
        ) : (
          <>
            {count === 0 && (
              <EmptyCard
                text={intl.formatMessage({
                  id: 'applications.emptyDescription',
                })}
                image={
                  <Image
                    source={leJobss3}
                    resizeMode="contain"
                    style={{ height: 87, width: 69 }}
                  />
                }
                link={null}
              />
            )}
            {count !== 0 && (
              <ApplicationsPreview
                applications={applications as Application[]}
                headingTitleId="home.applicationsStatus"
                headingTitleNavigationLink="/applications"
                componentId={componentId}
                slider={true}
                numberOfItems={3}
              />
            )}
          </>
        )}
      </SafeAreaView>
    )
  },
)

export {
  ApplicationsModule,
  useListApplicationsQuery,
  validateApplicationsInitialData,
}
