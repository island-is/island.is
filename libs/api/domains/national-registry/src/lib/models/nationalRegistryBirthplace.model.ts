import { EinstaklingurDTOFaeding } from '@island.is/clients/national-registry-v3'
import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class NationalRegistryBirthplace {
  @Field(() => String, { nullable: true })
  location?: string | null

  @Field(() => String, { nullable: true })
  municipalityCode?: string | null

  @Field(() => Date, { nullable: true })
  dateOfBirth?: Date | null
}

export function formatBirthplace(
  birthplace: EinstaklingurDTOFaeding | null | undefined,
): NationalRegistryBirthplace | null {
  if (!birthplace || !birthplace.faedingarStadurHeiti) {
    return null
  }

  return {
    location: birthplace.faedingarStadurHeiti,
    municipalityCode: birthplace.faedingarStadurKodi ?? null,
    dateOfBirth: birthplace.faedingarDagur
      ? new Date(birthplace.faedingarDagur)
      : null,
  }
}
