import parse from 'date-fns/parse'
import format from 'date-fns/format'
import is from 'date-fns/locale/is'
import enGB from 'date-fns/locale/en-GB'
import sortBy from 'lodash/sortBy'
import { parsePhoneNumberFromString } from 'libphonenumber-js'
import kennitala from 'kennitala'
import {} from '../types'
import {
  Address,
  ApplicantChildCustodyInformation,
  NationalRegistryIndividual,
} from '@island.is/application/types'

export const formatSsn = (ssn: string) => {
  return ssn.replace(/(\d{6})(\d+)/, '$1-$2')
}

export const formatAddress = (address: Address | null | undefined) => {
  if (!address) {
    return null
  }
  return `${address.streetAddress}, ${address.postalCode} ${address.locality}`
}

export const getSelectedChildrenFromExternalData = (
  children: ApplicantChildCustodyInformation[],
  selectedChildren: string[],
): ApplicantChildCustodyInformation[] => {
  return children.filter((child) => selectedChildren.includes(child.nationalId))
}

interface ChildrenResidenceInfo {
  parentName: string
  address: Address | null
  nationalId: string
}

const extractParentInfo = (
  individual: NationalRegistryIndividual | null | undefined,
): ChildrenResidenceInfo | null => {
  if (!individual) {
    return null
  }
  const { nationalId, fullName, address } = individual
  return {
    nationalId,
    address,
    parentName: fullName,
  }
}

export const childrenResidenceInfo = (
  applicant: NationalRegistryIndividual,
  children: ApplicantChildCustodyInformation[],
  selectedChildren: string[],
): {
  current: ChildrenResidenceInfo | null
  future: ChildrenResidenceInfo | null
} => {
  const selectedExternalDataChildren = getSelectedChildrenFromExternalData(
    children,
    selectedChildren,
  )
  const parentB = selectedExternalDataChildren[0].otherParent
  const childrenLiveWithApplicant = selectedExternalDataChildren.some(
    (child) => child.livesWithApplicant,
  )

  return {
    current: childrenLiveWithApplicant
      ? extractParentInfo(applicant)
      : extractParentInfo(parentB),
    future: childrenLiveWithApplicant
      ? extractParentInfo(parentB)
      : extractParentInfo(applicant),
  }
}

export const formatDate = ({
  date,
  formatter = 'PPP',
  localeKey = 'is',
}: {
  date: string
  formatter?: string
  localeKey?: string
}) => {
  try {
    const locale = localeKey === 'is' ? is : enGB
    const parsedDate = parse(date, 'yyyy-MM-dd', new Date())
    return format(parsedDate, formatter, { locale })
  } catch {
    return date
  }
}

export const getOtherParentInformation = (
  children: ApplicantChildCustodyInformation[],
  selectedChildren: string[],
): NationalRegistryIndividual => {
  const selected = getSelectedChildrenFromExternalData(
    children,
    selectedChildren,
  )
  return selected?.[0]?.otherParent ?? ({} as NationalRegistryIndividual)
}

export const formatPhoneNumber = (phoneNumber: string): string => {
  const phone = parsePhoneNumberFromString(phoneNumber, 'IS')
  return phone?.formatNational() || phoneNumber
}

export const sortChildrenByAge = (
  children: ApplicantChildCustodyInformation[],
): ApplicantChildCustodyInformation[] => {
  return sortBy(children, (child) => {
    return kennitala.info(child.nationalId)?.birthday
  })
}
