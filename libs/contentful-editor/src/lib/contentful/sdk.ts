import { FieldAPI, CrudAction, EntityType } from 'contentful-ui-extensions-sdk/typings';
import { createFakeFieldAPI } from '../utils/createFakeFieldAPI';

import { createFakeNavigatorAPI } from '../utils/createFakeNavigatorAPI';

import { ContentfulEnv, createContentfulClient } from './client';
import publishedEntry from '../utils/entry.json'

import { locales } from './locales'
import { createFakeSpaceAPI } from '../utils/createFakeSpaceAPI';

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

export const getSdk = (field: FieldAPI, env: ContentfulEnv) => {
  // const space = (await createContentfulClient(env)).space
  const space = createFakeSpaceAPI(); // TEMP
  // const [fieldTemp] = createFakeFieldAPI() // TEMP
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
    },
    field: field,
    locales,
    navigator: {
      ...navigator,
      onSlideInNavigation: () => {
        return () => { }
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
