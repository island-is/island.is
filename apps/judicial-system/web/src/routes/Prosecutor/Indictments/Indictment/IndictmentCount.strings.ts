import { defineMessage, defineMessages } from 'react-intl'

export const indictmentCount = {
  delete: defineMessage({
    id:
      'judicial.system.core:indictments_indictment.section.indictment_count.delete',
    defaultMessage: 'Eyða',
    description: 'Notaður sem texti á Eyða hnappi á ákæruliða skrefi í ákærum.',
  }),
  policeNumber: defineMessages({
    label: {
      id:
        'judicial.system.core:indictments_indictment.section.indictment_count.policeNumber.label',
      defaultMessage: 'LÖKE málsnúmer',
      description:
        'Notaður sem titill á LÖKE málsnúmers lista á ákæruliða skrefi í ákærum.',
    },
    placeholder: {
      id:
        'judicial.system.core:indictments_indictment.section.indictment_count.police_number.placeholder',
      defaultMessage: 'Veldu málsnúmer',
      description:
        'Notaður sem skýritexti á LÖKE málsnúmers lista á ákæruliða skrefi í ákærum.',
    },
  }),
  vehicleLicencePlate: defineMessages({
    label: {
      id:
        'judicial.system.core:indictments_indictment.section.indictment_count.vehicle_licence_plate.label',
      defaultMessage: 'Skráningarnúmer ökutækis',
      description:
        'Notaður sem titill á "skráningarnúmer ökutækis" svæði á ákæruliða skrefi í ákærum.',
    },
    placeholder: {
      id:
        'judicial.system.core:indictments_indictment.section.indictment_count.vehicle_licence_plate.placeholder',
      defaultMessage: 'AB-123',
      description:
        'Notaður sem skýritexti á "skráningarnúmer ökutækis" svæði á ákæruliða skrefi í ákærum.',
    },
  }),
  lawBreak: defineMessages({
    label: {
      id:
        'judicial.system.core:indictments_indictment.section.indictment_count.law_break.label',
      defaultMessage: 'Brot',
      description:
        'Notaður sem titill á "brot" lista á ákæruliða skrefi í ákærum.',
    },
    placeholder: {
      id:
        'judicial.system.core:indictments_indictment.section.indictment_count.law_break.placeholder',
      defaultMessage: 'Veldu brot',
      description:
        'Notaður sem skýritexti á "brot" lista á ákæruliða skrefi í ákærum.',
    },
  }),
  lawBroken: defineMessages({
    label: {
      id:
        'judicial.system.core:indictments_indictment.section.indictment_count.law_broken.label',
      defaultMessage: 'Lagaákvæði',
      description:
        'Notaður sem titill á "lagaákvæði" leitarboxi á ákæruliða skrefi í ákærum.',
    },
    placeholder: {
      id:
        'judicial.system.core:indictments_indictment.section.indictment_count.law_broken.placeholder',
      defaultMessage: 'Leitaðu að lagaákvæði',
      description:
        'Notaður sem skýritexti á "lagaákvæði" leitarboxi á ákæruliða skrefi í ákærum.',
    },
  }),
  lawBreakDescription: defineMessages({
    label: {
      id:
        'judicial.system.core:indictments_indictment.section.indictment_count.law_break_description.label',
      defaultMessage: 'Atvikalýsing',
      description:
        'Notaður sem titill á "atvikalýsing" svæði á ákæruliða skrefi í ákærum.',
    },
    placeholder: {
      id:
        'judicial.system.core:indictments_indictment.section.indictment_count.law_break_description.placeholder',
      defaultMessage: 'Skrifaðu atvikalýsingu',
      description:
        'Notaður sem skýritexti á "atvikalýsing" svæði á ákæruliða skrefi í ákærum.',
    },
  }),
  lawsBrokenDescription: defineMessages({
    label: {
      id:
        'judicial.system.core:indictments_indictment.section.indictment_count.laws_broken_description.label',
      defaultMessage: 'Heimfærsla',
      description:
        'Notaður sem titill á "heimfærslu" svæði á ákæruliða skrefi í ákærum.',
    },
    placeholder: {
      id:
        'judicial.system.core:indictments_indictment.section.indictment_count.laws_broken_description.placeholder',
      defaultMessage: 'Skrifaðu heimfærslu',
      description:
        'Notaður sem skýritexti á "heimfærslu" svæði á ákæruliða skrefi í ákærum.',
    },
  }),
}
