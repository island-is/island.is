export class Grant {
  key!: string
  type!: string
  subjectId!: string
  sessionId?: string
  clientId!: string
  description?: string
  creationTime!: Date
  expiration?: Date
  consumedTime?: Date
  data!: string
  readonly created!: Date
  readonly modified?: Date
}
