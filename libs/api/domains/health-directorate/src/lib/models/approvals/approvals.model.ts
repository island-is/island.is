import { Field, ID, ObjectType } from '@nestjs/graphql'
import { ApprovalCodesEnum, ApprovalStatusEnum } from '../enums'
import { Country } from './country.model'

@ObjectType('HealthDirectoratePatientDataApproval')
export class Approval {
  @Field(() => ID)
  id!: string

  @Field(() => ApprovalStatusEnum)
  status!: ApprovalStatusEnum

  @Field()
  createdAt!: Date

  @Field()
  validFrom!: Date

  @Field()
  validTo!: Date

  @Field(() => [ApprovalCodesEnum])
  codes!: ApprovalCodesEnum[]

  @Field(() => [Country])
  countries!: Country[]
}

@ObjectType('HealthDirectoratePatientDataApprovals')
export class Approvals {
  @Field(() => [Approval])
  data!: Approval[]
}

@ObjectType('HealthDirectoratePatientDataApprovalReturn')
export class ApprovalReturn {
  @Field(() => ID)
  id!: string
}
