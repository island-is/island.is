import { defineMessage } from 'react-intl'

import { AlertMessage, Box, Stack } from '@island.is/island-ui/core'
import { useLocale, useNamespaces } from '@island.is/localization'
import {
  ActionCard,
  CardLoader,
  IntroHeader,
  m,
} from '@island.is/service-portal/core'
import { getOrganizationLogoUrl, isDefined } from '@island.is/shared/utils'
import { EducationPaths } from '../../lib/paths'
import { Problem } from '@island.is/react-spa/shared'
import { OrganizationSlugType } from '@island.is/shared/constants'
import { useStudentInfoQuery } from './EducationGraduation.generated'
import {
  UniversityCareersStudentTrackTranscript,
  UniversityCareersStudentTrackTranscriptError,
  UniversityCareersUniversityId,
} from '@island.is/api/schema'
import { useOrganizations } from '@island.is/service-portal/graphql'
import { useMemo } from 'react'

const mapUniversityToOrganization = (
  university: UniversityCareersUniversityId,
): OrganizationSlugType | null => {
  switch (university) {
    case UniversityCareersUniversityId.AGRICULTURAL_UNIVERSITY_OF_ICELAND:
      return 'landbunadarhaskoli-islands'
    case UniversityCareersUniversityId.HOLAR_UNIVERSITY:
      return 'holaskoli-haskolinn-a-holum'
    case UniversityCareersUniversityId.UNIVERSITY_OF_ICELAND:
      return 'haskoli-islands'
    case UniversityCareersUniversityId.UNIVERSITY_OF_AKUREYRI:
      return 'haskolinn-a-akureyri'
    case UniversityCareersUniversityId.BIFROST_UNIVERSITY:
      return 'bifrost'
    default:
      return null
  }
}

export const EducationGraduation = () => {
  useNamespaces('sp.education-graduation')
  const { lang, formatMessage } = useLocale()

  const { loading, error, data } = useStudentInfoQuery({
    variables: {
      input: {
        locale: lang,
      },
    },
  })

  const { data: organizations } = useOrganizations()

  const tracks: Array<UniversityCareersStudentTrackTranscript> =
    data?.universityCareersStudentTrackHistory?.trackResults
      .filter((u) => u.__typename === 'UniversityCareersStudentTrackTranscript')
      .filter(isDefined)
      .map((u) => u as UniversityCareersStudentTrackTranscript) ?? []

  const errors: Array<UniversityCareersStudentTrackTranscriptError> =
    useMemo(() => {
      return (
        data?.universityCareersStudentTrackHistory?.trackResults
          .filter(
            (u) =>
              u.__typename === 'UniversityCareersStudentTrackTranscriptError',
          )
          .filter(isDefined)
          .map((u) => u as UniversityCareersStudentTrackTranscriptError) ?? []
      )
    }, [data?.universityCareersStudentTrackHistory.trackResults])

  const errorString = useMemo(() => {
    return errors
      .map((e) => mapUniversityToOrganization(e.university))
      .map((e) => (organizations ?? []).find((o) => o.slug === e)?.title)
      .filter(isDefined)
      .join(', ')
  }, [errors, organizations])

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
      {!!errors.length && !error && !loading && (
        <Box marginBottom={2}>
          <AlertMessage
            type="warning"
            title={formatMessage(m.couldNotFetchAllItems)}
            message={formatMessage(m.couldNotFetchAllItemsDetail, {
              arg: errorString,
            })}
          />
        </Box>
      )}
      {error && !loading && <Problem error={error} noBorder={false} />}
      {loading && !error && <CardLoader />}
      {!loading && !error && !tracks?.length && !errors?.length && (
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
        {!!tracks?.length &&
          tracks?.map((item, index) => {
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
