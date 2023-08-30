export const makeHref = (
  selectedTag: string | string[],
  newsOverviewUrl: string,
  y: number | string,
  m?: number | string,
) => {
  const params = { y, m, tag: selectedTag }
  const query = Object.entries(params).reduce((queryObject, [key, value]) => {
    if (value) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore make web strict
      queryObject[key] = value
    }
    return queryObject
  }, {})

  return {
    pathname: newsOverviewUrl,
    query,
  }
}
