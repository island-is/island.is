import { EinstaklingurDTORikisfang } from '@island.is/clients/national-registry-v3'
import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class NationalRegistryCitizenship {
  @Field(() => String, { nullable: true })
  name?: string | null

  @Field(() => String, { nullable: true })
  code!: string
}
