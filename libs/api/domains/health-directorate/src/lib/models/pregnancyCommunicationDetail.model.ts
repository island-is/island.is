import { createUnionType } from '@nestjs/graphql'
import { PregnancyCommunicationKindEnum } from './enums'
import { ExaminationCommunicationDetail } from './examinationCommunicationDetail.model'
import { PhoneCallCommunicationDetail } from './phoneCallCommunicationDetail.model'

export const PregnancyCommunicationDetail = createUnionType({
  name: 'HealthDirectoratePregnancyCommunicationDetail',
  types: () =>
    [ExaminationCommunicationDetail, PhoneCallCommunicationDetail] as const,
  resolveType: (
    value: ExaminationCommunicationDetail | PhoneCallCommunicationDetail,
  ) =>
    value.kind === PregnancyCommunicationKindEnum.phoneCall
      ? PhoneCallCommunicationDetail
      : ExaminationCommunicationDetail,
})
