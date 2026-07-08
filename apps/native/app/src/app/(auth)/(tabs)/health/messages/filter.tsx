import { useCallback, useState } from 'react'
import { useIntl } from 'react-intl'
import { Pressable, SafeAreaView, ScrollView, View } from 'react-native'
import { router } from 'expo-router'
import styled from 'styled-components'

import { Button, theme, Typography } from '@/ui'
import { FilteringCheckbox } from '@/components/filtering-checkbox'
import {
  healthMessagesFilterStore,
  useHealthMessagesFilterStore,
} from '@/stores/health-messages-filter-store'
import { StackScreen } from '@/components/stack-screen'

const ButtonContainer = styled(View)`
  margin-left: ${({ theme }) => theme.spacing[2]}px;
  margin-right: ${({ theme }) => theme.spacing[2]}px;
  bottom: ${theme.spacing[2]}px;
`

export default function HealthMessagesFilterScreen() {
  const intl = useIntl()
  const store = useHealthMessagesFilterStore()

  // Local editing state (initialized from store)
  const [starred, setStarred] = useState(store.starred)
  const [archived, setArchived] = useState(store.archived)

  const clearAllFilters = () => {
    setStarred(false)
    setArchived(false)
  }

  const isSelected = starred || archived

  // Whether the store currently has filters applied. When true, the Apply
  // button must remain available even if the user has cleared the local state,
  // so they can commit the cleared state back to the store.
  const hasAppliedFilters = store.starred || store.archived

  const onApplyFilters = useCallback(() => {
    healthMessagesFilterStore.setState({
      starred,
      archived,
    })
    router.back()
  }, [starred, archived])

  return (
    <SafeAreaView style={{ flex: 1, marginTop: theme.spacing[3] }}>
      <StackScreen
        options={{
          title: intl.formatMessage({
            id: 'health.messages.filter.screenTitle',
          }),
          headerTitleAlign: 'center',
          // Rendered via `headerRight` instead of `headerRightItems`: the
          // native items API breaks title centering on iOS.
          headerRight: () => (
            <Pressable
              onPress={clearAllFilters}
              disabled={!isSelected}
              style={{
                height: 46,
                justifyContent: 'center',
                paddingHorizontal: theme.spacing[1],
              }}
            >
              <Typography
                size={15}
                weight="400"
                color={isSelected ? theme.color.blue400 : theme.color.dark300}
              >
                {intl.formatMessage({ id: 'inbox.filterClearButton' })}
              </Typography>
            </Pressable>
          ),
        }}
      />
      <ScrollView style={{ flex: 1, marginBottom: theme.spacing[3] }}>
        <FilteringCheckbox
          label={intl.formatMessage({ id: 'inboxFilters.starred' })}
          checked={starred}
          onPress={() => setStarred(!starred)}
        />
        <FilteringCheckbox
          label={intl.formatMessage({ id: 'inboxFilters.archived' })}
          checked={archived}
          onPress={() => setArchived(!archived)}
        />
      </ScrollView>
      {(isSelected || hasAppliedFilters) && (
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
