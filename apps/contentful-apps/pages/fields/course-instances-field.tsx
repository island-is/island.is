import { useEffect, useState } from 'react'
import type { FieldExtensionSDK } from '@contentful/app-sdk'
import { EntryCard, MenuDivider, MenuItem } from '@contentful/f36-components'
import { MultipleEntryReferenceEditor } from '@contentful/field-editor-reference'
import { entityHelpers } from '@contentful/field-editor-shared'
import { useCMA, useSDK } from '@contentful/react-apps-toolkit'

type EntryLinkValue = {
  sys: {
    type: 'Link'
    linkType: 'Entry'
    id: string
  }
}

const CourseInstancesField = () => {
  const sdk = useSDK<FieldExtensionSDK>()
  const cma = useCMA()
  const [duplicatingEntryId, setDuplicatingEntryId] = useState<string | null>(
    null,
  )
  const [_, setCounter] = useState(0)

  useEffect(() => {
    sdk.window.startAutoResizer()
    return () => {
      sdk.window.stopAutoResizer()
    }
  }, [sdk.window])

  const handleDuplicate = async (entryId: string) => {
    setDuplicatingEntryId(entryId)
    try {
      const sourceEntry = await cma.entry.get({ entryId })

      const duplicatedEntry = await cma.entry.create(
        {
          contentTypeId: sourceEntry.sys.contentType.sys.id,
        },
        {
          fields: JSON.parse(JSON.stringify(sourceEntry.fields ?? {})),
        },
      )

      const currentValue = (sdk.field.getValue() ?? []) as EntryLinkValue[]
      await sdk.field.setValue([
        ...currentValue,
        {
          sys: {
            type: 'Link',
            linkType: 'Entry',
            id: duplicatedEntry.sys.id,
          },
        },
      ])

      sdk.notifier.success('Course instance duplicated')
      await sdk.navigator.openEntry(duplicatedEntry.sys.id, {
        slideIn: { waitForClose: true },
      })
    } catch (error) {
      console.error(error)
      sdk.notifier.error('Could not duplicate course instance')
    } finally {
      setDuplicatingEntryId(null)
    }
  }

  return (
    <MultipleEntryReferenceEditor
      hasCardEditActions={true}
      viewType="card"
      sdk={sdk}
      isInitiallyDisabled={false}
      parameters={{
        instance: {
          showCreateEntityAction: true,
          showLinkEntityAction: false,
        },
      }}
      renderCustomCard={(cardProps, _linkActionsProps) => {
        const title = entityHelpers.getEntryTitle({
          entry: cardProps.entity,
          contentType: cardProps.contentType,
          localeCode: cardProps.localeCode,
          defaultLocaleCode: cardProps.defaultLocaleCode,
          defaultTitle: 'Untitled',
        })
        const description = entityHelpers.getEntityDescription({
          entity: cardProps.entity,
          contentType: cardProps.contentType,
          localeCode: cardProps.localeCode,
          defaultLocaleCode: cardProps.defaultLocaleCode,
        })
        const status = entityHelpers.getEntityStatus(cardProps.entity.sys)
        const entryId = cardProps.entity.sys.id

        const onEdit = async () => {
          await sdk.navigator.openEntry(entryId, {
            slideIn: {
              waitForClose: true,
            },
          })
          setCounter((c) => c + 1)
        }

        return (
          <EntryCard
            title={title}
            description={description}
            contentType={cardProps.contentType?.name}
            status={status}
            size={cardProps.size}
            withDragHandle={Boolean(cardProps.renderDragHandle)}
            dragHandleRender={cardProps.renderDragHandle}
            actions={[
              <MenuItem
                key="duplicate"
                onClick={() => {
                  handleDuplicate(entryId)
                }}
                isDisabled={cardProps.isDisabled || duplicatingEntryId !== null}
              >
                Duplicate
              </MenuItem>,
              <MenuDivider key="divider-duplicate" />,
              <MenuItem key="edit" onClick={onEdit}>
                Edit
              </MenuItem>,
              <MenuItem key="remove" onClick={cardProps.onRemove}>
                Remove
              </MenuItem>,
            ]}
            onClick={onEdit}
          />
        )
      }}
      actionLabels={{
        createNew: () => 'Create new Course Instance',
      }}
    />
  )
}

export default CourseInstancesField
