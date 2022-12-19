import {
  buildForm,
  buildSection,
  buildExternalDataProvider,
  buildDataProviderItem,
  buildMultiField,
  buildCustomField,
  buildRadioField,
  buildDescriptionField,
  buildSelectField,
  buildDividerField,
  buildKeyValueField,
  buildSubmitField,
  buildFileUploadField,
  buildTextField,
  buildDateField,
} from '@island.is/application/core'
import {
  Form,
  FormModes,
  Application,
  FormValue,
  DefaultEvents,
} from '@island.is/application/types'
import type { User } from '@island.is/api/domains/national-registry'
import { format as formatNationalId } from 'kennitala'
import {
  NationalRegistryUser,
  UserProfile,
  DistrictCommissionerAgencies,
} from '../types/schema'
import { m } from '../lib/messages'
import format from 'date-fns/format'
import is from 'date-fns/locale/is'
import { HasQualityPhotoData } from '../fields/QualityPhoto/hooks/useQualityPhoto'
import { UPLOAD_ACCEPT, YES, NO, SEND_HOME, PICK_UP } from '../lib/constants'
import { Photo, Delivery } from '../types'
import { sectionDataProviders } from './applicationSections/sectionDataProviders'
import { sectionInformation } from './applicationSections/sectionInformation'
import { sectionPhoto } from './applicationSections/sectionPhoto'
import { sectionDelivery } from './applicationSections/sectionDelivery'
import { sectionOverview } from './applicationSections/sectionOverview'

export const getApplication = (): Form => {
  return buildForm({
    id: 'PMarkApplicationDraftForm',
    title: '',
    mode: FormModes.DRAFT,
    renderLastScreenButton: true,
    renderLastScreenBackButton: true,
    children: [
      sectionDataProviders,
      sectionInformation,
      sectionPhoto,
      sectionDelivery,
      sectionOverview,
    ],
  })
}
