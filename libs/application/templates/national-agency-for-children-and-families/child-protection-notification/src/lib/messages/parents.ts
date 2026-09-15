import { defineMessages } from 'react-intl'

export const parentsMessages = {
  shared: defineMessages({
    parentDescription: {
      id: 'cpn.application:parents.shared.parentDescription',
      defaultMessage:
        'Upplýsingaöflun á næstu skrefum ræðst af því hvort kennitala er þekkt eða ekki.',
      description: 'Description for the guardian information section',
    },
    basicInfoTitle: {
      id: 'cpn.application:parents.shared.basicInfoTitle',
      defaultMessage: 'Grunnupplýsingar',
      description: 'Title for the basic information group',
    },
    addressTitle: {
      id: 'cpn.application:parents.shared.addressTitle',
      defaultMessage: 'Heimilisfang',
      description: 'Title for address group for a guardian',
    },
    citizenship: {
      id: 'cpn.application:parents.shared.citizenship',
      defaultMessage: 'Ríkisfang',
      description: 'Label for citizenship/nationality select field',
    },
    citizenshipPlaceholder: {
      id: 'cpn.application:parents.shared.citizenshipPlaceholder',
      defaultMessage: 'Veldu ríkisfang',
      description: 'Placeholder for citizenship select field',
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
        'Ef kennitölur verðandi foreldra eru skráðar þá eru upplýsingar sóttar sjálfvirkt úr þjóðskrá.',
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
      defaultMessage: 'Verðandi foreldri 1 (barnshafandi foreldri)',
      description: 'Title for expectant parent 1 section',
    },
    parent2Title: {
      id: 'cpn.application:parents.expectantParents.parent2Title',
      defaultMessage: 'Verðandi foreldri',
      description: 'Title for expectant parent 2 section',
    },
    fetchedDataInfo: {
      id: 'cpn.application:parents.expectantParents.fetchedDataInfo',
      defaultMessage:
        'Upplýsingar t.d. um lögheimili verðandi foreldra, póstnúmer, sveitarfélag, ríkisfang, fæðingarstað og dagsetningu nýskráningar eru ekki birtar hér en hafa verið sóttar og verða sendar með tilkynningunni til barnaverndar.',
      description:
        'Info alert shown after parent data is fetched from national registry',
    },
  }),
  guardians: defineMessages({
    sectionTitle: {
      id: 'cpn.application:parents.guardians.sectionTitle',
      defaultMessage: 'Forsjár- eða umsjáraðilar',
      description: 'Guardians section title',
    },
    title: {
      id: 'cpn.application:parents.guardians.title',
      defaultMessage: 'Upplýsingar um forsjár- eða umsjáraðila',
      description: 'Guardians title',
    },
    description: {
      id: 'cpn.application:parents.guardians.description',
      defaultMessage:
        'Forsjáraðili er sá aðili sem fer með lögformleg fyrirsvar fyrir barn, ræður persónulegum högum og tekur ákvarðanir fyrir hönd þess eftir því sem aldur og þroski barns gefur tilefni til.',
      description: 'Intro description for the guardians section',
    },
    radioLabel: {
      id: 'cpn.application:parents.guardians.radioLabel',
      defaultMessage:
        'Þekkir þú kennitölu eða kerfiskennitölu forsjár- eða umsjáraðila barnsins?',
      description:
        'Radio label asking whether the user knows the guardians SSN',
    },
    parent1Title: {
      id: 'cpn.application:parents.guardians.parent1Title',
      defaultMessage: 'Forsjáraðili/umsjáraðili 1',
      description: 'Title for guardian 1 section',
    },
    parent2Title: {
      id: 'cpn.application:parents.guardians.parent2Title',
      defaultMessage: 'Forsjáraðili/umsjáraðili 2',
      description: 'Title for guardian 2 section',
    },
    fetchedDataInfo: {
      id: 'cpn.application:parents.guardians.fetchedDataInfo',
      defaultMessage:
        'Upplýsingar t.d. um lögheimili forsjár- eða umsjáraðila, póstnúmer, sveitarfélag, tegund forsjár, ríkisfang, fæðingarstað og dagsetningu nýskráningar eru ekki birtar hér en hafa verið sóttar og verða sendar með tilkynningunni til barnaverndar.',
      description:
        'Info alert shown after guardian data is fetched from national registry',
    },
  }),
  custodians: defineMessages({
    sectionTitle: {
      id: 'cpn.application:parents.custodians.sectionTitle',
      defaultMessage: 'Forsjár- eða umsjáraðilar',
      description: 'Custodians section title',
    },
    title: {
      id: 'cpn.application:parents.custodians.title',
      defaultMessage: 'Upplýsingar um forsjár- eða umsjáraðila',
      description: 'Custodians title',
    },
    description: {
      id: 'cpn.application:parents.custodians.description',
      defaultMessage:
        'Upplýsingar um forsjár- eða umsjáraðila barns með kerfiskennitölu eru ekki tiltækar í opinberum skrám.',
      description: 'Intro description for the custodians section',
    },
    radioLabel: {
      id: 'cpn.application:parents.custodians.radioLabel',
      defaultMessage:
        'Þekkir þú kennitölu eða kerfiskennitölu forsjár- eða umsjáraðila barnsins?',
      description:
        'Radio label asking whether the user knows the custodians SSN',
    },
    parent1Title: {
      id: 'cpn.application:parents.custodians.parent1Title',
      defaultMessage: 'Forsjáraðili/umsjáraðili 1',
      description: 'Title for custodian 1 section',
    },
    parent2Title: {
      id: 'cpn.application:parents.custodians.parent2Title',
      defaultMessage: 'Forsjáraðili/umsjáraðili 2',
      description: 'Title for custodian 2 section',
    },
    fetchedDataInfo: {
      id: 'cpn.application:parents.custodians.fetchedDataInfo',
      defaultMessage:
        'Upplýsingar t.d. um lögheimili forsjár- eða umsjáraðila, póstnúmer, sveitarfélag, tegund forsjár, ríkisfang, fæðingarstað og dagsetningu nýskráningar eru ekki birtar hér en hafa verið sóttar og verða sendar með tilkynningunni til barnaverndar.',
      description:
        'Info alert shown after custodian data is fetched from national registry',
    },
  }),
}
