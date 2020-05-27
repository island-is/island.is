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
    ssn: '1903795829',
    state: 'approved',
  },
]

const useForceUpdate = () => {
  const [_, setValue] = useState(0)
  return () => setValue((value) => ++value)
}

function Company() {
  const router = useRouter()
  const forceUpdate = useForceUpdate()
  const { ssn } = router.query
  const company = companies.find((c) => c.ssn === ssn)

  const onSubmit = () => {
    company.state = 'approved'
    forceUpdate()
  }

  if (company.state === 'approved') {
    return <Congratulations />
  }

  return <Signup company={company} onSubmit={onSubmit} />
}

export default Company
