import React, { useRef } from 'react'
import { gql, useQuery, useMutation } from '@apollo/client'

import { Query, Mutation, License } from '@island.is/api/schema'
import { Box, Button } from '@island.is/island-ui/core'
import { EducationCard } from '@island.is/service-portal/core'

const EducationLicenseQuery = gql`
  query EducationLicenseQuery {
    educationLicense {
      id
      school
      programme
      date
    }
  }
`

const FetchEducationSignedLicenseUrlMutation = gql`
  mutation FetchEducationSignedLicenseUrlMutation(
    $input: FetchEducationSignedLicenseUrlInput!
  ) {
    fetchEducationSignedLicenseUrl(input: $input) {
      url
    }
  }
`

const LicenseCards = () => {
  const { data } = useQuery<Query>(EducationLicenseQuery)
  const [fetchEducationSignedLicenseUrl] = useMutation<Mutation>(
    FetchEducationSignedLicenseUrlMutation,
  )

  const { educationLicense = [] } = data || {}
  const anchorRef = useRef<HTMLAnchorElement>(null)

  const handleDownload = async (license: License) => {
    const { data } = await fetchEducationSignedLicenseUrl({
      variables: { input: { licenseId: license.id } },
    })
    if (!data?.fetchEducationSignedLicenseUrl) {
      return
    }

    fetch(data?.fetchEducationSignedLicenseUrl.url)
      .then((res) => res.blob())
      .then((blob) => {
        const href = window.URL.createObjectURL(blob)
        anchorRef.current!.href = href
        anchorRef.current!.download = `leyfisbref-${license.programme}.pdf`
        anchorRef.current!.click()
        anchorRef.current!.href = ''
      })
      .catch((err) => console.error(err))
  }

  return (
    <>
      {educationLicense.map((license, index) => (
        <Box marginBottom={3} key={index}>
          <EducationCard
            eyebrow={license.school}
            imgPlaceholder={'MRN'}
            title={`Leyfisbréf - ${license.programme}`}
            description={license.date}
            CTA={
              <Button
                variant="text"
                icon="download"
                iconType="outline"
                nowrap
                onClick={() => handleDownload(license)}
              >
                Sækja skjal
              </Button>
            }
          />
        </Box>
      ))}
      <a target="__blank" style={{ display: 'none' }} ref={anchorRef} />
    </>
  )
}

export default LicenseCards
