import { Field, Float, ID, Int, ObjectType } from '@nestjs/graphql'

@ObjectType('IntellectualPropertyCountry')
export class Country {
  @Field(() => String, { nullable: true })
  name?: string | null

  @Field(() => String, { nullable: true })
  code?: string | null
}

@ObjectType('IntellectualPropertyPatentOwnerDetail')
export class OwnerDetail {
  @Field(() => String, { nullable: true })
  name?: string | null

  @Field(() => String, { nullable: true })
  address?: string | null

  @Field(() => String, { nullable: true })
  postalCode?: string | null

  @Field(() => String, { nullable: true })
  city?: string | null

  @Field(() => String, { nullable: true })
  state?: string | null

  @Field(() => ID, { nullable: true })
  id?: number

  @Field(() => String, { nullable: true })
  ssn?: string | null

  @Field(() => Country, { nullable: true })
  country?: Country
}

@ObjectType('IntellectualPropertyAnnualFee')
export class AnnualFee {
  @Field(() => ID, { nullable: true })
  id?: number

  @Field(() => ID, { nullable: true })
  patentID?: number | null

  @Field(() => Date, { nullable: true })
  paymentDate?: Date | null

  @Field(() => Date, { nullable: true })
  expires?: Date | null

  @Field(() => Int, { nullable: true })
  number?: number | null

  @Field(() => String, { nullable: true })
  amount?: string | null

  @Field(() => Boolean, { nullable: true })
  surCharge?: boolean | null

  @Field(() => String, { nullable: true })
  paid?: string | null

  @Field(() => String, { nullable: true })
  payer?: string | null

  @Field(() => ID, { nullable: true })
  agentID?: number | null
}

@ObjectType('IntellectualPropertyPatentAgent')
export class Agent {
  @Field(() => String, { nullable: true })
  id?: string | null

  @Field(() => String, { nullable: true })
  ssn?: string | null

  @Field(() => String, { nullable: true })
  name?: string | null
  @Field(() => String, { nullable: true })
  address?: string | null

  @Field(() => String, { nullable: true })
  postalCode?: string | null

  @Field(() => String, { nullable: true })
  city?: string | null
  @Field(() => String, { nullable: true })
  phone?: string | null

  @Field(() => String, { nullable: true })
  mobile?: string | null

  @Field(() => String, { nullable: true })
  email?: string | null

  @Field(() => Country, { nullable: true })
  country?: Country
}
@ObjectType('IntellectualPropertyPCT')
export class PCT {
  @Field(() => String, { nullable: true })
  pctNumber?: string | null

  @Field(() => Date, { nullable: true })
  pctDate?: Date
}

@ObjectType('IntellectualPropertyPCTIS')
export class PCTIS {
  @Field(() => String, { nullable: true })
  pctIsNumber?: string | null

  @Field(() => Date, { nullable: true })
  pctIsApplicationDate?: Date
}

@ObjectType('IntellectualPropertySPC')
export class SPC {
  @Field(() => ID, { nullable: true })
  id?: number

  @Field(() => String, { nullable: true })
  spcNumber?: string | null

  @Field(() => Date, { nullable: true })
  applicationDate?: Date

  @Field(() => String, { nullable: true })
  product?: string | null

  @Field(() => String, { nullable: true })
  medicineName?: string | null

  @Field({ nullable: true })
  medicineForChildren?: boolean

  @Field(() => Date, { nullable: true })
  maxDuration?: Date

  @Field(() => String, { nullable: true })
  status?: string | null

  @Field(() => Agent, { nullable: true })
  spcAgent?: Agent

  @Field(() => Int, { nullable: true })
  agent?: number

  @Field(() => String, { nullable: true })
  icelandicMarketingAuthorizationNumber?: string | null

  @Field(() => Date, { nullable: true })
  dateIcelandicMarketingAuthorization?: Date

  @Field(() => String, { nullable: true })
  foreignMarketingAuthorizationNumber?: string | null

  @Field(() => Date, { nullable: true })
  dateForeignMarketingAuthorization?: Date

  @Field(() => Date, { nullable: true })
  grantPublishedInGazetteDate?: Date

  @Field(() => Date, { nullable: true })
  publishedInGazetteDate?: Date

  @Field(() => String, { nullable: true })
  referenceNumber?: string | null

  @Field(() => Date, { nullable: true })
  lastModified?: Date

  @Field({ nullable: true })
  canRenew?: boolean

  @Field(() => String, { nullable: true })
  message?: string | null

  @Field(() => AnnualFee, { nullable: true })
  annualFee?: AnnualFee

  @Field(() => [AnnualFee], { nullable: true })
  annualFeeList?: Array<AnnualFee> | null

  @Field(() => AnnualFee, { nullable: true })
  lastAnnualFee?: AnnualFee

  @Field(() => String, { nullable: true })
  parentPatent?: string | null

  @Field(() => [OwnerDetail], { nullable: true })
  ownersDetail?: Array<OwnerDetail> | null
}

@ObjectType('IntellectualPropertyPriority')
export class Priority {
  @Field(() => Date, { nullable: true })
  dateApplication?: Date

  @Field(() => Country, { nullable: true })
  country?: Country

  @Field(() => String, { nullable: true })
  number?: string | null

  @Field(() => Date, { nullable: true })
  createDate?: Date
}

