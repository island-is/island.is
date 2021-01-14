import { Claim } from './claim.model'

export default class UserIdentity {
  subjectId!: string
  name!: string
  providerName!: string
  providerSubjectId!: string
  active!: boolean
  readonly created!: Date
  readonly modified?: Date
  readonly claims?: Claim[]
}
