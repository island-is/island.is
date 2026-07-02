import { defineMessages } from 'react-intl'

export const expectantParentsMessages = {
  shared: defineMessages({
    sectionTitle: {
      id: 'cpn.application:expectantParents.shared.sectionTitle',
      defaultMessage: 'Verðandi foreldrar',
      description: 'Expectant parents section title',
    },
    intro1: {
      id: 'cpn.application:expectantParents.shared.intro1',
      defaultMessage:
        'Vinsamlegar fylltu út upplýsingar beggja verðandi foreldra. Skráðu barnshafandi móður sem verðandi foreldri 1 og verðandi faðir sem foreldra 2.',
      description: 'First intro paragraph for expectant parents section',
    },
    intro2: {
      id: 'cpn.application:expectantParents.shared.intro2',
      defaultMessage:
        'Með því að skrá kennitölu verðandi foreldra getum við sótt upplýsingarnar með sjálfvirkum hætti í Þjóðskrá. Ef kennitölur verðandi foreldra er ekki við höndina þá biðjum við þig að skrá umbeðnar upplýsingar eftir bestu getu og vitneskju.',
      description:
        'Second intro paragraph explaining the benefit of providing SSN',
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
