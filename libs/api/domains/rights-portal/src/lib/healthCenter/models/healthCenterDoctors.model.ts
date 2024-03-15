import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType('RightsPortalHealthCenterDoctors')
export class HealthCenterDoctors {
  @Field(() => Number, { nullable: true })
  id?: number

  @Field(() => String, { nullable: true })
  name?: string

  @Field(() => String, { nullable: true })
  availableFrom?: string

  @Field(() => String, { nullable: true })
  availableTo?: string
}
