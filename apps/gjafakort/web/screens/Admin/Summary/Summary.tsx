import React, { useState } from 'react'
import Link from 'next/link'
import Router from 'next/router'
import { useQuery } from 'react-apollo'
import gql from 'graphql-tag'

import { ApplicationStates } from '@island.is/gjafakort/consts'
import {
  Box,
  ContentBlock,
  Typography,
  IconDeprecated as Icon,
  ButtonDeprecated as Button,
  Select,
  Column,
  Columns,
  Option,
} from '@island.is/island-ui/core'

import { ContentLoader } from '@island.is/gjafakort-web/components'

import { KeyValue } from '../../../components'

import * as styles from './Summary.css'

const CompanyApplicationsQuery = gql`
  query CompanyApplicationsQueryMinimal {
    companyApplications {
      id
      name
      email
      state
      companySSN
      generalEmail
      companyDisplayName
      operationsTrouble
      publicHelpAmount
      companyName
      logs {
        id
        data
      }
    }
  }
`

const Options = {
  operationsTrouble: 'operationsTrouble',
  publicHelp: 'publicHelp',
  operationsTroubleAndOrPublicHelp: 'operationsTroubleAndOrPublicHelp',
}

const filterOptions: Option[] = [
  {
    label: 'Í resktrarerfiðleikum',
    value: Options.operationsTrouble,
  },
  {
    label: 'Fengið opinberabera aðstoð',
    value: Options.publicHelp,
  },
  {
    label: 'Í rekstrarerfiðleikum og/eða fengu opinbera hjálp',
    value: Options.operationsTroubleAndOrPublicHelp,
  },
]

function Summary() {
  const { data, loading, error } = useQuery(CompanyApplicationsQuery)
  const [filter, setFilter] = useState(null)
  const { companyApplications } = data || {}
  if (error || (loading && !data)) {
    return <ContentLoader />
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

  const filterApplications = () => {
    if (!filter) {
      return companyApplications
    } else if (filter.value === Options.operationsTrouble) {
      return companyApplications.filter(
        (application) => application.operationsTrouble,
      )
    } else if (filter.value === Options.publicHelp) {
      return companyApplications.filter((application) =>
        Boolean(application.publicHelpAmount),
      )
    } else if (filter.value === Options.operationsTroubleAndOrPublicHelp) {
      return companyApplications.filter(
        (application) =>
          application.operationsTrouble ||
          Boolean(application.publicHelpAmount),
      )
    } else {
      return []
    }
  }

  return (
    <Box paddingX="gutter">
      <ContentBlock>
        <Box display="flex" justifyContent="center" marginBottom={6}>
          <Box marginX={[2, 6]}>
            <KeyValue
              label="Umsóknir"
              value={approvedApplications.length}
              color="blue400"
              size="h1"
            />
          </Box>
          <Box marginX={[2, 6]}>
            <KeyValue
              label="Eftir að yfirfara"
              value={pendingApplications.length}
              size="h1"
            />
          </Box>
          <Box marginX={[2, 6]}>
            <KeyValue
              label="Hafnaðar"
              value={rejectedApplications.length}
              size="h1"
            />
          </Box>
        </Box>
        <Box marginBottom={6}>
          <Columns space="gutter" collapseBelow="lg">
            <Column width="2/3">
              <Box>
                <Box display="flex" alignItems="center" marginBottom={1}>
                  <Icon type="alert" width={20} color="yellow600" />
                  <Box marginLeft={2}>
                    <Typography variant="p">
                      merkir fyrirtæki sem voru í rekstrarerfiðleikum 31.
                      desember 2019 í skilningi hópundanþágureglugerðar
                    </Typography>
                  </Box>
                </Box>
                <Box display="flex" alignItems="center">
                  <Icon type="info" width={20} color="blue600" />
                  <Box marginLeft={2}>
                    <Typography variant="p">
                      merkir fyrirtæki sem hafa á síðastliðnum tveimur
                      reikningsárum eða á yfirstandandi reikningsári fengið
                      opinbera aðstoð
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Column>
            <Column width="1/3">
              <Box position="relative">
                <Select
                  name="filter"
                  label="Sía eftir"
                  placeholder="Veldu síu"
                  value={filter}
                  onChange={(option) => {
                    setFilter(option)
                  }}
                  options={filterOptions}
                />
                <Box position="absolute" right={0}>
                  <Button
                    variant="text"
                    onClick={() => {
                      setFilter(null)
                    }}
                  >
                    endursetja síu
                  </Button>
                </Box>
              </Box>
            </Column>
          </Columns>
        </Box>
        <Box marginBottom={6} overflow="scroll">
          <table className={styles.table}>
            <thead className={styles.thead}>
              <tr>
                <th>Nafn fyrirtækis</th>
                <th className={styles.breakText}>Nafn tengiliða</th>
                <th>Netfang tengiliða</th>
                <th>Staða umsóknar</th>
                <th>Kennitala</th>
                <th className={styles.right}>Fjöldi atburða</th>
                <th className={styles.right}>Fjöldi villa</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {filterApplications().map((application, index) => (
                <tr className={styles.tr} key={index}>
                  <td>
                    <Box display="flex" flexDirection="column">
                      <Typography variant="p" color="dark400">
                        {application.companyName}
                        {application.publicHelpAmount > 0 && (
                          <Box marginLeft={1} display="inlineFlex">
                            <Icon type="info" width={16} color="blue600" />
                          </Box>
                        )}
                        {application.operationsTrouble && (
                          <Box marginLeft={1} display="inlineFlex">
                            <Icon type="alert" width={16} color="yellow600" />
                          </Box>
                        )}
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
                        application.state === ApplicationStates.APPROVED ||
                        application.state === ApplicationStates.MANUAL_APPROVED
                          ? 'blue600'
                          : application.state === ApplicationStates.REJECTED
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
                  <td className={styles.right}>
                    {
                      application.logs.filter(
                        (log) => JSON.parse(log.data).success === false,
                      ).length
                    }
                  </td>
                  <td className={styles.right}>
                    <Box
                      display="flex"
                      onClick={() => Router.push(`/admin/${application.id}`)}
                      cursor="pointer"
                      marginLeft={1}
                      alignItems="center"
                    >
                      <Icon type="external" width={16} />
                    </Box>
                  </td>
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
