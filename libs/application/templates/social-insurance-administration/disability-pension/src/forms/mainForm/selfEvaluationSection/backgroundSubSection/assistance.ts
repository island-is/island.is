import { buildMultiField, buildRadioField } from "@island.is/application/core";
import { disabilityPensionFormMessage } from "../../../../lib/messages";
import { SectionRouteEnum } from "../../../../types";
import { yesOrNoOptions } from "../../../../utils";

export const assistanceField = buildMultiField({
  id: SectionRouteEnum.SELF_EVALUATION,
  title: disabilityPensionFormMessage.selfEvaluation.title,
  description: disabilityPensionFormMessage.selfEvaluation.description,
  children: [
    buildRadioField({
      id: `${SectionRouteEnum.SELF_EVALUATION}.assistance`,
      title: disabilityPensionFormMessage.selfEvaluation.assistance,
      width: 'half',
      backgroundColor: 'blue',
      options: yesOrNoOptions,
    }),
  ]
})
