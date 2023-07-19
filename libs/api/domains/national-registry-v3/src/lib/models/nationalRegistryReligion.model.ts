import { EinstaklingurDTOTru } from '@island.is/clients/national-registry-v3'
import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType('NationalRegistryV3Religion')
export class Religion {
  @Field(() => String, { nullable: true })
  name?: string | null

  @Field(() => String, { nullable: true })
  code?: string | null
}

export function formatReligion(
  religion: EinstaklingurDTOTru | null | undefined,
): Religion | null {
  if (!religion) {
    return null
  }

  return {
    name: religion.trufelagHeiti ?? null,
    code: religion.trufelagKodi ?? null,
  }
}
