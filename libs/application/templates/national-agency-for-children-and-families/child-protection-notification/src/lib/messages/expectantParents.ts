import { defineMessages } from 'react-intl'

export const expectantParentsMessages = {
  shared: defineMessages({
    sectionTitle: {
      id: 'cpn.application:expectantParents.shared.sectionTitle',
      defaultMessage: 'Verðandi foreldrar',
      description: 'Expectant parents section title',
    },
    description: {
      id: 'cpn.application:expectantParents.shared.description',
      defaultMessage:
        'Vinsamlegar fylltu út upplýsingar beggja verðandi foreldra. Skráðu barnshafandi móður sem verðandi foreldri 1 og verðandi faðir sem foreldra 2.\n\nMeð því að skrá kennitölu verðandi foreldra getum við sótt upplýsingarnar með sjálfvirkum hætti í Þjóðskrá. Ef kennitölur verðandi foreldra er ekki við höndina þá biðjum við þig að skrá umbeðnar upplýsingar eftir bestu getu og vitneskju.',
      description: 'Intro description for the expectant parents section',
    },
    radioLabel: {
      id: 'cpn.application:expectantParents.shared.radioLabel',
      defaultMessage:
        'Þekkir þú kennitölu eða kerfiskennitölu verðandi foreldra barnsins?',
      description: 'Radio label asking whether the user knows the parents SSN',
    },
    parent1Title: {
      id: 'cpn.application:expectantParents.shared.parent1Title',
      defaultMessage: 'Verðandi foreldri 1',
      description: 'Title for expectant parent 1 section',
    },
    parent2Title: {
      id: 'cpn.application:expectantParents.shared.parent2Title',
      defaultMessage: 'Verðandi foreldri 2',
      description: 'Title for expectant parent 2 section',
    },
    parentDescription: {
      id: 'cpn.application:expectantParents.shared.parentDescription',
      defaultMessage: 'Fylltu út upplýsingar eftir bestu vitneskju og getu.',
      description: 'Description under each parent section title',
    },
    nameAgeGenderTitle: {
      id: 'cpn.application:expectantParents.shared.nameAgeGenderTitle',
      defaultMessage: 'Veistu nafn, aldur og/eða kyn verðandi foreldris?',
      description: 'Title for name/age/gender group for a parent',
    },
    addressTitle: {
      id: 'cpn.application:expectantParents.shared.addressTitle',
      defaultMessage: 'Veistu hvar verðandi foreldri býr?',
      description: 'Title for address group for a parent',
    },
    citizenship: {
      id: 'cpn.application:expectantParents.shared.citizenship',
      defaultMessage: 'Ríkisfang',
      description: 'Label for citizenship/nationality select field',
    },
    genderPlaceholder: {
      id: 'cpn.application:expectantParents.shared.genderPlaceholder',
      defaultMessage: 'Veldu kyn',
      description: 'Placeholder for gender select field',
    },
    countryPlaceholder: {
      id: 'cpn.application:expectantParents.shared.countryPlaceholder',
      defaultMessage: 'Veldu land',
      description: 'Placeholder for country select field',
    },
    citizenshipPlaceholder: {
      id: 'cpn.application:expectantParents.shared.citizenshipPlaceholder',
      defaultMessage: 'Veldu ríkisfang',
      description: 'Placeholder for citizenship select field',
    },
    municipalityPlaceholder: {
      id: 'cpn.application:expectantParents.shared.municipalityPlaceholder',
      defaultMessage: 'Veldu sveitarfélag',
      description: 'Placeholder for municipality select field',
    },
    genderMale: {
      id: 'cpn.application:expectantParents.shared.genderMale',
      defaultMessage: 'Karlmaður',
      description: 'Gender option: male',
    },
    genderFemale: {
      id: 'cpn.application:expectantParents.shared.genderFemale',
      defaultMessage: 'Kvennmaður',
      description: 'Gender option: female',
    },
    genderNonBinary: {
      id: 'cpn.application:expectantParents.shared.genderNonBinary',
      defaultMessage: 'Kynsegin',
      description: 'Gender option: non-binary',
    },
    fetchedDataInfo: {
      id: 'cpn.application:expectantParents.shared.fetchedDataInfo',
      defaultMessage:
        'Upplýsingar um lögheimili verðandi foreldra, póstnúmer, sveitarfélag, tegund forsjár, ríkisfang, fæðingarstað og dagsetning nýskráningar eru ekki birtar hér en hafa verið sóttar og verða sendar með tilkynningunni til barnaverndar.',
      description:
        'Info alert shown after parent data is fetched from national registry',
    },
  }),
}
