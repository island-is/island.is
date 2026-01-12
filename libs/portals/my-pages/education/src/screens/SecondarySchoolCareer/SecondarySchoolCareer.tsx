import React from 'react'
import {
  addArray,
  formatDate,
  IntroHeader,
  m,
  MMS_SLUG,
  SortableTable,
} from '@island.is/portals/my-pages/core'
import { Box, Column, SkeletonLoader } from '@island.is/island-ui/core'

import { useGetInnaPeriodsQuery } from './Periods.generated'
import { tagSelector } from '../../utils/tagSelector'
import { useLocale, useNamespaces } from '@island.is/localization'
import { edMessage } from '../../lib/messages'
import { Problem } from '@island.is/react-spa/shared'

export const EducationGraduationDetail = () => {
  useNamespaces('sp.education-secondary-school')
  const { data: innaData, loading, error } = useGetInnaPeriodsQuery()
  const { formatMessage } = useLocale()

  const periodItems = innaData?.innaPeriods?.items || []

  return (
    <Box marginBottom={[6, 6, 10]}>
      <IntroHeader
        title={m.educationFramhskoliCareer}
        intro={edMessage.careerIntro}
        serviceProviderSlug={MMS_SLUG}
        serviceProviderTooltip={formatMessage(m.mmsTooltipSecondary)}
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
      {error && !loading && <Problem error={error} noBorder={false} />}

      {!error && !loading && !periodItems.length && (
        <Problem
          type="no_data"
          noBorder={false}
          title={formatMessage(m.noData)}
          message={formatMessage(m.noDataFoundDetail)}
          imgSrc="./assets/images/sofa.svg"
        />
      )}
      {periodItems.length > 0 &&
        !loading &&
        periodItems.map((item, i) => (
          <Box key={i} marginTop={i > 0 ? 6 : 0}>
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
