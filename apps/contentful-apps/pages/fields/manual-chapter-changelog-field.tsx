import { useEffect, useState } from 'react'
import {
  Button,
  Box,
  Table,
  Datepicker,
  Textarea,
} from '@contentful/f36-components'
import { DeleteIcon, PlusIcon } from '@contentful/f36-icons'
import { FieldExtensionSDK } from '@contentful/app-sdk'
import { useSDK } from '@contentful/react-apps-toolkit'
import { useDebounce } from 'react-use'

const DEBOUNCE_TIME = 150
const BOTTOM_PADDING = '330px'

const generateId = (items: Changelog['items']) => {
  let highestId = 0

  for (const item of items) {
    if (item.id > highestId) {
      highestId = item.id
    }
  }

  return highestId + 1
}

const sortByDateOfChange = (a: ChangelogItem, b: ChangelogItem) => {
  if (a.dateOfChange > b.dateOfChange) {
    return -1
  } else if (a.dateOfChange < b.dateOfChange) {
    return 1
  }
  return 0
}

interface Changelog {
  items: {
    id: number
    dateOfChange: string
    textualDescription: string
  }[]
}

type ChangelogItem = Changelog['items'][number]

const ManualChapterChangelogField = () => {
  const sdk = useSDK<FieldExtensionSDK>()
  const [changelog, setChangelog] = useState<Changelog>(
    sdk.field.getValue() ?? {
      items: [],
    },
  )

  useEffect(() => {
    sdk.window.startAutoResizer()
  }, [sdk.window])

  useDebounce(
    () => {
      sdk.field.setValue(changelog)
    },
    DEBOUNCE_TIME,
    [changelog],
  )

  const updateChangelogItem = (
    id: number,
    key: keyof Changelog['items'][number],
    value: string,
  ) => {
    setChangelog((prevChangelog) => ({
      ...prevChangelog,
      items: prevChangelog.items.map((item) => {
        if (item.id !== id) return item
        return {
          ...item,
          [key]: value,
        }
      }),
    }))
  }

  return (
    <Box
      style={{
        paddingBottom: changelog.items.length > 0 ? BOTTOM_PADDING : undefined,
      }}
    >
      <Box
        paddingBottom="spacingL"
        style={{ display: 'flex', justifyContent: 'flex-end' }}
      >
        <Button
          onClick={() => {
            setChangelog((prevChangelog) => ({
              ...prevChangelog,
              items: prevChangelog.items.concat({
                id: generateId(prevChangelog.items),
                dateOfChange: new Date().toISOString(),
                textualDescription: '',
              }),
            }))
          }}
          startIcon={<PlusIcon />}
        >
          Add change
        </Button>
      </Box>
      {changelog.items.length > 0 && (
        <Table>
          <Table.Head>
            <Table.Row>
              <Table.Cell>Date</Table.Cell>
              <Table.Cell>Description</Table.Cell>
              <Table.Cell />
            </Table.Row>
          </Table.Head>
          <Table.Body>
            {changelog.items.sort(sortByDateOfChange).map((change) => (
              <Table.Row key={change.id}>
                <Table.Cell>
                  <Datepicker
                    onSelect={(day) => {
                      updateChangelogItem(
                        change.id,
                        'dateOfChange',
                        day.toISOString(),
                      )
                    }}
                    selected={
                      change.dateOfChange ? new Date(change.dateOfChange) : null
                    }
                  />
                </Table.Cell>
                <Table.Cell>
                  <Textarea
                    value={change.textualDescription}
                    onChange={(ev) => {
                      updateChangelogItem(
                        change.id,
                        'textualDescription',
                        ev.target.value,
                      )
                    }}
                  />
                </Table.Cell>
                <Table.Cell>
                  <Button
                    onClick={() => {
                      sdk.dialogs
                        .openConfirm({
                          title: 'Confirm deletion',
                          message:
                            'Are you sure you want to delete this change?',
                          intent: 'negative',
                        })
                        .then((value) => {
                          if (!value) return
                          setChangelog((prevChangelog) => ({
                            ...prevChangelog,
                            items: prevChangelog.items.filter(
                              (item) => item.id !== change.id,
                            ),
                          }))
                        })
                    }}
                    startIcon={<DeleteIcon />}
                  />
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      )}
    </Box>
  )
}

export default ManualChapterChangelogField
