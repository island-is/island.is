import React, { useState } from 'react'
import { useQuery } from 'react-apollo'
import { useRouter } from 'next/router'
import gql from 'graphql-tag'

import { ContentLoader } from '@island.is/gjafakort-web/components'
import { Signup, Congratulations, NotQualified } from './components'

export const GetCompanyQuery = gql`
  query GetCompanyQuery($ssn: String!) {
    company(ssn: $ssn) {
      ssn
      name
      application {
        id
        name
        email
        state
        companySSN
        serviceCategory
        generalEmail
        webpage
        phoneNumber
        approveTerms
        companyName
        companyDisplayName
      }
    }
  }
`

function Company() {
  const router = useRouter()
  const { ssn } = router.query
  const [submition, setSubmition] = useState<
    'pending' | 'rejected' | 'approved'
  >('pending')
  const { data, loading } = useQuery(GetCompanyQuery, { variables: { ssn } })
  const { company } = data || {}

  const onSubmit = (isSuccess: boolean) => {
    if (isSuccess) {
      setSubmition('approved')
    } else {
      setSubmition('rejected')
    }
  }

  if (loading && !data) {
    return <ContentLoader />
  }

  if (company.application?.state === 'approved' || submition === 'approved') {
    return <Congratulations />
  } else if (submition === 'rejected') {
    return <NotQualified />
  }

  return <Signup company={company} handleSubmition={onSubmit} />
}

export default Company
