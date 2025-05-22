import { getValueViaPath } from '@island.is/application/core'
import { Application, UserProfile } from '@island.is/application/types'
import { Routes } from '../lib/constants'
import { getChosenApplicant, getChildPassport } from '..'

export const updateAnswers = (
  application: Application,
  nationalId: string,
  setValue: (name: string, value: unknown, config?: object) => void,
): object => {
  const chosenApplicants = getChosenApplicant(
    application.externalData,
    nationalId,
  )
  const applicantUserProfile = getValueViaPath(
    application.externalData,
    'userProfile.data',
    undefined,
  ) as UserProfile | undefined
  const childPassport = getChildPassport(
    application.answers,
    application.externalData,
    nationalId,
  )
  const secondGuardianNationalId = getValueViaPath(
    application.answers,
    `${Routes.SECONDGUARDIANINFORMATION}.nationalId`,
    undefined,
  ) as string | undefined

  // Updates if second guardian is already on answers and is not the same
  const shouldUpdateSecondParent = (): boolean => {
    return (
      !!childPassport?.secondParent &&
      !!secondGuardianNationalId &&
      secondGuardianNationalId !== childPassport?.secondParent
    )
  }

  setValue(`${Routes.APPLICANTSINFORMATION}.name`, chosenApplicants.name)
  setValue(
    `${Routes.APPLICANTSINFORMATION}.nationalId`,
    chosenApplicants.nationalId,
  )
  setValue(
    `${Routes.APPLICANTSINFORMATION}.phoneNumber`,
    applicantUserProfile?.mobilePhoneNumber,
  )
  setValue(`${Routes.APPLICANTSINFORMATION}.email`, applicantUserProfile?.email)

  // If child and has second guardian
  if (shouldUpdateSecondParent()) {
    setValue(
      `${Routes.SECONDGUARDIANINFORMATION}.name`,
      childPassport?.secondParentName,
    )
    setValue(
      `${Routes.SECONDGUARDIANINFORMATION}.nationalId`,
      childPassport?.secondParent,
    )
    setValue(`${Routes.SECONDGUARDIANINFORMATION}.phoneNumber`, '')
    setValue(`${Routes.SECONDGUARDIANINFORMATION}.email`, '')
  }

  return shouldUpdateSecondParent()
    ? {
        ...application.answers,
        [Routes.APPLICANTSINFORMATION]: {
          name: chosenApplicants.name,
          nationalId: chosenApplicants.nationalId,
          phoneNumber: applicantUserProfile?.mobilePhoneNumber,
          email: applicantUserProfile?.email,
        },
        [Routes.SECONDGUARDIANINFORMATION]: {
          name: childPassport?.secondParentName,
          nationalId: childPassport?.secondParent,
          phoneNumber: '',
          email: '',
        },
      }
    : {
        ...application.answers,
        [Routes.APPLICANTSINFORMATION]: {
          name: chosenApplicants.name,
          nationalId: chosenApplicants.nationalId,
          phoneNumber: applicantUserProfile?.mobilePhoneNumber,
          email: applicantUserProfile?.email,
        },
      }
}
