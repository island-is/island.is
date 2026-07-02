import {
  Box,
  GridRow,
  GridColumn,
  Checkbox,
  type InputBackgroundColor,
} from '@island.is/island-ui/core'
import { Markdown } from '@island.is/shared/components'
import type {
  RadioOptionIntrospection,
  ResolvePreviewString,
  ScreenIntrospection,
} from '../../types/translationWorkspace'
import { noop } from '../../utils/translationWorkspaceFieldConstants'
import {
  fieldPreviewLayoutProps,
  resolveTranslatableStaticText,
} from '../../utils/translationWorkspaceStaticText'

export type CheckboxFieldLeafPreviewProps = {
  screen: ScreenIntrospection
  layout: ReturnType<typeof fieldPreviewLayoutProps>
  label: string
  resolvePreviewString: ResolvePreviewString
  previewValue?: string
}

export const CheckboxFieldLeafPreview = ({
  screen,
  layout,
  label,
  resolvePreviewString,
  previewValue,
}: CheckboxFieldLeafPreviewProps) => {
  const key = screen.id
  const options =
    screen.checkboxOptions && screen.checkboxOptions.length > 0
      ? screen.checkboxOptions
      : [
          {
            value: '1',
            labelDefaultMessage: label.trim() !== '' ? label : ' ',
          },
        ]

  const large = screen.checkboxLarge !== false
  const strong = screen.checkboxStrong === true
  const bgColor: InputBackgroundColor | undefined =
    large &&
    (screen.checkboxBackgroundColor === 'white' ||
      screen.checkboxBackgroundColor === 'blue')
      ? screen.checkboxBackgroundColor
      : large
      ? 'blue'
      : undefined

  const split = screen.width === 'half' ? ('1/2' as const) : ('1/1' as const)
  const spacing = screen.checkboxSpacing
  const spacingBottom: 0 | 1 | 2 =
    spacing === 0 || spacing === 1 || spacing === 2 ? spacing : 2

  const resolveOptionLabel = (opt: RadioOptionIntrospection) => {
    if (opt.labelMessageId) {
      return resolvePreviewString(opt.labelMessageId, opt.labelDefaultMessage)
    }
    return opt.labelDefaultMessage ?? opt.value
  }

  const descriptionResolved = screen.description
    ? resolveTranslatableStaticText(
        screen.description,
        screen.messageDescriptors,
        resolvePreviewString,
      ).trim()
    : ''

  return (
    <Box key={key} {...layout}>
      {descriptionResolved.length > 0 && (
        <Box marginBottom={1}>
          <Markdown>{descriptionResolved}</Markdown>
        </Box>
      )}
      <Box paddingTop={2}>
        <GridRow>
          {options.map((opt, index) => {
            const text = resolveOptionLabel(opt)
            return (
              <GridColumn
                key={`${key}-cb-${opt.value}-${index}`}
                span={['1/1', split]}
                paddingBottom={spacingBottom}
              >
                <Checkbox
                  large={large}
                  strong={strong}
                  backgroundColor={bgColor}
                  name={`${key}-${opt.value}`}
                  value={opt.value}
                  checked={previewValue === opt.value}
                  onChange={noop}
                  label={
                    <Markdown>{text.trim() === '' ? '\u00a0' : text}</Markdown>
                  }
                />
              </GridColumn>
            )
          })}
        </GridRow>
      </Box>
    </Box>
  )
}
