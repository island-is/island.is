import { defineMessages } from 'react-intl'

// Global string for the application
export const application = defineMessages({
  name: {
    id: 'crc.application:application.name',
    defaultMessage: 'Breytt lögheimili barna',
    description: 'Name of the Children Residence Change application',
  },
})

// All sections in the application
export const section = defineMessages({
  backgroundInformation: {
    id: 'crc.application:section.backgroundInformation',
    defaultMessage: 'Grunnupplýsingar',
    description: 'Background information',
  },
  arrangement: {
    id: 'crc.application:section.arrangement',
    defaultMessage: 'Fyrirkomulag',
    description: 'Arrangement',
  },
  effect: {
    id: 'crc.application:section.effect',
    defaultMessage: 'Áhrif umsóknar',
    description: 'Effect of Application',
  },
  overview: {
    id: 'crc.application:section.overview',
    defaultMessage: 'Yrirlit og undirritun',
    description: 'Overview and Signing',
  },
  received: {
    id: 'crc.application:section.received',
    defaultMessage: 'Umsókn móttekin',
    description: 'Application Received',
  },
})

// External information retrieval
export const externalData = {
  general: defineMessages({
    sectionTitle: {
      id:
        'crc.application:section.backgroundInformation.externalData.sectionTitle',
      defaultMessage: 'Gagnaöflun',
      description: 'External information retrieval section title',
    },
    pageTitle: {
      id:
        'crc.application:section.backgroundInformation.externalData.pageTitle',
      defaultMessage: 'Gagnaöflun',
      description: 'External information retrieval page title',
    },
    subTitle: {
      id: 'crc.application:section.backgroundInformation.externalData.subTitle',
      defaultMessage: 'Eftirfarandi gögn verða sótt rafrænt með þínu samþykki.',
      description: 'External information retrieval subtitle',
    },
    checkboxLabel: {
      id: 'crc.application:section.backgroundInformation.externalData.subTitle',
      defaultMessage: 'Ég samþykki gagnaöflun',
      description: 'External information retrieval checkbox label',
    },
  }),
  applicant: defineMessages({
    title: {
      id:
        'crc.application:section.backgroundInformation.externalData.applicant.title',
      defaultMessage: 'Persónuupplýsingar úr Þjóðskrá',
      description:
        'Title: External Info about applicant from the National Registry',
    },
    subTitle: {
      id:
        'crc.application:section.backgroundInformation.externalData.applicant.subTitle',
      defaultMessage:
        'Til þess að auðvelda fyrir sækjum við persónuupplýsingar úr Þjóðskrá til þess að fylla út umsóknina',
      description:
        'Subtitle: External Info about applicant from the National Registry',
    },
  }),
  children: defineMessages({
    title: {
      id:
        'crc.application:section.backgroundInformation.externalData.children.title',
      defaultMessage: 'Grunnupplýsingar um börn',
      description:
        'Title: External Info about applicants children from the National Registry',
    },
    subTitle: {
      id:
        'crc.application:section.backgroundInformation.externalData.children.subTitle',
      defaultMessage:
        'Nöfn, kennitölur og núverandi lögheimili barna í þinni forsjá.',
      description:
        'Subtitle: External Info about applicants children from the National Registry',
    },
  }),
  otherParents: defineMessages({
    title: {
      id:
        'crc.application:section.backgroundInformation.externalData.otherParents.title',
      defaultMessage: 'Grunnupplýsingar um foreldra',
      description:
        'Title: External Info about other parents from the National Registry',
    },
    subTitle: {
      id:
        'crc.application:section.backgroundInformation.externalData.otherParents.subTitle',
      defaultMessage: 'Nöfn, kennitölur og lögheimili forelda barnanna.',
      description:
        'Subtitle: External Info about other parents from the National Registry',
    },
  }),
}

// Select children
export const selectChildren = {
  general: defineMessages({
    sectionTitle: {
      id:
        'crc.application:section.backgroundInformation.selectChildren.sectionTitle',
      defaultMessage: 'Velja barn/börn',
      description: 'Select children section title',
    },
    pageTitle: {
      id:
        'crc.application:section.backgroundInformation.selectChildren.pageTitle',
      defaultMessage: 'Veldu barn/börn',
      description: 'Select children page title',
    },
    subTitle: {
      id:
        'crc.application:section.backgroundInformation.selectChildren.subTitle',
      defaultMessage:
        'Hér sérðu lista yfir börn sem eru skráð í þinni forsjá. Þú getur valið fyrir hvaða barn/börn á að flytja lögheimili.',
      description: 'Select children subtitle',
    },
  }),
  checkboxes: defineMessages({
    title: {
      id:
        'crc.application:section.backgroundInformation.selectChildren.checkboxes.title',
      defaultMessage: 'Börn í þinni forsjá',
      description: 'Title: displayed above checkboxes',
    },
    subLabel: {
      id:
        'crc.application:section.backgroundInformation.selectChildren.checkboxes.sublabel',
      defaultMessage: 'Hitt forsjárforeldrið er {parentName}',
      description: 'Sublabel: displayed below a childs name',
    },
  }),
}

