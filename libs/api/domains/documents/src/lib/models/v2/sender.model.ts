import { Field, ObjectType } from '@nestjs/graphql'
import { Base } from './base.model'

@ObjectType('DocumentsV2Sender', {
  implements: () => Base,
})
export class Sender implements Base {
  @Field()
  id!: string

  @Field({ nullable: true })
  name?: string
}
