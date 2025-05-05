import {
  addArray,
  formatDate,
  IntroHeader,
  m,
  MMS_SLUG,
  SortableTable,
} from '@island.is/portals/my-pages/core'
import {
  Box,
  GridColumn,
  GridRow,
  LoadingDots,
} from '@island.is/island-ui/core'
import { useLocale, useNamespaces } from '@island.is/localization'
import { useParams } from 'react-router-dom'

import { useGetInnaPeriodsQuery } from '../SecondarySchoolCareer/Periods.generated'
import { useGetInnaDiplomasQuery } from '../SecondarySchoolCareer/Diplomas.generated'
import { tagSelector } from '../../utils/tagSelector'
import { edMessage } from '../../lib/messages'
import { Problem } from '@island.is/react-spa/shared'

type UseParams = {
  id: string
}

export const EducationGraduationDetail = () => {
  useNamespaces('sp.education-secondary-school')
  const { formatMessage } = useLocale()
  const { id } = useParams() as UseParams

  const { data: innaData, loading, error } = useGetInnaPeriodsQuery()
  const {
    data: innaDiplomas,
    loading: loadingDiplomas,
    error: errorDiplomas,
  } = useGetInnaDiplomasQuery()

  const periodItems = innaData?.innaPeriods?.items || []
  const diplomaItems = innaDiplomas?.innaDiplomas?.items || []

  const singleGraduation = diplomaItems.filter(
    (item) => String(item.diplomaId) === id,
  )
  const graduationItem = singleGraduation[0]

  const periodArray = periodItems.filter(
    (item) => item?.organisation === graduationItem?.organisation,
  )

  const queryLoading = loading || loadingDiplomas
  const queryError = error || errorDiplomas

  if (queryLoading) {
    return (
      <Box marginBottom={6}>
        <GridRow>
          <GridColumn span={['12/12', '12/12', '6/8', '6/8']}>
            <LoadingDots />
          </GridColumn>
        </GridRow>
      </Box>
    )
  }
  return (
    <Box marginBottom={[6, 6, 10]}>
      <IntroHeader
        title={`${formatMessage(m.educationFramhskoliCareer)}: ${
          graduationItem.organisation ?? ''
        }`}
        intro={formatMessage(edMessage.careerIntro)}
        serviceProviderSlug={MMS_SLUG}
        serviceProviderTooltip={formatMessage(m.mmsTooltipSecondary)}
        marginBottom={6}
      />
      {/* <GridRow marginTop={4}>
        <GridColumn span="1/1">
          <Box
            display="flex"
            justifyContent="flexStart"
            printHidden
            marginBottom={4}
          >
            <Button
              colorScheme="default"
              icon="document"
              iconType="filled"
              size="default"
              type="button"
              variant="utility"
            >
              Sækja skjal
            </Button>
          </Box>
        </GridColumn>
      </GridRow> */}
      {queryError && !queryLoading && (
        <Problem error={queryError} noBorder={false} />
      )}
      {!queryError && !queryLoading && !periodArray.length && (
        <Problem
          type="no_data"
          noBorder={false}
          title={formatMessage(m.noData)}
          message={formatMessage(m.noDataFoundDetail)}
          imgSrc="./assets/images/sofa.svg"
        />
      )}
      {!queryLoading &&
        !queryError &&
        periodArray?.map((item, i) => (
          <Box key={i} marginTop={i > 0 ? 6 : 1}>
            <SortableTable
              title={`${item.organisation ?? ''} - ${item.periodName ?? ''}`}
              labels={{
                name: formatMessage(edMessage.courseName),
                course: formatMessage(edMessage.courseId),
                units: formatMessage(edMessage.units),
                grade: formatMessage(edMessage.grade),
                date: formatMessage(edMessage.dateShort),
                status: formatMessage(edMessage.status),
              }}
              defaultSortByKey="name"
              items={
                item.courses?.map((course, i) => ({
                  id: course?.courseId ?? `${i}`,
                  name: course?.courseName ?? '',
                  course: course?.courseId ?? '',
                  units: course?.units ?? '',
                  grade: course?.finalgrade ?? '',
                  date: formatDate(course?.date ?? ''),
                  status: course?.status ?? '',
                  tag: tagSelector(course?.status ?? ''),
                })) ?? []
              }
              footer={{
                name: `${formatMessage(edMessage.total)}:`,
                course: '',
                units: addArray(
                  item.courses?.map((item) => item?.units || '') || [],
                ),
              }}
            />
          </Box>
        ))}
    </Box>
  )
}

export default EducationGraduationDetail