@ObjectType('IntellectualPropertyInternalClassification')
export class InternalClassification {
  @Field(() => String, { nullable: true })
  category?: string | null

  @Field(() => String, { nullable: true })
  sequence?: string | null

  @Field(() => Date, { nullable: true })
  createDate?: Date

  @Field(() => String, { nullable: true })
  type?: string | null

  @Field(() => Date, { nullable: true })
  datePublished?: Date
}

@ObjectType('IntellectualPropertyPatentOwner')
export class Owner {
  @Field(() => String, { nullable: true })
  name?: string | null

  @Field(() => String, { nullable: true })
  home?: string | null

  @Field(() => Country, { nullable: true })
  countryName?: Country
}

@ObjectType('IntellectualPropertyPatentInventor')
export class Inventor {
  @Field(() => String, { nullable: true })
  name?: string | null

  @Field(() => String, { nullable: true })
  address?: string | null

  @Field(() => String, { nullable: true })
  postalCode?: string | null

  @Field(() => String, { nullable: true })
  city?: string | null

  @Field(() => String, { nullable: true })
  county?: string | null

  @Field(() => Country, { nullable: true })
  country?: Country
}

@ObjectType('IntellectualPropertyAnnualFeeSimple')
export class AnnualFeeSimple {
  @Field(() => Date, { nullable: true })
  annualFeeDatePaid?: Date

  @Field(() => Date, { nullable: true })
  annualFeeDueDate?: Date

  @Field(() => String, { nullable: true })
  annualFeeNumber?: string | null

  @Field(() => String, { nullable: true })
  paymentMadeBy?: string | null

  @Field({ nullable: true })
  surCharge?: boolean

  @Field(() => ID, { nullable: true })
  id?: number
}

@ObjectType('IntellectualPropertyPatent')
export class Patent {
  @Field(() => String, { nullable: true })
  id?: string | null

  @Field(() => String, { nullable: true })
  applicationNumber?: string | null

  @Field(() => String, { nullable: true })
  epApplicationNumber?: string | null

  @Field(() => String, { nullable: true })
  registrationNumber?: string | null

  @Field(() => String, { nullable: true })
  patentName?: string | null

  @Field(() => String, { nullable: true })
  patentNameInOrgLanguage?: string | null

  @Field(() => String, { nullable: true })
  patentIcelandicName?: string | null

  @Field(() => Owner, { nullable: true })
  owner?: Owner

  @Field(() => Date, { nullable: true })
  expires?: Date

  @Field(() => Date, { nullable: true })
  applicationDate?: Date

  @Field(() => Date, { nullable: true })
  registeredDate?: Date

  @Field(() => Date, { nullable: true })
  epDatePublication?: Date

  @Field(() => Date, { nullable: true })
  epDateProvisionPublishedInGazette?: Date

  @Field(() => Date, { nullable: true })
  epApplicationDate?: Date

  @Field(() => Date, { nullable: true })
  applicationDatePublishedAsAvailable?: Date

  @Field(() => Date, { nullable: true })
  maxValidDate?: Date

  @Field(() => Date, { nullable: true })
  epDateTranslationSubmitted?: Date

  @Field(() => AnnualFee, { nullable: true })
  nextAnnualFee?: AnnualFee

  @Field(() => AnnualFee, { nullable: true })
  currentAnnualFee?: AnnualFee

  @Field(() => [AnnualFee], { nullable: true })
  annualFees?: Array<AnnualFeeSimple> | null

  @Field(() => Float, { nullable: true })
  paymentDue?: number

  @Field(() => Float, { nullable: true })
  applicationFee?: number

  @Field(() => Boolean, { nullable: true })
  canRenew?: boolean

  @Field(() => String, { nullable: true })
  error?: string | null

  @Field(() => String, { nullable: true })
  status?: string | null

  @Field(() => String, { nullable: true })
  statusText?: string | null

  @Field(() => Date, { nullable: true })
  statusDate?: Date

  @Field({ nullable: true })
  alive?: boolean

  @Field(() => String, { nullable: true })
  epoStatus?: string | null

  @Field(() => String, { nullable: true })
  dataURL?: string | null

  @Field(() => Agent, { nullable: true })
  patentAgent?: Agent

  @Field(() => String, { nullable: true })
  classificationType?: string | null

  @Field(() => [Inventor], { nullable: true })
  inventors?: Array<Inventor> | null

  @Field(() => [InternalClassification], { nullable: true })
  internalClassifications?: Array<InternalClassification> | null

  @Field(() => [Priority], { nullable: true })
  priorities?: Array<Priority> | null

  @Field(() => [OwnerDetail], { nullable: true })
  ownersDetail?: Array<OwnerDetail> | null

  @Field(() => Date, { nullable: true })
  appDate?: Date

  @Field(() => Date, { nullable: true })
  regDate?: Date

  @Field(() => [SPC], { nullable: true })
  spc?: Array<SPC> | null

  @Field(() => Date, { nullable: true })
  lastModified?: Date

  @Field(() => String, { nullable: true })
  language?: string | null

  @Field(() => [String], { nullable: true })
  spcNumbers?: Array<string> | null

  @Field(() => PCT, { nullable: true })
  pct?: PCT

  @Field(() => PCTIS, { nullable: true })
  pctIs?: PCTIS
}
