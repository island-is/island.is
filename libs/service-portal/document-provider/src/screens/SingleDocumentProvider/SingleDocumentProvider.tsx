import React, { useEffect, useState } from 'react'
import { ServicePortalModuleComponent } from '@island.is/service-portal/core'
import { useLocale } from '@island.is/localization'
import { Box, Text } from '@island.is/island-ui/core'
import { m } from '../../lib/messages'
import { useLocation, useParams } from 'react-router-dom'
import { DocumentProviderOrganisationForm } from './DocumentProviderOrganisationForm'
import { OrganisationPreview } from '../DocumentProviders/DocumentProviders'
import { DocumentProviderTechnicalContactForm } from './DocumentProviderTechnicalContactForm'
import { DocumentProviderAdministrativeContactForm } from './DocumentProviderAdministrativeContactForm'
import { DocumentProviderHelpDeskForm } from './DocumentProviderHelpDeskForm'
import { DocumentProviderDashboard } from './DocumentProviderDashboard'
import { useGetOrganisation } from '../../shared/useGetOrganisation'
//TODO fix breadcrumbs so you can go back to DocmentProviders site
export const IsFetchingProviderOrganisationContext = React.createContext(false)

const SingleDocumentProvider: ServicePortalModuleComponent = ({ userInfo }) => {
  const params = useParams<{ nationalId: string }>()
  const { state: organisationPreview } = useLocation<OrganisationPreview>()
  const { formatMessage } = useLocale()

  const [organisationName, setOrganisationName] = useState(
    organisationPreview?.name ||
      formatMessage(m.SingleProviderOrganisationNameNotFoundMessage),
  )

  const { organisation, loading } = useGetOrganisation(params.nationalId)
  useEffect(() => {
    const name = organisation?.name
    if (name) setOrganisationName(name)
  }, [organisation?.name])

  const { technicalContact, administrativeContact, helpdesk } =
    organisation || {}
  return (
    <Box marginBottom={[2, 3, 5]}>
      <Box marginBottom={[2, 3]}>
        <Text variant="h1" as="h1">
          {organisationName}
        </Text>
      </Box>
      <Box marginBottom={[2, 3]}>
        <Text as="p">{formatMessage(m.SingleProviderDescription)}</Text>
      </Box>
      <Box>
        <IsFetchingProviderOrganisationContext.Provider value={loading}>
          <DocumentProviderDashboard />
          <DocumentProviderOrganisationForm
            organisation={organisation}
            setOrganisationName={setOrganisationName}
          />
          <DocumentProviderTechnicalContactForm
            organisationId={organisation?.id}
            organisationNationalId={organisation?.nationalId}
            technicalContact={technicalContact}
          />
          <DocumentProviderAdministrativeContactForm
            organisationId={organisation?.id}
            organisationNationalId={organisation?.nationalId}
            administrativeContact={administrativeContact}
          />
          <DocumentProviderHelpDeskForm
            organisationId={organisation?.id}
            helpDesk={helpdesk}
            organisationNationalId={organisation?.nationalId}
          />
        </IsFetchingProviderOrganisationContext.Provider>
      </Box>
    </Box>
  )
}

export default SingleDocumentProvider
