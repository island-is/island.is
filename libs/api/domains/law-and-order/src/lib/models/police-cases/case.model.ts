import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType('LawAndOrderPoliceCase')
export class Case {
  @Field()
  number!: string

  @Field({ nullable: true })
  type?: string

  @Field({ nullable: true })
  status?: string

  @Field({ nullable: true })
  contact?: string

  @Field({ nullable: true })
  courtAdvocate?: string

  @Field({ nullable: true })
  department?: string

  @Field({ nullable: true, description: 'ISO8601' })
  received?: string

  @Field({ nullable: true })
  receivedLocation?: string

  @Field({ nullable: true, description: 'ISO8601' })
  modified?: string
}
