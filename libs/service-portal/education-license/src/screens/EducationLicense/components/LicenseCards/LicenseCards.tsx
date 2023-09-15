import React, { useState, useEffect } from 'react'
import { gql, useQuery, useMutation } from '@apollo/client'
import format from 'date-fns/format'
import is from 'date-fns/locale/is'

import { Query, Mutation, EducationLicense } from '@island.is/api/schema'
import { Box, Button, ModalBase, Stack, Text } from '@island.is/island-ui/core'
import { CardLoader, EmptyState, m } from '@island.is/service-portal/core'
import { ActionCard } from '@island.is/service-portal/core'

import * as styles from './LicenseCards.css'
import { useLocale, useNamespaces } from '@island.is/localization'

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
  const [fetchEducationSignedLicenseUrl, { loading: mutationLoading }] =
    useMutation<Mutation>(FetchEducationSignedLicenseUrlMutation)
  useNamespaces('sp.education-license')
  const { formatMessage } = useLocale()

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
    return <CardLoader />
  }

  return (
    <>
      {educationLicense.map((license, index) => (
        <Box marginBottom={3} key={index}>
          <ActionCard
            cta={{
              label: mutationLoading
                ? formatMessage({
                    id: 'sp.education-license:downloading',
                    defaultMessage: 'Innsiglun skjals í vinnslu…',
                  })
                : formatMessage({
                    id: 'sp.education-license:send-file',
                    defaultMessage: 'Senda skjal í undirritun',
                  }),
              onClick: () => handleDownload(license),
              variant: 'text',
            }}
            tag={{
              label: license.school,
              variant: 'purple',
              outlined: false,
            }}
            text={`${formatMessage({
              id: 'sp.education-license:date',
              defaultMessage: 'Útgáfudagur',
            })}: ${format(new Date(license.date), 'dd. MMMM yyyy', {
              locale: is,
            })}`}
            heading={`${formatMessage({
              id: 'sp.education-license:programme',
              defaultMessage: 'Leyfisbréf',
            })} - ${license.programme}`}
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
                <Text variant="h1">
                  {formatMessage({
                    id: 'sp.education-license:doc-ready-for-dl',
                    defaultMessage: 'Skjal tilbúið í niðurhal',
                  })}
                </Text>
                <Box marginTop={2}>
                  <Text variant="intro">
                    {formatMessage({
                      id: 'sp.education-license:doc-ready-sealed',
                      defaultMessage:
                        'Leyfisbréfið þitt hefur verið innsiglað og er tilbúið til niðurhals.',
                    })}
                  </Text>
                </Box>
                {expiry > 0 ? (
                  <Text>
                    {formatMessage({
                      id: 'sp.education-license:download-link-expiry',
                      defaultMessage:
                        'Athugið að niðurhalslinkurinn rennur út eftir',
                    })}{' '}
                    <Text as="span" variant="intro" color="red400">
                      {expiry}
                    </Text>{' '}
                    {formatMessage({
                      id: 'sp.education-license:seconds',
                      defaultMessage: 'sekúndur.',
                    })}
                  </Text>
                ) : (
                  <Text color="red400">
                    {formatMessage({
                      id: 'sp.education-license:download-link-expired',
                      defaultMessage: 'Niðurhalslinkurinn er útrunninn.',
                    })}
                  </Text>
                )}
              </Stack>
              <Box
                width="full"
                display="inlineFlex"
                justifyContent="spaceBetween"
              >
                <Button variant="ghost" onClick={closeModal}>
                  {formatMessage({
                    id: 'sp.education-license:cancel',
                    defaultMessage: 'Hætta við',
                  })}
                </Button>
                <Button disabled={expiry <= 0}>
                  <a download href={href} target="_blank" rel="noreferrer">
                    {formatMessage({
                      id: 'sp.education-license:download',
                      defaultMessage: 'Hlaða niður',
                    })}
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
