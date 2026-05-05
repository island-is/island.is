import { LocaleEnum } from '@island.is/nest/graphql'
import { Field, InputType } from '@nestjs/graphql'

@InputType('ShipRegistryUserShipInput')
export class UserShipInput {
  @Field()
  registrationNumber!: string

  @Field(() => LocaleEnum, { nullable: true, defaultValue: LocaleEnum.Is })
  locale?: LocaleEnum
}
