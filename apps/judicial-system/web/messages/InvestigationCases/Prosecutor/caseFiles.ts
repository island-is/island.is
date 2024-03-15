// TODO: DELETE THIS FILE
import { defineMessage, defineMessages } from 'react-intl'

export const icCaseFiles = {
  heading: defineMessage({
    id: 'judicial.system.investigation_cases:case_files.heading',
    defaultMessage: 'Rannsóknargögn',
    description:
      'Notaður sem titill á rannsóknargagna skrefi í rannsóknarheimildum.',
  }),
  sections: {
    files: defineMessages({
      heading: {
        id: 'judicial.system.investigation_cases:case_files.files.heading',
        defaultMessage: 'Rannsóknargögn',
        description:
          'Notaður sem titill fyrir "rannsóknargögn" hlutann á rannsóknargagna skrefi í rannsóknarheimildum.',
      },
      introduction: {
        id: 'judicial.system.investigation_cases:case_files.files.introduction',
        defaultMessage:
          'Gögnin í pakkanum hér fyrir neðan munu liggja frammi í þinghaldinu.',
        description:
          'Notaður sem skýring fyrir "rannsóknargögn" hlutann á rannsóknargagna skrefi í rannsóknarheimildum.',
      },
      label: {
        id: 'judicial.system.investigation_cases:case_files.files.label',
        defaultMessage: 'Dragðu skjöl hingað til að hlaða upp',
        description:
          'Notaður sem titill í "rannsóknargögn" skjalaboxi á rannsóknargagna skrefi í rannsóknarheimildum.',
      },
      buttonLabel: {
        id: 'judicial.system.investigation_cases:case_files.files.buttonLabel',
        defaultMessage: 'Velja skjöl til að hlaða upp',
        description:
          'Notaður sem titill í "velja gögn til að hlaða upp" takka á rannsóknargagna skrefi í rannsóknarheimildum.',
      },
    }),
    comments: defineMessages({
      heading: {
        id: 'judicial.system.investigation_cases:case_files.comments.heading',
        defaultMessage: 'Athugasemdir vegna rannsóknargagna',
        description:
          'Notaður sem titill fyrir "athugasemdir vegna rannsóknargagna" hlutann á rannsóknargagna skrefi í rannsóknarheimildum.',
      },
      tooltip: {
        id: 'judicial.system.investigation_cases:case_files.comments.tooltip',
        defaultMessage:
          'Hér er hægt að skrá athugasemdir til dómara og dómritara varðandi rannsóknargögnin.',
        description:
          'Notaður sem upplýsingatexti í upplýsingasvæði við "athugasemdir vegna rannsóknargagna" titil á rannsóknargagna skrefi í rannsóknarheimildum.',
      },
      label: {
        id: 'judicial.system.investigation_cases:case_files.comments.label',
        defaultMessage: 'Skilaboð',
        description:
          'Notaður sem titill í "skilaboð" textaboxi á rannsóknargagna skrefi í rannsóknarheimildum.',
      },
      placeholder: {
        id: 'judicial.system.investigation_cases:case_files.comments.placeholder',
        defaultMessage:
          'Er eitthvað sem þú vilt koma á framfæri við dómstólinn varðandi gögnin?',
        description:
          'Notaður sem skýritexti í "skilaboð" textaboxi á rannsóknargagna skrefi í rannsóknarheimildum.',
      },
    }),
  },
}
