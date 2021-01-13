export class ClientSecret {
  clientId!: string
  value!: string
  description?: string
  type!: string
  expiration?: Date
  readonly created!: Date
  readonly modified?: Date
}
