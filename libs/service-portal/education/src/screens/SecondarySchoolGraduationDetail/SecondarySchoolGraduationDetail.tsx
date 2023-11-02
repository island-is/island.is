import React from 'react'
import {
  addArray,
  formatDate,
  IntroHeader,
  m,
  NotFound,
  SortableTable,
} from '@island.is/service-portal/core'
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
import { defineMessage } from 'react-intl'
import { edMessage } from '../../lib/messages'

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

  const singleGraduation = diplomaItems.filter((item) => item.diplomaId === id)
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

  if ((!periodArray.length && !queryLoading) || queryError) {
    return (
      <NotFound
        title={defineMessage({
          id: 'sp.education-secondary-school:not-found',
          defaultMessage: 'Engin gögn fundust',
        })}
      />
    )
  }

  return (
    <Box marginBottom={[6, 6, 10]}>
      <IntroHeader
        title={`${formatMessage(m.educationFramhskoliCareer)}: ${
          graduationItem.organisation ?? ''
        }`}
        intro={formatMessage(edMessage.careerIntro)}
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

      {periodArray.length > 0 &&
        !loading &&
        periodArray.map((item, i) => (
          <Box key={i} marginTop={i > 0 ? 6 : 1}>
            <SortableTable
              title={`${item.organisation ?? ''} - ${item.periodName ?? ''}`}
              labels={{
                name: formatMessage(edMessage.courseName),
                brautarheiti: formatMessage(edMessage.courseId),
                einingar: formatMessage(edMessage.units),
                einkunn: formatMessage(edMessage.grade),
                dags: formatMessage(edMessage.dateShort),
                Staða: formatMessage(edMessage.status),
              }}
              items={
                item.courses?.map((course, i) => ({
                  id: course?.courseId ?? `${i}`,
                  name: course?.courseName ?? '',
                  brautarheiti: course?.courseId ?? '',
                  einingar: course?.units ?? '',
                  einkunn: course?.finalgrade ?? '',
                  dags: formatDate(course?.date ?? ''),
                  Staða: course?.status ?? '',
                  tag: tagSelector(course?.status ?? ''),
                })) ?? []
              }
              footer={{
                name: `${formatMessage(edMessage.total)}:`,
                brautarheiti: '',
                einingar: addArray(
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
