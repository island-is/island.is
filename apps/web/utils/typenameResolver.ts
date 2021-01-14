// this is needed cause content type names don't match in API and Contentful
const typenameMap = {
  aboutpage: 'page',
}
export const typenameResolver = (typename: string) =>
  typenameMap[typename.toLowerCase()] ?? typename
