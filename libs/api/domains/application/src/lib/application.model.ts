import { Field, ObjectType, ID, registerEnumType } from '@nestjs/graphql'
import graphqlTypeJson from 'graphql-type-json'
import { ApplicationResponseDtoTypeIdEnum } from '../../gen/fetch/models/ApplicationResponseDto'

registerEnumType(ApplicationResponseDtoTypeIdEnum, {
  name: 'ApplicationResponseDtoTypeIdEnum',
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

  @Field(() => [String], { nullable: true })
  assignees!: string[]

  @Field(() => String, { nullable: true })
  externalId?: string

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
}
