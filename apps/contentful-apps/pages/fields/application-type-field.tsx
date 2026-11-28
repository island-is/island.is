import { useEffect, useMemo, useState } from 'react'
import { FieldExtensionSDK } from '@contentful/app-sdk'
import {
  Autocomplete,
  Button,
  Flex,
  Paragraph,
  Stack,
  Text,
} from '@contentful/f36-components'
import { useSDK } from '@contentful/react-apps-toolkit'

import { ApplicationConfigurations } from '@island.is/application/types'

const GLOBAL_APPLICATION_TYPE = '*'
// Room for the selected value, the input and the 300px option list
const OPEN_MENU_HEIGHT = 450

interface ApplicationTypeOption {
  typeId: string
  label: string
}

const OPTIONS: ApplicationTypeOption[] = [
  {
    typeId: GLOBAL_APPLICATION_TYPE,
    label: '* (All application types)',
  },
  ...Object.entries(ApplicationConfigurations)
    .map(([typeId, { slug }]) => ({
      typeId,
      label: `${typeId} (/umsoknir/${slug})`,
    }))
    .sort((a, b) => a.typeId.localeCompare(b.typeId)),
]

const ApplicationTypeField = () => {
  const sdk = useSDK<FieldExtensionSDK>()
  const [value, setValue] = useState<string | undefined>(sdk.field.getValue())
  const [filter, setFilter] = useState('')

  useEffect(() => {
    sdk.window.startAutoResizer()
    const detach = sdk.field.onValueChanged((newValue) => setValue(newValue))
    return () => {
      detach()
      sdk.window.stopAutoResizer()
    }
  }, [sdk.field, sdk.window])

  // The option list is rendered inside the iframe, so make the iframe tall enough while it is open
  const onMenuOpen = () => {
    sdk.window.stopAutoResizer()
    sdk.window.updateHeight(OPEN_MENU_HEIGHT)
  }

  const onMenuClose = () => {
    sdk.window.startAutoResizer()
  }

  const filteredOptions = useMemo(() => {
    const search = filter.trim().toLowerCase()
    return search
      ? OPTIONS.filter((option) => option.label.toLowerCase().includes(search))
      : OPTIONS
  }, [filter])

  const selectedOption = OPTIONS.find((option) => option.typeId === value)

  return (
    <Stack flexDirection="column" alignItems="flex-start" spacing="spacingS">
      {value && (
        <Flex alignItems="center" gap="spacingS">
          <Text fontWeight="fontWeightDemiBold">
            {selectedOption?.label ?? value}
          </Text>
          <Button
            size="small"
            variant="transparent"
            onClick={() => sdk.field.removeValue()}
          >
            Clear
          </Button>
        </Flex>
      )}
      {value && !selectedOption && (
        <Paragraph>
          This application type does not exist in the application system
        </Paragraph>
      )}
      <Autocomplete<ApplicationTypeOption>
        items={filteredOptions}
        onInputValueChange={setFilter}
        onOpen={onMenuOpen}
        onClose={onMenuClose}
        onSelectItem={(option) => sdk.field.setValue(option.typeId)}
        itemToString={(option) => option.label}
        renderItem={(option) => option.label}
        textOnAfterSelect="clear"
        placeholder="Search for an application type"
        listMaxHeight={300}
      />
    </Stack>
  )
}

export default ApplicationTypeField
