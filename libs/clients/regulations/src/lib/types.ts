import {
  ISODate,
  RegName,
  RegulationEffect,
  RegulationType,
} from '@island.is/regulations-tools/types'

export type IRegulation = {
  id?: number
  title: string
  name: RegName
  type: RegulationType
  signatureDate: ISODate
  publishedDate: ISODate
  effectiveDate: ISODate
  status: 'shipped'
  /** The raw Regulation.text **with** appendix sections included */
  text: string
  ministryId?: number | null
  externalLink?: string | null
  repealedBeacuseReasons: boolean
}

export const ValidationError = {
  MissingValue: 'MissingValue',
  InvalidValue: 'InvalidValue',
  Error: 'Error',
} as const

type ValueOf<T> = T[keyof T]

export type IValidationMessage = {
  field?: string
  code: ValueOf<typeof ValidationError>
  message?: string
}

export type UpdateResponse = {
  success: boolean
  code: number
  message?: string | Error
  errors?: Array<IValidationMessage>
  data?: {
    id?: number
    regulationId?: number
    regulation?: Partial<IRegulation>
    original?: Partial<IRegulation>
  }
}

export type UiRegulation = IRegulation & {
  /** Regulation.text **excluding** appendix sections */
  text: string
  /** Titles and texts extracted out of the original Regulation.text blob */
  appendixes: Array<{
    title: string
    text: string
  }>
  comments: string
  repealedDate: ISODate | null
}

export type ImpactRegulation = Partial<
  Pick<UiRegulation, 'title' | 'text' | 'appendixes' | 'comments' | 'name'>
> & {
  date?: ISODate
  changingId?: string
  regulationId?: string
  type?: RegulationEffect['effect']
}

export type PublishRegulationInput = IRegulation & {
  impacts?: ImpactRegulation[]
  lawChapters?: string[]
  ministryName?: string
}
