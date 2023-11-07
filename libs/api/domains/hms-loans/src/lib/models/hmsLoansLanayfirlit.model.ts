import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType('HmsLoansVedstadirModel')
export class VedstadirModel {
  @Field(() => String, { nullable: true })
  fastanumer?: string

  @Field(() => String, { nullable: true })
  vedstadurHeiti?: string

  @Field(() => String, { nullable: true })
  vedstadurSVfelag?: string

  @Field(() => String, { nullable: true })
  epilog?: string

  @Field(() => String, { nullable: true })
  svFelagsNumer?: string
}

@ObjectType('HmsLoansMedgreidendurModel')
export class MedgreidendurModel {
  @Field(() => String, { nullable: true })
  nafnMedgreidandi?: string | null

  @Field(() => String, { nullable: true })
  medGreidandi?: string | null
}

@ObjectType('HmsLoansLanayfirlitModel')
export class LanayfirlitModel {
  @Field(() => Number, { nullable: true })
  masterloanid?: number

  @Field(() => String, { nullable: true })
  nafn?: string

  @Field(() => String, { nullable: true })
  heimili?: string

  @Field(() => Number, { nullable: true })
  postnumer?: number

  @Field(() => String, { nullable: true })
  poststod?: string

  @Field(() => Date, { nullable: true })
  fyrstiVaxtadagur?: Date

  @Field(() => Date, { nullable: true })
  fyrstiGjalddagi?: Date

  @Field(() => Number, { nullable: true })
  fjoldiGjalddaga?: number

  @Field(() => Number, { nullable: true })
  fjoldiGjalddagaAAri?: number

  @Field(() => String, { nullable: true })
  greidslujofnun?: string

  @Field(() => String, { nullable: true })
  uppGrAkvaedi?: string

  @Field(() => String, { nullable: true })
  frysting?: string

  @Field(() => String, { nullable: true })
  timabFrysting?: string

  @Field(() => String, { nullable: true })
  breytilegir?: string

  @Field(() => Number, { nullable: true })
  hlutdeildarlan?: number

  @Field(() => String, { nullable: true })
  tegVisitolu?: string

  @Field(() => Number, { nullable: true })
  grunnVisitala?: number

  @Field(() => Number, { nullable: true })
  vextir?: number

  @Field(() => Number, { nullable: true })
  upphaflegFjarhaed?: number

  @Field(() => Date, { nullable: true })
  naestiGjalddagi?: Date

  @Field(() => Date, { nullable: true })
  sidastiGjalddagi?: Date

  @Field(() => Date, { nullable: true })
  elstiOgreiddiGjalddagi?: Date

  @Field(() => Number, { nullable: true })
  fjoldiGjalddagaEftir?: number

  @Field(() => Number, { nullable: true })
  stadaJofnun?: number

  @Field(() => Number, { nullable: true })
  sidastaGreidsla?: number

  @Field(() => Number, { nullable: true })
  vanskilAlls?: number

  @Field(() => Number, { nullable: true })
  nafnverdOgjaldfallid?: number

  @Field(() => Number, { nullable: true })
  afallnirVxtVb?: number

  @Field(() => Number, { nullable: true })
  eftirstodvarMVSkil?: number

  @Field(() => Number, { nullable: true })
  uppgreidslugjald?: number

  @Field(() => Number, { nullable: true })
  uppgreidsluverdmaeti?: number

  @Field(() => String, { nullable: true })
  stadaLans?: string

  @Field(() => String, { nullable: true })
  kennitala?: string

  @Field(() => String, { nullable: true })
  lanaFlokkur?: string

  @Field(() => Number, { nullable: true })
  leggur?: number

  @Field(() => [VedstadirModel], { nullable: true })
  vedstadir?: VedstadirModel[]

  @Field(() => [MedgreidendurModel], { nullable: true })
  medgreidendur?: MedgreidendurModel[]
}
