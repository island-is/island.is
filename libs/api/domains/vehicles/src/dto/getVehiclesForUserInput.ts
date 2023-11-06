import { Field, InputType, registerEnumType } from '@nestjs/graphql'

export enum VehicleUserTypeEnum {
  eigandi = 'Eigandi',
  medeigandi = 'Meðeigandi',
  umradamadur = 'Umráðamaður',
}

registerEnumType(VehicleUserTypeEnum, {
  name: 'VehicleUserTypeEnum',
})

@InputType()
export class GetVehiclesForUserInput {
  @Field()
  pageSize!: number

  @Field()
  page!: number

  @Field(() => VehicleUserTypeEnum, { nullable: true })
  type?: VehicleUserTypeEnum

  @Field()
  showDeregeristered!: boolean

  @Field()
  showHistory!: boolean

  @Field(() => Date, { nullable: true })
  dateFrom?: Date

  @Field(() => Date, { nullable: true })
  dateTo?: Date
}
