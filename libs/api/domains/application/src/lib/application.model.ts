import { Field, ObjectType, ID, registerEnumType } from '@nestjs/graphql'
import graphqlTypeJson from 'graphql-type-json'
import {
  ApplicationListAdminResponseDtoStatusEnum,
  ApplicationListAdminResponseDtoTypeIdEnum,
} from '../../gen/fetch'

import {
  ApplicationResponseDtoStatusEnum,
  ApplicationResponseDtoTypeIdEnum,
} from '../../gen/fetch'

registerEnumType(ApplicationResponseDtoTypeIdEnum, {
  name: 'ApplicationResponseDtoTypeIdEnum',
})

registerEnumType(ApplicationResponseDtoStatusEnum, {
  name: 'ApplicationResponseDtoStatusEnum',
})

registerEnumType(ApplicationListAdminResponseDtoTypeIdEnum, {
  name: 'ApplicationListAdminResponseDtoTypeIdEnum',
})

registerEnumType(ApplicationListAdminResponseDtoStatusEnum, {
  name: 'ApplicationListAdminResponseDtoStatusEnum',
})

@ObjectType()
class ActionCardTag {
  @Field(() => String, { nullable: true })
  label?: string

  @Field(() => String, { nullable: true })
  variant?: string
}

@ObjectType()
class PendingAction {
  @Field(() => String, { nullable: true })
  displayStatus?: string

  @Field(() => String, { nullable: true })
  title?: string

  @Field(() => String, { nullable: true })
  content?: string

  @Field(() => String, { nullable: true })
  button?: string
}

@ObjectType()
export class ApplicationHistory {
  @Field(() => Date)
  date!: Date

  @Field(() => String, { nullable: true })
  log?: string

  @Field(() => String, { nullable: true })
  subLog?: string
}

@ObjectType()
export class ActionCardMetaData {
  @Field(() => String, { nullable: true })
  title?: string

  @Field(() => String, { nullable: true })
  description?: string

  @Field(() => ActionCardTag, { nullable: true })
  tag?: ActionCardTag

  @Field(() => Boolean, { nullable: true })
  deleteButton?: boolean

  @Field(() => PendingAction, { nullable: true })
  pendingAction?: PendingAction

  @Field(() => [ApplicationHistory], { nullable: true })
  history?: ApplicationHistory[]

  @Field(() => Number, { nullable: true })
  draftFinishedSteps?: number

  @Field(() => Number, { nullable: true })
  draftTotalSteps?: number

  @Field(() => String, { nullable: true })
  historyButton?: string
}

@ObjectType()
export class Application {
  @Field(() => ID)
  id!: string

  @Field(() => Date)
  created!: Date

  @Field(() => Date)
  modified!: Date

  @Field(() => String)
  applicant!: string

  @Field(() => [String])
  assignees!: string[]

  @Field(() => [String])
  applicantActors!: string[]

  @Field(() => String)
  state!: string

  @Field(() => ActionCardMetaData, { nullable: true })
  actionCard?: ActionCardMetaData

  @Field(() => ApplicationResponseDtoTypeIdEnum)
  typeId!: ApplicationResponseDtoTypeIdEnum

  @Field(() => graphqlTypeJson)
  answers!: object

  @Field(() => graphqlTypeJson)
  externalData!: object

  @Field(() => String, { nullable: true })
  name?: string

  @Field(() => String, { nullable: true })
  institution?: string

  @Field(() => Number, { nullable: true })
  progress?: number

  @Field(() => ApplicationResponseDtoStatusEnum)
  status!: ApplicationResponseDtoStatusEnum

  @Field(() => Boolean, { nullable: true })
  pruned?: boolean
}

@ObjectType()
export class ApplicationStatistics {
  @Field(() => String)
  typeid!: string

  @Field(() => Number)
  count!: number

  @Field(() => Number)
  draft!: number

  @Field(() => Number)
  inprogress!: number

  @Field(() => Number)
  completed!: number

  @Field(() => Number)
  rejected!: number

  @Field(() => Number)
  approved!: number

  @Field(() => String)
  name?: string
}

@ObjectType()
class ApplicationAdminData {
  @Field(() => String)
  label!: string

  @Field(() => String)
  key!: string

  @Field(() => [String], { nullable: true })
  values?: string[]
}

@ObjectType()
export class ApplicationAdmin {
  @Field(() => ID)
  id!: string

  @Field(() => Date)
  created!: Date

  @Field(() => Date)
  modified!: Date

  @Field(() => String)
  applicant!: string

  @Field(() => [String])
  assignees!: string[]

  @Field(() => [String])
  applicantActors!: string[]

  @Field(() => Date, { nullable: true })
  pruneAt?: Date

  @Field(() => Boolean, { nullable: true })
  pruned?: boolean

  @Field(() => String)
  state!: string

  @Field(() => ActionCardMetaData, { nullable: true })
  actionCard?: ActionCardMetaData

  @Field(() => ApplicationListAdminResponseDtoTypeIdEnum)
  typeId!: ApplicationListAdminResponseDtoTypeIdEnum

  @Field(() => String, { nullable: true })
  name?: string

  @Field(() => String, { nullable: true })
  institution?: string

  @Field(() => Number, { nullable: true })
  progress?: number

  @Field(() => ApplicationListAdminResponseDtoStatusEnum)
  status!: ApplicationListAdminResponseDtoStatusEnum

  @Field(() => String, { nullable: true })
  applicantName?: string

  @Field(() => String, { nullable: true })
  paymentStatus?: string

  @Field(() => [ApplicationAdminData], { nullable: true })
  adminData?: ApplicationAdminData[]
}

@ObjectType()
export class ApplicationAdminPaginatedResponse {
  @Field(() => [ApplicationAdmin])
  rows!: ApplicationAdmin[]
  @Field(() => Number)
  count!: number
}

@ObjectType()
export class ApplicationPayment {
  @Field()
  fulfilled!: boolean

  @Field()
  paymentUrl!: string
}

@ObjectType()
export class ApplicationTypeAdminInstitution {
  @Field(() => String)
  id!: string

  @Field(() => String, { nullable: true })
  name?: string
}

@ObjectType()
export class ApplicationInstitution {
  @Field(() => String)
  nationalId!: string

  @Field(() => String)
  contentfulId!: string
}
