import React, { useEffect, useState } from 'react'
import HelpBox from '../../common/HelpBox'
import NoActiveConnections from '../../common/NoActiveConnections'
import { ResourcesService } from '../../../services/ResourcesService'
import UserClaimCreateForm from './UserClaimCreateForm'
import TranslationUtils from './../../../utils/translation.utils'
import { FormPage } from './../../../entities/common/Translation'
interface Props {
  identityResourceName: string
  claims?: string[]
  handleNext?: () => void
  handleBack?: () => void
  handleChanges?: () => void
  handleNewClaimsAdded: () => void
}

const IdentityResourceUserClaims: React.FC<Props> = (props: Props) => {
  const [claims, setClaims] = useState<string[]>([])
  const [translation] = useState<FormPage>(
    TranslationUtils.getFormPage('IdentityResourceUserClaims'),
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
          <h1>{translation.title}</h1>

          <div className="identity-resource-user-claims__container__form">
            <div className="identity-resource-user-claims__help">
              {translation.help}
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
              title={translation.noActiveConnections?.title}
              show={!props.claims || props.claims.length === 0}
              helpText={translation.noActiveConnections?.helpText}
            ></NoActiveConnections>

            <div className="identity-resource-user-claims__buttons__container">
              <div className="identity-resource-user-claims__button__container">
                <button
                  type="button"
                  className="identity-resource-user-claims__button__cancel"
                  onClick={props.handleBack}
                >
                  {translation.cancelButton}
                </button>
              </div>
              <div className="identity-resource-user-claims__button__container">
                <button
                  type="button"
                  className="identity-resource-user-claims__button__save"
                  value="Next"
                  onClick={props.handleNext}
                >
                  {translation.saveButton}
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
