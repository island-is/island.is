import { useMemo, useState } from 'react'
import { useDebounce } from 'react-use'
import dynamic from 'next/dynamic'
import { type EditorExtensionSDK } from '@contentful/app-sdk'
import {
  Box,
  Button,
  FormControl,
  MenuItem,
  Select,
} from '@contentful/f36-components'
import { PlusIcon } from '@contentful/f36-icons'
import { useSDK } from '@contentful/react-apps-toolkit'

import { CustomSortableContext } from '../../sortable/CustomSortableContext'
import { SortableEntryCard } from '../../sortable/SortableEntryCard'
import { mapLocalesToFieldApis } from '../utils'
import * as styles from './OverviewLinksEditor.css'

const ContentfulField = dynamic(
  () =>
    // Dynamically import via client side rendering since the @contentful/default-field-editors package accesses the window and navigator global objects
    import('../ContentfulField').then(({ ContentfulField }) => ContentfulField),
  {
    ssr: false,
  },
)

const createLocaleToFieldMapping = (sdk: EditorExtensionSDK) => {
  return {
    internalTitle: mapLocalesToFieldApis([sdk.locales.default], sdk, 'title'),
    displayedTitle: mapLocalesToFieldApis(
      sdk.locales.available,
      sdk,
      'displayedTitle',
    ),
    overviewLinks: mapLocalesToFieldApis(
      [sdk.locales.default],
      sdk,
      'overviewLinks',
    ),
    link: mapLocalesToFieldApis([sdk.locales.default], sdk, 'link'),
    hasBorderAbove: mapLocalesToFieldApis(
      [sdk.locales.default],
      sdk,
      'hasBorderAbove',
    ),
    linkData: mapLocalesToFieldApis([sdk.locales.default], sdk, 'linkData'),
  }
}

const generateUniqueId = (linkData: LinkData): string => {
  let highestId = 0
  for (const { id } of linkData.categoryCardItems) {
    if (Number(id) > highestId) highestId = Number(id)
  }
  return String(highestId + 1)
}

enum LinkDataVariant {
  IntroLinkImage = 'IntroLinkImage',
  CategoryCard = 'CategoryCard',
}

interface LinkData {
  variant: LinkDataVariant
  categoryCardItems: {
    id: string
    title: string
    description: string
    href: string
  }[]
}

const DEBOUNCE_TIME_IN_MS = 100

export const OverviewLinksEditor = () => {
  const sdk = useSDK<EditorExtensionSDK>()
  const localeToFieldMapping = useMemo(() => {
    return createLocaleToFieldMapping(sdk)
  }, [sdk])

  const [linkData, setLinkData] = useState<LinkData>(
    sdk.entry.fields.linkData.getValue() || {
      variant: LinkDataVariant.IntroLinkImage,
      categoryCardItems: [],
    },
  )

  useDebounce(
    () => {
      sdk.entry.fields.linkData.setValue(linkData)
    },
    DEBOUNCE_TIME_IN_MS,
    [linkData],
  )

  return (
    <Box
      paddingLeft="spacingS"
      paddingRight="spacingS"
      paddingTop="spacingL"
      paddingBottom="spacingL"
      className={styles.itemContainer}
    >
      <ContentfulField
        displayName="Internal Title"
        fieldID="internalTitle"
        localeToFieldMapping={localeToFieldMapping}
        sdk={sdk}
      />

      <ContentfulField
        displayName="Has Border Above"
        fieldID="hasBorderAbove"
        localeToFieldMapping={localeToFieldMapping}
        sdk={sdk}
      />

      <FormControl>
        <FormControl.Label>Variant</FormControl.Label>
        <Select
          value={linkData.variant}
          onChange={(event) => {
            setLinkData((prevLinkData) => ({
              ...prevLinkData,
              variant: event.target.value as LinkDataVariant,
            }))
          }}
        >
          <Select.Option value={LinkDataVariant.IntroLinkImage}>
            Intro Link Image
          </Select.Option>
          <Select.Option value={LinkDataVariant.CategoryCard}>
            Category Card
          </Select.Option>
        </Select>
      </FormControl>

      {linkData.variant === LinkDataVariant.CategoryCard && (
        <ContentfulField
          displayName="Displayed Title"
          fieldID="displayedTitle"
          localeToFieldMapping={localeToFieldMapping}
          sdk={sdk}
        />
      )}

      {linkData.variant === LinkDataVariant.IntroLinkImage && (
        <ContentfulField
          displayName="Overview Links"
          fieldID="overviewLinks"
          localeToFieldMapping={localeToFieldMapping}
          sdk={sdk}
          widgetId="entryCardsEditor"
        />
      )}

      {linkData.variant === LinkDataVariant.CategoryCard && (
        <FormControl>
          <FormControl.Label>Overview Links</FormControl.Label>
          <CustomSortableContext
            containerClassName={styles.itemContainer}
            items={linkData.categoryCardItems}
            updateItems={(updatedItems: LinkData['categoryCardItems']) => {
              setLinkData((prevLinkData) => ({
                ...prevLinkData,
                categoryCardItems: updatedItems,
              }))
            }}
            renderItem={(item: LinkData['categoryCardItems'][number]) => (
              <SortableEntryCard
                key={item.id}
                id={item.id}
                contentType="Category Card"
                title={item.title || 'Untitled'}
                description={item.description}
                actions={[
                  <MenuItem
                    key="edit"
                    onClick={async () => {
                      const updatedItem = await sdk.dialogs.openCurrentApp({
                        parameters: {
                          state: item,
                        },
                        minHeight: 400,
                      })
                      setLinkData((prevLinkData) => ({
                        ...prevLinkData,
                        categoryCardItems: prevLinkData.categoryCardItems.map(
                          (prevItem) => {
                            if (prevItem.id !== item.id) return prevItem
                            return updatedItem
                          },
                        ),
                      }))
                    }}
                  >
                    Edit
                  </MenuItem>,
                  <MenuItem
                    key="remove"
                    onClick={() => {
                      setLinkData((prevLinkData) => ({
                        ...prevLinkData,
                        categoryCardItems:
                          prevLinkData.categoryCardItems.filter(
                            ({ id }) => item.id !== id,
                          ),
                      }))
                    }}
                  >
                    Remove
                  </MenuItem>,
                ]}
              />
            )}
          />
          <div className={styles.createCategoryCardButtonContainer}>
            <Button
              startIcon={<PlusIcon />}
              onClick={() => {
                setLinkData((prevLinkData) => ({
                  ...prevLinkData,
                  categoryCardItems: prevLinkData.categoryCardItems.concat({
                    id: generateUniqueId(prevLinkData),
                    title: '',
                    description: '',
                    href: '',
                  }),
                }))
              }}
            >
              Create new card
            </Button>
          </div>
        </FormControl>
      )}

      {linkData.variant === LinkDataVariant.CategoryCard && (
        <ContentfulField
          displayName="See more link"
          fieldID="link"
          localeToFieldMapping={localeToFieldMapping}
          sdk={sdk}
          widgetId="entryLinkEditor"
        />
      )}
    </Box>
  )
}
