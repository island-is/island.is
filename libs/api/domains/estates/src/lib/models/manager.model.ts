import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType('EstatesManager')
export class EstateManager {
  @Field({ nullable: true })
  name?: string

  @Field({ nullable: true })
  nationalId?: string
}
