import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType('EstatesCaseStatus')
export class CaseStatus {
  @Field({ nullable: true, description: 'Status code from the API' })
  code?: string

  @Field({ nullable: true })
  text?: string

  @Field({ nullable: true })
  isOpen?: boolean
}
