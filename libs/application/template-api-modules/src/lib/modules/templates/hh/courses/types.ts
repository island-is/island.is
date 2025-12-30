import { YesOrNoEnum } from '@island.is/application/core'

type NationalIdWithName = {
  nationalId: string
  name: string
  email: string
  phone: string
}

export type ApplicationAnswers = {
  userIsPayingAsIndividual: YesOrNoEnum
  participantList: Array<{
    nationalIdWithName: NationalIdWithName
  }>
  courseSelect: string
  dateSelect: string
  companyPayment?: {
    nationalIdWithName: NationalIdWithName
  }
}
