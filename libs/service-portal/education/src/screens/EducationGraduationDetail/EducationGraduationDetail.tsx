import { defineMessage } from 'react-intl'

import {
  Box,
  Button,
  Divider,
  GridColumn,
  GridRow,
  Stack,
  Text,
} from '@island.is/island-ui/core'
import { useLocale, useNamespaces } from '@island.is/localization'
import {
  formatDate,
  formSubmit,
  IntroHeader,
  m,
  UserInfoLine,
} from '@island.is/service-portal/core'
import { formatNationalId } from '@island.is/portals/core'
import { useParams } from 'react-router-dom'
import { useStudentTrackQuery } from './EducationGraduationDetail.generated'
import { Problem } from '@island.is/react-spa/shared'
import { OrganizationSlugType } from '@island.is/shared/constants'
type UseParams = {
  id: string
  uni: string
}

export const EducationGraduationDetail = () => {
  useNamespaces('sp.education-graduation')
  const { id, uni } = useParams() as UseParams
  const { formatMessage, lang } = useLocale()

  const { data, loading, error } = useStudentTrackQuery({
    variables: {
      input: {
        trackNumber: parseInt(id),
        locale: lang,
        universityId: uni,
      },
    },
  })

  const studentInfo = data?.universityCareersStudentTrack?.transcript
  const text = data?.universityCareersStudentTrack?.metadata
  const files = data?.universityCareersStudentTrack?.files
  const downloadServiceURL =
    data?.universityCareersStudentTrack?.downloadServiceURL

  const graduationDate = studentInfo
    ? formatDate(studentInfo?.graduationDate)
    : undefined

  const noFiles = files?.length === 0

  return (
    <Box marginBottom={[6, 6, 10]}>
      <IntroHeader
        title={m.educationGraduation}
        intro={text?.description || ''}
        serviceProviderSlug={uni as OrganizationSlugType}
        serviceProviderTooltip={formatMessage(m.universityOfIcelandTooltip)}
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
            <Text variant="small">{text?.footer}</Text>
          </Box>
        </>
      )}
    </Box>
  )
}

export default EducationGraduationDetail
