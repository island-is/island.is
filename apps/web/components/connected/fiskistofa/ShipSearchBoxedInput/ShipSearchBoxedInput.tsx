import { useState } from 'react'
import { useIntl } from 'react-intl'
import { useRouter } from 'next/router'

import {
  Box,
  BoxProps,
  Button,
  GridColumn,
  GridRow,
  Input,
  ResponsiveSpace,
  Stack,
  Text,
} from '@island.is/island-ui/core'
import { SpanType } from '@island.is/island-ui/core/types'
import { theme } from '@island.is/island-ui/theme'
import { shouldLinkOpenInNewWindow } from '@island.is/shared/utils'
import { useWindowSize } from '@island.is/web/hooks/useViewport'

import { translation as translationStrings } from './translation.strings'

const INPUT_COLUMN_SPAN: SpanType = [
  '12/12',
  '12/12',
  '12/12',
  '12/12',
  '10/12',
]
const SEARCH_BUTTON_COLUMN_SPAN: SpanType = [
  '12/12',
  '12/12',
  '12/12',
  '12/12',
  '2/12',
]
const SEARCH_BUTTON_JUSTIFY_CONTENT: BoxProps['justifyContent'] = [
  'flexEnd',
  'flexEnd',
  'flexEnd',
  'flexEnd',
  'flexStart',
]
const SEARCH_BUTTON_MARGIN_TOP: ResponsiveSpace = [3, 3, 3, 3, 0]

const ShipSearchBoxedInput = () => {
  const { width } = useWindowSize()
  const { formatMessage } = useIntl()
  const [searchValue, setSearchValue] = useState('')
  const router = useRouter()

  const search = () => {
    const searchValueIsNumber =
      !isNaN(Number(searchValue)) && searchValue.length > 0
    if (searchValueIsNumber) {
      const pathname = formatMessage(translationStrings.shipDetailsHref)
      const query = {
        ...router.query,
        [formatMessage(translationStrings.shipDetailsNumberQueryParam)]:
          searchValue,
        selectedTab: router.query?.selectedTab ?? 'skip',
      }

      const params = new URLSearchParams()

      for (const [name, value] of Object.entries(query)) {
        params.append(name, value as string)
      }

      const url = `${pathname}?${params}`

      window.open(
        url,
        shouldLinkOpenInNewWindow(pathname) ? '_blank' : '_self',
        'noopener,noreferrer',
      )
    } else {
      const query = { ...router.query, name: searchValue }
      router.push({
        pathname: formatMessage(translationStrings.shipSearchHref),
        query,
      })
    }
  }

  const label = formatMessage(translationStrings.label)
  const placeholder = formatMessage(translationStrings.placeholder)
  const title = formatMessage(translationStrings.title)
  const description = formatMessage(translationStrings.description)
  const searchButtonText = formatMessage(translationStrings.searcButtonText)

  return (
    <Box background="blue100" padding="containerGutter" borderRadius="default">
      <Stack space={2}>
        {title && <Text variant="h2">{title}</Text>}
        {description && (
          <Box marginBottom={2}>
            <Text>{description}</Text>
          </Box>
        )}

        <GridRow>
          <GridColumn span={INPUT_COLUMN_SPAN}>
            <Box>
              <Input
                value={searchValue}
                onChange={(ev) => {
                  setSearchValue(ev.target.value)
                }}
                size="md"
                placeholder={placeholder}
                name="fiskistofa-skipaleit"
                label={label}
                onKeyDown={(ev) => {
                  if (ev.key === 'Enter') {
                    search()
                  }
                }}
              />
            </Box>
          </GridColumn>
          <GridColumn span={SEARCH_BUTTON_COLUMN_SPAN}>
            <Box
              display="flex"
              justifyContent={SEARCH_BUTTON_JUSTIFY_CONTENT}
              height="full"
              alignItems="center"
              marginTop={SEARCH_BUTTON_MARGIN_TOP}
            >
              <Button fluid={width > theme.breakpoints.xl} onClick={search}>
                {searchButtonText}
              </Button>
            </Box>
          </GridColumn>
        </GridRow>
      </Stack>
    </Box>
  )
}

export default ShipSearchBoxedInput
