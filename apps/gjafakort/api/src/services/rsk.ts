import { Base64 } from 'js-base64'
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
  userSsn: string,
): Promise<CompanyRegistryMember[]> => {
  const res = await fetch(
    `${rsk.url}/companyregistry/members/${userSsn}/companies`,
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
}
