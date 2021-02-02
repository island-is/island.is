import { useState, useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import { useLocale } from '@island.is/localization'
import { ApplicationTypes, ExternalData } from "@island.is/application/core"
import { hasHealthInsurance, hasActiveApplication, hasOldPendingApplications, hasIcelandicAddress, isFormerCountryOutsideEu } from '../healthInsuranceUtils'
import { ContentType } from '../types'
import { m } from '../forms/messages'

interface ContentRecord {
  [key: string]: ContentType
}

const contentList = {
  hasHealthInsurance: {
    title: m.alreadyInsuredTitle,
    description: m.alreadyInsuredDescription,
    buttonText: m.alreadyInsuredButtonText,
    // buttonAction: () => history.push(`../umsoknir/${typeId}`)
  },
  activeApplication: {
    title: m.activeApplicationTitle,
    description: m.activeApplicationDescription,
    buttonText: m.activeApplicationButtonText,
    // buttonAction: () => {}
  },
  // oldPendingApplications: {
  //   title: m.activeApplicationTitle,
  //   description: m.oldPendingApplicationDescription,
  // },
  registerAddress: {
    title: m.registerYourselfTitle,
    description: m.registerYourselfDescription,
    buttonText: m.registerYourselfButtonText,
    // buttonAction: () => {}
  },
  waitingPeriod: {
    title: m.waitingPeriodTitle,
    description: m.waitingPeriodDescription,
    buttonText: m.waitingPeriodButtonText,
    // buttonAction: () => {}
  },
}

export const useModalContent = (externalData: ExternalData) => {
  const [content, setContent] = useState<any>() //TODO fix type!! and initialValue
  const history = useHistory()

  useEffect(() => {
    if (hasHealthInsurance(externalData)) {
      setContent({ ...contentList.hasHealthInsurance, buttonAction: () => history.push(`../umsoknir/${ApplicationTypes.HEALTH_INSURANCE}`) })
    } else if (hasActiveApplication(externalData)) {
      setContent({ ...contentList.activeApplication, buttonAction: () => history.push(`../umsoknir/${ApplicationTypes.HEALTH_INSURANCE}`)})
    } else if (hasOldPendingApplications(externalData)) {
      const oldPendingApplications = externalData?.oldPendingApplications
      ?.data as string[]
      setContent({
        title: m.activeApplicationTitle,
        description: m.oldPendingApplicationDescription,
        buttonText: () => ({
          ...m.oldPendingApplicationDescription,
          values: { applicationNumber: oldPendingApplications[0] },
        }),
        buttonAction: () => history.push(`../umsoknir/${ApplicationTypes.HEALTH_INSURANCE}`),
      })
    } else if (hasIcelandicAddress(externalData)) {
      setContent({ ...contentList.registerAddress, buttonAction: () => history.push(`../umsoknir/${ApplicationTypes.HEALTH_INSURANCE}`)})
    } 
    // else if (isFormerCountryOutsideEu(externalData)) {
    //   setContent({ ...contentList.activeApplication, buttonAction: () => history.push(`../umsoknir/${ApplicationTypes.HEALTH_INSURANCE}`)})
    // }
  }, [externalData])

  return content
}

export default useModalContent

