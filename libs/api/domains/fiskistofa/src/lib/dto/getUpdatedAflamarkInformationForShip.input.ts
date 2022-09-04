import { Field, InputType } from '@nestjs/graphql'

@InputType()
class CategoryChange {
  // kvotategund (Auðkenni fisktegundar)
  @Field()
  id!: number

  // aflabreyting
  @Field()
  catchChange!: number

  // aflamarksbreyting
  @Field()
  allowedCatchChange!: number
}

@InputType()
export class CategoryChanges {
  @Field(() => [CategoryChange])
  categoryChanges!: CategoryChange[]
}

@InputType()
export class GetUpdatedAflamarkInformationForShipInput {
  @Field()
  shipNumber!: number

  @Field()
  timePeriod!: string

  @Field(() => CategoryChanges)
  changes!: CategoryChanges
}
