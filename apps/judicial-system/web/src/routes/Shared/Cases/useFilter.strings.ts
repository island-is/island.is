import { defineMessages } from 'react-intl'

export const useFilter = defineMessages({
  allCases: {
    id: 'judicial.system.core:use_filter.all_cases',
    defaultMessage: 'Öll mál',
    description: 'Notaður sem valmöguleiki á sía öll mál',
  },
  investicationCases: {
    id: 'judicial.system.core:use_filter.investigation_cases',
    defaultMessage: 'Rannsóknarmál',
    description: 'Notaður sem valmöguleiki á sía Rannsóknarmál mál',
  },
  indictmentCases: {
    id: 'judicial.system.core:use_filter.indictment_cases',
    defaultMessage: 'Sakamál',
    description: 'Notaður sem valmöguleiki á sía Sakamál mál',
  },
  myCases: {
    id: 'judicial.system.core:use_filter.my_cases',
    defaultMessage: 'Mín mál',
    description: 'Notaður sem valmöguleiki á sía mín mál',
  },
})
