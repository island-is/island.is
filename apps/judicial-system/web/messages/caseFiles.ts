import { defineMessage, defineMessages } from 'react-intl'

// Strings for select court component
export const caseFiles = {
  heading: defineMessage({
    id: 'judicial.system:component.caseFiles.heading',
    defaultMessage: 'Rannsóknargögn',
    description: 'Case files component: Heading',
  }),
  description: defineMessages({
    heading: {
      id: 'judicial.system:component.caseFiles.description.heading',
      defaultMessage: 'Meðferð gagna',
      description: 'Case files component description: Heading',
    },
    list: {
      id: 'judicial.system:component.caseFiles.description.list#markdown',
      defaultMessage:
        '- Hér er hægt að hlaða upp rannsóknargögnum til að sýna dómara.\\n\\n- Gögnin eru eingöngu aðgengileg dómara í málinu og aðgengi að þeim lokast þegar dómari hefur úrskurðað.\\n\\n- Gögnin verða ekki lögð fyrir eða flutt í málakerfi dómstóls nema annar hvor aðilinn kæri úrskurðinn.',
      description: 'Case files component description: List',
    },
  }),
  files: defineMessages({
    heading: {
      id: 'judicial.system:component.caseFiles.files.heading',
      defaultMessage: 'Rannsóknargögn',
      description: 'Case files component files: Heading',
    },
    label: {
      id: 'judicial.system:component.caseFiles.files.label',
      defaultMessage: 'Dragðu skjöl hingað til að hlaða upp',
      description: 'Case files component files: Label',
    },
    buttonLabel: {
      id: 'judicial.system:component.caseFiles.files.buttonLabel',
      defaultMessage: 'Velja skjöl til að hlaða upp',
      description: 'Case files component files: Button label',
    },
  }),
  comments: defineMessages({
    heading: {
      id: 'judicial.system:component.caseFiles.comments.heading',
      defaultMessage: 'Athugasemdir vegna rannsóknargagna',
      description: 'Case files component comments: Heading',
    },
    tooltip: {
      id: 'judicial.system:component.caseFiles.comments.tooltip',
      defaultMessage:
        'Hér er hægt að skrá athugasemdir til dómara og dómritara varðandi rannsóknargögnin.',
      description: 'Case files component comments: Tooltip',
    },
    label: {
      id: 'judicial.system:component.caseFiles.comments.label',
      defaultMessage: 'Skilaboð',
      description: 'Case files component comments: Label',
    },
    placeholder: {
      id: 'judicial.system:component.caseFiles.comments.placeholder',
      defaultMessage:
        'Er eitthvað sem þú vilt koma á framfæri við dómstólinn varðandi gögnin?',
      description: 'Case files component comments: Placeholder',
    },
  }),
}
