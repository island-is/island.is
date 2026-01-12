import { YesOrNoEnum } from '@island.is/application/core'

type NationalIdWithName = {
  nationalId: string
  name: string
  email: string
  phone: string
}

export type ApplicationAnswers = {
  payment: {
    userIsPayingAsIndividual: YesOrNoEnum
    companyPayment?: {
      nationalIdWithName: NationalIdWithName
    }
  }
  participantList: Array<{
    nationalIdWithName: NationalIdWithName
  }>
  courseSelect: string
  dateSelect: string
}
