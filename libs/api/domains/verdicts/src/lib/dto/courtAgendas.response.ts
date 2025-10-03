import { Field, Int, ObjectType } from '@nestjs/graphql'
import { CacheField } from '@island.is/nest/graphql'
import { CourtAgendasInput } from './courtAgendas.input'

@ObjectType('WebCourtAgendaJudge')
class CourtAgendaJudge {
  @Field(() => String, { nullable: true })
  id?: string

  @Field(() => String, { nullable: true })
  name?: string

  @Field(() => String, { nullable: true })
  title?: string

  @Field(() => Boolean, { nullable: true })
  isPresident?: boolean

  @Field(() => Int, { nullable: true })
  placement?: number
}

@ObjectType('WebCourtAgendaLawyer')
class CourtAgendaLawyer {
  @Field(() => String, { nullable: true })
  id?: string

  @Field(() => String, { nullable: true })
  name?: string

  @Field(() => String, { nullable: true })
  title?: string

  @Field(() => Int, { nullable: true })
  placement?: number

  @Field(() => String, { nullable: true })
  side?: string
}

@ObjectType('WebCourtAgenda')
class CourtAgenda {
  @Field(() => String)
  id!: string

  @Field(() => String)
  caseNumber!: string

  @Field(() => String)
  dateFrom!: string

  @Field(() => String)
  dateTo!: string

  @Field(() => Boolean)
  closedHearing!: boolean

  @Field(() => String)
  courtRoom!: string

  @Field(() => String)
  type!: string

  @CacheField(() => [CourtAgendaJudge])
  judges!: CourtAgendaJudge[]

  @CacheField(() => [CourtAgendaLawyer])
  lawyers!: CourtAgendaLawyer[]

  @Field(() => String)
  court!: string

  @Field(() => String)
  title!: string
}

@ObjectType('WebCourtAgendasResponse')
export class CourtAgendasResponse {
  @CacheField(() => [CourtAgenda])
  items!: CourtAgenda[]

  @Field(() => Int)
  total!: number

  @CacheField(() => CourtAgendasInput)
  input!: CourtAgendasInput
}
