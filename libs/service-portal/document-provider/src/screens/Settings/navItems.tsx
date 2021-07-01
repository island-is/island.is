import {
  NavigationScreenItem,
  ServicePortalPath,
} from '@island.is/service-portal/core'
import { m } from '../../lib/messages'
import { m as spm } from '@island.is/service-portal/core'

export const navScreenItems: NavigationScreenItem[] = [
  {
    name: m.EditInstitution,
    url: ServicePortalPath.DocumentProviderSettingsEditInstituion,
    text: m.EditInstitutionDescription,
    tags: [spm.name, spm.natreg, spm.address, spm.email, spm.telNumber],
  },
  {
    name: m.EditResponsibleContact,
    url: ServicePortalPath.DocumentProviderSettingsEditResponsibleContact,
    text: m.EditResponsibleContactDescription,
    tags: [spm.name, spm.email, spm.telNumber],
  },
  {
    name: m.EditTechnicalContact,
    url: ServicePortalPath.DocumentProviderSettingsEditTechnicalContact,
    text: m.EditTechnicalContactDescription,
    tags: [spm.name, spm.email, spm.telNumber],
  },
  {
    name: m.EditUserHelpContact,
    url: ServicePortalPath.DocumentProviderSettingsEditUserHelpContact,
    text: m.EditUserHelpContactDescription,
    tags: [spm.email, spm.telNumber],
  },
  {
    name: m.EditEndPoints,
    url: ServicePortalPath.DocumentProviderSettingsEditEndpoints,
    text: m.EditEndPointsDescription,
    tags: [spm.endpoint],
  },
]
