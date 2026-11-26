import { readFile } from 'fs/promises'

// The preparation step chooses images; import jobs only consume explicit
// assignments to assets already present in the configured Contentful environment.
export const readNewsImageAssignments = async (
  args = process.argv,
): Promise<Record<string, string>> => {
  const index = args.indexOf('--images')
  const path = index === -1 ? undefined : args[index + 1]
  if (!path || path.startsWith('--')) {
    throw new Error(
      'News import requires --images <path-to-json> with post slug to image asset ID assignments',
    )
  }
  const assignments: unknown = JSON.parse(await readFile(path, 'utf8'))
  if (
    !assignments ||
    typeof assignments !== 'object' ||
    Array.isArray(assignments) ||
    Object.entries(assignments).some(
      ([slug, id]) => !slug.trim() || typeof id !== 'string' || !id.trim(),
    )
  ) {
    throw new Error(
      'News image assignments must be a JSON object mapping post slugs to non-empty image asset IDs',
    )
  }
  return Object.assign(Object.create(null), assignments)
}
