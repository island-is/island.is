import { Answers } from '../../types'

export type RepeaterProps = {
  field: {
    props: {
      fields: Array<object>
      repeaterButtonText: string
      sumField: string
      calcWithShareValue?: boolean
      assetKey?: string
    }
  }
}

export interface FieldComponentProps {
  assetKey?: string
  onAfterChange?: () => void
  setLoadingFieldName?: (fieldName: string | null) => void
  loadingFieldName?: string | null
  pushRight?: boolean
  field: Record<string, any>
  fieldIndex: string
  fieldName: string
  error?: string
  answers?: Answers
  isInitial?: boolean
  disabled?: boolean
}
