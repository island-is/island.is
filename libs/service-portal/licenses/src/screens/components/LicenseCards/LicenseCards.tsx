import React, { useState } from 'react'
import { gql, useMutation, useQuery } from '@apollo/client'
import { Locale } from '@island.is/shared/types'
import { useUserProfile } from '@island.is/service-portal/graphql'

import { GenericLicenseDataField, Query } from '@island.is/api/schema'
import { Box, SkeletonLoader, Button } from '@island.is/island-ui/core'

const dataFragment = gql`
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
`

const GenericLicensesQuery = gql`
  query GenericLicensesQuery($input: GetGenericLicensesInput, $locale: String) {
    genericLicenses(input: $input, locale: $locale) {
      nationalId
      license {
        type
        provider {
          id
        }
        pkpass
        pkpassVerify
        timeout
        status
        pkpassStatus
      }
      fetch {
        status
        updated
      }
      payload {
        data {
          ...genericLicenseDataFieldFragment
        }
        rawData
      }
    }
  }
  ${dataFragment}
`

const GenericLicenseQuery = gql`
  query GenericLicenseQuery($input: GetGenericLicenseInput!, $locale: String) {
    genericLicense(input: $input, locale: $locale) {
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
      fetch {
        status
        updated
      }
      payload {
        data {
          ...genericLicenseDataFieldFragment
        }
        rawData
      }
    }
  }
  ${dataFragment}
`

const generatePkPassMutation = gql`
  mutation generatePkPassMutation($input: GeneratePkPassInput!) {
    generatePkPass(input: $input) {
      pkpassUrl
    }
  }
`

const verifyPkPassMutation = gql`
  mutation verifyPkPassMutation($input: VerifyPkPassInput!) {
    verifyPkPass(input: $input) {
      data
      valid
      error {
        status
        message
        data
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
      {fields.map((field, i) => {
        return (
          <React.Fragment key={i}>
            {field.type === 'Value' && (
              <dl>
                <dt>{field.label}</dt>
                <dd>{field.value}</dd>
              </dl>
            )}
            {field.type === 'Category' && (
              <>
                <h3>
                  {field.name} - {field.label}
                </h3>
                <DataFields fields={field.fields ?? []} />
              </>
            )}
            {field.type === 'Group' && (
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

type LicenseProps = {
  licenseType: string
}

const License = ({ licenseType }: LicenseProps) => {
  const { data: userProfile } = useUserProfile()
  const locale = (userProfile?.locale as Locale) ?? 'is'
  const { data, loading: queryLoading } = useQuery<Query>(GenericLicenseQuery, {
    variables: {
      locale,
      input: {
        licenseType,
      },
    },
  })

  const { genericLicense = null } = data ?? {}

  if (queryLoading) {
    return <SkeletonLoader width="100%" height={158} />
  }

  return <DataFields fields={genericLicense?.payload?.data ?? []} />
}

type PkPassProps = {
  licenseType: string
}

const PkPass = ({ licenseType }: PkPassProps) => {
  const [pkpass, setPkpass] = useState<string | null>(null)
  const { data: userProfile } = useUserProfile()
  const locale = (userProfile?.locale as Locale) ?? 'is'
  const [generatePkPass, { loading }] = useMutation(generatePkPassMutation)

  const onClick = async () => {
    const response = await generatePkPass({
      variables: { locale, input: { licenseType } },
    })

    if (!response.errors) {
      setPkpass(response?.data?.generatePkPass?.pkpassUrl ?? null)
    }
  }

  return (
    <>
      <Button onClick={onClick}>Sækja pkpass</Button>
      {loading && <SkeletonLoader width="100%" height={158} />}
      {pkpass && <p>{pkpass}</p>}
    </>
  )
}

const PkPassVerify = ({ licenseType }: PkPassProps) => {
  const [pkpass, setPkpass] = useState<string | null>(null)
  const [text, setText] = useState<string>('')
  const [error, setError] = useState<string | undefined>()
  const [valid, setValid] = useState<boolean | undefined>()
  const { data: userProfile } = useUserProfile()
  const locale = (userProfile?.locale as Locale) ?? 'is'
  const [verifyPkPass, { loading }] = useMutation(verifyPkPassMutation)

  const onClick = async () => {
    setValid(undefined)
    setError(undefined)
    const response = await verifyPkPass({
      variables: { locale, input: { licenseType, data: text } },
    })

    if (!response.errors) {
      setValid(response?.data?.verifyPkPass?.valid ?? false)

      if (response?.data?.verifyPkPass?.error) {
        const errorObject = response?.data?.verifyPkPass?.error
        setError(
          `Villa "${errorObject?.status}": "${
            errorObject?.message
          }". ${JSON.stringify(errorObject.data)}`,
        )
      }

      setPkpass(response?.data?.verifyPkPass?.data ?? null)
    } else {
      setPkpass(JSON.stringify(response.errors))
    }
  }

  return (
    <>
      <textarea onChange={(e) => setText(e.target?.value ?? '')} value={text} />
      <Button onClick={onClick}>Staðfesta pkpass</Button>
      {loading && <SkeletonLoader width="100%" height={158} />}
      {typeof valid === 'boolean' && <p>{valid ? 'GILT' : 'ÓGILT'}</p>}
      {pkpass && <p>{pkpass}</p>}
      {error && <p>{error}</p>}
    </>
  )
}

const LicenseCards = () => {
  const [showLicense, setShowLicense] = useState<boolean>(false)
  const { data: userProfile } = useUserProfile()
  const locale = (userProfile?.locale as Locale) ?? 'is'
  const { data, loading: queryLoading } = useQuery<Query>(
    GenericLicensesQuery,
    {
      variables: {
        locale,
        input: {
          // includedTypes: [],
          // excludedTypes: [],
          // force: false,
          // onlyList: false,
        },
      },
    },
  )
  const { genericLicenses = [] } = data ?? {}

  if (queryLoading) {
    return <SkeletonLoader width="100%" height={158} />
  }

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
            <dd>{license.license.pkpass ? 'Já' : 'Nei'}</dd>
            <dt>pkpass staða</dt>
            <dd>{license.license.pkpassStatus}</dd>
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
          <>
            <h2>Gögn skilríkis</h2>
            {showLicense && <License licenseType={license.license.type} />}
            {!showLicense && (
              <Button onClick={() => setShowLicense(true)}>
                Sækja skilríki
              </Button>
            )}
          </>
          <>
            <h2>PKPASS</h2>
            {license.license.pkpass && (
              <PkPass licenseType={license.license.type} />
            )}
            {!license.license.pkpass && <p>Skírteini hefur ekki pkpass</p>}
          </>
          <>
            <h2>PKPASS staðfesting</h2>
            {license.license.pkpassVerify && (
              <PkPassVerify licenseType={license.license.type} />
            )}
            {!license.license.pkpassVerify && (
              <p>Skírteini hefur ekki staðfestingu á pkpass</p>
            )}
          </>
        </Box>
      ))}
    </>
  )
}

export default LicenseCards
