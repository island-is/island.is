import { defineMessages } from 'react-intl'

export const errorMessages = defineMessages({
  phoneNumber: {
    id: 'nps.application:error.phoneNumber',
    defaultMessage: 'Símanúmerið þarf að vera gilt.',
    description: 'The phone number must be valid.',
  },
  nationalId: {
    id: 'nps.application:error.nationalId',
    defaultMessage: 'Kennitala þarf að vera gild.',
    description: 'National id must be valid',
  },
  relativeSameAsGuardian: {
    id: 'nps.application:error.relativeSameAsGuardian',
    defaultMessage: 'Aðstandandi má ekki vera forsjáraðili',
    description: 'A relative may not be a guardian',
  },
  siblingsRequired: {
    id: 'nps.application:error.siblingsRequired',
    defaultMessage: 'Nauðsynlegt er að bæta við að minnsta kosti einu systkini',
    description: 'You must add at least one sibling',
  },
  languagesRequired: {
    id: 'nps.application:error.languagesRequired',
    defaultMessage: 'Það þarf að velja að minnsta kosti eitt tungumál',
    description: 'At least one language must be selected',
  },
  languageRequired: {
    id: 'nps.application:error.languageRequired',
    defaultMessage: 'Það þarf að velja tungumál',
    description: 'Language must be selected',
  },
  twoLanguagesRequired: {
    id: 'nps.application:error.twoLanguagesRequired',
    defaultMessage: 'Það þarf að velja að minnsta kosti tvö tungumál',
    description: 'At least two language must be selected',
  },
  expectedEndDateRequired: {
    id: 'nps.application:error.expectedEndDateRequired',
    defaultMessage: 'Það þarf að velja áætlaðan lokadag',
    description: 'You must select an expected end date',
  },
  expectedEndDateMessage: {
    id: 'nps.application:error.expectedEndDateMessage',
    defaultMessage: 'Lokadagur má ekki vera fyrir byrjunardag',
    description: 'End date cannot be before start date',
  },
  noChildrenFoundTitle: {
    id: 'nps.application:error.noChildrenFoundTitle',
    defaultMessage: 'Því miður ert þú ekki með skráð barn á grunnskólaaldri',
    description:
      'Unfortunately, you do not have a child registered at primary school age',
  },
  noChildrenFoundMessage: {
    id: 'nps.application:error.noChildrenFoundMessage#markdown',
    defaultMessage:
      'Eingöngu sá sem er með lögheimilisforsjá hefur heimild til að sækja um fyrir barn. \n\nÞjóðskrá skráir hver eða hverjir teljast foreldrar barns og hver fari með forsjárskyldur þess. Upplýsingar um skráningu forsjár og lögheimilisforeldris má nálgast hér: [Foreldrar og forsjá | Þjóðskrá (skra.is)](https://www.skra.is/folk/skraning-barns/foreldrar-og-forsja/)\n\nUpplýsingum um tengsl á milli barna og foreldra auk forsjáraðila eru einnig aðgengilegar á [Mínum síðum á Ísland.is](https://island.is/minarsidur)',
    description:
      'Only the person who has legal custody has the authority to apply for a child.\n\nThe National Registry records who or which individuals are considered to be the parents of a child and who has custody responsibilities. Information on registering custody and legal guardianship can be found here: [Parents and Custody | National Registry (skra.is)](https://www.skra.is/folk/skraning-barns/foreldrar-og-forsja/)\n\nInformation about the relationship between children and parents, as well as custody authorities, is also available on [My Pages on Ísland.is](https://island.is/minarsidur)',
  },
  foodAllergiesOrIntolerancesRequired: {
    id: 'nps.application:error.foodAllergiesOrIntolerancesRequired',
    defaultMessage:
      'Það þarf að velja að minnsta kosti eitt fæðuofnæmi eða -óþol',
    description: 'At least one food allergy or intolerance must be selected',
  },
  otherAllergiesRequired: {
    id: 'nps.application:error.otherAllergiesRequired',
    defaultMessage: 'Það þarf að velja að minnsta kosti eitt ofnæmi',
    description: 'At least one allergy must be selected',
  },
})
