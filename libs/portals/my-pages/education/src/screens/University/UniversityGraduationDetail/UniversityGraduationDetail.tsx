import {
  LocaleEnum,
  UniversityCareersStudyType,
  UniversityCareersUniversityId,
} from '@island.is/api/schema'
import {
  AlertMessage,
  Box,
  Button,
  DropdownMenu,
  GridColumn,
  GridRow,
  Text,
  Inline,
} from '@island.is/island-ui/core'
import { useLocale, useNamespaces } from '@island.is/localization'
import { formatNationalId } from '@island.is/portals/core'
import { Problem } from '@island.is/react-spa/shared'
import {
  InfoLineStack,
  InfoLine,
  formatDate,
  m,
  IntroWrapperV2,
  formSubmit,
} from '@island.is/portals/my-pages/core'
import { useParams } from 'react-router-dom'
import {
  mapSlugToContentfulSlug,
  mapSlugToUniversity,
} from '../../../utils/mapUniversitySlug'
import { useStudentTrackQuery } from './UniversityGraduationDetail.generated'
import { isDefined } from '@island.is/shared/utils'
import { uniMessages } from '../../../lib/messages'

type UseParams = {
  id: string
  uni: string
}

type Props = {
  studyType?: UniversityCareersStudyType
}

export const UniversityGraduationDetail = ({ studyType }: Props) => {
  useNamespaces('sp.education-graduation')
  const { id, uni } = useParams() as UseParams
  const { formatMessage, lang } = useLocale()

  const { data, loading, error } = useStudentTrackQuery({
    variables: {
      input: {
        trackNumber: parseInt(id),
        locale: lang === 'is' ? LocaleEnum.Is : LocaleEnum.En,
        universityId:
          mapSlugToUniversity(uni) ??
          UniversityCareersUniversityId.UNIVERSITY_OF_ICELAND,
      },
    },
  })

  const {
    transcript: studentInfo,
    metadata: text,
    files,
  } = data?.universityCareersStudentTrack ?? {
    transcript: undefined,
    text: undefined,
    files: undefined,
  }

  const graduationDate = studentInfo
    ? formatDate(studentInfo?.graduationDate)
    : undefined

  const downloadCount = files?.length ?? 0
  const fileDownloadDisplay: 'dropdown' | 'inline' | undefined =
    downloadCount > 2 ? 'dropdown' : downloadCount > 0 ? 'inline' : undefined

  const serviceProviderSlug = mapSlugToContentfulSlug(uni) ?? 'haskoli-islands'

  return (
    <IntroWrapperV2
      title={
        studyType === UniversityCareersStudyType.MICRO_CREDENTIALS
          ? m.educationMicroCredentials
          : m.educationGraduation
      }
      intro={text?.description || ''}
      serviceProvider={{ slug: serviceProviderSlug }}
    >
      <GridRow marginBottom={[1, 1, 1, 3]}>
        <GridColumn span="12/12">
          <Box
            display="flex"
            flexDirection="row"
            flexWrap="wrap"
            justifyContent="flexStart"
            printHidden
          >
            {files && fileDownloadDisplay === 'dropdown' && (
              <DropdownMenu
                icon="ellipsisHorizontal"
                iconType="outline"
                menuLabel={formatMessage(m.moreOptions)}
                items={files
                  .map((item) => {
                    const downloadServiceUrl = item.downloadServiceURL
                    if (!downloadServiceUrl) {
                      return null
                    }
                    return {
                      onClick: () => formSubmit(`${item.downloadServiceURL}`),
                      title: item.fileName,
                    }
                  })
                  .filter(isDefined)}
                title={formatMessage(uniMessages.graduationFiles)}
              />
            )}
            {fileDownloadDisplay === 'inline' && (
              <Inline space={2}>
                {files?.map((item) => {
                  if (!item.downloadServiceURL) {
                    return null
                  }
                  return (
                    <Button
                      key={`download-${item.fileName}`}
                      variant="utility"
                      size="small"
                      icon="document"
                      iconType="outline"
                      onClick={() => formSubmit(`${item.downloadServiceURL}`)}
                    >
                      {item.fileName}
                    </Button>
                  )
                })}
              </Inline>
            )}
            {!fileDownloadDisplay && !loading && (
              <Box width="full">
                <AlertMessage
                  type="warning"
                  title={formatMessage(m.noTranscriptForDownload)}
                  message={text?.unconfirmedData}
                />
              </Box>
            )}
          </Box>
        </GridColumn>
      </GridRow>
      {error && !loading && <Problem error={error} noBorder={false} />}

      {!loading && !error && !studentInfo && (
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
      {!error && (loading || studentInfo) && (
        <>
          <InfoLineStack label={formatMessage(m.overview)}>
            <InfoLine
              label={m.fullName}
              loading={loading}
              content={studentInfo?.name}
              translate="no"
            />
            <InfoLine
              label={m.date}
              loading={loading}
              content={graduationDate}
            />
            {studentInfo?.degree && (
              <InfoLine
                label={formatMessage(
                  studyType === UniversityCareersStudyType.MICRO_CREDENTIALS
                    ? uniMessages.studyLevel
                    : uniMessages.degree,
                )}
                loading={loading}
                content={formatNationalId(studentInfo.degree)}
              />
            )}
            {studentInfo?.studyProgram && (
              <InfoLine
                label={formatMessage(uniMessages.program)}
                loading={loading}
                content={formatNationalId(studentInfo?.studyProgram ?? '')}
              />
            )}
            <InfoLine
              label={formatMessage(uniMessages.faculty)}
              loading={loading}
              content={formatNationalId(studentInfo?.faculty ?? '')}
            />
            <InfoLine
              label={formatMessage(uniMessages.school)}
              loading={loading}
              content={formatNationalId(studentInfo?.school ?? '')}
            />
            <InfoLine
              label={formatMessage(uniMessages.institution)}
              loading={loading}
              content={formatNationalId(
                studentInfo?.institution?.displayName ?? '',
              )}
            />
          </InfoLineStack>
          <Box marginTop={5}>
            <Text variant="small">{text?.footer}</Text>
          </Box>
        </>
      )}
    </IntroWrapperV2>
  )
}

export default UniversityGraduationDetail
