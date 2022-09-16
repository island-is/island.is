import { formatText, getValueViaPath } from '@island.is/application/core'
import { Application } from '@island.is/application/types'
import { messages } from '@island.is/application/templates/institution-collaboration'
import { useLocale } from '@island.is/localization'

export function hasConstraintType(
  constraintType: string,
  application: Application,
) {
  try {
    return getValueViaPath(
      application.answers,
      'constraints.' + constraintType,
    ) as boolean
  } catch (err) {
    return false
  }
}

export function getServicesArray(application: Application): string[] {
  const { formatMessage } = useLocale()
  //#region Services Text
  const servicesTextArr: string[] = []
  hasConstraintType('hasMail', application) &&
    servicesTextArr.push(
      formatText(
        messages.constraints.constraintsMailLabel,
        application,
        formatMessage,
      ),
    )

  hasConstraintType('hasLogin', application) &&
    servicesTextArr.push(
      formatText(
        messages.constraints.constraintsLoginLabel,
        application,
        formatMessage,
      ),
    )
  hasConstraintType('hasStraumur', application) &&
    servicesTextArr.push(
      formatText(
        messages.constraints.constraintsStraumurLabel,
        application,
        formatMessage,
      ),
    )
  hasConstraintType('hasWebsite', application) &&
    servicesTextArr.push(
      formatText(
        messages.constraints.constraintsWebsiteLabel,
        application,
        formatMessage,
      ),
    )
  hasConstraintType('hasApply', application) &&
    servicesTextArr.push(
      formatText(
        messages.constraints.constraintsApplyingLabel,
        application,
        formatMessage,
      ),
    )
  hasConstraintType('hasMyPages', application) &&
    servicesTextArr.push(
      formatText(
        messages.constraints.constraintsmyPagesLabel,
        application,
        formatMessage,
      ),
    )
  hasConstraintType('hasCert', application) &&
    servicesTextArr.push(
      formatText(
        messages.constraints.constraintsCertLabel,
        application,
        formatMessage,
      ),
    )
  hasConstraintType('hasConsult', application) &&
    servicesTextArr.push(
      formatText(
        messages.constraints.constraintsConsultLabel,
        application,
        formatMessage,
      ),
    )

  //#endregion Services Text
  return servicesTextArr
}
