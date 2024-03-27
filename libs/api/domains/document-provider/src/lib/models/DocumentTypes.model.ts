import { Field, Int, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class DocumentProviderType {
  @Field(() => String, { nullable: true })
  name?: string

  @Field(() => Boolean, { nullable: true })
  active?: boolean

  @Field(() => Int)
  id!: number
}

@ObjectType()
export class DocumentProviderCategory extends DocumentProviderType {}
