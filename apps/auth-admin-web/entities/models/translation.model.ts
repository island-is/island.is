export class Translation {
  language!: string
  className!: string
  key!: string
  property!: string
  value?: string
  readonly created!: Date
  readonly modified?: Date
}
