import {
  BaseExtensionSDK,
  CrudAction,
  EntityType,
  FieldExtensionSDK,
} from 'contentful-ui-extensions-sdk/typings'
import { Space } from 'contentful-management/dist/typings/entities/space'
import { ContentType } from 'contentful-management/dist/typings/entities/content-type'
import { openRichTextDialog } from '@contentful/field-editor-rich-text'
import { Entry } from 'contentful-management/dist/typings/entities/entry'
import { Asset } from 'contentful-management/dist/typings/entities/asset'
import {
  env,
  locales,
  getEntryURL,
  Entries,
  Assets,
  Types,
} from '@island.is/contentful-editor'

export const contentfulUrl = `https://app.contentful.com/spaces/${env.space}/entries`

/**
 * TODO
 * If more than one content types used in a page,
 * we need to loop through and send them here as well
 */
export const createSdk = (
  entry: Entry,
  entries: Entries,
  assets: Assets,
  types: Types,
  space: Space,
) => {
  const sdk = {
    space: {
      ...space,
      getEntry: (entryId: string) => {
        const foundEntry = entries.find((entry) => entry.sys.id === entryId)

        if (foundEntry) {
          return Promise.resolve(foundEntry)
        }

        return Promise.resolve(entry)
      },
      getAsset: (assetId: string) => {
        const asset = assets.find((item) => item.sys.id === assetId)

        return Promise.resolve(asset)
      },
      getEntityScheduledActions: () => {
        console.log('-getEntityScheduledActions')
        return Promise.resolve([])
      },
      getAssets: () => {
        console.log('-getAssets')
        return Promise.resolve({ items: assets })
      },
      getCachedContentTypes() {
        return types
      },
    },
    locales,
    navigator: {
      openEntry(entryId: string) {
        window.open(`${contentfulUrl}/${entryId}`, '_blank')
      },
      openAsset(assetId: string) {
        window.open(`${contentfulUrl}/${assetId}`, '_blank')
      },
      onSlideInNavigation: () => {
        console.log('-onSlideInNavigation')
        return () => {}
      },
    },
    dialogs: {
      selectSingleAsset({ contentTypes, entityType, locale, withCreate }) {
        /*
        console.log('-contentTypes', contentTypes)
        console.log('-entityType', entityType)
        console.log('-locale', locale)
        console.log('-withCreate', withCreate)
        */
      },

      selectSingleEntry({ contentTypes, entityType, locale, withCreate }) {
        /*
        console.log('-contentTypes', contentTypes)
        console.log('-entityType', entityType)
        console.log('-locale', locale)
        console.log('-withCreate', withCreate)
        */
      },
    } as {
      selectSingleAsset: (...args: any) => void
      selectSingleEntry: (...args: any) => void
      openCurrent: (sdk: FieldExtensionSDK) => void
    },
    access: {
      can: (access: CrudAction, entityType: EntityType) => {
        if (entityType === 'Asset') {
          if (access === 'create') {
            return Promise.resolve(false)
          }

          if (access === 'read') {
            return Promise.resolve(true)
          }
        }

        return Promise.resolve(false)
      },
    },
    parameters: {
      instance: {
        getEntryUrl: (entryId: string) => {
          const foundEntry = entries.find((entry) => entry.sys.id === entryId)

          if (foundEntry) {
            return getEntryURL(foundEntry)
          }

          return '#'
        },
      },
    },
  }

  sdk.dialogs.openCurrent = openRichTextDialog(sdk)

  return sdk
}
