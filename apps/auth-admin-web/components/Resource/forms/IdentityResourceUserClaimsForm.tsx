import React, { useEffect, useState } from 'react'
import HelpBox from '../../common/HelpBox'
import NoActiveConnections from '../../common/NoActiveConnections'
import { ResourcesService } from '../../../services/ResourcesService'
import UserClaimCreateForm from './UserClaimCreateForm'
import LocalizationUtils from '../../../utils/localization.utils'
import { FormControl } from '../../../entities/common/Localization'
interface Props {
  identityResourceName: string
  claims?: string[]
  handleNext?: () => void
  handleBack?: () => void
  handleChanges?: () => void
  handleNewClaimsAdded: () => void
}

const IdentityResourceUserClaims: React.FC<React.PropsWithChildren<Props>> = (
  props: Props,
) => {
  const [claims, setClaims] = useState<string[]>([])
  const [localization] = useState<FormControl>(
    LocalizationUtils.getFormControl('IdentityResourceUserClaims'),
  )

  useEffect(() => {
    getAllAvailableClaims()
  }, [props.claims])

  const getAllAvailableClaims = async () => {
    const response = await ResourcesService.findAllIdentityResourceUserClaims()
    if (response) {
      setClaims(response.map((x) => x.claimName))
    }
  }

  const add = async (claimName: string) => {
    const response = await ResourcesService.addIdentityResourceUserClaim(
      props.identityResourceName,
      claimName,
    )
    if (response) {
      if (props.handleChanges) {
        props.handleChanges()
      }
    }
  }

  const remove = async (claimName: string) => {
    const response = await ResourcesService.removeIdentityResourceUserClaim(
      props.identityResourceName,
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
    const response = await ResourcesService.createIdentityResourceUserClaim({
      resourceName: props.identityResourceName,
      claimName: claim,
    })
    if (response) {
      props.handleNewClaimsAdded()
    }
  }

  return (
    <div className="identity-resource-user-claims">
      <div className="identity-resource-user-claims__wrapper">
        <div className="identity-resource-user-claims__container">
          <h1>{localization.title}</h1>

          <div className="identity-resource-user-claims__container__form">
            <div className="identity-resource-user-claims__help">
              {localization.help}
            </div>
            <UserClaimCreateForm
              resourceName={props.identityResourceName}
              handleSave={saveNewUserClaim}
              existingClaims={props.claims}
            />
            <div className="identity-resource-user-claims__container__fields">
              {claims?.map((claim: string) => {
                return (
                  <div
                    className="identity-resource-user-claims__container__checkbox__field"
                    key={claim}
                  >
                    <label
                      className="identity-resource-user-claims__label"
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
              title={localization.noActiveConnections?.title}
              show={!props.claims || props.claims.length === 0}
              helpText={localization.noActiveConnections?.helpText}
            ></NoActiveConnections>

            <div className="identity-resource-user-claims__buttons__container">
              <div className="identity-resource-user-claims__button__container">
                <button
                  type="button"
                  className="identity-resource-user-claims__button__cancel"
                  onClick={props.handleBack}
                  title={localization.buttons['cancel'].helpText}
                >
                  {localization.buttons['cancel'].text}
                </button>
              </div>
              <div className="identity-resource-user-claims__button__container">
                <button
                  type="button"
                  className="identity-resource-user-claims__button__save"
                  title={localization.buttons['save'].helpText}
                  onClick={props.handleNext}
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
export default IdentityResourceUserClaims
