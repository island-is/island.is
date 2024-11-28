interface Value {
  value?: string
}

type NationalIdTransformer = ({ value }: Value) => string | undefined

export const nationalIdTransformer: NationalIdTransformer = ({ value }) =>
  value?.replace(/-/g, '')
