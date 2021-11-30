import React, { useState } from 'react'
import { useQuery, useMutation } from 'react-apollo'
import gql from 'graphql-tag'

import {
  Input,
  Stack,
  SkeletonLoader,
  Box,
  Typography,
} from '@island.is/island-ui/core'

import {
  Layout,
  KeyValue,
  ContentLoader,
} from '@island.is/gjafakort-web/components'
import { nFormatter } from '@island.is/gjafakort-web/utils'

import { Value } from './components'

import * as styles from './User.css'

const UserApplicationCountQuery = gql`
  query UserApplicationCountQuery {
    userApplicationCount
  }
`

const FetchUserApplicationQuery = gql`
  mutation FetchUserApplicationQuery($ssn: String!) {
    fetchUserApplication(ssn: $ssn) {
      id
      mobileNumber
      countryCode
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

function User() {
  const [value, setValue] = useState('')
  const { error, data: countData, loading: countLoading } = useQuery(
    UserApplicationCountQuery,
  )
  const [getUserApplication, { loading, data }] = useMutation(
    FetchUserApplicationQuery,
    {
      update(cache, { data: { fetchUserApplication } }) {
        cache.writeQuery({
          query: FetchUserApplicationQuery,
          data: { fetchUserApplication },
        })
      },
    },
  )

  const { fetchUserApplication: application } = data || {}
  const { userApplicationCount: count } = countData || {}

  const updateValue = (event) => {
    const input = event.target.value
    if (input.length <= 10) {
      setValue(input)
    } else {
      return
    }

    if (input.length === 10) {
      getUserApplication({ variables: { ssn: input } })
    }
  }

  if (error || countLoading) {
    return <ContentLoader />
  }

  return (
    <Layout
      left={
        <Box marginBottom={6}>
          <Box marginBottom={8} display="flex" justifyContent="spaceAround">
            <Value label="gjafabréf sótt" value={count} />
            <Value label="virði í kr." value={nFormatter(count * 5000)} />
          </Box>
          <Box padding="gutter">
            <Input
              name="search"
              value={value}
              onChange={updateValue}
              placeholder="Leitaðu eftir kennitölu"
            />
            {loading ? (
              <SkeletonLoader />
            ) : (
              <Box marginTop={6}>
                {value.length === 10 && (
                  <Box
                    background="blue100"
                    position="relative"
                    paddingX={[5, 12]}
                    paddingY={[5, 9]}
                    width="full"
                  >
                    {!application ? (
                      <Typography variant="intro">
                        No application found
                      </Typography>
                    ) : (
                      <Box>
                        <Typography variant="h2" color="blue400">
                          +{application.countryCode}{' '}
                          {`${application.mobileNumber.slice(
                            0,
                            3,
                          )}-${application.mobileNumber.slice(3)}`}
                        </Typography>
                        <Typography variant="intro" color="dark400">
                          {application.id}
                        </Typography>
                        {application.logs && (
                          <Box marginTop={6}>
                            <Stack space="gutter">
                              {application.logs.map((log) => (
                                <Box key={log.id}>
                                  <Typography variant="h4">
                                    {log.title}
                                  </Typography>
                                  <Box display="flex" flexWrap="wrap">
                                    <KeyValue
                                      label="Búin til"
                                      value={new Date(
                                        log.created,
                                      ).toLocaleString('is-IS')}
                                      size="p"
                                    />
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
                                      {JSON.stringify(
                                        JSON.parse(log.data),
                                        null,
                                        2,
                                      )}
                                    </code>
                                  </pre>
                                </Box>
                              ))}
                            </Stack>
                          </Box>
                        )}
                      </Box>
                    )}
                  </Box>
                )}
              </Box>
            )}
          </Box>
        </Box>
      }
    />
  )
}

export default User
