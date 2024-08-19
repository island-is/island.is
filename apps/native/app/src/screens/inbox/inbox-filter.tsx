import {
  Accordion,
  AccordionItem,
  CheckboxItem,
  DatePickerInput,
  theme,
} from '@ui'
import { useEffect, useState } from 'react'
import { useIntl } from 'react-intl'
import { ScrollView } from 'react-native'
import { Navigation } from 'react-native-navigation'
import { createNavigationOptionHooks } from '../../hooks/create-navigation-option-hooks'
import { useConnectivityIndicator } from '../../hooks/use-connectivity-indicator'
import { ComponentRegistry } from '../../utils/component-registry'
import {
  DocumentsV2Category,
  DocumentsV2Sender,
} from '../../graphql/types/schema'

const { useNavigationOptions, getNavigationOptions } =
  createNavigationOptionHooks((theme, intl) => ({
    topBar: {
      title: {
        text: intl.formatMessage({
          id: 'inboxFilters.screenTitle',
        }),
      },
    },
  }))

export function InboxFilterScreen(props: {
  opened: boolean
  bookmarked: boolean
  archived: boolean
  availableSenders: DocumentsV2Sender[]
  availableCategories: DocumentsV2Category[]
  selectedSendersIncoming: string[]
  selectedCategoriesIncoming: string[]
  componentId: string
}) {
  useConnectivityIndicator({ componentId: props.componentId })

  const intl = useIntl()
  const [opened, setOpened] = useState(props.opened)
  const [bookmarked, setBookmarked] = useState(props.bookmarked)
  const [archived, setArchived] = useState(props.archived)
  const [selectedSenders, setSelectedSenders] = useState<string[]>(
    props.selectedSendersIncoming ?? [],
  )
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    props.selectedCategoriesIncoming ?? [],
  )

  useNavigationOptions(props.componentId)

  useEffect(() => {
    Navigation.updateProps(ComponentRegistry.InboxScreen, {
      opened,
      bookmarked,
      archived,
      senderNationalId: selectedSenders,
      categoryIds: selectedCategories,
    })
  }, [opened, bookmarked, archived, selectedSenders, selectedCategories])

  return (
    <ScrollView style={{ flex: 1, marginTop: theme.spacing[3] }}>
      <CheckboxItem
        label={intl.formatMessage({
          id: 'inboxFilters.unreadOnly',
        })}
        checked={opened}
        onPress={() => {
          setOpened(!opened)
        }}
      />
      <CheckboxItem
        label={intl.formatMessage({
          id: 'inboxFilters.starred',
        })}
        checked={bookmarked}
        onPress={() => {
          setBookmarked(!bookmarked)
        }}
      />
      <CheckboxItem
        label={intl.formatMessage({
          id: 'inboxFilters.archived',
        })}
        checked={archived}
        onPress={() => {
          setArchived(!archived)
        }}
      />
      <Accordion>
        {props.availableSenders?.length ? (
          <AccordionItem
            key="organization"
            title={intl.formatMessage({ id: 'inbox.filterOrganizationTitle' })}
            startOpen={selectedSenders.length > 0}
          >
            {props.availableSenders.map((sender) => {
              return sender.name && sender.id ? (
                <CheckboxItem
                  key={sender.id}
                  label={sender.name}
                  checked={selectedSenders.includes(sender.id)}
                  onPress={() => {
                    if (selectedSenders.includes(sender.id!)) {
                      setSelectedSenders((prev) =>
                        prev.filter((id) => id !== sender.id),
                      )
                    } else {
                      setSelectedSenders((prev) => [...prev, sender.id!])
                    }
                  }}
                />
              ) : null
            })}
          </AccordionItem>
        ) : null}
        {props.availableCategories?.length ? (
          <AccordionItem
            key="category"
            title={intl.formatMessage({ id: 'inbox.filterCategoryTitle' })}
            startOpen={selectedCategories.length > 0}
          >
            {props.availableCategories.map((category) => {
              return category.name && category.id ? (
                <CheckboxItem
                  key={category.id}
                  label={category.name}
                  checked={selectedCategories.includes(category.id)}
                  onPress={() => {
                    if (selectedCategories.includes(category.id)) {
                      setSelectedCategories((prev) =>
                        prev.filter((id) => id !== category.id),
                      )
                    } else {
                      setSelectedCategories((prev) => [...prev, category.id])
                    }
                  }}
                />
              ) : null
            })}
          </AccordionItem>
        ) : null}

        <AccordionItem
          key="dates"
          title={intl.formatMessage({ id: 'inbox.filterDatesTitle' })}
        >
          <DatePickerInput
            label={intl.formatMessage({ id: 'inbox.filterDateFromLabel' })}
            placeholder={intl.formatMessage({
              id: 'inbox.filterDatePlaceholder',
            })}
          />
          <DatePickerInput
            label={intl.formatMessage({ id: 'inbox.filterDateToLabel' })}
            placeholder={intl.formatMessage({
              id: 'inbox.filterDatePlaceholder',
            })}
            maximumDate={new Date()}
          />
        </AccordionItem>
      </Accordion>
    </ScrollView>
  )
}

InboxFilterScreen.options = getNavigationOptions
