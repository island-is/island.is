import { ObjectType, Field, Int, OmitType } from '@nestjs/graphql'

@ObjectType('IntellectualPropertyDesignPledge')
export class Pledge {
  @Field(() => String, { nullable: true })
  holder?: string | null

  @Field(() => Date, { nullable: true })
  date?: Date

  @Field(() => String, { nullable: true })
  location?: string | null

  @Field(() => Date, { nullable: true })
  liftedDate?: Date

  @Field(() => String, { nullable: true })
  comment?: string | null
}
@ObjectType('IntellectualPropertyDesignLicense')
export class License {
  @Field(() => String, { nullable: true })
  holder?: string | null

  @Field(() => Date, { nullable: true })
  date?: Date

  @Field(() => Date, { nullable: true })
  expires?: Date

  @Field(() => String, { nullable: true })
  comment?: string | null
}

@ObjectType('IntellectualPropertyDesignObjection')
export class Objection {
  @Field(() => String, { nullable: true })
  opponent?: string | null

  @Field(() => String, { nullable: true })
  reason?: string | null

  @Field(() => String, { nullable: true })
  conclusion?: string | null

  @Field(() => String, { nullable: true })
  extract?: string | null

  @Field(() => Date, { nullable: true })
  dateReceived?: Date

  @Field(() => Date, { nullable: true })
  dateConclusion?: Date
}

@ObjectType('IntellectualPropertyDesignAppeal')
export class Appeal {
  @Field(() => String, { nullable: true })
  apellant?: string | null

  @Field(() => String, { nullable: true })
  reason?: string | null

  @Field(() => String, { nullable: true })
  conclusion?: string | null

  @Field(() => String, { nullable: true })
  extract?: string | null

  @Field(() => Date, { nullable: true })
  dateReceived?: Date

  @Field(() => Date, { nullable: true })
  dateConclusion?: Date
}

@ObjectType('IntellectualPropertyDesignCountry')
export class Country {
  @Field(() => String, { nullable: true })
  name?: string | null

  @Field(() => String, { nullable: true })
  code?: string | null
}

@ObjectType('IntellectualPropertyDesignPerson')
export class Person {
  @Field(() => String, { nullable: true })
  name?: string | null

  @Field(() => String, { nullable: true })
  address?: string | null

  @Field(() => String, { nullable: true })
  postalcode?: string | null

  @Field(() => String, { nullable: true })
  city?: string | null

  @Field(() => String, { nullable: true })
  country?: string | null

  @Field(() => Country, { nullable: true })
  countryDetails?: Country

  @Field(() => String, { nullable: true })
  email?: string | null

  @Field(() => String, { nullable: true })
  telephone?: string | null

  @Field(() => String, { nullable: true })
  mobilephone?: string | null

  @Field(() => String, { nullable: true })
  ssn?: string | null
}

@ObjectType('IntellectualPropertyDesignContact')
export class Contact extends OmitType(Person, ['ssn']) {}

@ObjectType('IntellectualPropertyDesignSpecification')
export class Specification {
  @Field(() => String, { nullable: true })
  description?: string | null

  @Field(() => String, { nullable: true })
  number?: string | null

  @Field(() => String, { nullable: true })
  designIsDecoration?: string | null

  @Field(() => String, { nullable: true })
  designShouldBeProtectedInColors?: string | null

  @Field(() => String, { nullable: true })
  specificationText?: string | null

  @Field(() => String, { nullable: true })
  specificationCount?: string | null
}

@ObjectType('IntellectualPropertyDesign')
export class Design {
  @Field(() => String, { nullable: true })
  applicationNumber?: string | null

  @Field(() => Date, { nullable: true })
  applicationDate?: Date

  @Field(() => Date, { nullable: true })
  applicationDateAvailable?: Date

  @Field(() => Date, { nullable: true })
  applicationDatePublishedAsAvailable?: Date

  @Field(() => Date, { nullable: true })
  internationalRegistrationDate?: Date

  @Field(() => Date, { nullable: true })
  applicationDeadlineDate?: Date

  @Field(() => Date, { nullable: true })
  announcementDate?: Date

  @Field(() => Date, { nullable: true })
  expiryDate?: Date

  @Field(() => Int, { nullable: true })
  statusID?: number

  @Field(() => String, { nullable: true })
  hId?: string | null

  @Field({ nullable: true })
  applicationImmidiateAvailability?: boolean

  @Field(() => String, { nullable: true })
  dmNumber?: string | null

  @Field(() => String, { nullable: true })
  wipoBulletinNumber?: string | null

  @Field(() => String, { nullable: true })
  registrationNumber?: string | null

  @Field(() => Date, { nullable: true })
  registrationDate?: Date

  @Field(() => Date, { nullable: true })
  publishDate?: Date

  @Field(() => Int, { nullable: true })
  agentID?: number

  @Field(() => String, { nullable: true })
  dividedTo?: string | null

  @Field(() => String, { nullable: true })
  referenceNumber?: string | null

  @Field(() => Date, { nullable: true })
  createDate?: Date

  @Field(() => Date, { nullable: true })
  lastModified?: Date

  @Field(() => Int, { nullable: true })
  id?: number

  @Field(() => String, { nullable: true })
  status?: string | null

  @Field(() => Int, { nullable: true })
  contactID?: number

  @Field(() => Specification, { nullable: true })
  specification?: Specification

  @Field(() => String, { nullable: true })
  description?: string | null

  @Field(() => [Person], { nullable: true })
  owners?: Array<Person> | null

  @Field(() => [Person], { nullable: true })
  designers?: Array<Person> | null

  @Field(() => Person, { nullable: true })
  agent?: Person

  @Field(() => Contact, { nullable: true })
  contact?: Contact

  @Field(() => [String], { nullable: true })
  classification?: Array<string> | null

  @Field(() => [Objection], { nullable: true })
  objections?: Array<Objection> | null

  @Field(() => [Appeal], { nullable: true })
  appeals?: Array<Appeal> | null

  @Field(() => [License], { nullable: true })
  licenses?: Array<Pledge> | null

  @Field({ nullable: true })
  canRenew?: boolean

  @Field({ nullable: true })
  canRenewWithResumption?: boolean
}
