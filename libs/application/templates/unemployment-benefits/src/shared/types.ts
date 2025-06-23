export enum EmploymentStatus {
  UNEMPLOYED = 'unemployed',
  EMPLOYED = 'employed',
  PARTJOB = 'partjob',
  OCCASIONAL = 'occasional',
}

export enum WorkingAbility {
  ABLE = 'able',
  PARTLY_ABLE = 'partlyAble',
  DISABILITY = 'disability',
}

export enum EducationType {
  CURRENT = 'current',
  LAST_SEMESTER = 'lastSemester',
  LAST_YEAR = 'lastYear',
}

export interface ChildrenInAnswers {
  name: string
  nationalId: string
}

export interface PreviousJobInAnswers {
  company: {
    nationalId: string
    name: string
  }
  title: string
  percentage: number
  startDate: string
  endDate: string
}
