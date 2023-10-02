import {
  BookOverview,
  StudentOverView,
} from '@island.is/clients/driving-license-book'
import { DrivingLicenseBookStudentOverview } from '../drivinLicenceBook.type'

export const getStudentMapper = (
  data: StudentOverView,
  book: BookOverview,
): DrivingLicenseBookStudentOverview => {
  return {
    nationalId: data.ssn ?? '',
    id: data.id ?? '',
    name: data.name ?? '',
    zipCode: data.zipCode ?? -1,
    address: data.address ?? '',
    email: data.email ?? '',
    primaryPhoneNumber: data.primaryPhoneNumber ?? '',
    secondaryPhoneNumber: data.secondaryPhoneNumber ?? '',
    active: data.active ?? false,
    bookLicenseCategories: data.bookLicenseCategories ?? [],
    book: {
      id: book.id ?? '',
      teacherNationalId: book.teacherSsn ?? '',
      licenseCategory: book.licenseCategory ?? '',
      createdOn: book.createdOn ?? '',
      teacherName: book.teacherName ?? '',
      schoolNationalId: book.schoolSsn ?? '',
      schoolName: book.schoolName ?? '',
      isDigital: book.isDigital ?? false,
      status: book.status ?? 1,
      statusName: book.statusName ?? '',
      totalLessonTime: book.totalLessonTime ?? -1,
      totalLessonCount: book.totalLessonCount ?? -1,
      drivingSchoolExams: !book.drivingSchoolExams
        ? []
        : book.drivingSchoolExams.map((exam) => ({
            id: book.id ?? '',
            examDate: exam.examDate ?? '',
            schoolNationalId: exam.schoolSsn ?? '',
            schoolName: exam.schoolName ?? '',
            schoolEmployeeNationalId: exam.schoolEmployeeSsn ?? '',
            schoolEmployeeName: exam.schoolEmployeeName ?? '',
            schoolTypeId: exam.schoolTypeId ?? -1,
            schoolTypeName: exam.schoolTypeName ?? '',
            schoolTypeCode: exam.schoolTypeCode ?? '',
            comments: exam.comments ?? '',
          })),
      testResults: !book.testResults
        ? []
        : book.testResults.map((testResult) => ({
            id: testResult.id ?? '',
            examDate: testResult.examDate ?? '',
            score: testResult.score ?? -1,
            scorePart1: testResult.scorePart1 ?? -1,
            scorePart2: testResult.scorePart2 ?? -1,
            hasPassed: testResult.hasPassed ?? false,
            testCenterNationalId: testResult.testCenterSsn ?? '',
            testCenterName: testResult.testCenterName ?? '',
            testExaminerNationalId: testResult.testExaminerSsn ?? '',
            testExaminerName: testResult.testExaminerName ?? '',
            testTypeId: testResult.testTypeId ?? -1,
            testTypeName: testResult.testTypeName ?? '',
            testTypeCode: testResult.testTypeCode ?? '',
            comments: testResult.comments ?? '',
          })),
      teachersAndLessons: !book.teachersAndLessons
        ? []
        : book.teachersAndLessons.map((lesson) => ({
            id: lesson.id ?? '',
            registerDate: lesson.registerDate ?? '',
            lessonTime: lesson.lessonTime ?? -1,
            teacherNationalId: lesson.teacherSsn ?? '',
            teacherName: lesson.teacherName ?? '',
            comments: lesson.comments ?? '',
          })),
    },
  }
}
