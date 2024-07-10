import {
  Accordion,
  AccordionItem,
  CheckboxItem,
  TableViewCell,
  theme,
} from '@ui'
import { useEffect, useState } from 'react'
import { useIntl } from 'react-intl'
import { Platform, ScrollView, Switch, Text } from 'react-native'
import { Navigation } from 'react-native-navigation'
import { PressableHighlight } from '../../components/pressable-highlight/pressable-highlight'
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
  senders: DocumentsV2Sender[]
  categories: DocumentsV2Category[]
  componentId: string
}) {
  useConnectivityIndicator({ componentId: props.componentId })

  const intl = useIntl()
  const [opened, setOpened] = useState(props.opened)
  const [bookmarked, setBookmarked] = useState(props.bookmarked)
  const [archived, setArchived] = useState(props.archived)
  const [selectedSenders, setSelectedSenders] = useState<string[]>([])
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])

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
    <ScrollView style={{ flex: 1 }}>
      <PressableHighlight
        onPress={() => {
          setOpened(!opened)
        }}
      >
        <TableViewCell
          title={intl.formatMessage({
            id: 'inboxFilters.unreadOnly',
          })}
          accessory={
            <Switch
              value={opened}
              onValueChange={() => setOpened(!opened)}
              thumbColor={Platform.select({ android: theme.color.dark100 })}
              trackColor={{
                false: theme.color.dark200,
                true: theme.color.blue400,
              }}
            />
          }
          border
        />
      </PressableHighlight>
      <PressableHighlight
        onPress={() => {
          setBookmarked(!bookmarked)
        }}
      >
        <TableViewCell
          title={intl.formatMessage({
            id: 'inboxFilters.starred',
          })}
          accessory={
            <Switch
              value={bookmarked}
              onValueChange={() => setBookmarked(!bookmarked)}
              thumbColor={Platform.select({ android: theme.color.dark100 })}
              trackColor={{
                false: theme.color.dark200,
                true: theme.color.blue400,
              }}
            />
          }
          border
        />
      </PressableHighlight>
      <PressableHighlight
        onPress={() => {
          setArchived(!archived)
        }}
      >
        <TableViewCell
          title={intl.formatMessage({
            id: 'inboxFilters.archived',
          })}
          accessory={
            <Switch
              value={archived}
              onValueChange={() => setArchived(!archived)}
              thumbColor={Platform.select({ android: theme.color.dark100 })}
              trackColor={{
                false: theme.color.dark200,
                true: theme.color.blue400,
              }}
            />
          }
        />
      </PressableHighlight>
      <Accordion>
        {props.senders?.length ? (
          <AccordionItem
            key="organization"
            title={intl.formatMessage({ id: 'inbox.filterOrganizationTitle' })}
          >
            {props.senders.map((sender) => {
              return sender.name && sender.id ? (
                <CheckboxItem key={sender.id} label={sender.name} />
              ) : null
            })}
          </AccordionItem>
        ) : null}
        {props.categories?.length ? (
          <AccordionItem
            key="category"
            title={intl.formatMessage({ id: 'inbox.filterCategoryTitle' })}
          >
            {props.categories.map((category) => {
              return category.name && category.id ? (
                <CheckboxItem key={category.id} label={category.name} />
              ) : null
            })}
          </AccordionItem>
        ) : null}

        <AccordionItem
          key="dates"
          title={intl.formatMessage({ id: 'inbox.filterDatesTitle' })}
        >
          <Text>Dates here</Text>
        </AccordionItem>
      </Accordion>
    </ScrollView>
  )
}

InboxFilterScreen.options = getNavigationOptions
