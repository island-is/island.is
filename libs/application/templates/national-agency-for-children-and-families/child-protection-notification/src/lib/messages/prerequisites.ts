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
    nationalRegistryInformationTitle: {
      id: 'cpn.application:prerequisites.externalData.nationalRegistryInformationTitle',
      defaultMessage: 'Upplýsingar frá Þjóðskrá',
      description: 'Information from Registers Iceland',
    },
    nationalRegistryInformationSubTitle: {
      id: 'cpn.application:prerequisites.externalData.nationalRegistryInformationSubTitle',
      defaultMessage:
        'Upplýsingar um nafn og heimilisfang þjónustuveitanda sem og nafnið þitt.',
      description:
        'Information about the name and address of the service provider as well as your name.',
    },
    personalNationalRegistryInformationSubTitle: {
      id: 'cpn.application:prerequisites.externalData.personalNationalRegistryInformationSubTitle',
      defaultMessage:
        'Upplýsingar um nafn þitt, kennitölu, lögheimili, póstnúmer og sveitarfélag.',
      description:
        'Information about your name, national ID number, registered address, postal code, and municipality.',
    },
    userProfileInformationTitle: {
      id: 'cpn.application:prerequisites.externalData.userProfileInformationTitle',
      defaultMessage: 'Upplýsingar af mínum síðum á Ísland.is',
      description: 'Information from My Pages at Ísland.is',
    },
    userProfileInformationSubTitle: {
      id: 'cpn.application:prerequisites.externalData.userProfileInformationSubTitle',
      defaultMessage:
        'Upplýsingar um netfang, símanúmer tilkynnanda eru sóttar á mínar síður á Ísland.is.',
      description:
        'Information about the notifier’s email address and phone number will be retrieved from My Pages at Ísland.is.',
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
        'Þjónustuveitandi er hver sá aðili sem hefur afskipti af börnum og fjölskyldum þeirra og veitir þeim þjónustu. Þjónustuveitandi getur til að mynda verið stofnun, fyrirtæki, félagasamtök eða sjálfstætt starfandi fagaðili.',
      description: 'Service provider description',
    },
    service: {
      id: 'cpn.application:prerequisites.serviceProvider.service',
      defaultMessage: 'Flokkur þjónustuveitanda',
      description: 'Service provider category',
    },
    servicePlaceholder: {
      id: 'cpn.application:prerequisites.serviceProvider.servicePlaceholder',
      defaultMessage: 'Veldu flokk þjónustuveitenda',
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
    serviceProviderInformation: {
      id: 'cpn.application:prerequisites.serviceProvider.serviceProviderInformation',
      defaultMessage: 'Upplýsingar um þjónustuveitanda',
      description: 'Service provider information',
    },
    contactPerson: {
      id: 'cpn.application:prerequisites.serviceProvider.contactPerson',
      defaultMessage: 'Tengiliður þjónustuveitanda',
      description: 'Service provider contact',
    },
    contactPersonDescription: {
      id: 'cpn.application:prerequisites.serviceProvider.contactPersonDescription',
      defaultMessage:
        'Tengiliður ber ábyrgð á að senda tilkynningu til barnaverndar fyrir hönd þjónustuveitanda og er milliliður í samskiptum við barnavernd vegna hennar.',
      description: 'Service provider contact description',
    },
    workEmail: {
      id: 'cpn.application:prerequisites.serviceProvider.workEmail',
      defaultMessage: 'Vinnunetfang',
      description: 'Work email',
    },
  }),
  notifierInfo: defineMessages({
    subSectionTitle: {
      id: 'cpn.application:prerequisites.notifierInfo.subSectionTitle',
      defaultMessage: 'Upplýsingar um þig',
      description: 'Notifier information section title',
    },
    description: {
      id: 'cpn.application:prerequisites.notifierInfo.description',
      defaultMessage:
        'Þegar þú tilkynnir til barnaverndar þá þarftu að gefa upp nafn þitt, netfang og símanúmer svo Barnavernd geti haft samband við þig ef þörf krefur. Um leið getur þú óskað eftir nafnleynd þannig að sá sem þú tilkynnir fái ekki upplýsingar um þig.',
      description: 'Notifier information description',
    },
    wantsAnonymity: {
      id: 'cpn.application:prerequisites.notifierInfo.wantsAnonymity',
      defaultMessage: 'Óskar þú nafnleyndar?',
      description: 'Wants anonymity',
    },
    relationshipToChild: {
      id: 'cpn.application:prerequisites.notifierInfo.relationshipToChild',
      defaultMessage:
        'Merktu við hver tengsl þín eru við barnið sem þú hefur áhyggjur af.',
      description: 'Relationship to the child',
    },
    relationship: {
      id: 'cpn.application:prerequisites.notifierInfo.relationship',
      defaultMessage: 'Tengsl',
      description: 'Relationship',
    },
    relationshipPlaceholder: {
      id: 'cpn.application:prerequisites.notifierInfo.relationshipPlaceholder',
      defaultMessage: 'Veldu tengsl',
      description: 'Relationship placeholder',
    },
  }),
  child: defineMessages({
    subSectionTitle: {
      id: 'cpn.application:prerequisites.child.subSectionTitle',
      defaultMessage: 'Barn',
      description: 'Child',
    },
    education: {
      id: 'cpn.application:prerequisites.child.education',
      defaultMessage: 'Í hvaða dagvistun eða skóla er barnið?',
      description: 'Child education',
    },
    educationType: {
      id: 'cpn.application:prerequisites.child.educationType',
      defaultMessage: 'Dagvistun eða skóli',
      description: 'Child education type',
    },
    educationTypePlaceholder: {
      id: 'cpn.application:prerequisites.child.educationTypePlaceholder',
      defaultMessage: 'Veldu dagvistun eða skóla',
      description: 'Child education type placeholder',
    },
    startNotification: {
      id: 'cpn.application:prerequisites.child.startNotification',
      defaultMessage: 'Hefja tilkynningu',
      description: 'Start notification',
    },
  }),
}
