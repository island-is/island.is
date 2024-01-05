import { defineMessage } from 'react-intl'

import { Box, Stack } from '@island.is/island-ui/core'
import { useLocale, useNamespaces } from '@island.is/localization'
import {
  ActionCard,
  CardLoader,
  EmptyState,
  ErrorScreen,
  IntroHeader,
  UNI_HI_SLUG,
  m,
} from '@island.is/service-portal/core'
import { Query } from '@island.is/api/schema'
import { gql, useQuery } from '@apollo/client'
import { GET_ORGANIZATIONS_QUERY } from '@island.is/service-portal/graphql'
import { getOrganizationLogoUrl } from '@island.is/shared/utils'
import { EducationPaths } from '../../lib/paths'

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
  if (error && !loading) {
    return (
      <ErrorScreen
        figure="./assets/images/hourglass.svg"
        tagVariant="red"
        tag={formatMessage(m.errorTitle)}
        title={formatMessage(m.somethingWrong)}
        children={formatMessage(m.errorFetchModule, {
          module: formatMessage(m.education).toLowerCase(),
        })}
      />
    )
  }

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
        serviceProviderSlug={UNI_HI_SLUG}
        serviceProviderTooltip={formatMessage(m.universityOfIcelandTooltip)}
      />
      {loading && !error && <CardLoader />}
      {!loading && !error && studentInfo.length === 0 && (
        <Box marginTop={8}>
          <EmptyState
            title={defineMessage({
              id: 'sp.education-graduation:education-no-data',
              defaultMessage: 'Engin gögn fundust',
            })}
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
