import { defineMessages } from 'react-intl'

export const strings = defineMessages({
  heightenSecurityLabel: {
    id: 'judicial.system.core:prosecutor_section.heighten_security.label',
    defaultMessage: 'Hækka öryggisstig',
    description: 'Notaður sem texti í "Hækka öryggisstig" checkboxi.',
  },
  heightenSecurityInfo: {
    id: 'judicial.system.core:prosecutor_section.heighten_security.info',
    defaultMessage:
      'Með því að hækka öryggisstig á kröfunni verður krafan eingöngu aðgengileg þeim sem stofnaði kröfuna ásamt skráðum ákæranda í málinu.',
    description: 'Notaður sem upplýsingatexti í "Hækka öryggisstig" checkboxi.',
  },
  accessModalTitle: {
    id: 'judicial.system.core:prosecutor_section.access_modal.title',
    defaultMessage: 'Viltu skrá annan saksóknara á málið?',
    description:
      'Notaður sem titill fyrir "viltu skrá annan saksóknara á málið" tilkynningagluggan á óskir um fyrirtöku skrefi.',
  },
  accessModalText: {
    id: 'judicial.system.core:prosecutor_section.access_modal.text',
    defaultMessage:
      'Með því að skrá annan saksóknara á málið lokast þinn aðgangur að málinu og það verður ekki lengur sýnilegt þér í listanum.',
    description:
      'Notaður sem texti í "viltu skrá annan saksóknara á málið" tilkynningaglugganum á óskir um fyrirtöku skrefi.',
  },
  accessModalPrimaryButtonText: {
    id: 'judicial.system.core:prosecutor_section.access_modal.primary_button_text',
    defaultMessage: 'Já, halda áfram',
    description:
      'Notaður sem texti í "halda áfram" takkanum í tilkynningaglugganum á óskir um fyrirtöku skrefi.',
  },
  accessModalSecondaryButtonText: {
    id: 'judicial.system.core:prosecutor_section.access_modal.secondary_button_text',
    defaultMessage: 'Nei, hætta við',
    description:
      'Notaður sem texti í "hætta við" takkanum í tilkynningaglugganum á óskir um fyrirtöku skrefi.',
  },
})
