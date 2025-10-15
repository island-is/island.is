import { defineMessages } from 'react-intl'

export const applicant = {
  general: defineMessages({
    sectionTitle: {
      id: 'vmst.ub.application:applicant.general.sectionTitle',
      defaultMessage: 'Umsækjandi',
      description: 'applicant section page title',
    },
  }),
  labels: defineMessages({
    name: {
      id: 'vmst.ub.application:applicant.labels.name',
      defaultMessage: 'Nafn',
      description: 'applicant name label',
    },
    nationalId: {
      id: 'vmst.ub.application:applicant.labels.nationalId',
      defaultMessage: 'Kennitala',
      description: 'applicant nationalId label',
    },
    address: {
      id: 'vmst.ub.application:applicant.labels.address',
      defaultMessage: 'Heimilisfang',
      description: 'applicant address label',
    },
    postcode: {
      id: 'vmst.ub.application:applicant.labels.postcode',
      defaultMessage: 'Póstnúmer og staður',
      description: 'applicant postcode label',
    },
    email: {
      id: 'vmst.ub.application:applicant.labels.email',
      defaultMessage: 'Netfang',
      description: 'applicant email label',
    },
    phoneNumber: {
      id: 'vmst.ub.application:applicant.labels.phoneNumber',
      defaultMessage: 'Símanúmer',
      description: 'applicant phoneNumber label',
    },
    passwordDescription: {
      id: 'vmst.ub.application:applicant.labels.passwordDescription',
      defaultMessage:
        'Vinsamlegast veljið lykilorð vegna mögulegra símasamskipta. Lykilorð verður að vera minnst 4 stafir, tölustafir og/eða bókstafir. Hámarkslengd eru 10 stafir.',
      description: 'password label description',
    },
    passwordLabel: {
      id: 'vmst.ub.application:applicant.labels.passwordLabel',
      defaultMessage: 'Lykilorð',
      description: 'password label',
    },
    passwordPlaceholder: {
      id: 'vmst.ub.application:applicant.labels.passwordPlaceholder',
      defaultMessage: '123ABC',
      description: 'password placeholder label',
    },
    otherAddressCheckboxLabel: {
      id: 'vmst.ub.application:applicant.labels.otherAddressCheckboxLabel',
      defaultMessage: 'Dvalarstaður ef annar en lögheimili',
      description: 'other address checkbox label',
    },
    dependentChildren: {
      id: 'vmst.ub.application:applicant.labels.dependentChildren',
      defaultMessage: 'Börn á framfæri',
      description: 'dependent children label',
    },
    childName: {
      id: 'vmst.ub.application:applicant.labels.childName',
      defaultMessage: 'Nafn barns',
      description: 'child name label',
    },
    childNationalId: {
      id: 'vmst.ub.application:applicant.labels.childNationalId',
      defaultMessage: 'Kennitala barns',
      description: 'child nationalId label',
    },
    moreDependentChildren: {
      id: 'vmst.ub.application:applicant.labels.moreDependentChildren',
      defaultMessage: 'Fleiri börn á framfæri?',
      description: 'more dependent children label',
    },
    moreDependentChildrenDescription: {
      id: 'vmst.ub.application:applicant.labels.moreDependentChildrenDescription',
      defaultMessage:
        'Ef fleiri börn en skráð eru hér að ofan eru á þínu framfæri geturðu bætt þeim við hérna í listann',
      description: 'more dependent children description',
    },
    moreDependentChildrenButton: {
      id: 'vmst.ub.application:applicant.labels.moreDependentChildrenButton',
      defaultMessage: 'Bæta við barni á framfæri',
      description: 'more dependent children button label',
    },
  }),
  personalInformation: defineMessages({
    sectionTitle: {
      id: 'vmst.ub.application:applicant.personalInformation.sectionTitle',
      defaultMessage: 'Persónuupplýsingar',
      description: 'applicant personal information section title',
    },
    pageTitle: {
      id: 'vmst.ub.application:applicant.personalInformation.pageTitle',
      defaultMessage: 'Persónuupplýsingar',
      description: 'Personal information page description',
    },
    pageDescription: {
      id: 'vmst.ub.application:applicant.personalInformation.pageDescription',
      defaultMessage: 'Vinsamlegast leiðréttið eftirfarandi ef þörf er á',
      description: 'Personal information page description',
    },
  }),
  informationChangeAgreement: defineMessages({
    sectionTitle: {
      id: 'vmst.ub.application:applicant.informationChangeAgreement.sectionTitle',
      defaultMessage: 'Tilkynna breytingar',
      description: 'applicant information agreement section title',
    },
    pageTitle: {
      id: 'vmst.ub.application:applicant.informationChangeAgreement.pageTitle',
      defaultMessage: 'Tilkynna þarf breytingar',
      description: 'information agreement page description',
    },
    pageDescription: {
      id: 'vmst.ub.application:applicant.informationChangeAgreement.pageDescription#markdown',
      defaultMessage: `Það er mjög mikilvægt að láta vita af öllum breytingum á þínum högum. Þar undir fellur:
        \n* Breyttu heimilisfangi, símanúmeri og netfangi.
        \n* Breytingar skal tilkynna á „Mínum síðum“.
        \n\nEinnig þarf að tilkynna aðrar breytingar sem geta haft áhrif á greiðslu bóta, þar undir fellur:
        \n* Vinna
        \n* Tekjur
        \n* Nám
        \n* Veikindi, starfshæfni
        \n* Fæðingarorlof
        \n\n[Sjá nánar á Vinnumálastofnun.is](https://island.is/s/vinnumalastofnun)`,
      description: 'information agreement page description',
    },
  }),
  familyInformation: defineMessages({
    sectionTitle: {
      id: 'vmst.ub.application:applicant.familyInformation.sectionTitle',
      defaultMessage: 'Fjölskylduupplýsingar',
      description: 'applicant family information section title',
    },
    pageTitle: {
      id: 'vmst.ub.application:applicant.familyInformation.pageTitle',
      defaultMessage: 'Fjölskylduupplýsingar',
      description: 'family information page description',
    },
    moreThanEighteenErrorMessage: {
      id: 'vmst.ub.application:applicant.familyInformation.moreThanEighteenErrorMessage',
      defaultMessage: 'Ekki er hægt að skrá barn sem hefur náð 18 ára aldri',
      description: 'error message for children older than 18',
    },
  }),
}
