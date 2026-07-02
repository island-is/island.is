import { defineMessages } from 'react-intl'

export const prerequisitesMessages = {
  shared: defineMessages({
    sectionTitle: {
      id: 'cpn.application:prerequisites.shared.sectionTitle',
      defaultMessage: 'Forsendur',
      description: 'Prerequisites',
    },
  }),
  externalData: defineMessages({
    subSectionTitle: {
      id: 'cpn.application:prerequisites.externalData.subSectionTitle',
      defaultMessage: 'Gagnaöflun',
      description: 'Data collection',
    },
    description: {
      id: 'cpn.application:prerequisites.externalData.description',
      defaultMessage: 'Eftirfarandi upplýsingar verða sóttar rafrænt',
      description: 'The following information will be retrieved electronically',
    },
    checkboxProvider: {
      id: 'cpn.application:prerequisites.externalData.checkboxProvider',
      defaultMessage:
        'Ég skil að ofangreindra upplýsinga verður aflað í umsóknarferlinu',
      description:
        'I understand that the above information will be collected during the application process',
    },
  }),
  serviceProvider: defineMessages({
    subSectionTitle: {
      id: 'cpn.application:prerequisites.serviceProvider.subSectionTitle',
      defaultMessage: 'Þjónustuveitandi',
      description: 'Service provider',
    },
    description: {
      id: 'cpn.application:prerequisites.serviceProvider.description',
      defaultMessage:
        'Þjónustuveitandi er hver sá aðili sem hefur afskipti af börnum og fjölskyldum þeirra og veitir þeim þjónustu. Hann getur til að mynda verið stofnun, fyrirtæki, félagasamtök eða sjálfstætt starfandi fagaðili. \n\nVinsamlegast fylltu út upplýsingar um þjónustuveitandann sem sendir þessa tilkynningu. Þessar upplýsingar eru nauðsynlegar fyrir eftirfylgni.',
      description: 'Service provider description',
    },
    service: {
      id: 'cpn.application:prerequisites.serviceProvider.service',
      defaultMessage: 'Þjónusta',
      description: 'Service',
    },
    servicePlaceholder: {
      id: 'cpn.application:prerequisites.serviceProvider.servicePlaceholder',
      defaultMessage: 'Veldu þjónustu',
      description: 'Select service',
    },
    serviceType: {
      id: 'cpn.application:prerequisites.serviceProvider.serviceType',
      defaultMessage: 'Tegund',
      description: 'Type',
    },
    serviceTypePlaceholder: {
      id: 'cpn.application:prerequisites.serviceProvider.serviceTypePlaceholder',
      defaultMessage: 'Veldu tegund',
      description: 'Select type',
    },
    contactPerson: {
      id: 'cpn.application:prerequisites.serviceProvider.contactPerson',
      defaultMessage: 'Tengiliður þjónustuveitanda',
      description: 'Service provider contact',
    },
    contactPersonDescription: {
      id: 'cpn.application:prerequisites.serviceProvider.contactPersonDescription',
      defaultMessage:
        'Tengiliður er sá aðili sem samkvæmt verklagsreglum þjónustuveitanda hefur það formlega hlutverk að senda tilkynninguna til barnaverndar fyrir hönd þjónustuveitanda. Einnig að vera tengiliður milli barnaverndar og þeirra starfsmanna sem þekkja best til barnsins og atvika eða aðstæðna sem tilkynntar eru.',
      description: 'Service provider contact description',
    },
    workEmail: {
      id: 'cpn.application:prerequisites.serviceProvider.workEmail',
      defaultMessage: 'Vinnunetfang',
      description: 'Work email',
    },
    workEmailTooltip: {
      id: 'cpn.application:prerequisites.serviceProvider.workEmailTooltip',
      defaultMessage:
        'Hér er átt við almennt netfang sem notað er fyrir „hafa samband“. Dæmi: info@ eða postur@',
      description: 'Work email tooltip',
    },
    workPhone: {
      id: 'cpn.application:prerequisites.serviceProvider.workPhone',
      defaultMessage: 'Vinnunúmer',
      description: 'Work phone',
    },
    workPhoneTooltip: {
      id: 'cpn.application:prerequisites.serviceProvider.workPhoneTooltip',
      defaultMessage:
        'Hér er átt við vinnusímanúmer tengiliðs sem barnavernd getur hringt í til frekari upplýsingaöflunar.',
      description: 'Work phone tooltip',
    },
  }),
  child: defineMessages({
    subSectionTitle: {
      id: 'cpn.application:prerequisites.child.subSectionTitle',
      defaultMessage: 'Barn',
      description: 'Child',
    },
    startNotification: {
      id: 'cpn.application:prerequisites.child.startNotification',
      defaultMessage: 'Hefja tilkynningu',
      description: 'Start notification',
    },
  }),
}
