export class AdminAccess {
  nationalId!: string
  scope!: string
  email!: string
  active!: boolean
  readonly created!: Date
  readonly modified?: Date
}
