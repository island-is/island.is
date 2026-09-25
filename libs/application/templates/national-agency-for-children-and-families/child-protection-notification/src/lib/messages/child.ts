import { defineMessages } from 'react-intl'

export const childMessages = {
  shared: defineMessages({
    sectionTitle: {
      id: 'cpn.application:child.shared.sectionTitle',
      defaultMessage: 'Barn',
      description: 'Child section title',
    },
  }),
  nationalIdLookup: defineMessages({
    childInfoTitle: {
      id: 'cpn.application:child.nationalIdLookup.childInfoTitle',
      defaultMessage: 'Upplýsingar um barnið',
      description:
        'Title for the child info fields shown when user knows national ID',
    },
    description: {
      id: 'cpn.application:child.nationalIdLookup.description',
      defaultMessage:
        'Upplýsingaöflun á næstu skrefum ræðst af því hvort kennitala er þekkt eða ekki.',
      description:
        'Combined intro description for the child national ID lookup page',
    },
    radioLabel: {
      id: 'cpn.application:child.nationalIdLookup.radioLabel',
      defaultMessage: 'Þekkir þú kennitölu barns?',
      description:
        "Radio label asking whether the user knows the child's national ID",
    },
    radioOptionUnborn: {
      id: 'cpn.application:child.nationalIdLookup.radioOptionUnborn',
      defaultMessage: 'Barnið er ófætt',
      description: 'The child is unborn',
    },
    usePronounAndPreferredName: {
      id: 'cpn.application:child.nationalIdLookup.usePronounAndPreferredName',
      defaultMessage:
        'Barnið kýs að vera ávarpað með öðru nafni og/eða persónufornafni en hann eða hún',
      description: 'Checkbox label for preferred pronoun or name',
    },
    fetchedDataInfo: {
      id: 'cpn.application:child.nationalIdLookup.fetchedDataInfo',
      defaultMessage:
        'Upplýsingar t.d um kyn barns, ríkisfang, lögheimili, póstnúmer og sveitarfélag eru ekki birtar en verða sendar með tilkynningunni til barnaverndar.',
      description:
        'Info alert shown after child data is fetched from national registry',
    },
    preferredName: {
      id: 'cpn.application:child.nationalIdLookup.preferredName',
      defaultMessage: 'Valið nafn',
      description: 'Label for preferred name field',
    },
    preferredPronoun: {
      id: 'cpn.application:child.nationalIdLookup.preferredPronoun',
      defaultMessage: 'Valið persónufornafn',
      description: 'Label for preferred pronoun select field',
    },
    preferredPronounPlaceholder: {
      id: 'cpn.application:child.nationalIdLookup.preferredPronounPlaceholder',
      defaultMessage: 'Veldu persónufornafn',
      description: 'Placeholder for preferred pronoun select field',
    },
    childOver18Error: {
      id: 'cpn.application:child.nationalIdLookup.childOver18Error',
      defaultMessage:
        'Viðkomandi er orðinn 18 ára og telst því ekki lengur barn samkvæmt barnaverndarlögum. Ef mikilvægt er að koma upplýsingum um viðkomandi á framfæri getur þú haft beint samband við félagsþjónustu eða barnavernd í því sveitarfélagi þar sem viðkomandi býr.',
      description:
        'Error shown when the entered national ID belongs to someone 18 or older',
    },
  }),
  noNationalId: defineMessages({
    reasonLabel: {
      id: 'cpn.application:child.noNationalId.reasonLabel',
      defaultMessage: 'Nánari skýring',
      description: 'Label for the reason dropdown when no national ID is known',
    },
    reasonPlaceholder: {
      id: 'cpn.application:child.noNationalId.reasonPlaceholder',
      defaultMessage: 'Veldu nánari skýringu',
      description: 'Placeholder for the reason dropdown',
    },
  }),
  manualInfo: defineMessages({
    sectionTitle: {
      id: 'cpn.application:child.manualInfo.sectionTitle',
      defaultMessage: 'Upplýsingar um barn',
      description: 'Title for the manual child info subsection',
    },
    intro: {
      id: 'cpn.application:child.manualInfo.intro',
      defaultMessage:
        'Vinsamlegast fylltu út allar þær upplýsingar sem þú hefur vitneskju um.',
      description: 'Intro text for the manual child info page',
    },
    basicInfoTitle: {
      id: 'cpn.application:child.manualInfo.basicInfoTitle',
      defaultMessage: 'Grunnupplýsingar barns',
      description: 'Title for the basic child information group',
    },
    addressTitle: {
      id: 'cpn.application:child.manualInfo.addressTitle',
      defaultMessage: 'Heimilisfang barns',
      description: 'Title for address group',
    },
    languageTitle: {
      id: 'cpn.application:child.manualInfo.languageTitle',
      defaultMessage: 'Á hvaða tungumáli finnst barninu best að tjá sig?',
      description: 'Title for the language group',
    },
  }),
}
