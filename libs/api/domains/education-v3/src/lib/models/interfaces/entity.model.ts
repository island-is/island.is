import { Field, ID, InterfaceType } from '@nestjs/graphql'

@InterfaceType('EducationV3Entity')
export abstract class Entity {
  @Field(() => ID)
  id!: string

  @Field({ nullable: true })
  name?: string
}
