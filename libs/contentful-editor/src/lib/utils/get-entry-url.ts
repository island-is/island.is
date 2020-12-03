// TODO Add contentful package to directly import it from there
import { Entry } from '@contentful/field-editor-shared'

export const getEntryURL = (entry: Entry) => {
  const entryId = entry.sys.id
  const spaceId = entry.sys.space.sys.id

  return `https://app.contentful.com/spaces/${spaceId}/entries/${entryId}`
}
