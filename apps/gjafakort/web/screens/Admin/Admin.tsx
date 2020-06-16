import React, { useState } from 'react'
import { useQuery, useMutation } from 'react-apollo'
import gql from 'graphql-tag'

import {
  Accordion,
  AccordionItem,
  Hidden,
  BulletList,
  Bullet,
  Columns,
  Column,
  Stack,
  Icon,
  Box,
  Button,
  Typography,
} from '@island.is/island-ui/core'

import { ContentLoader, Layout } from '@island.is/gjafakort-web/components'

import { KeyValue } from '../../components'

import { NoApplications, ReviewStatus } from './components'

import * as styles from './Admin.treat'

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
      logs {
        id
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
  const { data, loading } = useQuery(CompanyApplicationsQuery)
  const [approveApplication, { loading: approveLoading }] = useMutation(
    ApproveCompanyApplication,
  )
  const [rejectApplication, { loading: rejectLoading }] = useMutation(
    RejectCompanyApplication,
  )
  const [index, setIndex] = useState(0)

  const { companyApplications } = data || {}
  if (loading && !data) {
    return <ContentLoader />
  } else if (!loading && !data) {
    return <p>Unauthorized</p>
  }

  const approvedApplications = companyApplications.filter(
    (a) => a.state === 'approved' || a.state === 'manual-approved',
  )
  const pendingApplications = companyApplications.filter(
    (a) => a.state === 'pending',
  )
  const rejectedApplications = companyApplications.filter(
    (a) => a.state === 'rejected',
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
            <Box marginBottom={6} width="full">
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
              <Box marginBottom={8}>
                <Box>
                  <Accordion dividerOnTop={false} dividerOnBottom={false}>
                    <AccordionItem
                      label="Skoða atburðarsögu"
                      labelVariant="h5"
                      id={application.id}
                    >
                      <Stack space="gutter">
                        {application.logs.map((log) => (
                          <Box key={log.id}>
                            <Typography variant="h4">{log.title}</Typography>
                            <Box display="flex" flexWrap="wrap">
                              <KeyValue
                                label="Staða umsóknar"
                                value={log.state}
                                size="p"
                              />
                              <KeyValue
                                label="Kennitala geranda"
                                value={log.authorSSN || '-'}
                                size="p"
                              />
                            </Box>
                            <pre className={styles.data}>
                              <code>
                                {JSON.stringify(JSON.parse(log.data), null, 2)}
                              </code>
                            </pre>
                          </Box>
                        ))}
                      </Stack>
                    </AccordionItem>
                  </Accordion>
                </Box>
                <Box marginBottom={1}>
                  <Typography variant="p">
                    {application.companyDisplayName} er skráð í eftirfarandi
                    flokka:
                  </Typography>
                </Box>
                <BulletList type="ul">
                  {application.validLicenses && (
                    <Bullet>
                      Fyrirtækið er með rekstrarleyfi vegna veitingastaða,
                      gististaða og skemmtanahalds.
                    </Bullet>
                  )}
                  {application.validPermit && (
                    <Bullet>
                      Fyrirtækið er með gilt starfsleyfi Ferðamálastofu.
                    </Bullet>
                  )}
                  {application.operationsTrouble && (
                    <Bullet>
                      Fyrirtækið var skráð í rekstrarerfiðleikum 31. desember
                      2019.
                    </Bullet>
                  )}
                  {application.operatingPermitForRestaurant && (
                    <Bullet>
                      Fyrirtæki er með starfsleyfi vegna veitingastaða.
                    </Bullet>
                  )}
                  {application.operatingPermitForVehicles && (
                    <Bullet>
                      Fyrirtæki er með starfsleyfi vegna leigu skráningarskyldra
                      ökutækja.
                    </Bullet>
                  )}
                  {application.exhibition && (
                    <Bullet>
                      Fyrirtækið heldur sýningar sem gerir út á náttúru,
                      menningu eða sögu.
                    </Bullet>
                  )}
                </BulletList>
              </Box>

              <Box marginBottom={4}>
                <Box marginBottom={2}>
                  <Typography variant="h4" as="h2">
                    Upplýsingar fyrirtækis
                  </Typography>
                </Box>
                <Box display="flex" flexWrap="wrap">
                  <KeyValue
                    label="Kennitala"
                    value={`${application.companySSN.slice(
                      0,
                      6,
                    )}-${application.companySSN.slice(6)}`}
                    color="blue400"
                  />
                  <KeyValue
                    label="Þjónustuflokkur"
                    value={application.serviceCategory}
                    color="blue400"
                  />
                  <KeyValue
                    label="Vefsíða"
                    value={application.webpage}
                    color="blue400"
                  />
                </Box>
              </Box>
              <Box marginBottom={12}>
                <Box marginBottom={2}>
                  <Typography variant="h4" as="h2">
                    Tengiliður
                  </Typography>
                </Box>
                <Box display="flex" flexWrap="wrap">
                  <KeyValue label="Nafn" value={application.name} />
                  <KeyValue
                    label="Netfang (aðal)"
                    value={application.generalEmail}
                  />
                  <KeyValue label="Netfang" value={application.email} />
                  <KeyValue
                    label="Símanúmer"
                    value={`${application.phoneNumber.slice(
                      0,
                      3,
                    )}-${application.phoneNumber.slice(3)}`}
                  />
                </Box>
              </Box>
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
