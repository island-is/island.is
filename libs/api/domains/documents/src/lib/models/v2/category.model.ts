import { Field, ObjectType } from '@nestjs/graphql'
import { Base } from './base.model'

@ObjectType('DocumentsV2Category', {
  implements: () => Base,
})
export class Category implements Base {
  @Field()
  id!: string

  @Field({ nullable: true })
  name?: string
}
