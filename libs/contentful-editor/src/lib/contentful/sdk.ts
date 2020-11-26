import {
  FieldAPI,
  CrudAction,
  EntityType,
} from 'contentful-ui-extensions-sdk/typings'
import { Space } from 'contentful-management/dist/typings/entities/space'
import { ContentType } from 'contentful-management/dist/typings/entities/content-type'

import { createFakeFieldAPI } from '../utils/createFakeFieldAPI'
import { createFakeNavigatorAPI } from '../utils/createFakeNavigatorAPI'
import publishedEntry from '../utils/entry.json'
import { createFakeSpaceAPI } from '../utils/createFakeSpaceAPI'
import { locales } from './locales'
import { ContentfulEnv, createContentfulClient } from './client'

const newEntitySelectorDummyDialog = (
  fnName: string,
  type: string,
) => async () => {
  return confirm(
    `sdk.dialogs.${fnName}()\nSimulate selecting a random entity or cancel?`,
  )
    ? {
        sys: {
          id: Math.random().toString(36).substring(7),
          type,
        },
      }
    : Promise.reject() // Simulate cancellation.
}

/**
 * TODO
 * If more than one content types used in a page,
 * we need to loop through and send them here as well
 */
export const getSdk = (space: Space, types: ContentType) => {
  const navigator = createFakeNavigatorAPI() // TEMP

  return {
    space: {
      ...space,
      getEntry: () => {
        return Promise.resolve(publishedEntry)
      },
      getAsset: () => {
        return Promise.resolve(null)
      },
      getEntityScheduledActions: () => {
        return Promise.resolve([])
      },
      getAssets: () => {
        return Promise.resolve({ items: [null] })
      },
      getCachedContentTypes() {
        return [types]
      },
    },
    field: undefined, // Is added when displaying the data in the sidebar
    locales,
    navigator: {
      ...navigator,
      onSlideInNavigation: () => {
        return () => {}
      },
    },
    dialogs: {
      selectSingleAsset: newEntitySelectorDummyDialog(
        'selectSingleAsset',
        'Asset',
      ),
      selectSingleEntry: newEntitySelectorDummyDialog(
        'selectSingleEntry',
        'Entry',
      ),
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
}
