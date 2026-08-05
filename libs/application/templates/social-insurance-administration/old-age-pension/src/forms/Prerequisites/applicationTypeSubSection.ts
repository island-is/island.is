import { buildRadioField, buildSubSection } from '@island.is/application/core'
import { oldAgePensionFormMessage } from '../../lib/messages'
import { ApplicationType } from '../../utils/constants'

export const applicationTypeSubSection = buildSubSection({
  id: 'applicationTypeSubSection',
  title: oldAgePensionFormMessage.pre.applicationTypeTitle,
  children: [
    buildRadioField({
      id: 'applicationType.option',
      title: oldAgePensionFormMessage.pre.applicationTypeTitle,
      description: oldAgePensionFormMessage.pre.applicationTypeDescription,
      options: [
        {
          value: ApplicationType.OLD_AGE_PENSION,
          dataTestId: 'old-age-pension',
          label: oldAgePensionFormMessage.shared.applicationTitle,
          subLabel:
            oldAgePensionFormMessage.pre
              .retirementPensionApplicationDescription,
        },
        {
          value: ApplicationType.HALF_OLD_AGE_PENSION,
          dataTestId: 'half-old-age-pension',
          label:
            oldAgePensionFormMessage.pre.halfRetirementPensionApplicationTitle,
          subLabel:
            oldAgePensionFormMessage.pre
              .halfRetirementPensionApplicationDescription,
        },
        {
          value: ApplicationType.SAILOR_PENSION,
          dataTestId: 'sailor-pension',
          label: oldAgePensionFormMessage.pre.fishermenApplicationTitle,
          subLabel:
            oldAgePensionFormMessage.pre.fishermenApplicationDescription,
        },
      ],
      required: true,
    }),
  ],
})
