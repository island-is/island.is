import { defineMessage } from 'react-intl'

import { Box, Stack } from '@island.is/island-ui/core'
import { useLocale, useNamespaces } from '@island.is/localization'
import {
  ActionCard,
  CardLoader,
  IntroHeader,
  m,
} from '@island.is/service-portal/core'
import { Query } from '@island.is/api/schema'
import { gql, useQuery } from '@apollo/client'
import { GET_ORGANIZATIONS_QUERY } from '@island.is/service-portal/graphql'
import { getOrganizationLogoUrl } from '@island.is/shared/utils'
import { EducationPaths } from '../../lib/paths'
import { Problem } from '@island.is/react-spa/shared'

const GetStudentInfoQuery = gql`
  query universityOfIcelandStudentInfo(
    $input: UniversityOfIcelandStudentInfoInput!
  ) {
    universityOfIcelandStudentInfo(input: $input) {
      transcripts {
        degree
        faculty
        institution {
          displayName
        }
        studyProgram
        trackNumber
      }
    }
  }
`

export const EducationGraduation = () => {
  useNamespaces('sp.education-graduation')
  const { lang, formatMessage } = useLocale()

  const { loading, error, data } = useQuery<Query>(GetStudentInfoQuery, {
    variables: {
      input: {
        locale: lang,
      },
    },
  })

  const { data: orgData } = useQuery(GET_ORGANIZATIONS_QUERY, {
    variables: {
      input: {
        lang: lang,
      },
    },
  })
  const organizations = orgData?.getOrganizations?.items || {}

  const studentInfo = data?.universityOfIcelandStudentInfo.transcripts || []

  return (
    <Box marginBottom={[6, 6, 10]}>
      <IntroHeader
        title={m.educationGraduation}
        intro={defineMessage({
          id: 'sp.education-graduation:education-graduation-intro',
          defaultMessage:
            'Hér getur þú fundið yfirlit yfir brautskráningar frá háskólanámi frá árinu 2015.',
          description: 'education graduation intro',
        })}
        serviceProviderSlug={'haskoli-islands'}
        serviceProviderTooltip={formatMessage(m.universityOfIcelandTooltip)}
      />
      {error && !loading && <Problem error={error} noBorder={false} />}
      {loading && !error && <CardLoader />}
      {!loading && !error && studentInfo.length === 0 && (
        <Box marginTop={8}>
          <Problem
            type="no_data"
            noBorder={false}
            title={formatMessage(m.noData)}
            message={formatMessage(m.noDataFoundDetail)}
            imgSrc="./assets/images/sofa.svg"
          />
        </Box>
      )}
      <Stack space={2}>
        {studentInfo.length > 0 &&
          studentInfo.map((item, index) => {
            return (
              <ActionCard
                key={`education-graduation-${index}`}
                heading={item.institution?.displayName}
                text={item.faculty}
                subText={`${item.studyProgram} ${item.degree}`}
                cta={{
                  label: defineMessage({
                    id: 'sp.education-graduation:details',
                    defaultMessage: 'Skoða',
                  }).defaultMessage,
                  variant: 'text',
                  url: item?.trackNumber
                    ? EducationPaths.EducationHaskoliGraduationDetail.replace(
                        ':id',
                        item.trackNumber.toString(),
                      )
                    : '',
                }}
                image={
                  item.institution?.displayName
                    ? {
                        type: 'image',
                        url: getOrganizationLogoUrl(
                          item.institution.displayName,
                          organizations,
                          120,
                        ),
                      }
                    : undefined
                }
              />
            )
          })}
      </Stack>
    </Box>
  )
}

export default EducationGraduation
