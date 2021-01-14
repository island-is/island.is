export class ApiResourceSecret {
  apiResourceName!: string
  value!: string
  description?: string
  readonly expiration?: Date
  type!: string
  readonly created!: Date
  readonly modified?: Date
}
