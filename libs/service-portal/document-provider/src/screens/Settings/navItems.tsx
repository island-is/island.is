import {
  NavigationScreenItem,
  ServicePortalPath,
} from '@island.is/service-portal/core'
import { m } from '../../lib/messages'

export const navScreenItems: NavigationScreenItem[] = [
  {
    name: m.EditInstitution,
    url: ServicePortalPath.DocumentProviderSettingsEditInstituion,
    text: m.EditInstitutionDescription,
    tags: [m.EditInstitutionTagOne, m.EditInstitutionTagTwo],
  },
  {
    name: m.EditResponsibleContact,
    url: ServicePortalPath.DocumentProviderSettingsEditResponsibleContact,
    text: m.EditResponsibleContactDescription,
    tags: [m.EditResponsibleContactTagOne, m.EditResponsibleContactTagTwo],
  },
  {
    name: m.EditTechnicalContact,
    url: ServicePortalPath.DocumentProviderSettingsEditTechnicalContact,
    text: m.EditTechnicalContactDescription,
    tags: [m.EditTechnicalContactTagOne, m.EditTechnicalContactTagTwo],
  },
  {
    name: m.EditUserHelpContact,
    url: ServicePortalPath.DocumentProviderSettingsEditUserHelpContact,
    text: m.EditUserHelpContactDescription,
    tags: [m.EditUserHelpContactTagOne, m.EditUserHelpContactTagTwo],
  },
  {
    name: m.EditEndPoints,
    url: ServicePortalPath.DocumentProviderSettingsEditEndpoints,
    text: m.EditEndPointsDescription,
    tags: [m.EditEndPointsTagOne, m.EditEndPointsTagTwo],
  },
]
