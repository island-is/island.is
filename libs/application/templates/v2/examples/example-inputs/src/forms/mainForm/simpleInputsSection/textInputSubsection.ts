import { SubSectionBuilder } from '@island.is/application/core'

export const textInputSubsection = new SubSectionBuilder(
  'textInput',
  'Text Input',
)
  .addPage('textInput', 'Text input', (page) => {
    page
      .addTextField('textInput', '', {
        placeholder: 'The most basic text input',
      })
      .addTextField('textInputTitle', 'With a title', {
        placeholder: 'The most basic text input',
      })
      .addTextField('textInputMaxLength', 'Max length 30', {
        placeholder: 'Max length 30',
        maxLength: 30,
        showMaxLength: true,
      })
      .addTextField('halfTextInput', '', {
        placeholder: 'Half width text input',
        width: 'half',
      })
      .addTextField('rightAlignedTextInput', '', {
        placeholder: 'Right aligned',
        width: 'half',
        rightAlign: true,
      })
      .addTextField('readOnlyTextInput', '', {
        defaultValue: 'Read only',
        width: 'half',
        readOnly: true,
      })
      .addTextField('maxLengthTextInput', '', {
        placeholder: 'Max length 3',
        width: 'half',
        maxLength: 3,
      })
      .addTextField('formatTextInput', '', {
        placeholder: 'Special format (kennitala)',
        format: '######-####',
      })
      .addTextField('whiteBackgroundTextInput', '', {
        placeholder: 'White background (try to use blue if possible)',
        backgroundColor: 'white',
      })
      .addTextField('textTextInput', '', {
        placeholder: 'Variant text (same as default)',
        variant: 'text',
        width: 'half',
      })
      .addTextField('emailTextInput', '', {
        placeholder: 'Variant email',
        variant: 'email',
        width: 'half',
      })
      .addTextField('numberTextInput', '', {
        placeholder: 'Variant number',
        variant: 'number',
        width: 'half',
      })
      .addTextField('currencyTextInput', '', {
        placeholder: 'Variant currency',
        variant: 'currency',
        width: 'half',
      })
      .addTextField('currencyTextInput2', '', {
        placeholder: 'Variant currency ($)',
        variant: 'currency',
        width: 'half',
        suffix: ' $',
      })
      .addTextField('currencyTextInput3', '', {
        placeholder: 'Variant currency (€)',
        variant: 'currency',
        width: 'half',
        suffix: ' €',
      })
      .addTextField('telTextInput', '', {
        placeholder: 'Variant tel (try to use buildPhoneField)',
        variant: 'tel',
      })
      .addTextField('textAreaTextInput', '', {
        placeholder: 'Textarea',
        variant: 'textarea',
        rows: 10,
        maxLength: 100,
        showMaxLength: true,
      })
  })
  .build()
