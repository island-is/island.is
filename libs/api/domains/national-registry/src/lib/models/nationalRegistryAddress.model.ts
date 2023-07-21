import { EinstaklingurDTOHeimili } from '@island.is/clients/national-registry-v3'
import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class NationalRegistryAddress {
  @Field(() => String, { nullable: true })
  streetName?: string | null

  @Field(() => String, { nullable: true })
  postalCode?: string | null

  @Field(() => String, { nullable: true })
  city?: string | null

  @Field(() => String, { nullable: true })
  municipalityText?: string | null

  @Field(() => String, { nullable: true })
  municipalityCode?: string | null
}

export function formatAddress(
  address: EinstaklingurDTOHeimili | null | undefined,
): NationalRegistryAddress | null {
  if (!address || !address.husHeiti) {
    return null
  }

  return {
    streetName: address.husHeiti,
    postalCode: address.postnumer ?? null,
    city: address.poststod ?? null,
    municipalityText: address.sveitarfelag ?? null,
  }
}
