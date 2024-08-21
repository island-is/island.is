import {
  Accordion,
  AccordionItem,
  Button,
  CheckboxItem,
  DatePickerInput,
  theme,
} from '@ui'
import { useEffect, useState } from 'react'
import { useIntl } from 'react-intl'
import { ScrollView, View } from 'react-native'
import { Navigation } from 'react-native-navigation'
import { createNavigationOptionHooks } from '../../hooks/create-navigation-option-hooks'
import { useConnectivityIndicator } from '../../hooks/use-connectivity-indicator'
import {
  ButtonRegistry,
  ComponentRegistry,
} from '../../utils/component-registry'
import {
  DocumentsV2Category,
  DocumentsV2Sender,
} from '../../graphql/types/schema'
import styled from 'styled-components'
import { useNavigationButtonPress } from 'react-native-navigation-hooks'

const ButtonContainer = styled(View)`
  margin-left: ${({ theme }) => theme.spacing[2]}px;
  margin-right: ${({ theme }) => theme.spacing[2]}px;
  bottom: ${theme.spacing[2]}px;
`

const { useNavigationOptions, getNavigationOptions } =
  createNavigationOptionHooks((theme, intl) => ({
    topBar: {
      title: {
        text: intl.formatMessage({
          id: 'inboxFilters.screenTitle',
        }),
      },
      rightButtons: [],
    },
  }))

export function InboxFilterScreen(props: {
  opened: boolean
  bookmarked: boolean
  archived: boolean
  availableSenders: DocumentsV2Sender[]
  availableCategories: DocumentsV2Category[]
  selectedSenders: string[]
  selectedCategories: string[]
  dateFrom?: Date
  dateTo?: Date
  componentId: string
}) {
  useConnectivityIndicator({ componentId: props.componentId })

  const intl = useIntl()
  const [opened, setOpened] = useState(props.opened)
  const [bookmarked, setBookmarked] = useState(props.bookmarked)
  const [archived, setArchived] = useState(props.archived)
  const [selectedSenders, setSelectedSenders] = useState<string[]>(
    props.selectedSenders ?? [],
  )
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    props.selectedCategories ?? [],
  )
  const [dateFrom, setDateFrom] = useState<Date | undefined>(props.dateFrom)
  const [dateTo, setDateTo] = useState<Date | undefined>(props.dateTo)

  const clearAllFilters = () => {
    setOpened(false)
    setBookmarked(false)
    setArchived(false)
    setSelectedSenders([])
    setSelectedCategories([])
    setDateFrom(undefined)
    setDateTo(undefined)
  }

  const isSelected =
    opened ||
    bookmarked ||
    archived ||
    selectedSenders.length > 0 ||
    selectedCategories.length > 0 ||
    dateFrom ||
    dateTo

  useNavigationOptions(props.componentId)

  useNavigationButtonPress(({ buttonId }) => {
    if (buttonId === ButtonRegistry.InboxFilterClearButton) {
      clearAllFilters()
    }
  }, props.componentId)

  useEffect(() => {
    Navigation.updateProps(ComponentRegistry.InboxScreen, {
      opened,
      bookmarked,
      archived,
      senderNationalId: selectedSenders,
      categoryIds: selectedCategories,
      dateFrom,
      dateTo,
    })
  }, [
    opened,
    bookmarked,
    archived,
    selectedSenders,
    selectedCategories,
    dateFrom,
    dateTo,
  ])

  useEffect(() => {
    if (isSelected) {
      Navigation.mergeOptions(props.componentId, {
        topBar: {
          rightButtons: [
            {
              id: ButtonRegistry.InboxFilterClearButton,
              text: intl.formatMessage({
                id: 'inbox.filterClearButton',
              }),
            },
          ],
        },
      })
    } else {
      Navigation.mergeOptions(props.componentId, {
        topBar: {
          rightButtons: [],
        },
      })
    }
  }, [isSelected, props.componentId, intl])

  return (
    <View
      style={{
        flex: 1,
        marginTop: theme.spacing[3],
      }}
    >
      <ScrollView style={{ flex: 1, marginBottom: theme.spacing[3] }}>
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
              title={intl.formatMessage({
                id: 'inbox.filterOrganizationTitle',
              })}
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
            startOpen={!!dateFrom || !!dateTo}
          >
            <DatePickerInput
              label={intl.formatMessage({ id: 'inbox.filterDateFromLabel' })}
              placeholder={intl.formatMessage({
                id: 'inbox.filterDatePlaceholder',
              })}
              onSelectDate={(date) => setDateFrom(date)}
              selectedDate={dateFrom}
            />
            {/* <DatePickerInput
              label={intl.formatMessage({ id: 'inbox.filterDateToLabel' })}
              placeholder={intl.formatMessage({
                id: 'inbox.filterDatePlaceholder',
              })}
              maximumDate={new Date()}
              minimumDate={dateFrom}
              onSelectDate={(date) => setDateTo(date)}
              selectedDate={dateTo}
            /> */}
          </AccordionItem>
        </Accordion>
      </ScrollView>
      {isSelected && (
        <ButtonContainer>
          <Button
            title={intl.formatMessage({ id: 'inbox.filterApplyButton' })}
            onPress={() => {
              Navigation.pop(props.componentId)
            }}
          />
        </ButtonContainer>
      )}
    </View>
  )
}

InboxFilterScreen.options = getNavigationOptions
