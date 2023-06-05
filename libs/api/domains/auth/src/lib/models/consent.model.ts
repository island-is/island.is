import { ObjectType } from '@nestjs/graphql'

@ObjectType('AuthConsent')
export class Consent {
  clientId!: string
  consentedScopes!: string[]
  rejectedScopes!: string[]
}
