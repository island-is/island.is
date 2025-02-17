import { useEffect, useState } from 'react'
import { EntryProps } from 'contentful-management'
import { DialogExtensionSDK, locations } from '@contentful/app-sdk'
import { FieldExtensionSDK } from '@contentful/app-sdk'
import {
  Box,
  Button,
  EntryCard,
  Heading,
  Paragraph,
  Spinner,
  TextInput,
} from '@contentful/f36-components'
import { Pagination } from '@contentful/f36-components'
import { CloseIcon, SearchIcon } from '@contentful/f36-icons'
import {
  CombinedLinkActions,
  MultipleEntryReferenceEditor,
} from '@contentful/field-editor-reference'
import { useCMA, useSDK } from '@contentful/react-apps-toolkit'

const DEBOUNCE_TIME = 500

const Dialog = () => {
  const sdk = useSDK<DialogExtensionSDK>()
  const cma = useCMA()
  const [searchTerm, setSearchTerm] = useState('')
  const [searchResults, setSearchResults] = useState<EntryProps[]>([])
  const [selectedEntries, setSelectedEntries] = useState<EntryProps[]>([])
  const [loading, setLoading] = useState(false)
  const [activePage, setActivePage] = useState(0)
  const [totalItems, setTotalItems] = useState(0)

  useEffect(() => {
    const timeout = setTimeout(() => {
      setLoading(true)
      cma.entry
        .getMany({
          query: {
            content_type: 'article',
            'fields.title[match]': searchTerm,
            select:
              'sys.id,sys.publishedVersion,sys.version,fields.title,fields.intro',
            order: '-sys.updatedAt',
            skip: activePage * 100,
          },
        })
        .then((response) => {
          setSearchResults(response.items)
          setTotalItems(response.total)
          setLoading(false)
        })
        .catch(() => {
          setLoading(false)
        })
    }, DEBOUNCE_TIME)

    return () => {
      clearTimeout(timeout)
    }
  }, [searchTerm, cma.entry, activePage])

  return (
    <Box padding="spacingM">
      <Box
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Heading>Add existing content</Heading>
        <CloseIcon
          style={{ alignSelf: 'flex-start', cursor: 'pointer' }}
          onClick={() => {
            setSelectedEntries([])
            sdk.close([])
          }}
        />
      </Box>

      <Paragraph>Search for an entry:</Paragraph>

      <Box>
        <TextInput
          onChange={(ev) => setSearchTerm(ev.target.value)}
          value={searchTerm}
          icon={loading ? <Spinner /> : <SearchIcon />}
        />
        <Box
          marginTop="spacingM"
          style={{ display: 'flex', justifyContent: 'flex-end' }}
        >
          <Button
            onClick={() => sdk.close(selectedEntries)}
            variant="positive"
            isDisabled={selectedEntries.length === 0}
          >
            Select {selectedEntries.length}{' '}
            {selectedEntries.length === 1 ? 'entry' : 'entries'}
          </Button>
        </Box>
      </Box>

      <Box marginTop="spacingM">
        <Pagination
          onPageChange={setActivePage}
          activePage={activePage}
          itemsPerPage={100}
          totalItems={totalItems}
        />
      </Box>

      <Box
        style={{
          gap: '16px',
          flexDirection: 'column',
          display: 'flex',
          marginTop: '16px',
        }}
      >
        {searchResults.map((result) => {
          const isPublished =
            !!result.sys.publishedVersion &&
            result.sys.version === result.sys.publishedVersion + 1

          const isChanged =
            !!result.sys.publishedVersion &&
            result.sys.version >= result.sys.publishedVersion + 1

          const isSelected = selectedEntries
            .map((e) => e.sys.id)
            .includes(result.sys.id)

          return (
            <EntryCard
              key={result.sys.id}
              status={
                isPublished ? 'published' : isChanged ? 'changed' : 'draft'
              }
              contentType="Article"
              title={result.fields?.title?.[sdk.locales.default] ?? 'Untitled'}
              description={result.fields?.intro?.[sdk.locales.default] ?? ''}
              isSelected={selectedEntries
                .map((e) => e.sys.id)
                .includes(result.sys.id)}
              onClick={() => {
                setSelectedEntries(
                  isSelected
                    ? selectedEntries.filter((e) => e.sys.id !== result.sys.id)
                    : selectedEntries.concat(result),
                )
              }}
            />
          )
        })}
      </Box>
    </Box>
  )
}

const Field = () => {
  const sdk = useSDK<FieldExtensionSDK>()

  useEffect(() => {
    sdk.window.startAutoResizer()
  }, [sdk.window])

  return (
    <MultipleEntryReferenceEditor
      hasCardEditActions={true}
      renderCustomActions={(props) => {
        return (
          <CombinedLinkActions
            {...props}
            onLinkExisting={(index) => {
              sdk.dialogs
                .openCurrentApp({
                  width: 800,
                  shouldCloseOnEscapePress: true,
                  shouldCloseOnOverlayClick: true,
                  minHeight: 600,
                })
                .then((entries) => {
                  if (entries?.length) {
                    props.onLinkedExisting(entries, index)
                  }
                })
            }}
          />
        )
      }}
      viewType="link"
      sdk={sdk}
      isInitiallyDisabled={false}
      parameters={{
        instance: {
          showCreateEntityAction: false,
          showLinkEntityAction: true,
        },
      }}
    />
  )
}

const ArticleRelatedArticlesField = () => {
  const sdk = useSDK()

  if (sdk.location.is(locations.LOCATION_DIALOG)) return <Dialog />
  else if (sdk.location.is(locations.LOCATION_ENTRY_FIELD)) return <Field />
  return null
}

export default ArticleRelatedArticlesField
