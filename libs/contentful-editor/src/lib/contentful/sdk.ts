import {
  BaseExtensionSDK,
  CrudAction,
  EntityType,
} from 'contentful-ui-extensions-sdk/typings'
import { Space } from 'contentful-management/dist/typings/entities/space'
import { ContentType } from 'contentful-management/dist/typings/entities/content-type'
import { openRichTextDialog } from '@contentful/field-editor-rich-text'
import { Entry } from 'contentful-management/dist/typings/entities/entry'
import { Collection } from 'contentful-management/dist/typings/common-types'
import { Asset, AssetProps } from 'contentful-management/dist/typings/entities/asset'

import { contentfulUrl } from '../contentful-editor'
import { locales } from './locales'

/**
 * TODO
 * If more than one content types used in a page,
 * we need to loop through and send them here as well
 */
export const getSdk = (entry: Entry, assets: Collection<Asset, AssetProps>, space: Space, types: ContentType): BaseExtensionSDK => {
  const sdk = {
    space: {
      ...space,
      getEntry: () => {
        console.log('-getEntry');
        return Promise.resolve(entry)
      },
      getAsset: () => {
        console.log('-getAsset');
        return Promise.resolve(null)
      },
      getEntityScheduledActions: () => {
        console.log('-getEntityScheduledActions');
        return Promise.resolve([])
      },
      getAssets: () => {
        console.log('-getAssets');
        return Promise.resolve({ items: assets.items })
      },
      getCachedContentTypes() {
        console.log('-getCachedContentTypes');
        return [types]
      },
    },
    locales,
    navigator: {
      openEntry(entryId: string) {
        window.open(`${contentfulUrl}/${entryId}`, '_blank');
      },
      openAsset(assetId: string) {
        window.open(`${contentfulUrl}/${assetId}`, '_blank');
      },
      onSlideInNavigation: () => {
        console.log('-onSlideInNavigation');

        return () => { }
      },
    },
    dialogs: {
      selectSingleAsset({
        contentTypes,
        entityType,
        locale,
        withCreate,
      }) {
        console.log('-contentTypes', contentTypes);
        console.log('-entityType', entityType);
        console.log('-locale', locale);
        console.log('-withCreate', withCreate);
      },

      selectSingleEntry({
        contentTypes,
        entityType,
        locale,
        withCreate,
      }) {
        console.log('-contentTypes', contentTypes);
        console.log('-entityType', entityType);
        console.log('-locale', locale);
        console.log('-withCreate', withCreate);
      },
    } as {
      selectSingleAsset: (...args: any) => void
      selectSingleEntry: (...args: any) => void
      openCurrent: (sdk: any) => void
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
        getEntryUrl: () => '#',
      },
    },
  }

  sdk.dialogs.openCurrent = openRichTextDialog(sdk)

  return sdk
}
