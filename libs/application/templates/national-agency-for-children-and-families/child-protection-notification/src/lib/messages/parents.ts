import { defineMessages } from 'react-intl'

export const parentsMessages = {
  shared: defineMessages({
    parentDescription: {
      id: 'cpn.application:parents.shared.parentDescription',
      defaultMessage: 'Fylltu út upplýsingar eftir bestu vitneskju og getu.',
      description: 'Description under each parent section title',
    },
    citizenship: {
      id: 'cpn.application:parents.shared.citizenship',
      defaultMessage: 'Ríkisfang',
      description: 'Label for citizenship/nationality select field',
    },
    genderPlaceholder: {
      id: 'cpn.application:parents.shared.genderPlaceholder',
      defaultMessage: 'Veldu kyn',
      description: 'Placeholder for gender select field',
    },
    countryPlaceholder: {
      id: 'cpn.application:parents.shared.countryPlaceholder',
      defaultMessage: 'Veldu land',
      description: 'Placeholder for country select field',
    },
    citizenshipPlaceholder: {
      id: 'cpn.application:parents.shared.citizenshipPlaceholder',
      defaultMessage: 'Veldu ríkisfang',
      description: 'Placeholder for citizenship select field',
    },
    municipalityPlaceholder: {
      id: 'cpn.application:parents.shared.municipalityPlaceholder',
      defaultMessage: 'Veldu sveitarfélag',
      description: 'Placeholder for municipality select field',
    },
  }),
  expectantParents: defineMessages({
    sectionTitle: {
      id: 'cpn.application:parents.expectantParents.sectionTitle',
      defaultMessage: 'Verðandi foreldrar',
      description: 'Expectant parents section title',
    },
    description: {
      id: 'cpn.application:parents.expectantParents.description',
      defaultMessage:
        'Vinsamlegar fylltu út upplýsingar beggja verðandi foreldra. Skráðu barnshafandi móður sem verðandi foreldri 1 og verðandi faðir sem foreldra 2.\n\nMeð því að skrá kennitölu verðandi foreldra getum við sótt upplýsingarnar með sjálfvirkum hætti í Þjóðskrá. Ef kennitölur verðandi foreldra er ekki við höndina þá biðjum við þig að skrá umbeðnar upplýsingar eftir bestu getu og vitneskju.',
      description: 'Intro description for the expectant parents section',
    },
    radioLabel: {
      id: 'cpn.application:parents.expectantParents.radioLabel',
      defaultMessage:
        'Þekkir þú kennitölu eða kerfiskennitölu verðandi foreldra barnsins?',
      description: 'Radio label asking whether the user knows the parents SSN',
    },
    parent1Title: {
      id: 'cpn.application:parents.expectantParents.parent1Title',
      defaultMessage: 'Verðandi foreldri 1',
      description: 'Title for expectant parent 1 section',
    },
    parent2Title: {
      id: 'cpn.application:parents.expectantParents.parent2Title',
      defaultMessage: 'Verðandi foreldri 2',
      description: 'Title for expectant parent 2 section',
    },
    nameAgeGenderTitle: {
      id: 'cpn.application:parents.expectantParents.nameAgeGenderTitle',
      defaultMessage: 'Veistu nafn, aldur og/eða kyn verðandi foreldris?',
      description: 'Title for name/age/gender group for a parent',
    },
    addressTitle: {
      id: 'cpn.application:parents.expectantParents.addressTitle',
      defaultMessage: 'Veistu hvar verðandi foreldri býr?',
      description: 'Title for address group for a parent',
    },
    fetchedDataInfo: {
      id: 'cpn.application:parents.expectantParents.fetchedDataInfo',
      defaultMessage:
        'Upplýsingar um lögheimili verðandi foreldra, póstnúmer, sveitarfélag, tegund forsjár, ríkisfang, fæðingarstað og dagsetning nýskráningar eru ekki birtar hér en hafa verið sóttar og verða sendar með tilkynningunni til barnaverndar.',
      description:
        'Info alert shown after parent data is fetched from national registry',
    },
  }),
  guardians: defineMessages({
    sectionTitle: {
      id: 'cpn.application:parents.guardians.sectionTitle',
      defaultMessage: 'Forsjáraðilar',
      description: 'Guardians section title',
    },
    title: {
      id: 'cpn.application:parents.guardians.title',
      defaultMessage: 'Upplýsingar um forsjáraðila',
      description: 'Guardians title',
    },
    description: {
      id: 'cpn.application:parents.guardians.description',
      defaultMessage:
        'Vinsamlegast fylltu eftir bestu getu út þær upplýsingar um forsjáraðila barnsins sem þú hefur vitneskju um. Forsjáraðili er sá aðili sem fer með lögformleg fyrirsvar fyrir barn, ræður persónulegum högum og tekur ákvarðanir fyrir hönd þess eftir því sem aldur og þroski barns gefur tilefni til.',
      description: 'Intro description for the guardians section',
    },
    radioLabel: {
      id: 'cpn.application:parents.guardians.radioLabel',
      defaultMessage:
        'Þekkir þú kennitölu eða kerfiskennitölu forsjáraðila barnsins?',
      description:
        'Radio label asking whether the user knows the guardians SSN',
    },
    parent1Title: {
      id: 'cpn.application:parents.guardians.parent1Title',
      defaultMessage: 'Forsjáraðili 1',
      description: 'Title for guardian 1 section',
    },
    parent2Title: {
      id: 'cpn.application:parents.guardians.parent2Title',
      defaultMessage: 'Forsjáraðili 2',
      description: 'Title for guardian 2 section',
    },
    nameAgeGenderTitle: {
      id: 'cpn.application:parents.guardians.nameAgeGenderTitle',
      defaultMessage: 'Veistu nafn, aldur og/eða kyn forsjáraðila?',
      description: 'Title for name/age/gender group for a guardian',
    },
    addressTitle: {
      id: 'cpn.application:parents.guardians.addressTitle',
      defaultMessage: 'Veistu hvar forsjáraðili býr?',
      description: 'Title for address group for a guardian',
    },
    fetchedDataInfo: {
      id: 'cpn.application:parents.guardians.fetchedDataInfo',
      defaultMessage:
        'Upplýsingar um lögheimili forsjáraðila, póstnúmer, sveitarfélag, tegund forsjár, ríkisfang, fæðingarstað og dagsetningu nýskráningar eru ekki birtar hér en hafa verið sóttar og verða sendar með tilkynningunni til barnaverndar.',
      description:
        'Info alert shown after guardian data is fetched from national registry',
    },
  }),
  custodians: defineMessages({
    sectionTitle: {
      id: 'cpn.application:parents.custodians.sectionTitle',
      defaultMessage: 'Umsjónaraðilar',
      description: 'Custodians section title',
    },
    title: {
      id: 'cpn.application:parents.custodians.title',
      defaultMessage: 'Upplýsingar um umsjónaraðila',
      description: 'Custodians title',
    },
    description: {
      id: 'cpn.application:parents.custodians.description',
      defaultMessage:
        'Þetta barn er með kerfiskennitölu. Í tilfelli barns með kerfiskennistölu er ekki er hægt að sannreyna forsjártengsl barns og fullorðins einstaklings með uppflettingu í forsjáraðilaskrá. Biðjum við þig því að skrá umönnunaraðila barns eftir bestu getu og vitneskju. \n\nMeð umönnunaraðila er átt við einstakling sem fer ekki með staðfesta forsjá en hefur enga síðar foreldraskyldur gagnvart barni. Það veitir því umönnun og uppeldi, tryggir því öryggi og stöðugleika og verndar það gegn hvers kyns ofbeldi og annarri vanvirðandi háttsemi. Umönnunaraðili getur verið foreldri með kerfiskennitölu, ættingi, aðstandandi eða fagaðili.',
      description: 'Intro description for the custodians section',
    },
    radioLabel: {
      id: 'cpn.application:parents.custodians.radioLabel',
      defaultMessage:
        'Þekkir þú kennitölu eða kerfiskennitölu umsjónaraðila barnsins?',
      description:
        'Radio label asking whether the user knows the custodians SSN',
    },
    parent1Title: {
      id: 'cpn.application:parents.custodians.parent1Title',
      defaultMessage: 'Umsjónaraðili 1',
      description: 'Title for custodian 1 section',
    },
    parent2Title: {
      id: 'cpn.application:parents.custodians.parent2Title',
      defaultMessage: 'Umsjónaraðili 2',
      description: 'Title for custodian 2 section',
    },
    nameAgeGenderTitle: {
      id: 'cpn.application:parents.custodians.nameAgeGenderTitle',
      defaultMessage: 'Veistu nafn, aldur og/eða kyn umsjónaraðila?',
      description: 'Title for name/age/gender group for a custodian',
    },
    addressTitle: {
      id: 'cpn.application:parents.custodians.addressTitle',
      defaultMessage: 'Veistu hvar umsjónaraðili býr?',
      description: 'Title for address group for a custodian',
    },
    fetchedDataInfo: {
      id: 'cpn.application:parents.custodians.fetchedDataInfo',
      defaultMessage:
        'Upplýsingar um lögheimili umsjónaraðila, póstnúmer, sveitarfélag, tegund forsjár, ríkisfang, fæðingarstað og dagsetningu nýskráningar eru ekki birtar hér en hafa verið sóttar og verða sendar með tilkynningunni til barnaverndar.',
      description:
        'Info alert shown after custodian data is fetched from national registry',
    },
  }),
}
