import {
  Application,
  ChildrenCustodyInformationApi,
  DefaultEvents,
  MaybeWithApplicationAndField,
  NationalRegistrySpouseApi,
  NationalRegistryUserApi,
} from '@island.is/application/types'
import { CardResponse, NationalRegistry } from '../lib/types'
import {
  EhicApplyForPhysicalCardApi,
  EhicCardResponseApi,
} from '../dataProviders'
import { Form, FormModes } from '@island.is/application/types'
import {
  buildCheckboxField,
  buildCustomField,
  buildDataProviderItem,
  buildDescriptionField,
  buildExternalDataProvider,
  buildForm,
  buildMultiField,
  buildSection,
  buildSubmitField,
} from '@island.is/application/core'
import {
  getDefaultValuesForPDFApplicants,
  getEhicResponse,
  getFromRegistry,
  getFullName,
  hasAPDF,
  someAreNotInsured,
  someCanApplyForPlastic,
  someCanApplyForPlasticOrPdf,
  someHavePDF,
  someHavePlasticButNotPdf,
} from '../lib/helpers/applicantHelper'

import { europeanHealthInsuranceCardApplicationMessages as e } from '../lib/messages'

/* eslint-disable-next-line */
export interface EuropeanHealthInsuranceCardProps { }

export const Declined: Form = buildForm({
  id: 'Declined',
  title: '',
  mode: FormModes.REJECTED,
  children: [
    buildDescriptionField({
      id: 'noInsurance',
      title: e.no.sectionLabel,
      description: e.no.sectionDescription,
    }),

  ],
})

export default Declined
