import { useState, useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import { ApplicationTypes, ExternalData } from '@island.is/application/core'
import {
  hasHealthInsurance,
  hasActiveApplication,
  hasOldPendingApplications,
  hasIcelandicAddress,
} from '../healthInsuranceUtils'
import { useLocale } from '@island.is/localization'
import { ContentType } from '../types'
import { m } from '../forms/messages'

export const useModalContent = (externalData: ExternalData) => {
  const [content, setContent] = useState<ContentType>()
  const history = useHistory()
  const { lang } = useLocale()

  const contentList = {
    hasHealthInsurance: {
      title: m.alreadyInsuredTitle,
      description: m.alreadyInsuredDescription,
      buttonText: m.alreadyInsuredButtonText,
      buttonAction: () =>
        (window.location.href =
          lang === 'is' ? 'sjukra.is' : 'sjukra.is/english'),
    },
    activeApplication: {
      title: m.activeApplicationTitle,
      description: m.activeApplicationDescription,
      buttonText: m.activeApplicationButtonText,
      buttonAction: () =>
        history.push(`../umsoknir/${ApplicationTypes.HEALTH_INSURANCE}`),
    },
    oldPendingApplications: {
      title: m.activeApplicationTitle,
      buttonText: m.oldPendingApplicationButtonText,
      buttonAction: () => history.push(`../apply-for-health-insurance`),
    },
    registerAddress: {
      title: m.registerYourselfTitle,
      description: m.registerYourselfDescription,
      buttonText: m.registerYourselfButtonText,
      buttonAction: () =>
        (window.location.href =
          lang === 'is'
            ? 'https://www.island.is/logheimili-upplysingar-innflytjendur'
            : 'https://www.island.is/en/legal-domicile-immigrant'),
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
  }, [externalData])

  return content
}

export default useModalContent
