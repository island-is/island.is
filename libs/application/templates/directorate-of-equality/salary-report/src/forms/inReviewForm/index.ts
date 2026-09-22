import { buildForm } from '@island.is/application/core'
import { buildFormConclusionSection } from '@island.is/application/ui-forms'
import {
  FormModes,
  type Application,
  type StaticText,
} from '@island.is/application/types'
import { DirectorateOfEqualityLogo } from '@island.is/application/assets/institution-logos'
import { messages } from '../../lib/messages'
import { salaryAnalysisNeedsImprovementPlan } from '../../utils/salaryAnalysisNavigation'

// IN_REVIEW is reached from three places, and only two of them involve an
// úrbótaáætlun: the plan submits out of POSTPONED and DRAFT_RETRY, and a plain
// report out of DRAFT when the analysis listed no outliers. The copy has to
// follow, or a company with nothing to explain is told its plan is under review.
const whetherPlanned =
  (
    withPlan: StaticText,
    withoutPlan: StaticText,
  ): ((application: Application) => StaticText) =>
  (application) =>
    salaryAnalysisNeedsImprovementPlan(
      application.answers,
      application.externalData,
    )
      ? withPlan
      : withoutPlan

export const inReviewForm = buildForm({
  id: 'inReviewForm',
  logo: DirectorateOfEqualityLogo,
  mode: FormModes.IN_PROGRESS,
  children: [
    buildFormConclusionSection({
      multiFieldTitle: messages.inReview.formTitle,
      sectionTitle: messages.inReview.sectionTitle,
      tabTitle: messages.inReview.sectionTitle,
      alertTitle: whetherPlanned(
        messages.inReview.alertTitle,
        messages.inReview.alertTitleNoPlan,
      ),
      expandableIntro: whetherPlanned(
        messages.inReview.expandableIntro,
        messages.inReview.expandableIntroNoPlan,
      ),
      expandableDescription: whetherPlanned(
        messages.inReview.expandableDescription,
        messages.inReview.expandableDescriptionNoPlan,
      ),
    }),
  ],
})
