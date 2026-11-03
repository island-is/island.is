import { Field, ID, ObjectType } from '@nestjs/graphql'
import { PersonBase } from './personBase.model'
import { Address } from './address.model'

@ObjectType('NationalRegistryHousing')
export class Housing {
  @Field(() => ID)
  domicileId!: string

  @Field(() => String, { nullable: true })
  domicileIdLast1stOfDecember?: string | null

  @Field(() => String, { nullable: true })
  domicileIdPreviousIcelandResidence?: string | null

  @Field(() => [PersonBase], {
    nullable: true,
  })
  domicileInhabitants?: Array<PersonBase> | null

  @Field(() => Address, { nullable: true })
  residence?: Address | null

  @Field(() => Address, { nullable: true })
  address?: Address | null
}
