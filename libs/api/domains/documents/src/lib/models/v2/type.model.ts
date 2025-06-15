import { Field, ObjectType } from '@nestjs/graphql'
import { Base } from './base.model'

@ObjectType('DocumentsV2Type', {
  implements: () => Base,
})
export class Type implements Base {
  @Field()
  id!: string

  @Field(() => String, { nullable: true })
  name?: string | null
}
