import {
  buildMultiField,
  buildSubSection,
  buildTextField,
} from '@island.is/application/core'

export const textInputSubsection = buildSubSection({
  id: 'textInput',
  title: 'Text Input',
  children: [
    buildMultiField({
      id: 'textInput',
      title: 'Text input',
      children: [
        buildTextField({
          id: 'textInput',
          placeholder: 'The most basic text input',
        }),
        buildTextField({
          id: 'textInputTitle',
          placeholder: 'The most basic text input',
          title: 'With a title',
        }),
        buildTextField({
          id: 'textInputMaxLength',
          placeholder: 'Max length 30',
          maxLength: 30,
          showMaxLength: true,
          title: 'Max length 30',
        }),
        buildTextField({
          id: 'halfTextInput',
          placeholder: 'Half width text input',
          width: 'half',
        }),
        buildTextField({
          id: 'rightAlignedTextInput',
          placeholder: 'Right aligned',
          width: 'half',
          rightAlign: true,
        }),
        buildTextField({
          id: 'readOnlyTextInput',
          defaultValue: 'Read only',
          width: 'half',
          readOnly: true,
        }),
        buildTextField({
          id: 'maxLengthTextInput',
          placeholder: 'Max length 3',
          width: 'half',
          maxLength: 3,
        }),
        buildTextField({
          id: 'formatTextInput',
          placeholder: 'Special format (kennitala)',
          format: '######-####',
        }),
        buildTextField({
          id: 'whiteBackgroundTextInput',
          placeholder: 'White background (try to use blue if possible)',
          backgroundColor: 'white',
        }),
        buildTextField({
          id: 'textTextInput',
          placeholder: 'Variant text (same as default)',
          variant: 'text',
          width: 'half',
        }),
        buildTextField({
          id: 'emailTextInput',
          placeholder: 'Variant email',
          variant: 'email',
          width: 'half',
        }),
        buildTextField({
          id: 'numberTextInput',
          placeholder: 'Variant number',
          variant: 'number',
          width: 'half',
        }),
        buildTextField({
          id: 'currencyTextInput',
          placeholder: 'Variant currency',
          variant: 'currency',
          width: 'half',
        }),
        buildTextField({
          id: 'currencyTextInput2',
          placeholder: 'Variant currency ($)',
          variant: 'currency',
          width: 'half',
          suffix: ' $',
        }),
        buildTextField({
          id: 'currencyTextInput3',
          placeholder: 'Variant currency (€)',
          variant: 'currency',
          width: 'half',
          suffix: ' €',
        }),
        buildTextField({
          id: 'telTextInput',
          placeholder: 'Variant tel (try to use buildPhoneField)',
          variant: 'tel',
        }),
        buildTextField({
          id: 'textAreaTextInput',
          placeholder: 'Textarea',
          variant: 'textarea',
          rows: 10,
          maxLength: 100,
          showMaxLength: true,
        }),
      ],
    }),
  ],
})
