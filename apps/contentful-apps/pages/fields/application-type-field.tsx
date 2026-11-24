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
    return sdk.field.onValueChanged((newValue) => setValue(newValue))
  }, [sdk.field, sdk.window])

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
