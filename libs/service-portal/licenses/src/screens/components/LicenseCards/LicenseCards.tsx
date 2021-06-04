import React from 'react'
import { gql, useQuery } from '@apollo/client'
import { Locale } from '@island.is/shared/types'
import { useUserProfile } from '@island.is/service-portal/graphql'

import {
  GenericLicenseDataField,
  GenericLicenseDataFieldType,
  Query,
} from '@island.is/api/schema'
import { Box, SkeletonLoader } from '@island.is/island-ui/core'

const GenericLicensesQuery = gql`
  fragment genericLicenseDataFieldFragment on GenericLicenseDataField {
    type
    name
    label
    value
    fields {
      type
      name
      label
      value
      fields {
        type
        name
        label
        value
      }
    }
  }

  query GenericLicensesQuery($input: GetGenericLicensesInput, $locale: String) {
    genericLicenses(input: $input, locale: $locale) {
      nationalId
      license {
        type
        provider {
          id
        }
        pkpass
        timeout
        status
      }
      payload {
        data {
          ...genericLicenseDataFieldFragment
        }
        rawData
      }
    }
  }
`

const DataFields = ({ fields }: { fields: GenericLicenseDataField[] }) => {
  if (!fields || fields.length === 0) {
    return null
  }

  return (
    <>
      <h2>Gögn skilríkis</h2>
      {fields.map((field, i) => {
        return (
          <React.Fragment key={i}>
            {field.type === GenericLicenseDataFieldType.Value && (
              <dl>
                <dt>{field.label}</dt>
                <dd>{field.value}</dd>
              </dl>
            )}
            {field.type === GenericLicenseDataFieldType.Category && (
              <>
                <h3>
                  {field.name} - {field.label}
                </h3>
                <DataFields fields={field.fields ?? []} />
              </>
            )}
            {field.type === GenericLicenseDataFieldType.Group && (
              <>
                <h3>{field.label}</h3>
                <DataFields fields={field.fields ?? []} />
              </>
            )}
          </React.Fragment>
        )
      })}
    </>
  )
}

const LicenseCards = () => {
  const { data: userProfile } = useUserProfile()
  const locale = (userProfile?.locale as Locale) ?? 'is'
  const { data, loading: queryLoading } = useQuery<Query>(
    GenericLicensesQuery,
    {
      variables: {
        locale,
        input: {
          // includedProviders: [],
          // excludedProviders?: [],
          // force: false,
          // onlyList: false,
        },
      },
    },
  )
  const { genericLicenses = [] } = data || {}

  console.log(genericLicenses)

  if (queryLoading) {
    return <SkeletonLoader width="100%" height={158} />
  }

  console.log('genericLicenses :>> ', genericLicenses)

  return (
    <>
      {genericLicenses.map((license, index) => (
        <Box marginBottom={3} key={index}>
          <dl>
            <dt>Kennitala</dt>
            <dd>{license.nationalId}</dd>
          </dl>
          <h2>Skilríki</h2>
          <dl>
            <dt>Gerð</dt>
            <dd>{license.license.type}</dd>
            <dt>Útgáfuaðili</dt>
            <dd>{license.license.provider.id}</dd>
            <dt>Staða</dt>
            <dd>{license.license.status}</dd>
            <dt>pkpass?</dt>
            <dd>{license.license.pkpass}</dd>
            <dt>timeout</dt>
            <dd>{license.license.timeout}</dd>
          </dl>
          <h2>Staða á að sækja skilríki</h2>
          <dl>
            <dt>Staða</dt>
            <dd>{license.fetch?.status}</dd>
            <dt>Uppfært</dt>
            <dd>{license.fetch?.updated}</dd>
          </dl>
          <DataFields fields={license.payload?.data ?? []} />
        </Box>
      ))}
    </>
  )
}

export default LicenseCards
