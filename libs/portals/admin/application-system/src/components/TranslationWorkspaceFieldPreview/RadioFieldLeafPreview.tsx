import { useEffect, useState } from 'react'
import {
  Box,
  Text,
  GridRow,
  GridColumn,
  RadioButton,
  type InputBackgroundColor,
} from '@island.is/island-ui/core'
import { Markdown } from '@island.is/shared/components'
import type {
  RadioOptionIntrospection,
  ResolvePreviewString,
  ScreenIntrospection,
} from '../../types/translationWorkspace'
import { fieldPreviewLayoutProps } from '../../utils/translationWorkspaceStaticText'

export type RadioFieldLeafPreviewProps = {
  screen: ScreenIntrospection
  layout: ReturnType<typeof fieldPreviewLayoutProps>
  label: string
  resolvePreviewString: ResolvePreviewString
  previewValue?: string
}

export const RadioFieldLeafPreview = ({
  screen,
  layout,
  label,
  resolvePreviewString,
  previewValue,
}: RadioFieldLeafPreviewProps) => {
  const key = screen.id
  const fallbackOptions: RadioOptionIntrospection[] = [
    { value: '1', labelDefaultMessage: 'Option 1' },
    { value: '2', labelDefaultMessage: 'Option 2' },
  ]
  const options =
    screen.radioOptions && screen.radioOptions.length > 0
      ? screen.radioOptions
      : fallbackOptions

  const large = screen.radioLargeButtons !== false
  const bgColor: InputBackgroundColor | undefined =
    large &&
    (screen.radioBackgroundColor === 'white' ||
      screen.radioBackgroundColor === 'blue')
      ? screen.radioBackgroundColor
      : large
      ? 'blue'
      : undefined

  const split = screen.width === 'half' ? ('1/2' as const) : ('1/1' as const)

  const [selected, setSelected] = useState(previewValue ?? '')

  useEffect(() => {
    if (previewValue !== undefined) {
      setSelected(previewValue)
    }
  }, [previewValue])

  const resolveOptionLabel = (opt: RadioOptionIntrospection) => {
    if (opt.labelMessageId) {
      return resolvePreviewString(opt.labelMessageId, opt.labelDefaultMessage)
    }
    return opt.labelDefaultMessage ?? opt.value
  }

  return (
    <Box key={key} {...layout}>
      {label.trim() !== '' && (
        <Text variant="small" fontWeight="semiBold" marginBottom={1}>
          {label}
        </Text>
      )}
      <Box paddingTop={2}>
        <GridRow>
          {options.map((opt, index) => {
            const optionLabel = resolveOptionLabel(opt)
            return (
              <GridColumn
                key={`${key}-${opt.value}-${index}`}
                span={['1/1', split]}
                paddingBottom={2}
                paddingTop={0}
              >
                <RadioButton
                  large={large}
                  backgroundColor={bgColor}
                  name={key}
                  label={
                    <Markdown>
                      {optionLabel.trim() === '' ? '\u00a0' : optionLabel}
                    </Markdown>
                  }
                  value={opt.value}
                  checked={opt.value === selected}
                  onChange={({ target }) => setSelected(String(target.value))}
                />
              </GridColumn>
            )
          })}
        </GridRow>
      </Box>
    </Box>
  )
}
