import { defineMessages, MessageDescriptor } from 'react-intl'
type MessageDir = Record<string, Record<string, MessageDescriptor>>

export const childPensionFormMessage: MessageDir = {
  shared: defineMessages({
    institution: {
      id: 'cp.application:institution.name',
      defaultMessage: 'Tryggingastofnun',
      description: 'Tryggingastofnun',
    },
    applicationTitle: {
      id: 'cp.application:applicationTitle',
      defaultMessage: 'Umsókn um barnalífeyri',
      description: 'Application for child pension',
    },
    formTitle: {
      id: 'cp.application:form.title',
      defaultMessage: 'Umsókn',
      description: 'Application',
    },
    yes: {
      id: 'cp.application:yes',
      defaultMessage: 'Já',
      description: 'Yes',
    },
    no: {
      id: 'cp.application:no',
      defaultMessage: 'Nei',
      description: 'No',
    },
  }),

  pre: defineMessages({
    prerequisitesSection: {
      id: 'cp.application:prerequisites.section',
      defaultMessage: 'Forsendur',
      description: 'Prerequisites',
    },
    forInfoSection: {
      id: 'cp.application:for.info.section',
      defaultMessage: 'Til upplýsinga',
      description: 'For Information',
    },
    forInfoDescription: {
      id: 'cp.application:for.info.description',
      defaultMessage:
        'TR sækir nauðsynlegar upplýsingar til úrvinnslu umsókna og afgreiðslu mála. Þær upplýsingar geta varðað bæði tekjur og aðrar aðstæður þínar.\n \nMisjafnt er eftir tegund umsóknar hvaða upplýsingar þarf til úrvinnslu en ekki eru sóttar meiri upplýsingar en nauðsynlegt er hverju sinni.',
      description: 'english translation',
    },
    forInfoSecondDescription: {
      id: 'cp.application:for.info.second.description',
      defaultMessage:
        'Ef tekjur eða aðrar aðstæður þínar breytast verður þú að láta TR vita þar sem það getur haft áhrif á greiðslur þínar.\n \nFrekari upplýsingar um gagnaöflun og meðferð persónuupplýsinga má finna í persónuverndarstefnu Tryggingastofnunar, www.tr.is/personuvernd. \n \nÞeim umsóknum sem sendar eru TR í gegnum Mínar síður Ísland.is verður svarað rafrænt',
      description: 'english translation',
    },
    externalDataSection: {
      id: 'cp.application:externalData.section',
      defaultMessage: 'Gagnaöflun',
      description: 'External Data',
    },
    checkboxProvider: {
      id: 'cp.application:checkbox.provider',
      defaultMessage:
        'Ég skil að ofangreindra gagna verður aflað í umsóknarferlinu',
      description: 'Checbox to confirm data provider',
    },
    userProfileTitle: {
      id: 'cp.application:userprofile.title',
      defaultMessage: 'Upplýsingar af mínum síðum Ísland.is',
      description: 'english translation',
    },
    userProfileSubTitle: {
      id: 'cp.application:userprofile.subtitle',
      defaultMessage:
        'Upplýsingar um netfang, símanúmer og bankareikning eru sóttar á mínar síður á Ísland.is..',
      description: 'english translation',
    },
    registryIcelandTitle: {
      id: 'cp.application:registry.iceland.title',
      defaultMessage: 'Upplýsingar úr Þjóðskrá',
      description: 'english translation',
    },
    registryIcelandSubTitle: {
      id: 'cp.application:registry.iceland.subtitle',
      defaultMessage:
        'Persónuupplýsingar um þig, maka og börn í þinni forsjá ásamt búsetusögu.',
      description: 'english translation',
    },
    startApplication: {
      id: 'cp.application.start.application',
      defaultMessage: 'Hefja umsókn',
      description: 'Start application',
    },
  }),

  info: defineMessages({
    section: {
      id: 'cp.application:info.section',
      defaultMessage: 'Almennar upplýsingar',
      description: 'General information',
    },
    subSectionTitle: {
      id: 'cp.application:info.sub.section.title',
      defaultMessage: 'Netfang og símanúmer',
      description: 'Email address and phone number',
    },
    subSectionDescription: {
      id: 'cp.application:info.sub.section.description',
      defaultMessage:
        'Netfang og símanúmer er sótt á mínar síður á Ísland.is. Ef upplýsingarnar eru ekki réttar eða vantar setur þú þær inn hér.',
      description: 'translation',
    },
    applicantEmail: {
      id: 'cp.application:info.applicant.email',
      defaultMessage: 'Netfang',
      description: 'Email address',
    },
    applicantPhonenumber: {
      id: 'cp.application:info.applicant.phonenumber',
      defaultMessage: 'Símanúmer',
      description: 'Phone number',
    },
    paymentTitle: {
      id: 'cp.application:info.payment.title',
      defaultMessage: 'Greiðsluupplýsingar',
      description: 'Payment information',
    },
  }),

  additionalInfo: defineMessages({
    section: {
      id: 'cp.application:additional.info.section',
      defaultMessage: 'Viðbótarupplýsingar',
      description: 'Additional information',
    },
  }),

  confirm: defineMessages({
    title: {
      id: 'cp.application:confirmation.title',
      defaultMessage: 'Senda inn umsókn',
      description: 'Review and submit',
    },
    section: {
      id: 'cp.application:confirmation.section',
      defaultMessage: 'Staðfesting',
      description: 'Confirmation',
    },
    description: {
      id: 'cp.application:confirm.description',
      defaultMessage:
        'Vinsamlegast farðu yfir umsóknina áður en þú sendir hana inn.',
      description: 'Please review the application before submitting.',
    },
    overviewTitle: {
      id: 'cp.application:overview.title',
      defaultMessage: 'Yfirlit',
      description: 'Overview',
    },
    buttonEdit: {
      id: 'cp.application:button.edit',
      defaultMessage: 'Breyta umsókn',
      description: 'Edit application',
    },
    name: {
      id: 'cp.application:confirm.name',
      defaultMessage: 'Nafn',
      description: 'Name',
    },
    nationalId: {
      id: 'cp.application:confirm.nationalId',
      defaultMessage: 'Kennitala',
      description: 'National registry ID',
    },
    email: {
      id: 'cp.application:confirm.email',
      defaultMessage: 'Netfang',
      description: 'Email',
    },
    phonenumber: {
      id: 'cp.application:confirm.phonenumber',
      defaultMessage: 'Símanúmer',
      description: 'phonenumber',
    },
  }),

  conclusionScreen: defineMessages({
    title: {
      id: 'cp.application:conclusion.screen.title',
      defaultMessage: 'Umsókn móttekin og bíður tekjuáætlunar',
      description: 'Congratulations, below are the next steps',
    },
  }),

  errors: defineMessages({
    phoneNumber: {
      id: 'cp.application:error.phonenumber',
      defaultMessage: 'Símanúmerið þarf að vera gilt.',
      description: 'The phone number must be valid.',
    },
  }),
}
