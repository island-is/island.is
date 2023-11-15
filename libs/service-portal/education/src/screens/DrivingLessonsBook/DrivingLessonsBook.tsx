import React from 'react'
import { useQuery, gql } from '@apollo/client'
import { Query } from '@island.is/api/schema'
import {
  Box,
  Button,
  Divider,
  SkeletonLoader,
  Stack,
  Text,
} from '@island.is/island-ui/core'
import { useLocale, useNamespaces } from '@island.is/localization'
import {
  ErrorScreen,
  UserInfoLine,
  m,
  formatDate,
  IntroHeader,
  EmptyState,
  SAMGONGUSTOFA_ID,
  FootNote,
  LinkResolver,
  SAMGONGUSTOFA_SLUG,
} from '@island.is/service-portal/core'

import {
  vehicleMessage as messages,
  urls,
} from '@island.is/service-portal/assets/messages'
import PhysicalLessons from '../../components/DrivingLessonsTables/PhysicalLessons'
import DrivingLessonsSchools from '../../components/DrivingLessonsTables/DrivingLessonsSchools'
import Exams from '../../components/DrivingLessonsTables/Exams'

export const GET_STUDENT_BOOK = gql`
  query GetUserDrivingLessonsBook {
    drivingLicenseBookUserBook {
      book {
        licenseCategory
        createdOn
        teacherName
        statusName
        totalLessonTime
        practiceDriving
        totalLessonCount
        teachersAndLessons {
          registerDate
          lessonTime
          teacherName
        }
        drivingSchoolExams {
          examDate
          schoolName
          schoolTypeName
          comments
          status
        }
        testResults {
          examDate
          hasPassed
          testTypeName
        }
      }
    }
  }
`

const DrivingLessonsBook = () => {
  useNamespaces('sp.vehicles')
  const { formatMessage } = useLocale()

  const { data, loading, error } = useQuery<Query>(GET_STUDENT_BOOK)

  const { book } = data?.drivingLicenseBookUserBook || {}

  // Frontend fix before service is fixed and returns double for total driving lessons
  const oneDrivingLessonsInMinutes = 45

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
          serviceProviderSlug={SAMGONGUSTOFA_SLUG}
          serviceProviderTooltip={formatMessage(m.drivingLessonTooltip)}
        />
      </Box>
      {loading && (
        <Box padding={3}>
          <SkeletonLoader space={1} height={40} repeat={5} />
        </Box>
      )}
      {book?.createdOn && !loading && (
        <>
          <Stack space={2}>
            <UserInfoLine
              title={formatMessage(messages.vehicleDrivingLessonsLabel)}
              label={formatMessage(
                messages.vehicleDrivingLessonsPracticeDriving,
              )}
              content={
                book?.practiceDriving
                  ? formatMessage(messages.yes)
                  : formatMessage(messages.no)
              }
              loading={loading}
            />
            <Divider />
            <UserInfoLine
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
              editLink={{
                title: messages.changeInstructor,
                url: formatMessage(urls.instructorApplication),
                external: true,
              }}
              content={book?.teacherName ?? ''}
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
              content={(book?.totalLessonTime / oneDrivingLessonsInMinutes)
                .toPrecision(3)
                .toString()}
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
              data={book.drivingSchoolExams.filter((item) => item.status === 2)}
            />
          )}

          {book?.testResults && (
            <Exams
              title={formatMessage(messages.vehicleDrivingLessonsExam)}
              data={book?.testResults}
            />
          )}
        </>
      )}
      {!loading && !error && !book?.createdOn && (
        <Box marginTop={8}>
          <EmptyState />
          <Box display="flex" alignItems="center" justifyContent="center">
            <LinkResolver href={formatMessage(urls.licenseApplication)}>
              <Button type="button">
                {formatMessage(messages.signupToDrivingSchool)}
              </Button>
            </LinkResolver>
          </Box>
        </Box>
      )}
      <FootNote
        serviceProviderSlug={SAMGONGUSTOFA_SLUG}
        notes={[
          { text: formatMessage(messages.vehicleDrivingLessonsInfoNote) },
        ]}
      />
    </>
  )
}

export default DrivingLessonsBook
