import { CacheField } from '@island.is/nest/graphql'
import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType('WebCourtScheduleType')
class ScheduleType {
  @Field(() => String)
  id!: string
  @Field(() => String)
  label!: string
}

@ObjectType('WebCourtScheduleTypesPerCourt')
class ScheduleTypesPerCourt {
  @CacheField(() => [ScheduleType])
  items!: ScheduleType[]
}

@ObjectType('WebCourtScheduleTypesResponse')
export class ScheduleTypesResponse {
  @CacheField(() => ScheduleTypesPerCourt)
  courtOfAppeal!: ScheduleTypesPerCourt

  @CacheField(() => ScheduleTypesPerCourt)
  supremeCourt!: ScheduleTypesPerCourt

  @CacheField(() => ScheduleTypesPerCourt)
  districtCourt!: ScheduleTypesPerCourt

  @CacheField(() => ScheduleTypesPerCourt)
  all!: ScheduleTypesPerCourt
}
