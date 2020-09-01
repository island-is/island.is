import { Field, ObjectType, ID, registerEnumType } from '@nestjs/graphql'
import graphqlTypeJson from 'graphql-type-json'
import { ApplicationStateEnum, ApplicationTypeIdEnum } from '../../gen/fetch'

registerEnumType(ApplicationStateEnum, {
  name: 'ApplicationStateEnum',
})

registerEnumType(ApplicationTypeIdEnum, {
  name: 'ApplicationTypeIdEnum',
})

@ObjectType()
export class Application {
  @Field((type) => ID)
  id: string

  @Field((type) => Date)
  created: Date

  @Field((type) => Date)
  modified: Date

  @Field((type) => String)
  applicant: string

  @Field((type) => String)
  assignee: string

  @Field((type) => String, { nullable: true })
  externalId?: string

  @Field((type) => ApplicationStateEnum)
  state: ApplicationStateEnum

  @Field((type) => [String], { nullable: true })
  attachments?: Array<string>

  @Field((type) => ApplicationTypeIdEnum)
  typeId: ApplicationTypeIdEnum

  @Field((type) => graphqlTypeJson)
  answers: object

  @Field((type) => graphqlTypeJson)
  externalData: object
}
