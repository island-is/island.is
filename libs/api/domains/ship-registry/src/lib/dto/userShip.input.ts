import { Field, InputType } from '@nestjs/graphql'
import { LocaleEnum } from './locale.enum'

@InputType('ShipRegistryUserShipInput')
export class UserShipInput {
  @Field()
  id!: string

  @Field(() => LocaleEnum, { nullable: true, defaultValue: LocaleEnum.Is })
  locale?: LocaleEnum
}
