import React, { useEffect, useState } from 'react'
import { ServicePortalModuleComponent } from '@island.is/service-portal/core'
import { useLocale } from '@island.is/localization'
import {
  Box,
  DatePicker,
  GridColumn,
  GridRow,
  Text,
} from '@island.is/island-ui/core'
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
  const [fromDate, setFromDate] = useState<Date | undefined>(undefined)
  const [toDate, setToDate] = useState<Date | undefined>(undefined)
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

  const today = new Date()

  return (
    <Box marginBottom={[2, 3, 5]}>
      <Box marginBottom={[2, 3]}>
        <Text variant="h3" as="h1">
          {organisationName}
        </Text>
      </Box>
      <Box marginBottom={[2, 3]}>
        <Text as="p">{formatMessage(m.SingleProviderDescription)}</Text>
      </Box>
      <Box>
        <IsFetchingProviderOrganisationContext.Provider value={loading}>
          <Box marginBottom={[2, 3]}>
            <GridRow>
              <GridColumn span="6/12">
                <DatePicker
                  id="fromDate"
                  label={formatMessage(m.documentProvidersDateFromLabel)}
                  placeholderText={formatMessage(
                    m.documentProvidersDateFromPlaceholderText,
                  )}
                  locale="is"
                  minDate={new Date(2011, 1, 1)}
                  maxDate={new Date()}
                  minYear={2011}
                  maxYear={today.getFullYear()}
                  handleChange={(date: Date) => setFromDate(date)}
                />
              </GridColumn>
              <GridColumn span="6/12">
                <DatePicker
                  id="toDate"
                  label={formatMessage(m.documentProvidersDateToLabel)}
                  placeholderText={formatMessage(
                    m.documentProvidersDateToPlaceholderText,
                  )}
                  locale="is"
                  minDate={new Date(2011, 1, 1)}
                  maxDate={new Date()}
                  minYear={2011}
                  maxYear={today.getFullYear()}
                  handleChange={(date: Date) => setToDate(date)}
                  hasError={fromDate && toDate && toDate < fromDate}
                  errorMessage={formatMessage(
                    m.documentProvidersDateToErrorMessage,
                  )}
                />
              </GridColumn>
            </GridRow>
          </Box>
          <DocumentProviderDashboard
            organisationId={organisationPreview.id}
            fromDate={fromDate}
            toDate={toDate}
          />
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
