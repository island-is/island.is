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
          title: '',
          placeholder: 'The most basic text input',
        }),
        buildTextField({
          id: 'halfTextInput',
          title: '',
          placeholder: 'Half width text input',
          width: 'half',
        }),
        buildTextField({
          id: 'rightAlignedTextInput',
          title: '',
          placeholder: 'Right aligned',
          width: 'half',
          rightAlign: true,
        }),
        buildTextField({
          id: 'readOnlydTextInput',
          title: '',
          defaultValue: 'Read only',
          width: 'half',
          readOnly: true,
        }),
        buildTextField({
          id: 'maxLengthTextInput',
          title: '',
          placeholder: 'Max length 3',
          width: 'half',
          maxLength: 3,
        }),
        buildTextField({
          id: 'formatTextInput',
          title: '',
          placeholder: 'Special format (kennitala)',
          format: '######-####',
        }),
        buildTextField({
          id: 'whiteBackgroundTextInput',
          title: '',
          placeholder: 'White background (try to use blue if possible)',
          backgroundColor: 'white',
        }),
        buildTextField({
          id: 'textTextInput',
          title: '',
          placeholder: 'Variant text (same as default)',
          variant: 'text',
          width: 'half',
        }),
        buildTextField({
          id: 'emailTextInput',
          title: '',
          placeholder: 'Variant email',
          variant: 'email',
          width: 'half',
        }),
        buildTextField({
          id: 'numberTextInput',
          title: '',
          placeholder: 'Variant number',
          variant: 'number',
          width: 'half',
        }),
        buildTextField({
          id: 'currencyTextInput',
          title: '',
          placeholder: 'Variant currency',
          variant: 'currency',
          width: 'half',
        }),
        buildTextField({
          id: 'currencyTextInput',
          title: '',
          placeholder: 'Variant currency ($)',
          variant: 'currency',
          width: 'half',
          suffix: ' $',
        }),
        buildTextField({
          id: 'currencyTextInput',
          title: '',
          placeholder: 'Variant currency (€)',
          variant: 'currency',
          width: 'half',
          suffix: ' €',
        }),
        buildTextField({
          id: 'telTextInput',
          title: '',
          placeholder: 'Variant tel (try to use buildPhoneField)',
          variant: 'tel',
        }),
        buildTextField({
          id: 'textAreaTextInput',
          title: '',
          placeholder: 'Textarea',
          variant: 'textarea',
          rows: 10,
        }),
      ],
    }),
  ],
})
