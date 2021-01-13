export class ClientClaim {
  clientId!: string
  type!: string
  value!: string
  readonly created!: Date
  readonly modified?: Date
}
