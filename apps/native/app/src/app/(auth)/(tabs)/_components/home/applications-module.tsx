import React from 'react'
import { FormattedMessage, useIntl } from 'react-intl'
import styled from 'styled-components/native'
import { Image, SafeAreaView, View } from 'react-native'
import { ApolloError } from '@apollo/client'

import { EmptyCard, StatusCardSkeleton, Heading } from '@/ui'
import leJobss3 from '@/assets/illustrations/le-jobs-s3.png'
import {
  Application,
  ListApplicationsQuery,
  useListApplicationsQuery,
} from '@/graphql/types/schema'

import { ApplicationsPreview } from '../../more/applications/_components/applications-preview'

interface ApplicationsModuleProps {
  data: ListApplicationsQuery | undefined
  loading: boolean
  error?: ApolloError | undefined
}

const Wrapper = styled(View)`
  margin-horizontal: ${({ theme }) => theme.spacing[2]}px;
`

const Host = styled.View`
  margin-bottom: ${({ theme }) => theme.spacing[2]}px;
`

const EmptyHeading = styled.View`
  margin-horizontal: ${({ theme }) => theme.spacing[2]}px;
`

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
  if (
    data?.applicationApplications?.length &&
    data?.applicationApplications?.length !== 0
  ) {
    return true
  }
  return false
}

const ApplicationsModule = React.memo(
  ({ data, loading, error }: ApplicationsModuleProps) => {
    const intl = useIntl()
    const applications = data?.applicationApplications ?? []
    const count = applications.length

    if (error && !data) {
      return null
    }

    return (
      <SafeAreaView>
        {loading && !data ? (
          <Wrapper>
            <StatusCardSkeleton />
          </Wrapper>
        ) : (
          <>
            {count === 0 && (
              <Host>
                <EmptyHeading>
                  <Heading>
                    <FormattedMessage id="homeOptions.applications" />
                  </Heading>
                </EmptyHeading>
                <Wrapper>
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
                </Wrapper>
              </Host>
            )}
            {count !== 0 && (
              <ApplicationsPreview
                applications={applications as Application[]}
                headingTitleId="home.applicationsStatus"
                headingTitleNavigationLink="/more/applications"
                slider
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
