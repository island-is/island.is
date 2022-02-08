import { Field, ObjectType, ID } from '@nestjs/graphql'
import { NationalRegistryRealEstateAddress } from './nationalRegistryRealEstateAddress.model'

@ObjectType()
export class NationalRegistryRealEstate {
  @Field(() => String, { nullable: true })
  realEstateNumber?: string | null

  @Field(() => NationalRegistryRealEstateAddress, { nullable: true })
  defaultAddress?: NationalRegistryRealEstateAddress | null

  // @Field(() => Appraisal, { nullable: true })
  // appraisal?: Appraisal | null

  // @Field(() => RegisteredOwnerWrapper, { nullable: true })
  // registeredOwners?: RegisteredOwnerWrapper | null

  // @Field(() => UnitOfUseWrapper, { nullable: true })
  // unitsOfUse?: UnitOfUseWrapper | null
}
