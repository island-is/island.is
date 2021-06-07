import React from 'react'
import { gql, useQuery, useMutation } from '@apollo/client'
import format from 'date-fns/format'
import is from 'date-fns/locale/is'

import { Query, Mutation, License } from '@island.is/api/schema'
import { Box, Button, SkeletonLoader } from '@island.is/island-ui/core'
import { EducationCard, EmptyState } from '@island.is/service-portal/core'
import { defineMessage } from 'react-intl'

const RegulationDraftQuery = gql`
  query RegulationDraftQuery {
    regulationDraft {
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

export const WIPRegulations = () => {
  const { data, loading: queryLoading } = useQuery<Query>(RegulationDraftQuery)
  const [
    fetchEducationSignedLicenseUrl,
    { loading: mutationLoading },
  ] = useMutation<Mutation>(FetchEducationSignedLicenseUrlMutation)

  const { educationLicense = [] } = data || {}

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
        const link = document.createElement('a')
        link.href = href
        link.href = '_blank'
        link.hidden = true
        link.download = `leyfisbref-${license.programme}.pdf`
        document.body.appendChild(link)
        link.click()
        link.remove()
      })
      .catch((err) => console.error(err))
  }

  if (queryLoading) {
    return <SkeletonLoader width="100%" height={158} />
  }

  return (
    <>
      {educationLicense.map((license, index) => (
        <Box marginBottom={3} key={index}>
          <EducationCard
            eyebrow={license.school}
            title={`Leyfisbréf - ${license.programme}`}
            description={`Útgáfudagur: ${format(
              new Date(license.date),
              'dd. MMMM yyyy',
              {
                locale: is,
              },
            )}`}
            CTA={
              <Button
                variant="text"
                icon={mutationLoading ? undefined : 'download'}
                iconType="outline"
                nowrap
                onClick={() => handleDownload(license)}
                disabled={mutationLoading}
              >
                {mutationLoading
                  ? 'Innsiglun skjals í vinnslu…'
                  : 'Sækja skjal'}
              </Button>
            }
          />
        </Box>
      ))}
      {educationLicense.length === 0 && (
        <Box marginTop={8}>
          <EmptyState
            title={defineMessage({
              id: 'service.portal:education-no-data',
              defaultMessage: 'Engin gögn fundust',
            })}
          />
        </Box>
      )}
    </>
  )
}
