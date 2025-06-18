import { Field, InterfaceType } from '@nestjs/graphql'

@InterfaceType('DocumentsV2Base')
export abstract class Base {
  @Field()
  id!: string

  @Field(() => String, { nullable: true })
  name?: string | null
}
