import { useState, useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import { ApplicationTypes, ExternalData } from '@island.is/application/core'
import {
  hasHealthInsurance,
  hasActiveApplication,
  hasOldPendingApplications,
  hasIcelandicAddress,
  isFormerCountryOutsideEu,
} from '../healthInsuranceUtils'
import { ContentType } from '../types'
import { m } from '../forms/messages'

export const useModalContent = (externalData: ExternalData) => {
  const [content, setContent] = useState<ContentType>()
  const history = useHistory()

  const contentList = {
    hasHealthInsurance: {
      title: m.alreadyInsuredTitle,
      description: m.alreadyInsuredDescription,
      buttonText: m.alreadyInsuredButtonText,
      buttonAction: () =>
        history.push(`../umsoknir/${ApplicationTypes.HEALTH_INSURANCE}`),
    },
    activeApplication: {
      title: m.activeApplicationTitle,
      description: m.activeApplicationDescription,
      buttonText: m.activeApplicationButtonText,
      buttonAction: () =>
        history.push(`../umsoknir/${ApplicationTypes.HEALTH_INSURANCE}`), //TODO, add when we have link to mypages
    },
    oldPendingApplications: {
      title: m.activeApplicationTitle,
      buttonText: m.oldPendingApplicationButtonText,
      buttonAction: () =>
        (window.location.href = `https://www.sjukra.is/um-okkur/thjonustuleidir/`),
    },
    registerAddress: {
      title: m.registerYourselfTitle,
      description: m.registerYourselfDescription,
      buttonText: m.registerYourselfButtonText,
      buttonAction: () =>
        (window.location.href = `https://www.island.is/en/legal-domicile-immigrant`),
    },
    waitingPeriod: {
      title: m.waitingPeriodTitle,
      description: m.waitingPeriodDescription,
      buttonText: m.waitingPeriodButtonText,
      buttonAction: () =>
        (window.location.href = `https://www.sjukra.is/english/health-insurance-abroad/european-health-insurance-card/european-countries/ `),
    },
  }

  useEffect(() => {
    if (hasHealthInsurance(externalData)) {
      setContent(contentList.hasHealthInsurance)
    } else if (hasActiveApplication(externalData)) {
      setContent(contentList.activeApplication)
    } else if (hasOldPendingApplications(externalData)) {
      const oldPendingApplications = externalData?.oldPendingApplications
        ?.data as string[]
      setContent({
        ...contentList.oldPendingApplications,
        description: () => ({
          ...m.oldPendingApplicationDescription,
          values: { applicationNumber: oldPendingApplications[0] },
        }),
      })
    } else if (hasIcelandicAddress(externalData)) {
      setContent(contentList.registerAddress)
    }
    // else if (isFormerCountryOutsideEu(externalData)) {
    //   setContent({ ...contentList.activeApplication, buttonAction: () => history.push(`../umsoknir/${ApplicationTypes.HEALTH_INSURANCE}`)})
    // }
  }, [externalData])

  return content
}

export default useModalContent
