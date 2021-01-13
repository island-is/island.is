export class Claim {
  type!: string
  subjectId!: string
  value!: string
  valueType!: string
  issuer!: string
  originalIssuer!: string
  readonly created!: Date
  readonly modified?: Date
}
