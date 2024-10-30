import { Field, InputType, registerEnumType } from '@nestjs/graphql'
import { IsBoolean, IsOptional } from 'class-validator'

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

  @Field(() => String, { nullable: true })
  permno?: string
}

@InputType()
export class GetVehiclesListV2Input {
  @Field()
  pageSize!: number

  @Field()
  page!: number

  @Field({
    description: 'Filter to only show vehicles requiring mileage registration',
    nullable: true,
  })
  @IsBoolean()
  @IsOptional()
  onlyMileage?: boolean

  @Field({ defaultValue: true })
  showOwned?: boolean

  @Field({ defaultValue: true })
  showCoowned?: boolean

  @Field({ defaultValue: true })
  showOperated?: boolean

  @Field({ nullable: true })
  permno?: string
}
