import { useState, useEffect } from 'react'
import {
  ApplicationTypes,
  ExternalData,
  getSlugFromType,
} from '@island.is/application/core'
import {
  hasHealthInsurance,
  hasActiveDraftApplication,
  hasPendingApplications,
  hasIcelandicAddress,
  getBaseUrl,
  getOldestDraftApplicationId,
} from '../healthInsuranceUtils'
import { useLocale } from '@island.is/localization'
import { ContentType } from '../types'
import { m } from '../forms/messages'
import { Applications } from '../dataProviders/APIDataTypes'

export const useModalContent = (
  externalData: ExternalData,
  typeId: ApplicationTypes,
) => {
  const [content, setContent] = useState<ContentType>()
  const baseUrl = getBaseUrl()
  const { lang } = useLocale()
  const applicationSlug = getSlugFromType(typeId)

  const contentList = {
    hasHealthInsurance: {
      title: m.alreadyInsuredTitle,
      description: m.alreadyInsuredDescription,
      buttonText: m.alreadyInsuredButtonText,
      buttonAction: () =>
        (window.location.href =
          lang === 'is'
            ? 'https://www.sjukra.is'
            : 'https://www.sjukra.is/english'),
    },
    activeDraftApplication: {
      title: m.activeDraftApplicationTitle,
      description: m.activeDraftApplicationDescription,
      buttonText: m.activeDraftApplicationButtonText,
    },
    pendingApplication: {
      title: m.pendingApplicationTitle,
      buttonText: m.pendingApplicationButtonText,
      buttonAction: () =>
        (window.location.href =
          lang === 'is'
            ? 'https://www.sjukra.is/um-okkur/thjonustuleidir/ '
            : 'https://www.sjukra.is/english'),
    },
    registerAddress: {
      title: m.registerYourselfTitle,
      description: m.registerYourselfDescription,
      buttonText: m.registerYourselfButtonText,
      buttonAction: () =>
        (window.location.href =
          lang === 'is'
            ? `${baseUrl}/logheimili-upplysingar-innflytjendur`
            : `${baseUrl}/en/legal-domicile-immigrant`),
    },
  }

  useEffect(() => {
    if (hasHealthInsurance(externalData)) {
      setContent(contentList.hasHealthInsurance)
    } else if (hasPendingApplications(externalData)) {
      const pendingApplications = externalData?.pendingApplications
        ?.data as string[]
      setContent({
        ...contentList.pendingApplication,
        description: () => ({
          ...m.pendingApplicationDescription,
          values: { applicationNumber: pendingApplications[0] },
        }),
      })
    } else if (hasIcelandicAddress(externalData)) {
      setContent(contentList.registerAddress)
    } else if (hasActiveDraftApplication(externalData)) {
      const applications = externalData?.applications.data as Applications[]
      const oldestDraftApplicationId = getOldestDraftApplicationId(applications)
      setContent({
        ...contentList.activeDraftApplication,
        buttonAction: () =>
          (window.location.href = `/umsoknir/${applicationSlug}/${oldestDraftApplicationId}`),
      })
    }
  }, [externalData])

  return content
}

export default useModalContent
