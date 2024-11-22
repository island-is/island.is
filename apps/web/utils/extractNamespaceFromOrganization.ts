export const extractNamespaceFromOrganization = (
  organization:
    | {
        namespace?: {
          fields: string
        } | null
      }
    | null
    | undefined,
): Record<string, unknown> => {
  let json = {}
  try {
    json = JSON.parse(organization?.namespace?.fields || '{}')
  } catch {
    console.log(
      'Failed JSON parsing organization namespace, fallback to empty object',
    )
  }
  return json
}
