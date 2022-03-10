import React, { useState, useEffect } from 'react'
import { gql, useQuery, useMutation } from '@apollo/client'
import format from 'date-fns/format'
import is from 'date-fns/locale/is'

import { Query, Mutation, EducationLicense } from '@island.is/api/schema'
import {
  Box,
  Button,
  SkeletonLoader,
  ModalBase,
  Stack,
  Text,
} from '@island.is/island-ui/core'
import { EducationCard, EmptyState, m } from '@island.is/service-portal/core'

import * as styles from './LicenseCards.css'

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
  const { data, loading: queryLoading } = useQuery<Query>(EducationLicenseQuery)
  const [href, setHref] = useState('')
  const [expiry, setExpiry] = useState(0)
  const [
    fetchEducationSignedLicenseUrl,
    { loading: mutationLoading },
  ] = useMutation<Mutation>(FetchEducationSignedLicenseUrlMutation)

  useEffect(() => {
    const interval = setInterval(() => {
      setExpiry((expiry) => expiry - 1)
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  const { educationLicense = [] } = data || {}

  const handleDownload = async (license: EducationLicense) => {
    const { data } = await fetchEducationSignedLicenseUrl({
      variables: { input: { licenseId: license.id } },
    })
    if (!data?.fetchEducationSignedLicenseUrl) {
      return
    }
    setHref(data?.fetchEducationSignedLicenseUrl.url)
    setExpiry(60)
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
                  : 'Senda skjal í undirritun'}
              </Button>
            }
          />
        </Box>
      ))}
      {educationLicense.length === 0 && (
        <Box marginTop={8}>
          <EmptyState title={m.noDataFound} />
        </Box>
      )}
      <ModalBase
        baseId="downloadDocumentAfterESeal"
        className={styles.modal}
        isVisible={Boolean(href)}
        onVisibilityChange={(isOpen) => {
          if (!isOpen) {
            setHref('')
          }
        }}
      >
        {({ closeModal }: { closeModal: () => void }) => (
          <Box
            background="white"
            paddingY={[3, 6, 12]}
            paddingX={[3, 6, 12, 15]}
          >
            <Stack space={4}>
              <Stack space={2}>
                <Text variant="h1">Skjal tilbúið í niðurhal</Text>
                <Box marginTop={2}>
                  <Text variant="intro">
                    Leyfisbréfið þitt hefur verið innsiglað og er tilbúið til
                    niðurhals.
                  </Text>
                </Box>
                {expiry > 0 ? (
                  <Text>
                    Athugið að niðurhalslinkurinn rennur út eftir{' '}
                    <Text as="span" variant="intro" color="red400">
                      {expiry}
                    </Text>{' '}
                    sekúndur.
                  </Text>
                ) : (
                  <Text color="red400">Niðurhalslinkurinn er útrunninn</Text>
                )}
              </Stack>
              <Box
                width="full"
                display="inlineFlex"
                justifyContent="spaceBetween"
              >
                <Button variant="ghost" onClick={closeModal}>
                  Hætta við
                </Button>
                <Button disabled={expiry <= 0}>
                  <a download href={href} target="_blank" rel="noreferrer">
                    Hlaða niður
                  </a>
                </Button>
              </Box>
            </Stack>
          </Box>
        )}
      </ModalBase>
    </>
  )
}

export default LicenseCards
