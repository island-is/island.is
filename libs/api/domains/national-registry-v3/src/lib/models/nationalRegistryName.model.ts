import { EinstaklingurDTONafnAllt } from '@island.is/clients/national-registry-v3'
import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType('NationalRegistryV3Name')
export class Name {
  @Field(() => String, { nullable: true })
  givenName?: string | null

  @Field(() => String, { nullable: true })
  middleName?: string | null

  @Field(() => String, { nullable: true })
  lastName?: string | null
}

export function formatName(
  name: EinstaklingurDTONafnAllt | null | undefined,
): Name | null {
  if (!name) {
    return null
  }

  return {
    givenName: name.eiginNafn ?? null,
    middleName: name.milliNafn ?? null,
    lastName: name.kenniNafn ?? null,
  }
}
