import React from 'react'
import {
  addArray,
  formatDate,
  IntroHeader,
  m,
  NotFound,
  SortableTable,
} from '@island.is/service-portal/core'
import { Box, Column, SkeletonLoader } from '@island.is/island-ui/core'

import { useGetInnaPeriodsQuery } from './Periods.generated'
import { tagSelector } from '../../utils/tagSelector'
import { useLocale } from '@island.is/localization'
import { edMessage } from '../../lib/messages'
import { defineMessage } from 'react-intl'

export const EducationGraduationDetail = () => {
  const { data: innaData, loading, error } = useGetInnaPeriodsQuery()
  const { formatMessage } = useLocale()

  const periodItems = innaData?.innaPeriods?.items || []

  if ((!periodItems.length && !loading) || error) {
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
        title={m.educationFramhskoliCareer}
        intro={edMessage.careerIntro}
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
      <Box marginTop={4}>
        {loading && (
          <Column width="content">
            <SkeletonLoader repeat={3} space={2} />
          </Column>
        )}
      </Box>
      {periodItems.length > 0 &&
        !loading &&
        periodItems.map((item, i) => (
          <Box key={i} marginTop={i > 0 ? 6 : 0}>
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
