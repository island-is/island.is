import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType('NationalRegistryXRoadCitizenship')
export class NationalRegistryCitizenship {
  @Field(() => String, { nullable: true })
  name?: string | null

  @Field(() => String)
  code!: string
}
