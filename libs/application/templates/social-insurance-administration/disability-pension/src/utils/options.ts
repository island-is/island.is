import { MessageDescriptor } from 'react-intl'

export const generateChildrenOptions = (
  m: Record<string, Record<string, MessageDescriptor>>,
) => [
  {
    value: 'Engin',
    label: m.questions.childrenCountZero,
  },
  {
    value: '1',
    label: m.questions.childrenCountOne,
  },
  {
    value: '2',
    label: m.questions.childrenCountTwo,
  },
  {
    value: '3',
    label: m.questions.childrenCountThree,
  },
  {
    value: '4',
    label: m.questions.childrenCountFour,
  },
  {
    value: '5',
    label: m.questions.childrenCountFive,
  },
  {
    value: '6+',
    label: m.questions.childrenCountSixOrMore,
  },
]

export const generateIcelandicCapabilityOptions = (
  m: Record<string, Record<string, MessageDescriptor>>,
) => [
  {
    value: '0',
    label: m.questions.icelandicCapabilityPoor,
  },
  {
    value: '1',
    label: m.questions.icelandicCapabilityFair,
  },
  {
    value: '2',
    label: m.questions.icelandicCapabilityGood,
  },
  {
    value: '3',
    label: m.questions.icelandicCapabilityVeryGood,
  },
]

export const generateEmploymentImportanceOptions = (
  m: Record<string, Record<string, MessageDescriptor>>,
) => [
  {
    value: '0',
    label: m.questions.employmentImportanceNotImportantAtAll,
  },
  {
    value: '1',
    label: m.questions.employmentImportanceNotImportant,
  },
  {
    value: '2',
    label: m.questions.employmentImportanceNeutral,
  },
  {
    value: '3',
    label: m.questions.employmentImportanceImportant,
  },
  {
    value: '4',
    label: m.questions.employmentImportanceVeryImportant,
  },
]
