export const LICENSE_CATEGORY = 'B'

export interface DrivingLicenseBookStudentForTeacher {
  id: string
  nationalId: string
  name: string
  totalLessonCount: number
}

export interface DrivingLicenseBookStudent {
  id: string
  nationalId: string
  name: string
  zipCode: number
  address: string
  email: string
  primaryPhoneNumber: string
  secondaryPhoneNumber: string
  active: boolean
  bookLicenseCategories: string[]
}

export interface DrivingBookLesson {
  id: string
  registerDate: string
  lessonTime: number
  teacherNationalId: string
  teacherName: string
  comments: string
}

export interface DrivingSchoolExam {
  id: string
  examDate: string
  schoolNationalId: string
  schoolName: string
  schoolEmployeeNationalId: string
  schoolEmployeeName: string
  schoolTypeId: number
  schoolTypeName: string
  schoolTypeCode: string
  comments: string
}

export interface DrivingLicenceTestResult {
  id: string
  examDate: string
  score: number
  scorePart1: number
  scorePart2: number
  hasPassed: boolean
  testCenterNationalId: string
  testCenterName: string
  testExaminerNationalId: string
  testExaminerName: string
  testTypeId: number
  testTypeName: string
  testTypeCode: string
  comments: string
}

export interface DrivingLicenseBook {
  id: string
  licenseCategory: string
  createdOn: string
  teacherNationalId: string
  teacherName: string
  schoolNationalId: string
  schoolName: string
  isDigital: boolean
  totalLessonTime: number
  totalLessonCount: number
  teachersAndLessons: DrivingBookLesson[]
  drivingSchoolExams: DrivingSchoolExam[]
  testResults: DrivingLicenceTestResult[]
}

export interface DrivingLicenseBookStudentOverview
  extends DrivingLicenseBookStudent {
  book: DrivingLicenseBook
}

export interface PracticalDrivingLesson {
  bookId: string
  id: string
  studentNationalId: string
  studentName: string
  licenseCategory: string
  teacherNationalId: string
  teacherName: string
  minutes: number
  createdOn: string
  comments: string
}

export interface Organization {
  nationalId: string 
  name: string 
  address: string 
  zipCode: string 
  phoneNumber: string 
  email: string 
  website: string 
  allowedDrivingSchoolTypes: string[]
}

export interface SchoolTestResultType {
  schoolTypeId: number
  schoolTypeName: string
  schoolTypeCode: string
  licenseCategory: string
}