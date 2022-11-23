import React from 'react'
import { useQuery, gql } from '@apollo/client'
import { Query } from '@island.is/api/schema'
import {
  Box,
  Divider,
  SkeletonLoader,
  Stack,
  Text,
} from '@island.is/island-ui/core'
import { useLocale, withClientLocale } from '@island.is/localization'
import {
  ErrorScreen,
  ServicePortalModuleComponent,
  UserInfoLine,
  m,
  formatDate,
  IntroHeader,
  EmptyState,
} from '@island.is/service-portal/core'

import { messages } from '../../lib/messages'
import PhysicalLessons from '../../components/DrivingLessonsTables/PhysicalLessons'
import DrivingLessonsSchools from '../../components/DrivingLessonsTables/DrivingLessonsSchools'
import Exams from '../../components/DrivingLessonsTables/Exams'

export const GET_STUDENT_BOOK = gql`
  query GetUserDrivingLessonsBook {
    drivingLicenseBookUserBook {
      book {
        id
        licenseCategory
        createdOn
        teacherNationalId
        teacherName
        schoolNationalId
        schoolName
        isDigital
        statusName
        totalLessonTime
        totalLessonCount
        teachersAndLessons {
          id
          registerDate
          lessonTime
          teacherNationalId
          teacherName
        }
        drivingSchoolExams {
          id
          examDate
          schoolNationalId
          schoolName
          schoolEmployeeNationalId
          schoolEmployeeName
          schoolTypeId
          schoolTypeName
          schoolTypeCode
          comments
        }
        testResults {
          id
          examDate
          score
          scorePart1
          scorePart2
          hasPassed
          testCenterNationalId
          testCenterName
          testExaminerNationalId
          testExaminerName
          testTypeId
          testTypeName
          testTypeCode
          comments
        }
      }
    }
  }
`

const DrivingLessonsBook: ServicePortalModuleComponent = () => {
  const { formatMessage } = useLocale()

  const { data, loading, error } = useQuery<Query>(GET_STUDENT_BOOK)

  const { book } = data?.drivingLicenseBookUserBook || {}

  if (error && !loading) {
    return (
      <ErrorScreen
        figure="./assets/images/hourglass.svg"
        tagVariant="red"
        tag="500"
        title={formatMessage(m.somethingWrong)}
        children={formatMessage(m.errorFetchModule, {
          module: formatMessage(m.vehicles).toLowerCase(),
        })}
      />
    )
  }

  return (
    <>
      <Box marginBottom={6}>
        <IntroHeader
          title={formatMessage(messages.vehicleDrivingLessonsTitle)}
          intro={formatMessage(messages.vehicleDrivingLessonsText)}
          img="./assets/images/drivingLessons.svg"
        />
      </Box>
      {loading && (
        <Box padding={3}>
          <SkeletonLoader space={1} height={40} repeat={5} />
        </Box>
      )}
      {book?.id && !loading && (
        <>
          <Stack space={2}>
            <UserInfoLine
              title={formatMessage(messages.vehicleDrivingLessonsLabel)}
              label={formatMessage(messages.vehicleDrivingLessonsStartDate)}
              content={book?.createdOn && formatDate(book?.createdOn)}
              loading={loading}
            />
            <Divider />
            <UserInfoLine
              label={formatMessage(messages.vehicleDrivingLessonsClassOfRight)}
              renderContent={() => (
                <Text fontWeight="semiBold">{book?.licenseCategory}</Text>
              )}
              loading={loading}
            />
            <Divider />
            <UserInfoLine
              label={formatMessage(messages.vehicleDrivingLessonsTeacher)}
              content={book?.teacherName}
              loading={loading}
              // Removed until application is ready
              // editLink={{
              //   url: '',
              //   external: true,
              //   title: messages.vehicleDrivingLessonsChangeTeacher,
              // }}
            />
            <Divider />
            <UserInfoLine
              label={formatMessage(messages.vehicleDrivingLessonsCount)}
              content={book?.totalLessonCount.toString()}
              loading={loading}
            />
            <Divider />
            <UserInfoLine
              label={formatMessage(messages.vehicleDrivingLessonsTotalTime)}
              content={
                (book?.totalLessonTime ? book?.totalLessonTime.toString() : 0) +
                ' ' +
                formatMessage(messages.vehicleDrivingLessonsMin)
              }
              loading={loading}
            />
            <Divider />
            <UserInfoLine
              label={formatMessage(messages.vehicleDrivingLessonsStatus)}
              content={book.statusName}
              loading={loading}
            />
            <Divider />
          </Stack>
          <Box marginBottom={5} />

          {book?.teachersAndLessons && (
            <PhysicalLessons
              title={formatMessage(messages.vehicleDrivingLessonsPhysical)}
              data={book.teachersAndLessons}
            />
          )}

          {book?.drivingSchoolExams && (
            <DrivingLessonsSchools
              title={formatMessage(messages.vehicleDrivingLessonsSchools)}
              data={book.drivingSchoolExams}
            />
          )}

          {book?.testResults && (
            <Exams
              title={formatMessage(messages.vehicleDrivingLessonsExam)}
              data={book?.testResults}
            />
          )}

          <Box paddingTop={4}>
            <Text variant="small">
              {formatMessage(messages.vehicleDrivingLessonsInfoNote)}
            </Text>
          </Box>
        </>
      )}
      {!loading && !error && !book?.id && (
        <Box marginTop={8}>
          <EmptyState />
        </Box>
      )}
    </>
  )
}

export default withClientLocale('sp.vehicles')(DrivingLessonsBook)
