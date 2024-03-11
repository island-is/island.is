import { defineMessage } from 'react-intl'

import { AlertMessage, Box, Stack } from '@island.is/island-ui/core'
import { useLocale, useNamespaces } from '@island.is/localization'
import {
  ActionCard,
  CardLoader,
  IntroHeader,
  UNI_HI_SLUG,
  m,
} from '@island.is/service-portal/core'
import { useOrganizations } from '@island.is/service-portal/graphql'
import { getOrganizationLogoUrl, isDefined } from '@island.is/shared/utils'
import { EducationPaths } from '../../lib/paths'
import { Problem } from '@island.is/react-spa/shared'
import { useStudentInfoQuery } from './EducationGraduation.generated'
import { useMemo } from 'react'

export const EducationGraduation = () => {
  useNamespaces('sp.education-graduation')
  const { lang, formatMessage } = useLocale()

  const { loading, error, data } = useStudentInfoQuery({
    errorPolicy: 'all',
    variables: {
      input: {
        locale: lang,
      },
    },
  })

  const { data: organizations } = useOrganizations()

  const possibleTracks = data?.universityCareersStudentTrackHistory

  const tracks = useMemo(
    () => [
      ...(possibleTracks?.agriculturalUniversityOfIceland ?? []),
      ...(possibleTracks?.universityOfIceland ?? []),
      ...(possibleTracks?.universityOfAkureyri ?? []),
      ...(possibleTracks?.bifrostUniversity ?? []),
      ...(possibleTracks?.holarUniversity ?? []),
    ],
    [possibleTracks],
  )

  const errorString = useMemo(() => {
    const mapPathsToIssuerString = (paths?: Array<string | number>) => {
      const mapPath = (path: string | number) => {
        if (typeof path === 'number') {
          return
        }
        switch (path) {
          case 'universityOfIceland':
            return 'hi fail'
          case 'universityOfAkureyri':
            return 'unak fail'
          case 'bifrostUniversity':
            return 'bifrost fail'
          case 'holarUniversity':
            return 'holar fail'
          case 'agriculturalUniversityOfIceland':
            return 'lbhi fail'
          default:
            return
        }
      }
      if (!paths) {
        return
      }

      return paths.map((p) => mapPath(p)).filter(isDefined)
    }
    let issuersArray: Array<string> = []
    if (error?.graphQLErrors) {
      error.graphQLErrors.forEach((e) => {
        const paths = e.path ? [...e.path] : []
        const mappedPaths = mapPathsToIssuerString(paths)
        if (mappedPaths) {
          issuersArray = [...issuersArray, ...mappedPaths]
        }
      })
    }
    return issuersArray.join(', ')
  }, [error?.graphQLErrors])

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
      <Stack space={2}>
        {!!tracks.length &&
          tracks.map((item, index) => {
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
        {!error && !!tracks.length && !loading && (
          <Problem
            type="no_data"
            noBorder={false}
            title={formatMessage(m.noData)}
            message={formatMessage(m.noDataFoundDetail)}
            imgSrc="./assets/images/sofa.svg"
          />
        )}
        {error && !data && !loading && (
          <Problem noBorder={false} error={error} />
        )}
        {error && !loading && data && (
          <AlertMessage
            type="warning"
            title={'fetch fail'}
            message={`fetch failed for the following providers; ${errorString}`}
          />
        )}
      </Stack>
    </Box>
  )
}

export default EducationGraduation
