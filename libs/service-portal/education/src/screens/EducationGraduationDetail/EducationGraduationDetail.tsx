import React from 'react'
import { defineMessage } from 'react-intl'

import {
  Box,
  Button,
  Divider,
  GridColumn,
  GridRow,
  SkeletonLoader,
  Stack,
  Text,
} from '@island.is/island-ui/core'
import { useLocale, useNamespaces } from '@island.is/localization'
import {
  EmptyState,
  ErrorScreen,
  formatDate,
  formSubmit,
  IntroHeader,
  m,
  UserInfoLine,
} from '@island.is/service-portal/core'
import { Query } from '@island.is/api/schema'
import { gql, useQuery } from '@apollo/client'
import { formatNationalId } from '@island.is/portals/core'
import { useParams } from 'react-router-dom'
import format from 'date-fns/format'
import is from 'date-fns/locale/is'

const GetStudentInfoQuery = gql`
  query universityOfIcelandStudentInfo(
    $input: UniversityOfIcelandStudentInfoInput!
  ) {
    universityOfIcelandStudentInfo(input: $input) {
      track(input: $input) {
        transcript {
          degree
          faculty
          graduationDate
          institution {
            id
            displayName
          }
          name
          nationalId
          school
          studyProgram
          trackNumber
        }
        files {
          type
          locale
          displayName
          fileName
        }
        body {
          description
          footer
          unconfirmedData
        }
        downloadServiceURL
      }
    }
  }
`

type UseParams = {
  id: string
}

export const EducationGraduationDetail = () => {
  useNamespaces('sp.education-graduation')
  const { id } = useParams() as UseParams
  const { formatMessage, lang } = useLocale()

  const { data, loading, error } = useQuery<Query>(GetStudentInfoQuery, {
    variables: {
      input: {
        trackNumber: parseInt(id),
        locale: lang,
      },
    },
  })

  const studentInfo = data?.universityOfIcelandStudentInfo.track.transcript
  const text = data?.universityOfIcelandStudentInfo.track.body
  const files = data?.universityOfIcelandStudentInfo.track.files
  const downloadServiceURL =
    data?.universityOfIcelandStudentInfo.track.downloadServiceURL

  const graduationDate = studentInfo
    ? formatDate(studentInfo?.graduationDate)
    : undefined

  const noFiles = files?.length === 0

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
        intro={text?.description || ''}
      />
      <GridRow marginBottom={[1, 1, 1, 3]}>
        <GridColumn span="12/12">
          <Box
            display="flex"
            flexDirection="row"
            flexWrap="wrap"
            justifyContent="flexStart"
            printHidden
          >
            {files &&
              files?.length > 0 &&
              downloadServiceURL &&
              files?.map((item, index) => {
                return (
                  <Box
                    key={`education-graduation-button-${index}`}
                    paddingRight={2}
                    marginBottom={[1, 1, 1, 0]}
                  >
                    <Button
                      variant="utility"
                      size="small"
                      icon="document"
                      iconType="outline"
                      onClick={() =>
                        formSubmit(
                          `${downloadServiceURL}${item.locale}/${studentInfo?.trackNumber}`,
                        )
                      }
                    >
                      {item.displayName}
                    </Button>
                  </Box>
                )
              })}
            {noFiles ? (
              <Box marginTop={1}>
                {text?.unconfirmedData && (
                  <Button
                    variant="utility"
                    size="small"
                    icon="document"
                    iconType="outline"
                    disabled
                  >
                    {formatMessage(m.educationCareer)}
                  </Button>
                )}
                <Text marginTop={1}>{text?.unconfirmedData || ''}</Text>
              </Box>
            ) : undefined}
          </Box>
        </GridColumn>
      </GridRow>
      {loading && !error && (
        <SkeletonLoader height={20} width={500} repeat={3} />
      )}
      {!loading && !error && !studentInfo && (
        <Box marginTop={8}>
          <EmptyState
            title={defineMessage({
              id: 'sp.education-graduation:education-grad-detail-no-data',
              defaultMessage: 'Engin gögn fundust',
            })}
          />
        </Box>
      )}
      <>
        <Stack space={1}>
          <UserInfoLine
            title={formatMessage(m.overview)}
            label={m.fullName}
            loading={loading}
            content={studentInfo?.name}
            translate="no"
          />
          <Divider />
          <UserInfoLine
            label={m.date}
            loading={loading}
            content={graduationDate}
          />
          <Divider />
          <UserInfoLine
            label={defineMessage({
              id: 'sp.education-graduation:education-grad-detail-degree',
              defaultMessage: 'Gráða',
            })}
            loading={loading}
            content={formatNationalId(studentInfo?.degree ?? '')}
          />
          <Divider />
          <UserInfoLine
            label={defineMessage({
              id: 'sp.education-graduation:education-grad-detail-program',
              defaultMessage: 'Námsleið',
            })}
            loading={loading}
            content={formatNationalId(studentInfo?.studyProgram ?? '')}
          />
          <Divider />
          <UserInfoLine
            label={defineMessage({
              id: 'sp.education-graduation:education-grad-detail-faculty',
              defaultMessage: 'Deild',
            })}
            loading={loading}
            content={formatNationalId(studentInfo?.faculty ?? '')}
          />
          <Divider />
          <UserInfoLine
            label={defineMessage({
              id: 'sp.education-graduation:education-grad-detail-school',
              defaultMessage: 'Svið',
            })}
            loading={loading}
            content={formatNationalId(studentInfo?.school ?? '')}
          />
          <Divider />
          <UserInfoLine
            label={defineMessage({
              id: 'sp.education-graduation:education-grad-detail-instutution',
              defaultMessage: 'Stofnun',
            })}
            loading={loading}
            content={formatNationalId(
              studentInfo?.institution?.displayName ?? '',
            )}
          />
          <Divider />
        </Stack>
        <Box marginTop={5}>
          {loading && !error && <SkeletonLoader height={20} repeat={2} />}
          <Text variant="small">{text?.footer}</Text>
        </Box>
      </>
    </Box>
  )
}

export default EducationGraduationDetail
