import { SearchBar } from '@island.is/island-ui-native'
import React from 'react'
import { useIntl } from '../../lib/intl'
import styled from 'styled-components/native'
import { I18nProvider } from '../../contexts/i18n-provider'
import { ThemeProvider } from '../../contexts/theme-provider'
import { uiStore, useUiStore } from '../../stores/ui-store'

interface NavigationBarTitleProps {
  title: string
}

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

const SearchBarComponent = ({ query, placeholder }: { query: string, placeholder: string }) => (
  <Host>
    <Container>
      <SearchBar
        value={query}
        onChangeText={(text) => uiStore.setState({ query: text })}
        onCancelPress={() => uiStore.setState({ query: '' })}
        placeholder={placeholder}
        returnKeyType="search"
      />
    </Container>
  </Host>
)

export const AndroidSearchBar = () => {
  const { query } = useUiStore()
  const intl = useIntl()
  return (
    <I18nProvider>
      <ThemeProvider>
        <SearchBarComponent query={query} placeholder={intl.formatMessage({ id: 'inbox.searchPlaceholder' })} />
      </ThemeProvider>
    </I18nProvider>
  )
}
