import { createUnionType } from '@nestjs/graphql'
import { CommunicationKindEnum } from './enums'
import { ExaminationCommunicationDetail } from './examinationCommunicationDetail.model'
import { PhoneCallCommunicationDetail } from './phoneCallCommunicationDetail.model'

export const CommunicationDetail = createUnionType({
  name: 'HealthDirectoratePregnancyCommunicationDetail',
  types: () =>
    [ExaminationCommunicationDetail, PhoneCallCommunicationDetail] as const,
  resolveType: (
    value: ExaminationCommunicationDetail | PhoneCallCommunicationDetail,
  ) =>
    value.kind === CommunicationKindEnum.phoneCall
      ? PhoneCallCommunicationDetail
      : ExaminationCommunicationDetail,
})
