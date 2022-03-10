import { Field, ObjectType } from '@nestjs/graphql'
import { Organization } from './organization.model'

@ObjectType()
export class Organizations {
  @Field(() => [Organization])
  items!: Organization[]
}
