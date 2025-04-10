import { AlertMessage, Box, Stack } from '@island.is/island-ui/core'
import { useLocale, useNamespaces } from '@island.is/localization'
import {
  ActionCard,
  CardLoader,
  IntroWrapper,
  m as coreMessages,
} from '@island.is/portals/my-pages/core'
import { isDefined } from '@island.is/shared/utils'
import { EducationPaths } from '../../lib/paths'
import { Problem } from '@island.is/react-spa/shared'
import { useStudentInfoQuery } from './EducationGraduation.generated'
import { useMemo } from 'react'
import { mapUniversityToSlug } from '../../utils/mapUniversitySlug'
import { uniMessages } from '../../lib/messages'

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

  const errors = data?.universityCareersStudentTrackHistory?.errors
  const transcripts = data?.universityCareersStudentTrackHistory?.transcripts

  const errorString = useMemo(() => {
    if (errors) {
      return errors
        .map((e) => e.institution.displayName)
        .filter(isDefined)
        .join(', ')
    }
  }, [errors])

  return (
    <IntroWrapper
      title={coreMessages.educationGraduation}
      intro={uniMessages.graduationIntro}
    >
      {!!errors?.length && !error && !loading && (
        <Box marginBottom={2}>
          <AlertMessage
            type="warning"
            title={formatMessage(coreMessages.couldNotFetchAllItems)}
            message={formatMessage(coreMessages.couldNotFetchAllItemsDetail, {
              arg: errorString,
            })}
          />
        </Box>
      )}
      {error && !loading && <Problem error={error} noBorder={false} />}
      {loading && !error && <CardLoader />}
      {!loading && !error && !transcripts?.length && !errors?.length && (
        <Box marginTop={8}>
          <Problem
            type="no_data"
            noBorder={false}
            title={formatMessage(coreMessages.noData)}
            message={formatMessage(coreMessages.noDataFoundDetail)}
            imgSrc="./assets/images/sofa.svg"
          />
        </Box>
      )}
      <Stack space={2}>
        {!!transcripts?.length &&
          transcripts?.map((item, index) => {
            if (!item.institution.id) {
              return null
            }
            return (
              //TODO: Replace with Island UI Card when it supports images
              <ActionCard
                key={`education-graduation-${index}`}
                heading={
                  item.studyProgram && item.degree
                    ? `${item.studyProgram} - ${item.degree}`
                    : item.institution.displayName ?? undefined
                }
                text={item.faculty}
                subText={
                  item.studyProgram && item.degree
                    ? item.institution.displayName ?? undefined
                    : undefined
                }
                cta={{
                  label: formatMessage(uniMessages.seeDetails),
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
    </IntroWrapper>
  )
}

export default EducationGraduation
