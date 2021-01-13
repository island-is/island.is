import { ClaimService } from '../../../services/ClaimService'
import React, { useEffect, useState } from 'react'
import HelpBox from '../../common/HelpBox'
import NoActiveConnections from '../../common/NoActiveConnections'
import { ResourcesService } from '../../../services/ResourcesService'

interface Props {
  apiScopeName: string
  claims?: string[]
  handleNext?: () => void
  handleBack?: () => void
  handleChanges?: () => void
}

const ApiScopeUserClaimsForm: React.FC<Props> = (props: Props) => {
  const [claims, setClaims] = useState<string[]>([])

  useEffect(() => {
    getAllAvailableClaims()
  }, [])

  const getAllAvailableClaims = async () => {
    const response = await ClaimService.findAll()
    if (response) {
      setClaims(response.map((x) => x.type))
    }
  }

  const add = async (claimName: string) => {
    const response = await ResourcesService.addApiScopeUserClaim(
      props.apiScopeName,
      claimName,
    )
    if (response) {
      if (props.handleChanges) {
        props.handleChanges()
      }
    }
  }

  const remove = async (claimName: string) => {
    const response = await ResourcesService.removeApiScopeUserClaim(
      props.apiScopeName,
      claimName,
    )
    if (response) {
      if (props.handleChanges) {
        props.handleChanges()
      }
    }
  }

  const setValue = (claimName: string, value: boolean) => {
    if (value) {
      add(claimName)
    } else {
      remove(claimName)
    }
  }

  return (
    <div className="api-scope-user-claims">
      <div className="api-scope-user-claims__wrapper">
        <div className="api-scope-user-claims__container">
          <h1>Select the appropriate user claims</h1>

          <div className="api-scope-user-claims__container__form">
            <div className="api-scope-user-claims__help">
              If needed, select the user claims for this Api Scope
            </div>
            <div className="api-scope-user-claims__container__fields">
              {claims?.map((claim: string) => {
                return (
                  <div
                    className="api-scope-user-claims__container__checkbox__field"
                    key={claim}
                  >
                    <label
                      className="api-scope-user-claims__label"
                      title={claim}
                    >
                      {claim}
                    </label>
                    <input
                      type="checkbox"
                      name={claim}
                      className="client__checkbox"
                      defaultChecked={props.claims?.includes(claim)}
                      onChange={(e) => setValue(claim, e.target.checked)}
                      title={`Set claim ${claim} as active og inactive`}
                    />
                    <HelpBox helpText={claim} />
                  </div>
                )
              })}
            </div>

            <NoActiveConnections
              title="No User Claims are selected"
              show={!props.claims || props.claims.length === 0}
              helpText="If necessary, check user the user claims needed"
            ></NoActiveConnections>

            <div className="api-scope-user-claims__buttons__container">
              <div className="api-scope-user-claims__button__container">
                <button
                  type="button"
                  className="api-scope-user-claims__button__cancel"
                  onClick={props.handleBack}
                >
                  Back
                </button>
              </div>
              <div className="api-scope-user-claims__button__container">
                <button
                  type="button"
                  className="api-scope-user-claims__button__save"
                  value="Next"
                  onClick={props.handleNext}
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
export default ApiScopeUserClaimsForm
