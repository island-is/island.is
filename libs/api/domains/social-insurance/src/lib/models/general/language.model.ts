import { ObjectType } from '@nestjs/graphql'
import { Country } from './country.model'

@ObjectType('SocialInsuranceGeneralLanguage')
export class Language extends Country {}
