import { useEffect, useState } from 'react'
import type { FieldExtensionSDK } from '@contentful/app-sdk'
import { Box, Button } from '@contentful/f36-components'
import { PlusIcon } from '@contentful/f36-icons'
import { useCMA, useSDK } from '@contentful/react-apps-toolkit'

import { EntryListSearch } from '../../components/EntryListSearch'

const GenericTagGroupItemsField = () => {
  const [_, setCounter] = useState(0)

  const sdk = useSDK<FieldExtensionSDK>()
  const cma = useCMA()

  const createGenericTag = async () => {
    const tag = await cma.entry.create(
      {
        contentTypeId: 'genericTag',
        environmentId: sdk.ids.environment,
        spaceId: sdk.ids.space,
      },
      {
        fields: {
          genericTagGroup: {
            [sdk.locales.default]: {
              sys: {
                id: sdk.entry.getSys().id,
                linkType: 'Entry',
                type: 'Link',
              },
            },
          },
        },
      },
    )
    sdk.navigator
      .openEntry(tag.sys.id, {
        slideIn: { waitForClose: true },
      })
      .then(() => {
        setCounter((c) => c + 1)
      })
  }

  useEffect(() => {
    sdk.window.startAutoResizer()
    return () => {
      sdk.window.stopAutoResizer()
    }
  }, [sdk.window])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <Box>
        <Box
          onClick={createGenericTag}
          style={{ display: 'flex', justifyContent: 'flex-end' }}
        >
          <Button startIcon={<PlusIcon />}>Create tag</Button>
        </Box>
      </Box>
      <EntryListSearch
        contentTypeId="genericTag"
        contentTypeLabel="Generic Tag"
        contentTypeTitleField="title"
      />
    </div>
  )
}

export default GenericTagGroupItemsField
