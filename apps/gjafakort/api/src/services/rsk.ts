import { Base64 } from 'js-base64'

import { logger } from '@island.is/logging'

import { environment } from '../environments'

const { rsk } = environment

interface CompanyRegistryMember {
  Kennitala: string
  Nafn: string
  Rekstarform: string
  StadaAdila: string
  ErStjorn: '0' | '1'
  ErProkuruhafi: '0' | '1'
}

export const getCompanyRegistryMembers = async (
  userSSN: string,
): Promise<CompanyRegistryMember[]> => {
  try {
    const res = await fetch(
      `${rsk.url}/companyregistry/members/${userSSN}/companies`,
      {
        method: 'GET',
        headers: {
          Authorization: `Basic ${Base64.encode(
            `${rsk.username}:${rsk.password}`,
          )}`,
          'Content-Type': 'application/json',
        },
      },
    )
    if (!res.ok) {
      const text = await res.text()
      throw new Error(text)
    }
    const { MemberCompanies } = await res.json()
    if (!MemberCompanies) {
      return []
    }
    return MemberCompanies
  } catch (err) {
    logger.error(err)
    throw new Error(
      'Error occurred while requesting members from company registry',
    )
  }
}

export const getCompanyBySSN = async (
  userSSN: string,
  companySSN: string,
): Promise<CompanyRegistryMember> => {
  const members = await getCompanyRegistryMembers(userSSN)
  return members.find(
    (member) => member.ErProkuruhafi === '1' && member.Kennitala === companySSN,
  )
}
