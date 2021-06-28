import {
  NavigationScreenItem,
  ServicePortalPath,
} from '@island.is/service-portal/core'
import { m } from '../../lib/messages'
import { m } from '@island.is/service-portal/core'

export const navScreenItems: NavigationScreenItem[] = [
  {
    name: m.EditInstitution,
    url: ServicePortalPath.DocumentProviderSettingsEditInstituion,
    text: m.EditInstitutionDescription,
    tags: [m.name, m.natreg, m.address, m.email, m.telNumber],
  },
  {
    name: m.EditResponsibleContact,
    url: ServicePortalPath.DocumentProviderSettingsEditResponsibleContact,
    text: m.EditResponsibleContactDescription,
    tags: [m.name, m.email, m.telNumber],
  },
  {
    name: m.EditTechnicalContact,
    url: ServicePortalPath.DocumentProviderSettingsEditTechnicalContact,
    text: m.EditTechnicalContactDescription,
    tags: [m.name, m.email, m.telNumber],
  },
  {
    name: m.EditUserHelpContact,
    url: ServicePortalPath.DocumentProviderSettingsEditUserHelpContact,
    text: m.EditUserHelpContactDescription,
    tags: [m.email, m.telNumber],
  },
  {
    name: m.EditEndPoints,
    url: ServicePortalPath.DocumentProviderSettingsEditEndpoints,
    text: m.EditEndPointsDescription,
    tags: [m.endpoint],
  },
]
