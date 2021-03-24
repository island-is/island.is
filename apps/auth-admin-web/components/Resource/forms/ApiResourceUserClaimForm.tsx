import React, { useEffect, useState } from 'react'
import HelpBox from '../../common/HelpBox'
import NoActiveConnections from '../../common/NoActiveConnections'
import { ResourcesService } from '../../../services/ResourcesService'
import UserClaimCreateForm from './UserClaimCreateForm'

interface Props {
  apiResourceName: string
  claims?: string[]
  handleNext?: () => void
  handleBack?: () => void
  handleChanges?: () => void
  handleNewClaimsAdded: () => void
}

const ApiResourceUserClaimsForm: React.FC<Props> = (props: Props) => {
  const [claims, setClaims] = useState<string[]>([])

  useEffect(() => {
    getAllAvailableClaims()
  }, [props.claims])

  const getAllAvailableClaims = async () => {
    const response = await ResourcesService.findAllApiResourceUserClaims()
    if (response) {
      setClaims(response.map((x) => x.claimName))
    }
  }

  const add = async (claimName: string) => {
    const response = await ResourcesService.addApiResourceUserClaim(
      props.apiResourceName,
      claimName,
    )
    if (response) {
      if (props.handleChanges) {
        props.handleChanges()
      }
    }
  }

  const remove = async (claimName: string) => {
    const response = await ResourcesService.removeApiResourceUserClaim(
      props.apiResourceName,
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

  const saveNewUserClaim = async (claim: string): Promise<void> => {
    const response = await ResourcesService.createApiResourceUserClaim({
      resourceName: props.apiResourceName,
      claimName: claim,
    })
    if (response) {
      props.handleNewClaimsAdded()
    }
  }

  return (
    <div className="api-resource-user-claims">
      <div className="api-resource-user-claims__wrapper">
        <div className="api-resource-user-claims__container">
          <h1>Select the appropriate user claims</h1>

          <div className="api-resource-user-claims__container__form">
            <div className="api-resource-user-claims__help">
              List of associated user claim types that should be included in the
              access token. The claims specified here will be added to the list
              of claims specified for the API.
            </div>
            <UserClaimCreateForm
              resourceName={props.apiResourceName}
              handleSave={saveNewUserClaim}
              existingClaims={props.claims}
            />
            <div className="api-resource-user-claims__container__fields">
              {claims?.map((claim: string) => {
                return (
                  <div
                    className="api-resource-user-claims__container__checkbox__field"
                    key={claim}
                  >
                    <label
                      className="api-resource-user-claims__label"
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

            <div className="api-resource-user-claims__buttons__container">
              <div className="api-resource-user-claims__button__container">
                <button
                  type="button"
                  className="api-resource-user-claims__button__cancel"
                  onClick={props.handleBack}
                >
                  Back
                </button>
              </div>
              <div className="api-resource-user-claims__button__container">
                <button
                  type="button"
                  className="api-resource-user-claims__button__save"
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
export default ApiResourceUserClaimsForm
