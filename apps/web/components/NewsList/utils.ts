export const makeHref = (
  selectedTag: string,
  newsOverviewUrl: string,
  y: number | string,
  m?: number | string,
) => {
  const params = { y, m, tag: selectedTag }
  const query = Object.entries(params).reduce((queryObject, [key, value]) => {
    if (value) {
      queryObject[key] = value
    }
    return queryObject
  }, {})

  return {
    pathname: newsOverviewUrl,
    query,
  }
}
