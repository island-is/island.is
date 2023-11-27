import React, { useEffect, useState } from 'react'
import HelpBox from '../../common/HelpBox'
import NoActiveConnections from '../../common/NoActiveConnections'
import { ResourcesService } from '../../../services/ResourcesService'
import UserClaimCreateForm from './UserClaimCreateForm'
import LocalizationUtils from '../../../utils/localization.utils'
import { FormControl } from '../../../entities/common/Localization'

interface Props {
  apiScopeName: string
  claims?: string[]
  handleNext?: () => void
  handleBack?: () => void
  handleChanges?: () => void
  handleNewClaimsAdded: () => void
}

const ApiScopeUserClaimsForm: React.FC<React.PropsWithChildren<Props>> = (
  props: Props,
) => {
  const [claims, setClaims] = useState<string[]>([])
  const [localization] = useState<FormControl>(
    LocalizationUtils.getFormControl('ApiScopeUserClaimsForm'),
  )
  useEffect(() => {
    getAllAvailableClaims()
  }, [props.claims])

  const getAllAvailableClaims = async () => {
    const response = await ResourcesService.findAllApiScopeUserClaims()
    if (response) {
      setClaims(response.map((x) => x.claimName))
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

  const saveNewUserClaim = async (claim: string): Promise<void> => {
    const response = await ResourcesService.createApiScopeUserClaim({
      resourceName: props.apiScopeName,
      claimName: claim,
    })
    if (response) {
      props.handleNewClaimsAdded()
    }
  }

  return (
    <div className="api-scope-user-claims">
      <div className="api-scope-user-claims__wrapper">
        <div className="api-scope-user-claims__container">
          <h1>{localization.title}</h1>

          <div className="api-scope-user-claims__container__form">
            <div className="api-scope-user-claims__help">
              {localization.help}
            </div>
            <UserClaimCreateForm
              resourceName={props.apiScopeName}
              handleSave={saveNewUserClaim}
              existingClaims={props.claims}
            />
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
              title={localization.noActiveConnections.title}
              show={!props.claims || props.claims.length === 0}
              helpText={localization.noActiveConnections.helpText}
            ></NoActiveConnections>

            <div className="api-scope-user-claims__buttons__container">
              <div className="api-scope-user-claims__button__container">
                <button
                  type="button"
                  className="api-scope-user-claims__button__cancel"
                  onClick={props.handleBack}
                  title={localization.buttons['cancel'].helpText}
                >
                  {localization.buttons['cancel'].text}
                </button>
              </div>
              <div className="api-scope-user-claims__button__container">
                <button
                  type="button"
                  className="api-scope-user-claims__button__save"
                  onClick={props.handleNext}
                  title={localization.buttons['save'].helpText}
                >
                  {localization.buttons['save'].text}
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
