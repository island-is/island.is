export interface TypeDto {
  type?: string
  model?: string
}

export const mapType = (data?: string): TypeDto => {
  if (!data) {
    return {
      type: undefined,
      model: undefined,
    }
  }

  const [type, ...model] = data.split(' ')

  if (!type) {
    return {
      type: undefined,
      model: undefined,
    }
  }

  return {
    type,
    model: model.join(' '),
  }
}
