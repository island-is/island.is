import { defineMessages } from 'react-intl'

export const strings = defineMessages({
  policeCaseNumberLabel: {
    id: 'judicial.system.core:police_case_info.police_case_number_label',
    defaultMessage: 'LÖKE málsnúmer',
    description:
      'Notaður sem titill í "LÖKE málsnúmer" textaboxi í LÖKE máli á ákærða skrefi í ákærum.',
  },
  policeCaseNumberPlaceholder: {
    id: 'judicial.system.core:police_case_info.police_case_number_placeholder',
    defaultMessage: '{prefix}-{year}-X',
    description:
      'Notaður sem skýritexti í "LÖKE málsnúmer" textaboxi í LÖKE máli á ákærða skrefi í ákærum.',
  },
  policeCaseNumberExists: {
    id: 'judicial.system.core:police_case_info.police_case_number_exists',
    defaultMessage: 'LÖKE málsnúmer er þegar skráð',
    description: 'Notaður sem villuboð þegar LÖKE málsnúmer er þegar skráð.',
  },
  policeCasePlaceLabel: {
    id: 'judicial.system.core:police_case_info.police_case_place_label',
    defaultMessage: 'Vettvangur',
    description:
      'Notaður sem titill í "Vettvangur" textaboxi í LÖKE máli á ákærða skrefi í ákærum.',
  },
  policeCasePlacePlaceholder: {
    id: 'judicial.system.core:police_case_info.police_case_place_placeholder',
    defaultMessage: 'Sláðu inn vettvang',
    description:
      'Notaður sem skýritexti í "Vettvangur" textaboxi í LÖKE máli á ákærða skrefi í ákærum.',
  },
  indictmentTypeLabel: {
    id: 'judicial.system.core:police_case_info.indictment_type_label',
    defaultMessage: 'Sakarefni',
    description:
      'Notaður sem titill í "Sakarefni" listanum í LÖKE máli á ákærða skrefi í ákærum.',
  },
  indictmentTypePlaceholder: {
    id: 'judicial.system.core:police_case_info.indictment_type_placeholder',
    defaultMessage: 'Veldu sakarefni',
    description:
      'Notaður sem skýritexti í "Sakarefni" listanum í LÖKE máli á ákærða skrefi í ákærum.',
  },
  delete: {
    id: 'judicial.system.core:police_case_info.delete',
    defaultMessage: 'Eyða',
    description:
      'Notaður sem texti á "Eyða" hnappinn í LÖKE máli á ákærða skrefi í ákærum.',
  },
  removeSubtype: {
    id: 'judicial.system.core:police_case_info.remove_subtype',
    defaultMessage: 'Eyða undirtegund ákæru {subtype}',
    description:
      'Notaður sem aria label á takkana fyrir undirtegund ákæru á ákærða skrefi í ákærum.',
  },
})
