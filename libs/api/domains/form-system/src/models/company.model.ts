import {
  Field as FieldType,
  ObjectType,
  GraphQLISODateTime,
} from '@nestjs/graphql'

@ObjectType()
export class CompanyClassification {
  @FieldType(() => String)
  type!: string

  @FieldType(() => String)
  classificationSystem!: string

  @FieldType(() => String)
  number!: string

  @FieldType(() => String)
  name!: string
}

@ObjectType()
export class CompanyVat {
  @FieldType(() => String, { nullable: true })
  vatNumber?: string

  @FieldType(() => GraphQLISODateTime, { nullable: true })
  dateOfRegistration?: Date

  @FieldType(() => String, { nullable: true })
  status?: string

  @FieldType(() => GraphQLISODateTime, { nullable: true })
  dateOfDeregistration?: Date

  @FieldType(() => [CompanyClassification], { nullable: 'itemsAndList' })
  classification?: CompanyClassification[]
}

@ObjectType()
export class CompanyRelatedParty {
  @FieldType(() => String)
  type!: string

  @FieldType(() => String)
  nationalId!: string

  @FieldType(() => String)
  name!: string
}

@ObjectType()
export class CompanyFormOfOperation {
  @FieldType(() => String)
  type!: string

  @FieldType(() => String)
  name!: string
}

@ObjectType()
export class CompanyAddress {
  @FieldType(() => String)
  type!: string

  @FieldType(() => String)
  streetAddress!: string

  @FieldType(() => String)
  postalCode!: string

  @FieldType(() => String)
  locality!: string

  @FieldType(() => String)
  municipalityNumber!: string

  @FieldType(() => String)
  country!: string

  @FieldType(() => Boolean)
  isPostbox!: boolean

  @FieldType(() => String)
  region!: string
}

@ObjectType()
export class CompanyInfo {
  @FieldType(() => String)
  nationalId!: string

  @FieldType(() => String)
  name!: string

  @FieldType(() => GraphQLISODateTime, { nullable: true })
  dateOfRegistration?: Date

  @FieldType(() => String)
  status!: string

  @FieldType(() => String, { nullable: true })
  vatNumber?: string

  @FieldType(() => GraphQLISODateTime, { nullable: true })
  lastUpdated?: Date
}

@ObjectType()
export class CompanyExtendedInfo extends CompanyInfo {
  @FieldType(() => [CompanyFormOfOperation], { nullable: 'itemsAndList' })
  formOfOperation?: CompanyFormOfOperation[]

  @FieldType(() => [CompanyAddress], { nullable: 'itemsAndList' })
  addresses?: CompanyAddress[]

  @FieldType(() => CompanyAddress, { nullable: true })
  address?: CompanyAddress

  @FieldType(() => CompanyAddress, { nullable: true })
  legalDomicile?: CompanyAddress

  @FieldType(() => [CompanyRelatedParty], { nullable: 'itemsAndList' })
  relatedParty?: CompanyRelatedParty[]

  @FieldType(() => [CompanyVat], { nullable: 'itemsAndList' })
  vat?: CompanyVat[]
}
