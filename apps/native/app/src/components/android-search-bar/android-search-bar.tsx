import { SearchBar } from '@island.is/island-ui-native'
import React from 'react'
import styled from 'styled-components/native'
import { I18nProvider } from '../../contexts/i18n-provider'
import { ThemeProvider } from '../../contexts/theme-provider'
import { useIntl } from '../../lib/intl'
import { uiStore, useUiStore } from '../../stores/ui-store'

const Host = styled.View`
  height: 120px;
  background-color: ${(props) => props.theme.shade.background};
`

const Container = styled.View`
  flex: 1;
  margin-bottom: 4px;
  padding-top: 56px;
  padding-left: 10px;
  padding-right: 10px;
  background-color: ${(props) => props.theme.shade.background};
`

const SearchBarComponent = () => {
  const intl = useIntl()
  const { query } = useUiStore()
  return (
    <Host>
      <Container>
        <SearchBar
          value={query}
          onChangeText={(text) => uiStore.setState({ query: text })}
          onCancelPress={() => uiStore.setState({ query: '' })}
          placeholder={intl.formatMessage({ id: 'inbox.searchPlaceholder' })}
          returnKeyType="search"
        />
      </Container>
    </Host>
  );
}

export const AndroidSearchBar = () => {
  return (
    <I18nProvider>
      <ThemeProvider>
        <SearchBarComponent />
      </ThemeProvider>
    </I18nProvider>
  );
}
