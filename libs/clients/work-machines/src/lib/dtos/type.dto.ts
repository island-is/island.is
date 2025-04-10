export interface TypeDto {
  fullType: string
  type: string
  subType?: string
}

export const mapType = (data?: string): TypeDto | null => {
  if (!data) {
    return null
  }

  const [type, ...subType] = data.split(' ')

  if (!type) {
    return null
  }

  return {
    fullType: data,
    type,
    subType: subType.join(' '),
  }
}
