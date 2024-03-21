import {
  buildForm,
  buildSection,
  getValueViaPath,
} from '@island.is/application/core'
import {
  Application,
  Form,
  FormModes,
  StaticText,
} from '@island.is/application/types'
import { informationSection } from './InformationSection'
import { Logo } from '../../assets/Logo'
import {
  buildFormConclusionSection,
  buildFormPaymentChargeOverviewSection,
} from '@island.is/application/ui-forms'
import { conclusion, externalData, payment } from '../../lib/messages'
import { getChargeItemCodes } from '../../utils'

const determineMessageFromApplicationAnswers = (
  application: Application,
): StaticText | undefined => {
  const regNumber =
    getValueViaPath(application.answers, 'machine.regNumber', undefined) ||
    ('' as string)
  console.log('application', application)
  return {
    ...conclusion.default.accordionTitle,
    defaultMessage: conclusion.default.accordionTitle.defaultMessage.replace(
      '{value}',
      regNumber,
    ),
  }
}

export const TransferOfMachineOwnershipForm: Form = buildForm({
  id: 'TransferOfMachineOwnershipFormDraft',
  title: '',
  logo: Logo,
  mode: FormModes.DRAFT,
  renderLastScreenButton: true,
  renderLastScreenBackButton: true,
  children: [
    buildSection({
      id: 'externalData',
      title: externalData.dataProvider.sectionTitle,
      children: [],
    }),
    informationSection,
    // buildFormPaymentChargeOverviewSection({
    //   sectionTitle: payment.general.title,
    //   getSelectedChargeItems: (_) =>
    //     getChargeItemCodes().map((x) => ({
    //       chargeItemCode: x,
    //     })),
    // }),
    buildFormConclusionSection({
      sectionTitle: conclusion.general.sectionTitle,
      multiFieldTitle: conclusion.general.title,
      alertTitle: conclusion.default.accordionTitle,
      expandableHeader: conclusion.default.expandableHeader,
      expandableDescription: conclusion.default.expandableDescription,
    }),
  ],
})
