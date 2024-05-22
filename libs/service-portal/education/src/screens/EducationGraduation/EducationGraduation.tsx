import { defineMessage } from 'react-intl'

import { AlertMessage, Box, Stack } from '@island.is/island-ui/core'
import { useLocale, useNamespaces } from '@island.is/localization'
import {
  ActionCard,
  CardLoader,
  IntroHeader,
  m,
} from '@island.is/service-portal/core'
import { isDefined } from '@island.is/shared/utils'
import { EducationPaths } from '../../lib/paths'
import { Problem } from '@island.is/react-spa/shared'
import { useStudentInfoQuery } from './EducationGraduation.generated'
import {
  UniversityCareersStudentTrackTranscript,
  UniversityCareersStudentTrackTranscriptError,
} from '@island.is/api/schema'
import { useOrganizations } from '@island.is/service-portal/graphql'
import { useMemo } from 'react'
import { mapUniversityToSlug } from '../../utils/mapUniversitySlug'

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
      .map((e) => mapUniversityToSlug(e.university))
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
            if (!item.institution.id) {
              return null
            }
            return (
              <ActionCard
                key={`education-graduation-${index}`}
                heading={`${item.studyProgram} - ${item.degree}`}
                text={item.faculty}
                subText={item.institution.displayName ?? undefined}
                cta={{
                  label: defineMessage({
                    id: 'sp.education-graduation:details',
                    defaultMessage: 'Skoða',
                  }).defaultMessage,
                  variant: 'text',
                  url:
                    item?.trackNumber && item?.institution?.id
                      ? EducationPaths.EducationHaskoliGraduationDetail.replace(
                          ':id',
                          item.trackNumber.toString(),
                        ).replace(
                          ':uni',
                          mapUniversityToSlug(item.institution.id),
                        )
                      : '',
                }}
                image={
                  item.institution?.logoUrl
                    ? {
                        type: 'image',
                        url: item.institution.logoUrl,
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
