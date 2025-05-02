import { UniversityCareersUniversityId } from '@island.is/api/schema'
import {
  AlertMessage,
  Box,
  DropdownMenu,
  GridColumn,
  GridRow,
  Text,
} from '@island.is/island-ui/core'
import { useLocale, useNamespaces } from '@island.is/localization'
import { formatNationalId } from '@island.is/portals/core'
import { Problem } from '@island.is/react-spa/shared'
import {
  InfoLineStack,
  InfoLine,
  formatDate,
  m,
  IntroWrapper,
} from '@island.is/portals/my-pages/core'
import { useParams } from 'react-router-dom'
import {
  mapSlugToContentfulSlug,
  mapSlugToUniversity,
} from '../../utils/mapUniversitySlug'
import { useStudentTrackQuery } from './UniversityGraduationDetail.generated'
import { isDefined } from '@island.is/shared/utils'
import { uniMessages } from '../../lib/messages'

type UseParams = {
  id: string
  uni: string
}

export const UniversityGraduationDetail = () => {
  useNamespaces('sp.education-graduation')
  const { id, uni } = useParams() as UseParams
  const { formatMessage, lang } = useLocale()

  const { data, loading, error } = useStudentTrackQuery({
    variables: {
      input: {
        trackNumber: parseInt(id),
        locale: lang,
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

  const filesAvailable = (files?.length ?? 0) > 0

  return (
    <IntroWrapper
      title={m.educationGraduation}
      intro={text?.description || ''}
      serviceProviderSlug={mapSlugToContentfulSlug(uni) ?? 'haskoli-islands'}
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
            {files && filesAvailable && (
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
                      href: downloadServiceUrl,
                      title: item.displayName,
                    }
                  })
                  .filter(isDefined)}
                title={formatMessage(uniMessages.graduationFiles)}
              />
            )}
            {!filesAvailable && !loading && (
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
                label={formatMessage(uniMessages.degree)}
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
    </IntroWrapper>
  )
}

export default UniversityGraduationDetail
