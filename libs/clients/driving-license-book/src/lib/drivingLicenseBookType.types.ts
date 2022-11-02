export interface CreatePracticalDrivingLessonInput {
  bookId: string
  minutes: number
  createdOn: string
  comments: string
}

export interface UpdatePracticalDrivingLessonInput {
  id: string
  bookId: string
  minutes: number
  createdOn: string
  comments: string
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

export interface PracticalDrivingLessonsInput {
  bookId: string
  id: string
}
