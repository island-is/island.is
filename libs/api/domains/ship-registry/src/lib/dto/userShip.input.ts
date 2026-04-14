import { Field, InputType } from '@nestjs/graphql'
import { LocaleEnum } from '../models/enums'

@InputType('ShipRegistryUserShipInput')
export class UserShipInput {
  @Field()
  registrationNumber!: string

  @Field(() => LocaleEnum, { nullable: true, defaultValue: LocaleEnum.Is })
  locale?: LocaleEnum
}
