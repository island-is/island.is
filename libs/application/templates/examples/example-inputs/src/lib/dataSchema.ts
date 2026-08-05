import { z } from 'zod'

const nationalIdWithNameSchema = z.object({
  nationalId: z.string().optional(),
  name: z.string().optional(),
})

const nationalIdWithNameWithContactSchema = nationalIdWithNameSchema.extend({
  phone: z.string().optional(),
  email: z.string().optional(),
})

const uploadFileSchema = z.object({
  name: z.string().optional(),
  key: z.string().optional(),
})

const bankAccountSchema = z.object({
  bankNumber: z.string().optional(),
  ledger: z.string().optional(),
  accountNumber: z.string().optional(),
})

const radioEnum = z.enum(['radio1', 'radio2', 'radio3'])
const selectEnum = z.enum(['select1', 'select2', 'select3'])
const checkboxEnum = z.enum(['checkbox1', 'checkbox2', 'checkbox3'])

export const dataSchema = z.object({
  // Prerequisites
  approveExternalData: z.boolean().refine((v) => v),

  // Simple inputs - text
  textInput: z.string().optional(),
  textInputTitle: z.string().optional(),
  textInputMaxLength: z.string().optional(),
  halfTextInput: z.string().optional(),
  rightAlignedTextInput: z.string().optional(),
  readOnlyTextInput: z.string().optional(),
  maxLengthTextInput: z.string().optional(),
  formatTextInput: z.string().optional(),
  whiteBackgroundTextInput: z.string().optional(),
  textTextInput: z.string().optional(),
  emailTextInput: z.string().optional(),
  numberTextInput: z.string().optional(),
  currencyTextInput: z.string().optional(),
  currencyTextInput2: z.string().optional(),
  currencyTextInput3: z.string().optional(),
  telTextInput: z.string().optional(),
  textAreaTextInput: z.string().optional(),

  // Simple inputs - display (computed but stored)
  input1: z.string().optional(),
  input2: z.string().optional(),
  input3: z.string().optional(),
  displayField: z.string().optional(),
  input4: z.string().optional(),
  radioFieldForDisplayField: z.enum(['1', '2', '3', 'other']).optional(),
  displayField2: z.string().optional(),

  // Simple inputs - radio
  radio: radioEnum.optional(),
  halfRadio: radioEnum.optional(),
  smallButtonsRadio: radioEnum.optional(),
  radioIllustrations: radioEnum.optional(),
  defaultRadio: radioEnum.optional(),
  WhiteBackgroundRadio: radioEnum.optional(),

  // Simple inputs - checkbox
  checkbox: z.array(checkboxEnum).optional(),
  checkboxHalf: z.array(checkboxEnum).optional(),
  checkboxHalfStrong: z.array(checkboxEnum).optional(),

  // Simple inputs - select
  select: selectEnum.optional(),
  halfSelect: selectEnum.optional(),
  whiteSelect: selectEnum.optional(),
  placeholderSelect: selectEnum.optional(),
  multiSelect: z.array(selectEnum).optional(),

  // Simple inputs - async select
  asyncSelect: z.string().optional(),
  asyncSelectSearchable: z.string().optional(),
  asyncSelectMulti: z.array(z.string()).optional(),
  primaryAsyncSelect: z.string().optional(),
  dependentAsyncSelect: z.string().optional(),

  // Simple inputs - company search
  companySearch: z
    .object({
      nationalId: z.string().optional(),
      label: z.string().optional(),
      isat: z.string().optional(),
      validEmployer: z.boolean().optional(),
    })
    .optional(),
  companySearchShouldIncludeIsatNumber: z
    .object({
      nationalId: z.string().optional(),
      label: z.string().optional(),
      isat: z.string().optional(),
      validEmployer: z.boolean().optional(),
    })
    .optional(),
  companySearchCheckIfEmployerIsOnForbiddenList: z
    .object({
      nationalId: z.string().optional(),
      label: z.string().optional(),
      validEmployer: z.boolean().optional(),
    })
    .optional(),

  // Simple inputs - phone
  phone: z.string().optional(),
  halfPhone: z.string().optional(),
  whitePhone: z.string().optional(),
  placeholderPhone: z.string().optional(),
  countrySelectPhone: z.string().optional(),
  countrySelectOnlyAllowedPhone: z.string().optional(),

  // Simple inputs - date
  date: z.string().optional(),
  halfDate: z.string().optional(),
  minAndMaxDate: z.string().optional(),
  whiteDate: z.string().optional(),
  placeholderDate: z.string().optional(),
  readOnlyDate: z.string().optional(),
  dateRangeFrom: z.string().optional(),
  dateRangeTo: z.string().optional(),

  // Simple inputs - file upload
  fileUpload: z.array(uploadFileSchema).optional(),

  // Simple inputs - slider (number by default; string for saveAsString)
  basicSlider: z.union([z.number(), z.string()]).optional(),
  basicSliderWithDefaultBackground: z
    .union([z.number(), z.string()])
    .optional(),
  basicSliderWithCustomBackground: z.union([z.number(), z.string()]).optional(),
  basicSliderTooltip: z.union([z.number(), z.string()]).optional(),
  thickSliderTooltip: z.union([z.number(), z.string()]).optional(),
  basicSliderColorLabels: z.union([z.number(), z.string()]).optional(),
  basicSliderColorLabelsAndTooltip: z
    .union([z.number(), z.string()])
    .optional(),
  basicSliderColorMinMaxLabels: z.union([z.number(), z.string()]).optional(),
  basicSliderColorMinMaxLabelsTooltip: z
    .union([z.number(), z.string()])
    .optional(),
  basicSliderColorBothLabels: z.union([z.number(), z.string()]).optional(),
  basicSliderAllLabels: z.union([z.number(), z.string()]).optional(),
  basicSliderAllLabelsDefaultValue: z
    .union([z.number(), z.string()])
    .optional(),

  // Composite - nationalIdWithName
  nationalIdWithNameField1: nationalIdWithNameSchema.optional(),
  nationalIdWithNameField2: nationalIdWithNameSchema.optional(),
  nationalIdWithNameField3: nationalIdWithNameWithContactSchema.optional(),

  // Composite - applicant info
  applicant: z
    .object({
      name: z.string().optional(),
      nationalId: z.string().optional(),
      address: z.string().optional(),
      postalCode: z.string().optional(),
      city: z.string().optional(),
      email: z.string().email().optional(),
      phoneNumber: z.string().optional(),
    })
    .optional(),

  // Composite - bank account
  bankAccountfield: bankAccountSchema.optional(),

  // Composite - vehicle permno with info
  vehicle: z
    .object({
      permno: z.string().optional(),
      makeAndColor: z.string().optional(),
      numberOfAxles: z.number().optional(),
      hasError: z.boolean().optional(),
    })
    .optional(),

  // Tables & repeaters - tableRepeater
  tableRepeater: z
    .array(
      z.object({
        input: z.string().min(1),
        select: z.string().optional(),
        radio: z.enum(['option1', 'option2', 'option3']).optional(),
        checkbox: z.array(z.enum(['option1', 'option2'])).optional(),
        date: z.string().optional(),
        nationalIdWithName: nationalIdWithNameSchema.optional(),
        phone: z.string().optional(),
        selectAsyncPrimary: z.string().optional(),
        selectAsyncReliant: z.string().optional(),
      }),
    )
    .optional(),

  // Tables & repeaters - fieldsRepeater
  fieldsRepeater: z
    .array(
      z.object({
        input: z.string().optional(),
        select: z.string().optional(),
        radio: z.enum(['option1', 'option2', 'option3']).optional(),
        checkbox: z.array(z.enum(['option1', 'option2'])).optional(),
        date: z.string().optional(),
        nationalIdWithName: nationalIdWithNameSchema.optional(),
        phone: z.string().optional(),
        selectAsyncPrimary: z.string().optional(),
        selectAsyncReliant: z.string().optional(),
      }),
    )
    .optional(),
})

export type ExampleFieldsAnswers = z.TypeOf<typeof dataSchema>
