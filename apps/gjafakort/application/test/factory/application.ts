import Application from '@island.is/gjafakort/application/api/domains/applications/model'
import Issuer from '@island.is/gjafakort/application/api/domains/issuers/model'
import {
  Types,
  States,
} from '@island.is/gjafakort/application/api/domains/applications/consts'

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
    type: Types.GJAFAKORT,
    state: States.PENDING,
  }
  return Object.assign({}, defaultProps, props)
}

export default async (props = {}) => Application.create(await data(props))
