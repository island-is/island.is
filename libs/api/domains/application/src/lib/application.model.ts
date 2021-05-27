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
class TagMetaData {
  @Field(() => String, { nullable: true })
  label?: string

  @Field(() => String, { nullable: true })
  variant?: string
}

@ObjectType()
class StateMetaData {
  @Field(() => String, { nullable: true })
  title?: string

  @Field(() => String, { nullable: true })
  description?: string

  @Field(() => TagMetaData, { nullable: true })
  tag?: TagMetaData
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

  @Field(() => String)
  state!: string

  @Field(() => StateMetaData, { nullable: true })
  stateMetaData?: StateMetaData

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

  @Field(() => String, { nullable: true })
  institution?: string

  @Field(() => Number, { nullable: true })
  progress?: number

  @Field(() => ApplicationResponseDtoStatusEnum)
  status!: ApplicationResponseDtoStatusEnum
}
