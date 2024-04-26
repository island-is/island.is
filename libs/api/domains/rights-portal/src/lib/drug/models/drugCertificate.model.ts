import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType('RightsPortalMethylDoctor')
export class MethylDoctor {
  @Field(() => String, { nullable: true })
  name?: string
}

@ObjectType('RightsPortalDrugCertificate')
export class DrugCertificate {
  @Field(() => Number, { nullable: true })
  id?: number

  @Field(() => String, { nullable: true })
  atcCode?: string

  @Field(() => String, { nullable: true })
  atcName?: string

  @Field(() => String, { nullable: true })
  drugName?: string

  @Field(() => Date, { nullable: true })
  date?: Date

  @Field(() => Date, { nullable: true })
  validFrom?: Date

  @Field(() => Date, { nullable: true })
  validTo?: Date

  @Field(() => String, { nullable: true })
  doctor?: string

  @Field(() => Boolean, { nullable: true })
  processed?: boolean

  @Field(() => Boolean, { nullable: true })
  approved?: boolean

  @Field(() => Boolean, { nullable: true })
  rejected?: boolean

  @Field(() => Boolean, { nullable: true })
  expired?: boolean

  @Field(() => Boolean, { nullable: true })
  valid?: boolean

  @Field(() => String, { nullable: true })
  comment?: string

  @Field(() => Number, { nullable: true })
  documentId?: number

  @Field(() => [MethylDoctor], { nullable: true })
  methylDoctors?: MethylDoctor[]
}
