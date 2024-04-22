import { Field, ObjectType } from '@nestjs/graphql'
import { Base } from './base.model'

@ObjectType('DocumentsV2Type', {
  implements: () => Base,
})
export class Type implements Base {
  @Field()
  id!: string

  @Field({ nullable: true })
  name?: string
}
