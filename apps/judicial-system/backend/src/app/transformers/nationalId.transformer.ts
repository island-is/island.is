interface Value {
  value?: string | null
}

type NationalIdTransformer = ({ value }: Value) => string | undefined | null

export const nationalIdTransformer: NationalIdTransformer = ({ value }) => {
  if (!value) {
    return value
  }

  return value.replace(/-/g, '')
}
