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
}

@ObjectType()
export class ApplicationHistory {
  @Field(() => Date)
  date!: Date

  @Field(() => String, { nullable: true })
  log?: string
}

@ObjectType()
class ActionCardMetaData {
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
}

@ObjectType()
export class ApplicationPayment {
  @Field()
  fulfilled!: boolean

  @Field()
  paymentUrl!: string
}