// Confirm other parent
export const otherParent = {
  general: defineMessages({
    sectionTitle: {
      id:
        'crc.application:section.backgroundInformation.otherParent.sectionTitle',
      defaultMessage: 'Staðfesta foreldri',
      description: 'Other parent section title',
    },
    pageTitle: {
      id: 'crc.application:section.backgroundInformation.otherParent.pageTitle',
      defaultMessage: 'Staðfestu upplýsingar um hitt foreldrið',
      description: 'Other parent page title',
    },
    description: {
      id:
        'crc.application:section.backgroundInformation.otherParent.description',
      defaultMessage: 'Hitt foreldrið er ${parentName} (${parentSSN})',
      description: 'Other parent page description',
    },
  }),
  inputs: defineMessages({
    description: {
      id:
        'crc.application:section.backgroundInformation.otherParent.inputs.description',
      defaultMessage:
        'Til að afla samþykkis hins foreldrisins þurfum við að fá netfang og símanúmer viðkomandi.',
      description: 'Description for inputs',
    },
    emailLabel: {
      id:
        'crc.application:section.backgroundInformation.otherParent.inputs.emailLabel',
      defaultMessage: 'Netfang',
      description: 'Email label',
    },
    phoneNumberLabel: {
      id:
        'crc.application:section.backgroundInformation.otherParent.inputs.phoneNumberLabel',
      defaultMessage: 'Símanúmer',
      description: 'Phone number label',
    },
  }),
}

// Reason
export const reason = {
  general: defineMessages({
    sectionTitle: {
      id: 'crc.application:section.arrangement.reason.sectionTitle',
      defaultMessage: 'Tilefni',
      description: 'Reason for change section title',
    },
    pageTitle: {
      id: 'crc.application:section.arrangement.reason.pageTitle',
      defaultMessage: 'Hvert er tilefni breytingar á lögheimili?',
      description: 'Reason for change page title',
    },
  }),
  input: defineMessages({
    label: {
      id: 'crc.application:section.arrangement.reason.input.label',
      defaultMessage: 'Tilefni',
      description: 'Label for reason for change input',
    },
    placeholder: {
      id: 'crc.application:section.arrangement.reason.input.placeholder',
      defaultMessage:
        'Skrifaðu hér í stuttu máli ástæðu þess að lögheimili barnsins er að færast á milli foreldra',
      description: 'Placeholder for reason for change input',
    },
  }),
}

// New Legal Residence
export const newResidence = {
  general: defineMessages({
    sectionTitle: {
      id: 'crc.application:section.arrangement.newResidence.sectionTitle',
      defaultMessage: 'Nýtt lögheimili',
      description: 'New legal residence section title',
    },
    pageTitle: {
      id: 'crc.application:section.arrangement.newResidence.pageTitle',
      defaultMessage: 'Hvert á að flytja lögheimilið?',
      description: 'New legal residence page title',
    },
    description: {
      id: 'crc.application:section.arrangement.newResidence.description',
      defaultMessage:
        '<p>Sem foreldrar með sameiginlega forsjá getið þið óskað eftir því að lögheimili barns færist frá þér til hins foreldrisins, eða öfugt.</p><p>Vinsamlegast staðfestu að lögheimilisflutningur sé eins og fram kemur hér fyrir neðan:</p>',
      description: 'Ne legal residence page descrption',
    },
  }),
  information: defineMessages({
    currentResidenceLabel: {
      id:
        'crc.application:section.arrangement.newResidence.information.currentResidenceLabel',
      defaultMessage: 'Núverandi lögheimili barna: ',
      description: 'Label for current residence',
    },
    newResidenceLabel: {
      id:
        'crc.application:section.arrangement.newResidence.information.newResidenceLabel',
      defaultMessage: 'Nýtt lögheimili barna: ',
      description: 'Label for new residence',
    },
  }),
  checkbox: defineMessages({
    label: {
      id: 'crc.application:section.arrangement.newResidence.checkbox.label',
      defaultMessage: 'Ég staðfesti að ofangreindar upplýsingar séu réttar',
      description: 'Confirm new residence label',
    },
  }),
}
