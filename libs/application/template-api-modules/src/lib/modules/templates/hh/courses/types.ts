import { YesOrNoEnum } from '@island.is/application/core'

type NationalIdWithName = {
  nationalId: string
  name: string
  email: string
  phone: string
}

export type ApplicationAnswers = {
  payment?: {
    userIsPayingAsIndividual: YesOrNoEnum
    companyPayment?: {
      nationalIdWithName: NationalIdWithName
    }
  }
  participantList: Array<{
    nationalIdWithName: NationalIdWithName
    workplace?: string
    jobTitle?: string
  }>
  userInformation: {
    name: string
    nationalId: string
    email: string
    phone: string
    healthcenter: string
  }
  courseSelect: string
  dateSelect: string
  courseHasChargeItemCode?: boolean
  workplace?: string
  jobTitle?: string
}

export type CourseInstanceData = {
  id: string
  startDate: string
  displayedTitle?: string | null
  startDateTimeDuration?: {
    startTime?: string
    endTime?: string
  }
  maxRegistrations?: number | null
  chargeItemCode?: string | null
  location?: string | null
  description?: string | null
}

export type CourseData = {
  id: string
  title: string
  slug?: string | null
  intro?: string | null
  organizationTitle?: string | null
  courseListPageId?: string | null
  categories?: Array<{ title: string }>
  instances: CourseInstanceData[]
}

export type Payer = {
  name: string
  nationalId: string
  isIndividual: boolean
}

export type ApplicantInfo = {
  nationalId: string
  name: string
  email: string
  phone: string
  healthcenter?: string
  workplace?: string
  jobTitle?: string
}
