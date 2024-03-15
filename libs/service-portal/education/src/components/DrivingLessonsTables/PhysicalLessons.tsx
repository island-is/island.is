import React from 'react'
import { useLocale, useNamespaces } from '@island.is/localization'
import { Box, Table as T, Text } from '@island.is/island-ui/core'
import { DrivingBookLesson } from '@island.is/api/schema'
import { vehicleMessage as messages } from '@island.is/service-portal/assets/messages'
import { formatDate } from '@island.is/service-portal/core'

interface PropTypes {
  data: DrivingBookLesson[]
  title: string
}

const PhysicalLessons = ({ data, title }: PropTypes) => {
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
                {formatMessage(messages.vehicleDrivingLessonsMinuteCount)}
              </Text>
            </T.HeadData>
            <T.HeadData>
              <Text variant="medium" fontWeight="semiBold">
                {formatMessage(messages.vehicleDrivingLessonsTeacher)}
              </Text>
            </T.HeadData>
          </T.Row>
        </T.Head>
        <T.Body>
          {data?.map((lesson: DrivingBookLesson | null, index: number) => {
            return (
              <T.Row key={index + 'driving lessons physical table'}>
                <T.Data>
                  <Text variant="medium">
                    {lesson?.registerDate && formatDate(lesson.registerDate)}
                  </Text>
                </T.Data>
                <T.Data>
                  <Text variant="medium">{lesson?.lessonTime}</Text>
                </T.Data>
                <T.Data>
                  <Text variant="medium">{lesson?.teacherName}</Text>
                </T.Data>
              </T.Row>
            )
          })}
        </T.Body>
      </T.Table>
    </Box>
  )
}

export default PhysicalLessons
