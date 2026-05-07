import { Field, Float, Int, ObjectType } from '@nestjs/graphql'

@ObjectType('WebLandspitaliMenuDistributorSummary')
export class MenuDistributorSummary {
  @Field(() => String, { nullable: true })
  id?: string | null

  @Field(() => String, { nullable: true })
  name?: string | null
}

@ObjectType('WebLandspitaliMenuCourse')
export class MenuCourse {
  @Field(() => String, { nullable: true })
  id?: string | null

  @Field(() => String, { nullable: true })
  name?: string | null

  @Field(() => String, { nullable: true })
  optionName?: string | null

  @Field(() => String, { nullable: true })
  description?: string | null

  @Field(() => Int, { nullable: true })
  order?: number

  @Field(() => String, { nullable: true })
  labelOfContents?: string | null

  @Field(() => [MenuIngredient])
  ingredients!: MenuIngredient[]

  @Field(() => [MenuNutrient])
  nutrients!: MenuNutrient[]

  @Field(() => [MenuPrice], { nullable: true })
  prices?: MenuPrice[] | null

  @Field(() => Float, { nullable: true })
  co2Equivalents?: number | null

  @Field(() => [MenuKnownAllergen])
  knownAllergens!: MenuKnownAllergen[]
}

@ObjectType('WebLandspitaliMenuIngredient')
export class MenuIngredient {
  @Field(() => String, { nullable: true })
  name?: string | null
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

@ObjectType('WebLandspitaliMenuPrice')
export class MenuPrice {
  @Field(() => String)
  name!: string

  @Field(() => Float)
  value!: number

  @Field(() => String, { nullable: true })
  currency?: string | null
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

  @Field(() => String, { nullable: true })
  date?: string

  @Field(() => String, { nullable: true })
  dateDescription?: string | null

  @Field(() => String, { nullable: true })
  holidayName?: string | null

  @Field(() => String, { nullable: true })
  lang?: string | null

  @Field(() => String, { nullable: true })
  description?: string | null

  @Field(() => Int, { nullable: true })
  order?: number

  @Field(() => MenuDistributorSummary, { nullable: true })
  distributor?: MenuDistributorSummary

  @Field(() => [MenuCourse])
  courses!: MenuCourse[]
}

@ObjectType('WebLandspitaliMenu')
export class MenuResponse {
  @Field(() => [MenuMeal])
  meals!: MenuMeal[]
}
