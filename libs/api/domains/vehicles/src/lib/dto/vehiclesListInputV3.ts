import { Field, InputType } from '@nestjs/graphql'

@InputType()
export class VehiclesListInputV3 {
  @Field()
  pageSize!: number

  @Field()
  page!: number

  @Field({
    nullable: true,
    defaultValue: true,
    description: 'Set to false if not needed for performance reasons',
  })
  includeNextMainInspectionDate?: boolean

  @Field({ nullable: true })
  filterOnlyVehiclesUserCanRegisterMileage?: boolean

  @Field({ nullable: true })
  query?: string
}
