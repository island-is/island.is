import React, { useState } from 'react'
import { useQuery, useMutation } from 'react-apollo'
import gql from 'graphql-tag'

import { ApplicationStates } from '@island.is/gjafakort/consts'
import {
  Hidden,
  Columns,
  Column,
  IconDeprecated as Icon,
  Box,
  ButtonDeprecated as Button,
  Typography,
} from '@island.is/island-ui/core'

import { ContentLoader, Layout } from '@island.is/gjafakort-web/components'

import { NoApplications, ReviewStatus, Info } from './components'

import * as styles from './Admin.css'

const CompanyApplicationsQuery = gql`
  query CompanyApplicationsQuery {
    companyApplications {
      id
      name
      email
      state
      companySSN
      serviceCategory
      generalEmail
      companyDisplayName
      companyName
      exhibition
      operatingPermitForRestaurant
      operatingPermitForVehicles
      operationsTrouble
      phoneNumber
      validLicenses
      validPermit
      webpage
      publicHelpAmount
      logs {
        id
        created
        state
        title
        data
        authorSSN
      }
    }
  }
`

const ApproveCompanyApplication = gql`
  mutation ApproveCompanyApplication($input: ApproveCompanyApplicationInput!) {
    approveCompanyApplication(input: $input) {
      application {
        id
        state
      }
    }
  }
`

const RejectCompanyApplication = gql`
  mutation RejectCompanyApplication($input: RejectCompanyApplicationInput!) {
    rejectCompanyApplication(input: $input) {
      application {
        id
        state
      }
    }
  }
`

function Admin() {
  const { data, loading, error } = useQuery(CompanyApplicationsQuery)
  const [approveApplication, { loading: approveLoading }] = useMutation(
    ApproveCompanyApplication,
  )
  const [rejectApplication, { loading: rejectLoading }] = useMutation(
    RejectCompanyApplication,
  )
  const [index, setIndex] = useState(0)

  const { companyApplications } = data || {}
  if (error || (loading && !data)) {
    return <ContentLoader />
  } else if (!loading && !data) {
    return <p>Unauthorized</p>
  }

  const approvedApplications = companyApplications.filter(
    (a) =>
      a.state === ApplicationStates.APPROVED ||
      a.state === ApplicationStates.MANUAL_APPROVED,
  )
  const pendingApplications = companyApplications.filter(
    (a) => a.state === ApplicationStates.PENDING,
  )
  const rejectedApplications = companyApplications.filter(
    (a) => a.state === ApplicationStates.REJECTED,
  )
  const applicationsLeft = pendingApplications.length
  const application = applicationsLeft && pendingApplications[index]

  const onApprove = async () => {
    const response = await approveApplication({
      variables: { input: { id: application.id } },
    })

    if (!response.errors) {
      if (index === applicationsLeft - 1) {
        setIndex(Math.max(index - 1, 0))
      }
    }
  }

  const onReject = async () => {
    const response = await rejectApplication({
      variables: { input: { id: application.id } },
    })

    if (!response.errors) {
      if (index === applicationsLeft - 1) {
        setIndex(Math.max(index - 1, 0))
      }
    }
  }

  return (
    <Layout
      left={
        <Box
          background="blue100"
          position="relative"
          paddingX={[5, 12]}
          paddingY={[5, 9]}
          width="full"
        >
          <Hidden above="md">
            <Box marginBottom={6} marginTop={2} width="full">
              <ReviewStatus
                approved={approvedApplications.length}
                pending={applicationsLeft}
                rejected={rejectedApplications.length}
              />
            </Box>
          </Hidden>
          {!application ? (
            <NoApplications />
          ) : (
            <Box>
              <Box marginBottom={2}>
                <Box marginBottom={1}>
                  <Typography variant="h1" as="h1">
                    {application.companyName}
                  </Typography>
                </Box>
                <Typography variant="h3" as="h2" color="blue400">
                  {application.companyDisplayName}
                </Typography>
                <Box
                  position="absolute"
                  right={0}
                  top={0}
                  marginTop={3}
                  marginRight={4}
                  display="flex"
                >
                  <Box marginRight={1}>
                    {index > 0 && (
                      <Box cursor="pointer" onClick={() => setIndex(index - 1)}>
                        <Icon type="arrowLeft" width={16} color="dark300" />
                      </Box>
                    )}
                  </Box>
                  <Typography variant="pSmall">
                    Umsókn {index + 1} af {applicationsLeft}
                  </Typography>
                  <Box marginLeft={1} className={styles.ghostSpace}>
                    {index < applicationsLeft - 1 && (
                      <Box cursor="pointer" onClick={() => setIndex(index + 1)}>
                        <Icon type="arrowRight" width={16} color="dark300" />
                      </Box>
                    )}
                  </Box>
                </Box>
              </Box>

              <Info application={application} />

              <Columns space={[4, 4, 4, 12]} collapseBelow="lg" alignY="center">
                <Column width="1/2">
                  <Button
                    variant="ghost"
                    width="fluid"
                    onClick={onReject}
                    disabled={rejectLoading || approveLoading}
                  >
                    Hafna
                  </Button>
                </Column>
                <Column width="1/2">
                  <Button
                    width="fluid"
                    onClick={onApprove}
                    disabled={rejectLoading || approveLoading}
                  >
                    Samþykkja
                  </Button>
                </Column>
              </Columns>
            </Box>
          )}
        </Box>
      }
      right={
        <Hidden below="lg">
          <ReviewStatus
            approved={approvedApplications.length}
            pending={applicationsLeft}
            rejected={rejectedApplications.length}
          />
        </Hidden>
      }
    />
  )
}

export default Admin
