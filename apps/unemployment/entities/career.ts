export interface JobCareer {
  employer: string
  careerStart: Date
  careerStop: Date
  jobTitle: JobCategory[]
}

export interface JobCategory {
  name: string
  job: JobTitle[]
}

export type JobTitle = string

export interface Career {
  career: JobCareer[]
  addedInfo: string
}
