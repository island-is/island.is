import React, { useState, useEffect } from 'react'
import HelpBox from '../../common/HelpBox'
import { ClientService } from '../../../services/ClientService'
import { IdpRestriction } from './../../../entities/models/idp-restriction.model'

interface Props {
  clientId: string
  restrictions?: string[] // What is currently valid for updating existing Clients
  handleNext?: () => void
  handleBack?: () => void
  handleChanges?: () => void
}

const ClientIdpRestrictionsForm: React.FC<Props> = (props: Props) => {
  const [idpProviders, setIdpProviders] = useState<IdpRestriction[]>([])
  const [allowAll, setAllowAll] = useState<boolean>(
    props.restrictions.length === 0,
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
    console.log('add')
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
    console.log('remove')
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
          <h1>Identity provider restrictions</h1>

          <div className="client-idp-restriction__container__form">
            <div className="client-idp-restriction__help">
              <p>
                Specifies which external identity providers (IdPs) can be used
                when authenticating.
              </p>
              <p>Note that Sim Card login is always allowed.</p>
            </div>
            <div className="client-idp-restriction__container__fields">
              <div className="client-idp-restriction__container__radio__field">
                <label htmlFor="all" className="client-idp-restriction__label">
                  Allow All
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
                  title={'Allow all identity providers'}
                />
              </div>
              <div className="client-idp-restriction__container__radio__field">
                <label
                  className="client-idp-restriction__label"
                  htmlFor="restricted"
                >
                  Allow Only:
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
                  title={'Allow only selected identity providers'}
                />
              </div>
            </div>

            <div
              className={`client-idp-restriction__container__fields indent${
                !allowAll ? ' show' : ' hidden'
              }`}
            >
              {idpProviders?.map((idpRestriction: IdpRestriction) => {
                return (
                  <div
                    key={idpRestriction.name}
                    className="client-idp-restriction__container__checkbox__field"
                  >
                    <label className="client-idp-restriction__label">
                      {idpRestriction.description}
                    </label>
                    <input
                      type="checkbox"
                      name={idpRestriction.name}
                      className="client__checkbox"
                      checked={props.restrictions?.includes(
                        idpRestriction.name,
                      )}
                      onChange={(e) =>
                        setIdp(idpRestriction.name, e.target.checked)
                      }
                      title={idpRestriction.helptext}
                      disabled={idpRestriction.name === 'sim' || allowAll}
                    />
                    <HelpBox helpText={idpRestriction.helptext} />
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
                >
                  Back
                </button>
              </div>
              <div className="client-idp-restriction__button__container">
                <button
                  type="button"
                  className="client-idp-restriction__button__save"
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
export default ClientIdpRestrictionsForm
