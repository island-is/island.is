import Application from '@island.is/gjafakort/application/api/domains/applications/model'
import Issuer from '@island.is/gjafakort/application/api/domains/issuers/model'
import { consts } from '@island.is/gjafakort/application/api/domains/common'

import { issuerFactory } from '.'

type Properties = {
  issuer?: Issuer
  type?: string
  state?: string
}

const data = async (props: Properties = {}) => {
  let issuer = props.issuer
  if (!issuer) {
    issuer = await issuerFactory()
  }

  const defaultProps = {
    issuerSSN: issuer.ssn,
    type: consts.Types.GJAFAKORT_COMPANY,
    state: consts.States.PENDING,
  }
  return Object.assign({}, defaultProps, props)
}

export default async (props = {}) => Application.create(await data(props))
