import React, { useState } from 'react'
import { useRouter } from 'next/router'
import { CompanySelection } from '../CompanySelection'
import { CompanySignup } from '../CompanySignup'

export type Company = {
  name: string
  ssn: string | number
}

const companies = [
  {
    name: 'Kaffi Klettur',
    ssn: '1903795829',
  },
  {
    name: 'Kosmos & Kaos',
    ssn: '1903795829',
  },
]

export const CompanySignupWrapper = () => {
  const router = useRouter()
  const [selectedCompany, setSelectedCompany] = useState<Company | undefined>()

  if (!selectedCompany) {
    return (
      <CompanySelection
        onSubmit={(company) => {
          setSelectedCompany(company)
        }}
        companies={companies}
      />
    )
  }

  return (
    <CompanySignup
      company={selectedCompany}
      onSubmit={(values) => {
        // Form is valid, do something with the values

        router.push('/skraning-tilbuin')
      }}
    />
  )
}

export default CompanySignupWrapper
