import { buildForm } from '@island.is/application/core'
import { Form, FormModes } from '@island.is/application/types'
import { dataCollection } from './Sections/dataCollection'
import { announcerInfo } from './Sections/announcerInfo'
import { spouseOfTheDeceased } from './Sections/spouseOfTheDeceased'
import { estateMembers } from './Sections/estateMembers'
import { testamentInfo } from './Sections/testamentInfo'
import { estateAssets } from './Sections/estateAssets'
import { estateDebts } from './Sections/estateDebts'
import { attachments } from './Sections/attachments'
import { representative } from './Sections/representative'
import { approvePrivateDivisionSubmission } from './Sections/approveSubmission'
import { overview } from './Overviews'
import { estateWithoutAssets } from './Sections/estateWithoutAssets'
import { applicationDescription } from './Sections/description'
import { reminderInfoForAssetsAndDebts } from './Sections/reminderInfoForAssetsAndDebts'

/* EINKASKIPTI */
export const privateDivisionForm: Form = buildForm({
  id: 'privateDivisionForm',
  mode: FormModes.DRAFT,
  renderLastScreenButton: true,
  renderLastScreenBackButton: true,
  children: [
    dataCollection,
    applicationDescription,
    announcerInfo,
    spouseOfTheDeceased,
    estateMembers,
    testamentInfo,
    estateAssets,
    estateDebts,
    attachments,
    representative,
    approvePrivateDivisionSubmission,
    overview,
  ],
})

/* SETA Í ÓSKIPTU BÚI */
export const undividedEstateForm: Form = buildForm({
  id: 'undividedEstateForm',
  mode: FormModes.DRAFT,
  renderLastScreenButton: true,
  renderLastScreenBackButton: true,
  children: [
    dataCollection,
    applicationDescription,
    announcerInfo,
    estateMembers,
    testamentInfo,
    reminderInfoForAssetsAndDebts,
    estateAssets,
    estateDebts,
    attachments,
    overview,
  ],
})

/* EIGNALAUST DÁNARBU */
export const estateWithoutAssetsForm: Form = buildForm({
  id: 'estateWithoutAssetsForm',
  mode: FormModes.DRAFT,
  renderLastScreenButton: true,
  renderLastScreenBackButton: true,
  children: [
    dataCollection,
    applicationDescription,
    announcerInfo,
    estateMembers,
    testamentInfo,
    estateWithoutAssets,
    estateAssets,
    estateDebts,
    attachments,
    overview,
  ],
})

/* OPINBER SKIPTI */
export const officialDivisionForm: Form = buildForm({
  id: 'officialDivisionForm',
  mode: FormModes.DRAFT,
  renderLastScreenButton: true,
  renderLastScreenBackButton: true,
  children: [dataCollection, applicationDescription, announcerInfo, overview],
})
