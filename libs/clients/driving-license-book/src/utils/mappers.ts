import {
  BookOverview,
  Organization,
  PracticalDrivingLesson,
  SchoolTestResultType,
  StudentOverView,
  StudentShortOverview,
} from '../../gen/fetch'
import {
  DrivingLicenseBookStudent,
  DrivingLicenseBookStudentForTeacher,
  DrivingLicenseBookStudentOverview,
  PracticalDrivingLesson as PracticalDrivingLessonMapped,
  SchoolType,
  Organization as OrganizationMapped,
} from '../lib/drivingLicenseBookType.types'

export const getStudentAndBookMapper = (
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
            status: exam.status ?? -1,
            statusName: exam.statusName ?? '',
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
      practiceDriving: book.practiceDriving || false,
    },
  }
}

export const getStudentMapper = (
  data: StudentOverView,
): DrivingLicenseBookStudent => {
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
  }
}

export const getStudentForTeacherMapper = (
  data: StudentShortOverview,
): DrivingLicenseBookStudentForTeacher => {
  return {
    id: data.studentId ?? '-1',
    nationalId: data.ssn ?? '',
    name: data.name ?? '',
    totalLessonCount: data.totalLessonCount ?? -1,
  }
}

export const drivingLessonMapper = (
  data: PracticalDrivingLesson,
): PracticalDrivingLessonMapped => {
  return {
    bookId: data.bookId ?? '',
    id: data.id ?? '',
    studentNationalId: data.studentSsn ?? '',
    studentName: data.studentName ?? '',
    licenseCategory: data.licenseCategory ?? '',
    teacherNationalId: data.teacherSsn ?? '',
    teacherName: data.teacherName ?? '',
    minutes: data.minutes ?? -1,
    createdOn: data.createdOn ?? '',
    comments: data.comments ?? '',
  }
}

export const schoolForSchoolStaffMapper = (
  employee: Organization,
  allowedSchoolTypes?: SchoolType[],
): OrganizationMapped => {
  return {
    nationalId: employee.ssn ?? '',
    name: employee.name ?? '',
    address: employee.address ?? '',
    zipCode: employee.zipCode ?? '',
    phoneNumber: employee.phoneNumber ?? '',
    email: employee.email ?? '',
    website: employee.website ?? '',
    allowedDrivingSchoolTypes: allowedSchoolTypes ?? [],
  }
}

export const schoolTypeMapper = (data: SchoolTestResultType): SchoolType => {
  return {
    schoolTypeId: data.schoolTypeId ?? -1,
    schoolTypeName: data.schoolTypeName ?? '',
    schoolTypeCode: data.schoolTypeCode ?? '',
    licenseCategory: data.licenseCategory ?? '',
  }
}
