import { useState, useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import { ApplicationTypes, ExternalData } from '@island.is/application/core'
import {
  hasHealthInsurance,
  hasActiveDraftApplication,
  pendingApplications,
  hasIcelandicAddress,
} from '../healthInsuranceUtils'
import { useLocale } from '@island.is/localization'
import { ContentType } from '../types'
import { m } from '../forms/messages'
import { Applications } from '../dataProviders/APIDataTypes'

export const useModalContent = (externalData: ExternalData) => {
  const [content, setContent] = useState<ContentType>()
  const history = useHistory()
  const { lang } = useLocale()
  const applications = externalData?.applications.data as Applications[]
  const sortedApplications = applications.sort((a, b) =>
    new Date(a.created) > new Date(b.created) ? 1 : -1,
  )
  const firstCreatedApplicationId = sortedApplications[0].id

  const contentList = {
    hasHealthInsurance: {
      title: m.alreadyInsuredTitle,
      description: m.alreadyInsuredDescription,
      buttonText: m.alreadyInsuredButtonText,
      buttonAction: () =>
        (window.location.href =
          lang === 'is' ? 'sjukra.is' : 'sjukra.is/english'),
    },
    activeDraftApplication: {
      title: m.activeDraftApplicationTitle,
      description: m.activeDraftApplicationDescription,
      buttonText: m.activeDraftApplicationButtonText,
      buttonAction: () =>
        history.push(`../umsokn/${firstCreatedApplicationId}`),
    },
    pendingApplication: {
      title: m.pendingApplicationTitle,
      buttonText: m.pendingApplicationButtonText,
      buttonAction: () =>
        (window.location.href = `https://www.sjukra.is/um-okkur/thjonustuleidir/`),
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
    } else if (pendingApplications(externalData)) {
      const oldPendingApplications = externalData?.oldPendingApplications
        ?.data as string[]
      setContent({
        ...contentList.pendingApplication,
        description: () => ({
          ...m.pendingApplicationDescription,
          values: { applicationNumber: oldPendingApplications[0] },
        }),
      })
    } else if (hasIcelandicAddress(externalData)) {
      setContent(contentList.registerAddress)
    } else if (hasActiveDraftApplication(externalData)) {
      setContent(contentList.activeDraftApplication)
    }
  }, [externalData])

  return content
}

export default useModalContent
