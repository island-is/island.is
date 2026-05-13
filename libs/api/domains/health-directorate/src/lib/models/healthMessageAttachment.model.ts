import { Field, Int, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class HealthDirectorateHealthMessageAttachment {
  @Field(() => Int)
  id!: number

  @Field()
  fileName!: string

  @Field({ nullable: true })
  description?: string
}
