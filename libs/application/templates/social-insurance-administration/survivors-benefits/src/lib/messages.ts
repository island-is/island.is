import { defineMessages, MessageDescriptor } from 'react-intl'
type MessageDir = Record<string, Record<string, MessageDescriptor>>

export const survivorsBenefitsFormMessage: MessageDir = {
  shared: defineMessages({
    institution: {
      id: 'sb.application:institution.name',
      defaultMessage: 'Tryggingastofnun',
      description: 'Tryggingastofnun',
    },
    applicationTitle: {
      id: 'sb.application:applicationTitle',
      defaultMessage: 'Umsókn um dánarbætur',
      description: 'Application for survivors benefits',
    },
    formTitle: {
      id: 'sb.application:form.title',
      defaultMessage: 'Umsókn',
      description: 'Application',
    },
    yes: {
      id: 'sb.application:yes',
      defaultMessage: 'Já',
      description: 'Yes',
    },
    no: {
      id: 'sb.application:no',
      defaultMessage: 'Nei',
      description: 'No',
    },
  }),

  pre: defineMessages({
    prerequisitesSection: {
      id: 'sb.application:prerequisites.section',
      defaultMessage: 'Forsendur',
      description: 'Prerequisites',
    },
    externalDataSection: {
      id: 'sb.application:externalData.section',
      defaultMessage: 'Gagnaöflun',
      description: 'External Data',
    },
    externalDataSubTitle: {
      id: 'sb.application:externalData.sub.title',
      defaultMessage: 'Eftirfarandi upplýsingar verða sóttar rafrænt:',
      description: 'english translation',
    },
    checkboxProvider: {
      id: 'sb.application:checkbox.provider',
      defaultMessage:
        'Ég skil að ofangreindra upplýsinga verður aflað í umsóknarferlinu',
      description: 'english translation',
    },
    registryIcelandTitle: {
      id: 'sb.application:registry.iceland.title',
      defaultMessage: 'Upplýsingar frá þjóðskrá',
      description: 'english translation',
    },
    registryIcelandDescription: {
      id: 'sb.application:registry.iceland.description',
      defaultMessage: 'Upplýsingar um þig, maka og börn.',
      description: 'english translation',
    },
    socialInsuranceAdministrationTitle: {
      id: 'sb.application:social.insurance.administration.title',
      defaultMessage: 'Upplýsingar af mínum síðum hjá Tryggingastofnun',
      description: 'english translation',
    },
    socialInsuranceAdministrationDescription: {
      id: 'sb.application:social.insurance.administration.description#markdown',
      defaultMessage:
        'Upplýsingar um netfang, símanúmer og bankareikningur eru sóttar á mínar síður hjá Tryggingastofnun. TR sækir einungis nauðsynlegar upplýsingar til úrvinnslu umsókna og afgreiðsla mála. Frekari upplýsingar um gagnaöflunarheimild og meðferð persónuupplýsinga má finna í persónuverndarstefnu Tryggingarstofnunar, [https://www.tr.is/tryggingastofnun/personuvernd](https://www.tr.is/tryggingastofnun/personuvernd).',
      description: 'english translation',
    },
    startApplication: {
      id: 'sb.application.start.application',
      defaultMessage: 'Hefja umsókn',
      description: 'Start application',
    },
  }),

  info: defineMessages({
    section: {
      id: 'sb.application:info.section',
      defaultMessage: 'Almennar upplýsingar',
      description: 'General information',
    },
    deceasedSpouseSubSection: {
      id: 'sb.application:deceased.spouse.sub.section',
      defaultMessage: 'Látinn maki/sambúðaraðili',
      description: 'english translation',
    },
    deceasedSpouseTitle: {
      id: 'sb.application:deceased.spouse.title',
      defaultMessage: 'Upplýsingar um látinn maka/sambúðaraðila',
      description: 'english translation',
    },
    deceasedSpouseDescription: {
      id: 'sb.application:deceased.spouse.description',
      defaultMessage:
        'Hérna eru upplýsingar um látinn maka/sambúðaraðila. Athugið ef eftirfarandi upplýsingar eru ekki réttar þá þarf að breyta þeim í Þjóðskrá.',
      description: 'english translation',
    },
    deceasedSpouseName: {
      id: 'sb.application:deceased.spouse.name',
      defaultMessage: 'Nafn',
      description: 'Name',
    },
  }),

  additionalInfo: defineMessages({
    section: {
      id: 'sb.application:additional.info.section',
      defaultMessage: 'Viðbótarupplýsingar',
      description: 'Additional information',
    },
  }),

  confirm: defineMessages({
    section: {
      id: 'sb.application:confirmation.section',
      defaultMessage: 'Staðfesting',
      description: 'Confirmation',
    },
    title: {
      id: 'sb.application:confirmation.title',
      defaultMessage: 'Senda inn umsókn',
      description: 'Review and submit',
    },
    description: {
      id: 'sb.application:confirm.description',
      defaultMessage:
        'Vinsamlegast farðu yfir umsóknina áður en þú sendir hana inn.',
      description: 'Please review the application before submitting.',
    },
    buttonEdit: {
      id: 'sb.application:button.edit',
      defaultMessage: 'Breyta umsókn',
      description: 'Edit application',
    },
  }),
}
