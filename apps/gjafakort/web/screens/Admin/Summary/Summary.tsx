import React from 'react'
import Link from 'next/link'
import { useQuery } from 'react-apollo'
import gql from 'graphql-tag'

import {
  Box,
  ContentBlock,
  Typography,
  Icon,
  Button,
} from '@island.is/island-ui/core'

import { ContentLoader } from '@island.is/gjafakort-web/components'

import { KeyValue } from '../../../components'

import * as styles from './Summary.treat'

const CompanyApplicationsQuery = gql`
  query CompanyApplicationsQuery {
    companyApplications {
      id
      name
      email
      state
      companySSN
      generalEmail
      companyDisplayName
      companyName
      logs {
        id
      }
    }
  }
`

function Summary() {
  const { data, loading } = useQuery(CompanyApplicationsQuery)
  const { companyApplications } = data || {}
  if (loading && !data) {
    return <ContentLoader />
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

  return (
    <Box paddingX="gutter">
      <ContentBlock>
        <Box display="flex" justifyContent="center" marginBottom={6}>
          <Box marginX={[6, 6]}>
            <KeyValue
              label="Umsóknir"
              value={approvedApplications.length}
              color="blue400"
              size="h1"
            />
          </Box>
          <Box marginX={[6, 6]}>
            <KeyValue
              label="Eftir að yfirfara"
              value={pendingApplications.length}
              size="h1"
            />
          </Box>
          <Box marginX={[6, 6]}>
            <KeyValue
              label="Hafnaðar"
              value={rejectedApplications.length}
              size="h1"
            />
          </Box>
        </Box>
        <Box marginBottom={6}>
          <table className={styles.table}>
            <thead className={styles.thead}>
              <tr>
                <th>Nafn fyrirtækis</th>
                <th>Nafn tengiliða</th>
                <th>Netfang tengiliða</th>
                <th>Staða umsóknar</th>
                <th>Kennitala</th>
                <th className={styles.right}>Fjöldi atburða</th>
              </tr>
            </thead>
            <tbody>
              {companyApplications.map((application) => (
                <tr className={styles.tr}>
                  <td>
                    <Box display="flex" flexDirection="column">
                      <Typography variant="p" color="dark400">
                        {application.companyName}
                      </Typography>
                      <Typography variant="pSmall" color="dark300">
                        {application.companyDisplayName}
                      </Typography>
                    </Box>
                  </td>
                  <td>{application.name}</td>
                  <td>
                    <Box display="flex" flexDirection="column">
                      <Typography variant="p" color="dark400">
                        {application.generalEmail}
                      </Typography>
                      <Typography variant="pSmall" color="dark300">
                        {application.email}
                      </Typography>
                    </Box>
                  </td>
                  <td>
                    <Typography
                      color={
                        application.state === 'approved' ||
                        application.state === 'manual-approved'
                          ? 'blue600'
                          : application.state === 'rejected'
                          ? 'red600'
                          : 'dark400'
                      }
                    >
                      {application.state}
                    </Typography>
                  </td>
                  <td>
                    {`${application.companySSN.slice(
                      0,
                      6,
                    )}-${application.companySSN.slice(6)}`}
                  </td>
                  <td className={styles.right}>{application.logs.length}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Box>
        <Box>
          <Link href="/admin">
            <span>
              <Button variant="text" size="small">
                <Box alignItems="center" display="flex">
                  <Icon type="arrowLeft" width={12} />
                </Box>
                Til baka í yfirferð
              </Button>
            </span>
          </Link>
        </Box>
      </ContentBlock>
    </Box>
  )
}

export default Summary
