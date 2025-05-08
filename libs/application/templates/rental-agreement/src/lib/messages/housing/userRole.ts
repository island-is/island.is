import { defineMessages } from 'react-intl'

export const userRole = defineMessages({
  subSectionName: {
    id: 'ra.application:userRole.subSectionName',
    defaultMessage: 'Aðillar samnings',
    description: 'User role sub section name',
  },
  pageTitle: {
    id: 'ra.application:userRole.pageTitle',
    defaultMessage: 'Aðillar samnings',
    description: 'User role page title',
  },
  pageDescription: {
    id: 'ra.application:userRole.pageDescription',
    defaultMessage:
      'Til að hægt sé að sækja réttar upplýsingar um þig biðjum við þig um að gera grein fyrir því hvort þú sért leigusali eða leigjandi.',
    description: 'User role page description',
  },
  landlordOptionLabel: {
    id: 'ra.application:userRole.landlordOptionLabel',
    defaultMessage: 'Ég er leigusali / í umboði leigusala',
    description: 'Landlord option label',
  },
  tenantOptionLabel: {
    id: 'ra.application:userRole.tenantdOptionLabel',
    defaultMessage: 'Ég er leigjandi / í umboði leigjanda',
    description: 'Tenant option label',
  },
})
