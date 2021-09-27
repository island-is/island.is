import { Field, ObjectType } from '@nestjs/graphql'
import { PagingData } from './propertyOwners.model'

@ObjectType()
export class Fasteignamat {
  @Field({ nullable: true })
  gildandiFasteignamat?: number | undefined

  @Field({ nullable: true })
  fyrirhugadFasteignamat?: number

  @Field({ nullable: true })
  gildandiMannvirkjamat?: number | undefined

  @Field({ nullable: true })
  fyrirhugadMannvirkjamat?: number

  @Field({ nullable: true })
  gildandiLodarhlutamat?: number | undefined

  @Field({ nullable: true })
  fyrirhugadLodarhlutamat?: number

  @Field({ nullable: true })
  gildandiAr?: number | undefined

  @Field({ nullable: true })
  fyrirhugadAr?: number | undefined
}

@ObjectType()
export class Stadfang {
  @Field({ nullable: true })
  stadfanganumer?: number

  @Field({ nullable: true })
  stadvisir?: string

  @Field({ nullable: true })
  stadgreinir?: string

  @Field({ nullable: true })
  postnumer?: number

  @Field({ nullable: true })
  sveitarfelag?: string

  @Field({ nullable: true })
  landeignarnumer?: number

  @Field({ nullable: true })
  birting?: string

  @Field({ nullable: true })
  birtingStutt?: string
}

@ObjectType()
export class UnitOfUse {
  @Field({ nullable: true })
  fasteignanumer?: string

  @Field({ nullable: true })
  notkunareininganumer?: string

  @Field({ nullable: true })
  stadfang?: Stadfang

  @Field({ nullable: true })
  merking?: string

  @Field({ nullable: true })
  notkun?: string

  @Field({ nullable: true })
  notkunBirting?: string

  @Field({ nullable: true })
  starfsemi?: string

  @Field({ nullable: true })
  lysing?: string

  @Field({ nullable: true })
  byggingarAr?: string

  @Field({ nullable: true })
  birtStaerd?: number

  @Field({ nullable: true })
  byggingararBirting?: string

  @Field({ nullable: true })
  lodarmat?: number

  @Field({ nullable: true })
  brunabotamat?: number

  @Field({ nullable: true })
  fasteignamat?: Fasteignamat
}

@ObjectType()
export class UnitsOfUseModel {
  @Field(() => PagingData, { nullable: true })
  paging?: PagingData

  @Field(() => [UnitOfUse], { nullable: true })
  notkunareiningar?: UnitOfUse[]
}
