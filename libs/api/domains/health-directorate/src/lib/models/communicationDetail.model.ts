import { createUnionType } from '@nestjs/graphql'
import { ExaminationCommunicationDetail } from './examinationCommunicationDetail.model'
import { PhoneCallCommunicationDetail } from './phoneCallCommunicationDetail.model'

export const HealthDirectorateCommunicationDetail = createUnionType({
  name: 'HealthDirectorateCommunicationDetail',
  types: () =>
    [ExaminationCommunicationDetail, PhoneCallCommunicationDetail] as const,

  resolveType: (value) => {
    if (value.kind === 'EXAMINATION') {
      return ExaminationCommunicationDetail
    }
    if (value.kind === 'PHONE_CALL') {
      return PhoneCallCommunicationDetail
    }
    return null
  },
})
