import { EinstaklingurDTORikisfang } from '@island.is/clients/national-registry-v3'
import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class NationalRegistryCitizenship {
  @Field(() => String, { nullable: true })
  name?: string | null

  @Field(() => String, { nullable: true })
  code?: string | null
}

export function formatCitizenship(
  citizenship: EinstaklingurDTORikisfang | null | undefined,
): NationalRegistryCitizenship | null {
  if (!citizenship || !citizenship.rikisfangLand) {
    return null
  }

  return {
    name: citizenship.rikisfangLand,
    code: citizenship.rikisfangKodi ?? '',
  }
}
