import React, { useState, useEffect } from 'react'
import HelpBox from '../../common/HelpBox'
import { ClientService } from '../../../services/ClientService'
import { IdpProvider } from './../../../entities/models/IdpProvider.model'
import LocalizationUtils from '../../../utils/localization.utils'
import { FormControl } from '../../../entities/common/Localization'

interface Props {
  clientId: string
  restrictions?: string[] // What is currently valid for updating existing Clients
  handleNext?: () => void
  handleBack?: () => void
  handleChanges?: () => void
}

const ClientIdpRestrictionsForm: React.FC<React.PropsWithChildren<Props>> = (
  props: Props,
) => {
  const [idpProviders, setIdpProviders] = useState<IdpProvider[]>([])
  const [allowAll, setAllowAll] = useState<boolean>(
    props.restrictions.length === 0,
  )
  const [localization] = useState<FormControl>(
    LocalizationUtils.getFormControl('ClientIdpRestrictionsForm'),
  )

  useEffect(() => {
    getIdpRestrictions()
  }, [])

  const getIdpRestrictions = async () => {
    const idpProviders = await ClientService.findAllIdpProviders()
    if (idpProviders) {
      setIdpProviders(idpProviders)
    }
  }

  useEffect(() => {
    if (allowAll) {
      props.restrictions.map((r) => remove(r))
    } else if (props.restrictions.length === 0) {
      add('sim')
    }
  }, [allowAll])

  const add = async (name: string) => {
    const createObj = {
      name: name,
      clientId: props.clientId,
    }

    const response = await ClientService.addIdpRestriction(createObj)
    if (response) {
      if (props.handleChanges) {
        props.handleChanges()
      }
    }
  }

  const remove = async (name: string) => {
    const response = await ClientService.removeIdpRestriction(
      props.clientId,
      name,
    )
    if (response) {
      if (props.handleChanges) {
        props.handleChanges()
      }
    }
  }

  const setIdp = (name: string, value: boolean) => {
    if (value) {
      add(name)
    } else {
      remove(name)
    }
  }

  return (
    <div className="client-idp-restriction">
      <div className="client-idp-restriction__wrapper">
        <div className="client-idp-restriction__container">
          <h1>{localization.title}</h1>

          <div className="client-idp-restriction__container__form">
            <div className="client-idp-restriction__help">
              {localization.help}
            </div>
            <div className="client-idp-restriction__container__fields">
              <div className="client-idp-restriction__container__radio__field">
                <label htmlFor="all" className="client-idp-restriction__label">
                  {localization.fields['all'].label}
                </label>
                <input
                  type="radio"
                  id="all"
                  name="all"
                  className="client__checkbox"
                  checked={allowAll}
                  onChange={(e) => {
                    setAllowAll(true)
                  }}
                  title={localization.fields['all'].helpText}
                />
              </div>
              <div className="client-idp-restriction__container__radio__field">
                <label
                  className="client-idp-restriction__label"
                  htmlFor="restricted"
                >
                  {localization.fields['restricted'].label}
                </label>
                <input
                  id="restricted"
                  type="radio"
                  name="restricted"
                  className="client__checkbox"
                  checked={!allowAll}
                  onChange={(e) => {
                    setAllowAll(false)
                  }}
                  title={localization.fields['restricted'].helpText}
                />
              </div>
            </div>

            <div
              className={`client-idp-restriction__container__fields indent${
                !allowAll ? ' show' : ' hidden'
              }`}
            >
              {idpProviders?.map((idp: IdpProvider) => {
                return (
                  <div
                    key={idp.name}
                    className="client-idp-restriction__container__checkbox__field"
                  >
                    <label className="client-idp-restriction__label">
                      {idp.description}
                    </label>
                    <input
                      type="checkbox"
                      name={idp.name}
                      className="client__checkbox"
                      checked={props.restrictions?.includes(idp.name)}
                      onChange={(e) => setIdp(idp.name, e.target.checked)}
                      title={idp.helptext}
                      disabled={idp.name === 'sim' || allowAll}
                    />
                    <HelpBox helpText={idp.helptext} />
                  </div>
                )
              })}
            </div>

            <div className="client-idp-restriction__buttons__container">
              <div className="client-idp-restriction__button__container">
                <button
                  type="button"
                  className="client-idp-restriction__button__cancel"
                  onClick={props.handleBack}
                  title={localization.buttons['cancel'].helpText}
                >
                  {localization.buttons['cancel'].text}
                </button>
              </div>
              <div className="client-idp-restriction__button__container">
                <button
                  type="button"
                  className="client-idp-restriction__button__save"
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
export default ClientIdpRestrictionsForm
