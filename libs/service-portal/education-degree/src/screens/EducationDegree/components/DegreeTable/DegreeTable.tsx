import React from 'react'
import { MessageDescriptor } from 'react-intl'

import { useLocale, useNamespaces } from '@island.is/localization'
import { gql, useQuery } from '@apollo/client'
import { Query, License } from '@island.is/api/schema'
import {
  AlertMessage,
  Box,
  Button,
  SkeletonLoader,
  Table as T,
} from '@island.is/island-ui/core'

const educationLicenseQuery = gql`
  query educationLicenseQuery {
    educationLicense {
      id
      school
      programme
      date
    }
  }
`

const DegreeTable = () => {
  let { data, loading } = useQuery<Query>(educationLicenseQuery)
  useNamespaces('sp.driving-license')
  return (
    <>
      <T.Table>
        <T.Head>
          <T.Row>
            <T.HeadData>Skóli</T.HeadData>
            <T.HeadData>Námsbraut</T.HeadData>
            <T.HeadData>Dagsetning</T.HeadData>
            <T.HeadData>Skjöl</T.HeadData>
          </T.Row>
        </T.Head>
        <T.Body>
          {data?.educationLicense.map((license) => (
            <DegreeTableRow key={license.id} license={license} />
          ))}
          {loading && (
            <>
              <LoadingRow />
              <LoadingRow />
              <LoadingRow />
            </>
          )}
        </T.Body>
      </T.Table>
      {data?.educationLicense.length === 0 && (
        <Box marginTop={2}>
          <AlertMessage
            type="info"
            title="Engar prófgráður fundust"
            message="Ef eitthvað er í ólagi hér er gott að hafa samband við profgradur@profgradur.is"
          />
        </Box>
      )}
    </>
  )
}

const LoadingRow = () => (
  <T.Row>
    <T.Data>
      <SkeletonLoader />
    </T.Data>
    <T.Data>
      <SkeletonLoader />
    </T.Data>
    <T.Data>
      <SkeletonLoader />
    </T.Data>
    <T.Data>
      <SkeletonLoader />
    </T.Data>
  </T.Row>
)

const DegreeTableRow = ({ license }: { license: License }) => {
  return (
    <>
      <T.Row key={license.id}>
        <T.Data>{license.school}</T.Data>
        <T.Data>{license.programme}</T.Data>
        <T.Data>{license.date}</T.Data>
        <T.Data>
          <Button
            variant="text"
            icon="download"
            iconType="outline"
            size="small"
          >
            Sækja skjal
          </Button>
        </T.Data>
      </T.Row>
    </>
  )
}

export default DegreeTable
