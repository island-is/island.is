import React, { useState } from 'react'
import { useRouter } from 'next/router'

import { Signup, Congratulations } from './components'

export type CompanyType = {
  name: string
  ssn: string | number
}

const companies = [
  {
    name: 'Kaffi Klettur',
    ssn: '1903795829',
    state: 'pending',
  },
  {
    name: 'Kosmos & Kaos',
    ssn: '1903795839',
    state: 'approved',
  },
]

function Company() {
  const router = useRouter()
  const { ssn } = router.query
  const [company, setCompany] = useState(companies.find((c) => c.ssn === ssn))

  const onSubmit = () => {
    setCompany({ ...company, state: 'approved' })
  }

  if (company.state === 'approved') {
    return <Congratulations />
  }

  return <Signup company={company} onSubmit={onSubmit} />
}

export default Company
