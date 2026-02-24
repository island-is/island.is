import { useCallback, useState } from 'react'
import { useIntl } from 'react-intl'
import { SafeAreaView, ScrollView, Text, TouchableOpacity, View } from 'react-native'
import { router, Stack } from 'expo-router'
import styled from 'styled-components'

import {
  Accordion,
  AccordionItem,
  Button,
  DatePickerInput,
  blue400,
  theme,
} from '@/ui'
import { FilteringCheckbox } from '@/screens/inbox/components/filtering-checkbox'
import { inboxFilterStore, useInboxFilterStore } from '@/stores/inbox-filter-store'

const ButtonContainer = styled(View)`
  margin-left: ${({ theme }) => theme.spacing[2]}px;
  margin-right: ${({ theme }) => theme.spacing[2]}px;
  bottom: ${theme.spacing[2]}px;
`

const DatePickerContainer = styled(View)`
  margin-horizontal: ${({ theme }) => theme.spacing[2]}px;
  gap: ${({ theme }) => theme.spacing[2]}px;
`

export default function FilterScreen() {
  const intl = useIntl()
  const store = useInboxFilterStore()

  // Local editing state (initialized from store)
  const [opened, setOpened] = useState(store.opened)
  const [bookmarked, setBookmarked] = useState(store.bookmarked)
  const [archived, setArchived] = useState(store.archived)
  const [selectedSenders, setSelectedSenders] = useState(
    store.senderNationalId,
  )
  const [selectedCategories, setSelectedCategories] = useState(
    store.categoryIds,
  )
  const [dateFrom, setDateFrom] = useState(store.dateFrom)
  const [dateTo, setDateTo] = useState(store.dateTo)

  const clearAllFilters = () => {
    setOpened(false)
    setBookmarked(false)
    setArchived(false)
    setSelectedSenders([])
    setSelectedCategories([])
    setDateFrom(undefined)
    setDateTo(undefined)
  }

  const isSelected = !!(
    opened ||
    bookmarked ||
    archived ||
    selectedSenders.length ||
    selectedCategories.length ||
    dateFrom ||
    dateTo
  )

  const onApplyFilters = useCallback(() => {
    inboxFilterStore.setState({
      opened,
      bookmarked,
      archived,
      senderNationalId: selectedSenders,
      categoryIds: selectedCategories,
      dateFrom,
      dateTo,
    })
    router.back()
  }, [
    opened,
    bookmarked,
    archived,
    selectedSenders,
    selectedCategories,
    dateFrom,
    dateTo,
  ])

  return (
    <SafeAreaView style={{ flex: 1, marginTop: theme.spacing[3] }}>
      <Stack.Screen
        options={{
          title: intl.formatMessage({ id: 'inboxFilters.screenTitle' }),
          headerRight: isSelected
            ? () => (
                <TouchableOpacity onPress={clearAllFilters}>
                  <Text style={{ color: blue400, fontSize: 16 }}>
                    {intl.formatMessage({ id: 'inbox.filterClearButton' })}
                  </Text>
                </TouchableOpacity>
              )
            : undefined,
        }}
      />
      <ScrollView style={{ flex: 1, marginBottom: theme.spacing[3] }}>
        <FilteringCheckbox
          label={intl.formatMessage({ id: 'inboxFilters.unreadOnly' })}
          checked={opened}
          onPress={() => setOpened(!opened)}
        />
        <FilteringCheckbox
          label={intl.formatMessage({ id: 'inboxFilters.starred' })}
          checked={bookmarked}
          onPress={() => setBookmarked(!bookmarked)}
        />
        <FilteringCheckbox
          label={intl.formatMessage({ id: 'inboxFilters.archived' })}
          checked={archived}
          onPress={() => setArchived(!archived)}
        />
        <Accordion>
          {store.availableSenders?.length ? (
            <AccordionItem
              key="organization"
              title={intl.formatMessage({
                id: 'inbox.filterOrganizationTitle',
              })}
              startOpen={selectedSenders.length > 0}
            >
              {store.availableSenders.map(({ name, id }) =>
                name && id ? (
                  <FilteringCheckbox
                    key={id}
                    label={name}
                    checked={selectedSenders.includes(id)}
                    onPress={() => {
                      if (selectedSenders.includes(id)) {
                        setSelectedSenders((prev) =>
                          prev.filter((s) => s !== id),
                        )
                      } else {
                        setSelectedSenders((prev) => [...prev, id])
                      }
                    }}
                  />
                ) : null,
              )}
            </AccordionItem>
          ) : null}
          {store.availableCategories?.length ? (
            <AccordionItem
              key="category"
              title={intl.formatMessage({ id: 'inbox.filterCategoryTitle' })}
              startOpen={selectedCategories.length > 0}
            >
              {store.availableCategories.map(({ name, id }) =>
                name && id ? (
                  <FilteringCheckbox
                    key={id}
                    label={name}
                    checked={selectedCategories.includes(id)}
                    onPress={() => {
                      if (selectedCategories.includes(id)) {
                        setSelectedCategories((prev) =>
                          prev.filter((c) => c !== id),
                        )
                      } else {
                        setSelectedCategories((prev) => [...prev, id])
                      }
                    }}
                  />
                ) : null,
              )}
            </AccordionItem>
          ) : null}
          <AccordionItem
            key="dates"
            title={intl.formatMessage({ id: 'inbox.filterDatesTitle' })}
            startOpen={!!dateFrom || !!dateTo}
          >
            <DatePickerContainer>
              <DatePickerInput
                label={intl.formatMessage({
                  id: 'inbox.filterDateFromLabel',
                })}
                placeholder={intl.formatMessage({
                  id: 'inbox.filterDatePlaceholder',
                })}
                onSelectDate={setDateFrom}
                selectedDate={dateFrom}
              />
              <DatePickerInput
                label={intl.formatMessage({
                  id: 'inbox.filterDateToLabel',
                })}
                placeholder={intl.formatMessage({
                  id: 'inbox.filterDatePlaceholder',
                })}
                maximumDate={new Date()}
                minimumDate={dateFrom}
                onSelectDate={setDateTo}
                selectedDate={dateTo}
              />
            </DatePickerContainer>
          </AccordionItem>
        </Accordion>
      </ScrollView>
      {isSelected && (
        <ButtonContainer>
          <Button
            title={intl.formatMessage({ id: 'inbox.filterApplyButton' })}
            onPress={onApplyFilters}
          />
        </ButtonContainer>
      )}
    </SafeAreaView>
  )
}
