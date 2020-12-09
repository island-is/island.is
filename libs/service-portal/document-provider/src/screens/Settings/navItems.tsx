import {
  NavigationScreenItem,
  ServicePortalPath,
} from '@island.is/service-portal/core'
import { defineMessage } from 'react-intl'

export const navScreenItems: NavigationScreenItem[] = [
  {
    name: defineMessage({
      id: 'sp.document-provider:edit-institution',
      defaultMessage: 'Breyta stofnun',
    }),
    url: ServicePortalPath.DocumentProviderSettingsEditInstituion,
    text: defineMessage({
      id: 'sp.document-provider:edit-institution-description',
      defaultMessage: 'Hér getur þú breytt grunnupplýsingum fyrir stofnun',
    }),
    tags: [
      defineMessage({
        id: 'service.portal:email',
        defaultMessage: 'Netfang',
      }),
      defineMessage({
        id: 'service.portal:tel',
        defaultMessage: 'Símanúmer',
      }),
    ],
  },
  {
    name: defineMessage({
      id: 'sp.document-provider:edit-responsible-contact',
      defaultMessage: 'Breyta ábyrgðarmanni',
    }),
    url: ServicePortalPath.DocumentProviderSettingsEditResponsibleContact,
    text: defineMessage({
      id: 'sp.document-provider:edit-responsible-contact',
      defaultMessage: 'Hér getur þú breytt upplýsingum um ábyrgðarmann',
    }),
    tags: [
      defineMessage({
        id: 'service.portal:email',
        defaultMessage: 'Netfang',
      }),
      defineMessage({
        id: 'service.portal:tel',
        defaultMessage: 'Símanúmer',
      }),
    ],
  },
  {
    name: defineMessage({
      id: 'sp.document-provider:edit-technical-contact',
      defaultMessage: 'Breyta tæknilegum tengilið',
    }),
    url: ServicePortalPath.DocumentProviderSettingsEditTechnicalContact,
    text: defineMessage({
      id: 'sp.document-provider:edit-technical-contact',
      defaultMessage: 'Hér getur þú breytt upplýsingum um tæknilegan tengilið',
    }),
    tags: [
      defineMessage({
        id: 'service.portal:email',
        defaultMessage: 'Netfang',
      }),
      defineMessage({
        id: 'service.portal:tel',
        defaultMessage: 'Símanúmer',
      }),
    ],
  },
  {
    name: defineMessage({
      id: 'sp.document-provider:edit-user-help-contact',
      defaultMessage: 'Breyta notendaaðstoð',
    }),
    url: ServicePortalPath.DocumentProviderSettingsEditUserHelpContact,
    text: defineMessage({
      id: 'sp.document-provider:edit-user-help-contact',
      defaultMessage: 'Hér getur þú breytt upplýsingum um notendaaðstoð',
    }),
    tags: [
      defineMessage({
        id: 'service.portal:email',
        defaultMessage: 'Netfang',
      }),
      defineMessage({
        id: 'service.portal:tel',
        defaultMessage: 'Símanúmer',
      }),
    ],
  },
  {
    name: defineMessage({
      id: 'sp.document-provider:edit-endpoints',
      defaultMessage: 'Breyta endapunkt',
    }),
    url: ServicePortalPath.DocumentProviderSettingsEditEndpoints,
    text: defineMessage({
      id: 'sp.document-provider:edit-endpoints',
      defaultMessage: 'Hér getur þú breytt endpunkt',
    }),
    tags: [
      defineMessage({
        id: 'service.portal:email',
        defaultMessage: 'Netfang',
      }),
      defineMessage({
        id: 'service.portal:tel',
        defaultMessage: 'Símanúmer',
      }),
    ],
  },
]
