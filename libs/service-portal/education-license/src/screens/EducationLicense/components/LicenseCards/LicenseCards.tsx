import React, { ReactNode } from 'react'
import { MessageDescriptor } from 'react-intl'

import { useLocale, useNamespaces } from '@island.is/localization'
import { gql, useQuery } from '@apollo/client'
import { Query, License } from '@island.is/api/schema'
import {
  AlertMessage,
  Box,
  Button,
  SkeletonLoader,
  Text,
  Table as T,
} from '@island.is/island-ui/core'
import * as styles from './LicenseCard.treat'

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

const LicenseCards = () => {
  const { data, loading } = useQuery<Query>(educationLicenseQuery)
  useNamespaces('sp.driving-license')
  return (
    <>
      {data?.educationLicense.map((license) => (
        <Box marginBottom={3}>
          <ActionCard
            eyebrow={license.school}
            imgPlaceholder={'MRN'}
            title={`Leyfisbréf - ${license.programme}`}
            description={license.date}
            CTA={
              <Button variant="text" icon="download" iconType="outline" nowrap>
                Sækja skjal
              </Button>
            }
          />
        </Box>
      ))}
      {data?.educationLicense.map((license) => (
        <Box marginBottom={3}>
          <ActionCard
            eyebrow={license.school}
            imgPlaceholder={'HÍ'}
            title={`Leyfisbréf - ${license.programme}`}
            description={license.date}
            CTA={
              <Button variant="text" icon="download" iconType="outline" nowrap>
                Sækja skjal
              </Button>
            }
          />
        </Box>
      ))}
      {data?.educationLicense.map((license) => (
        <Box marginBottom={3}>
          <ActionCard
            title={`Leyfisbréf - ${license.programme}`}
            description={license.date}
            CTA={
              <Button variant="text" icon="download" iconType="outline" nowrap>
                Sækja skjal
              </Button>
            }
          />
        </Box>
      ))}
      {data?.educationLicense.length === 0 && (
        <Box marginTop={2}>
          <AlertMessage
            type="info"
            title="Engin leyfisbréf fundust"
            message="Ef eitthvað er í ólagi hér er gott að hafa samband við leyfisbref@leyfisbref.is"
          />
        </Box>
      )}
    </>
  )
}

const LoadingPlaceholder = () => (
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

interface ActionCard {
  eyebrow?: string
  title?: string
  description?: string
  img?: string
  CTA?: ReactNode
  imgPlaceholder?: string
}

const ActionCard = ({
  eyebrow,
  title,
  description,
  img,
  CTA,
  imgPlaceholder,
}: ActionCard) => {
  return (
    <Box
      display={['block', 'flex']}
      alignItems="center"
      paddingY={[2, 3, 4]}
      paddingX={[2, 3, 4]}
      border="standard"
      borderRadius="large"
    >
      <Box display="flex" alignItems="center">
        {img && <img src={img} alt="" className={styles.img} />}
        {imgPlaceholder && !img && (
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            flexShrink={0}
            marginRight={[2, 4]}
            borderRadius="circle"
            background="blue100"
            color="blue400"
            className={styles.img}
          >
            <span className={styles.imgText}>{imgPlaceholder}</span>
          </Box>
        )}
        <div>
          {eyebrow && (
            <Text variant="eyebrow" color="purple400">
              {eyebrow}
            </Text>
          )}
          {title && (
            <Text variant="h3" as="h3" color="dark400" marginBottom={1}>
              {title}
            </Text>
          )}
          {description && <Text fontWeight="light">{description}</Text>}
        </div>
      </Box>
      {CTA && (
        <Box marginTop={[2, 'auto']} marginLeft="auto" textAlign="right">
          {CTA}
        </Box>
      )}
    </Box>
  )
}

export default LicenseCards
