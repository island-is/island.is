import React from 'react'
import { useLocale, useNamespaces } from '@island.is/localization'
import { Box, Table as T, Text } from '@island.is/island-ui/core'
import { DrivingSchoolExam } from '@island.is/api/schema'
import { vehicleMessage as messages } from '@island.is/service-portal/assets/messages'
import { formatDate } from '@island.is/service-portal/core'

interface PropTypes {
  data: DrivingSchoolExam[]
  title: string
}

const DrivingLessonsSchools = ({ data, title }: PropTypes) => {
  useNamespaces('sp.vehicles')
  const { formatMessage } = useLocale()
  return (
    <Box marginBottom={4} marginTop="containerGutter">
      <Text variant="h4" fontWeight="semiBold" paddingBottom={2}>
        {title}
      </Text>
      <T.Table>
        <T.Head>
          <T.Row>
            <T.HeadData>
              <Text variant="medium" fontWeight="semiBold">
                {formatMessage(messages.date)}
              </Text>
            </T.HeadData>
            <T.HeadData>
              <Text variant="medium" fontWeight="semiBold">
                {formatMessage(messages.vehicleDrivingLessonsCourseTitle)}
              </Text>
            </T.HeadData>
            <T.HeadData>
              <Text variant="medium" fontWeight="semiBold">
                {formatMessage(messages.vehicleDrivingLessonsSchool)}
              </Text>
            </T.HeadData>
            <T.HeadData>
              <Text variant="medium" fontWeight="semiBold">
                {formatMessage(messages.vehicleDrivingLessonsComments)}
              </Text>
            </T.HeadData>
          </T.Row>
        </T.Head>
        <T.Body>
          {data?.map((lesson: DrivingSchoolExam | null, index: number) => {
            return (
              <T.Row key={index + 'driving lessons physical table'}>
                <T.Data>
                  <Text variant="medium">
                    {lesson?.examDate && formatDate(lesson.examDate)}
                  </Text>
                </T.Data>
                <T.Data>
                  <Text variant="medium">{lesson?.schoolTypeName}</Text>
                </T.Data>
                <T.Data>
                  <Text variant="medium">{lesson?.schoolName}</Text>
                </T.Data>
                <T.Data>
                  <Text variant="medium">{lesson?.comments}</Text>
                </T.Data>
              </T.Row>
            )
          })}
        </T.Body>
      </T.Table>
    </Box>
  )
}

export default DrivingLessonsSchools
