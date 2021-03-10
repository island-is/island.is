import { Field, ObjectType, ID, registerEnumType } from '@nestjs/graphql'
import graphqlTypeJson from 'graphql-type-json'

import {
  ApplicationResponseDtoStatusEnum,
  ApplicationResponseDtoTypeIdEnum,
} from '../../gen/fetch/models/ApplicationResponseDto'

registerEnumType(ApplicationResponseDtoTypeIdEnum, {
  name: 'ApplicationResponseDtoTypeIdEnum',
})

registerEnumType(ApplicationResponseDtoStatusEnum, {
  name: 'ApplicationResponseDtoStatusEnum',
})

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

  @Field(() => Boolean)
  isApplicant?: boolean

  @Field(() => [String])
  assignees!: string[]

  @Field(() => Boolean)
  isAssignee?: boolean

  @Field(() => String)
  state!: string

  @Field(() => graphqlTypeJson, { nullable: true })
  attachments?: object

  @Field(() => ApplicationResponseDtoTypeIdEnum)
  typeId!: ApplicationResponseDtoTypeIdEnum

  @Field(() => graphqlTypeJson)
  answers!: object

  @Field(() => graphqlTypeJson)
  externalData!: object

  @Field(() => String, { nullable: true })
  name?: string

  @Field(() => Number, { nullable: true })
  progress?: number

  @Field(() => ApplicationResponseDtoStatusEnum)
  status!: ApplicationResponseDtoStatusEnum
}
