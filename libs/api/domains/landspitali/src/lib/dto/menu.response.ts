import { Field, Float, ObjectType } from '@nestjs/graphql'

@ObjectType('WebLandspitaliMenuCourse')
export class MenuCourse {
  @Field(() => String, { nullable: true })
  id?: string | null

  @Field(() => String, { nullable: true })
  name?: string | null

  @Field(() => String, { nullable: true })
  optionName?: string | null

  @Field(() => String, { nullable: true })
  labelOfContents?: string | null

  @Field(() => [MenuNutrient])
  nutrients!: MenuNutrient[]

  @Field(() => [MenuKnownAllergen])
  knownAllergens!: MenuKnownAllergen[]
}

@ObjectType('WebLandspitaliMenuNutrient')
export class MenuNutrient {
  @Field(() => String, { nullable: true })
  name?: string | null

  @Field(() => Float, { nullable: true })
  amount?: number

  @Field(() => String, { nullable: true })
  unit?: string | null
}

@ObjectType('WebLandspitaliMenuKnownAllergen')
export class MenuKnownAllergen {
  @Field(() => String, { nullable: true })
  name?: string | null

  @Field(() => String, { nullable: true })
  presenceLevel?: string | null
}

@ObjectType('WebLandspitaliMenuMeal')
export class MenuMeal {
  @Field(() => String, { nullable: true })
  name?: string | null

  @Field(() => [MenuCourse])
  courses!: MenuCourse[]
}

@ObjectType('WebLandspitaliMenu')
export class MenuResponse {
  @Field(() => [MenuMeal])
  meals!: MenuMeal[]
}
