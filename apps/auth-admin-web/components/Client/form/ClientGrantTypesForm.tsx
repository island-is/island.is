import React, { useEffect, useState } from 'react'
import HelpBox from '../../common/HelpBox'
import { GrantType } from '../../../entities/models/grant-type.model'
import { ClientGrantTypeDTO } from '../../../entities/dtos/client-grant-type.dto'
import NoActiveConnections from '../../common/NoActiveConnections'
import { ClientService } from '../../../services/ClientService'
import { GrantTypeService } from '../../../services/GrantTypeService'
import LocalizationUtils from '../../../utils/localization.utils'
import { FormControl } from '../../../entities/common/Localization'

interface Props {
  clientId: string
  grantTypes?: string[] // What is currently valid for updating existing Clients
  handleNext?: () => void
  handleBack?: () => void
  handleChanges?: () => void
}

const ClientGrantTypesForm: React.FC<React.PropsWithChildren<Props>> = (
  props: Props,
) => {
  const [grantTypes, setGrantTypes] = useState<GrantType[]>([])
  const [localization] = useState<FormControl>(
    LocalizationUtils.getFormControl('ClientGrantTypesForm'),
  )
  useEffect(() => {
    getGrantTypes()
  }, [])

  const getGrantTypes = async () => {
    const response = await GrantTypeService.findAll()
    if (response) {
      setGrantTypes(response)
    }
  }

  const add = async (grantType: string) => {
    const createObj: ClientGrantTypeDTO = {
      grantType: grantType,
      clientId: props.clientId,
    }

    const response = await ClientService.addGrantType(createObj)
    if (response) {
      if (props.handleChanges) {
        props.handleChanges()
      }
    }
  }

  const remove = async (grantType: string) => {
    const response = await ClientService.removeGrantType(
      props.clientId,
      grantType,
    )
    if (response) {
      if (props.handleChanges) {
        props.handleChanges()
      }
    }
  }

  const setValue = (grantType: string, value: boolean) => {
    if (value) {
      add(grantType)
    } else {
      remove(grantType)
    }
  }

  return (
    <div className="client-grant-types">
      <div className="client-grant-types__wrapper">
        <div className="client-grant-types__container">
          <h1>{localization.title}</h1>

          <div className="client-grant-types__container__form">
            <div className="client-grant-types__help">{localization.help}</div>
            <div className="client-grant-types__container__fields">
              {grantTypes?.map((grantType: GrantType) => {
                return (
                  <div
                    className="client-grant-types__container__checkbox__field"
                    key={grantType.name}
                  >
                    <label
                      className="client-grant-types__label"
                      title={grantType.description}
                    >
                      {grantType.name}
                    </label>
                    <input
                      type="checkbox"
                      name={grantType.name}
                      className="client__checkbox"
                      defaultChecked={props.grantTypes?.includes(
                        grantType.name,
                      )}
                      onChange={(e) =>
                        setValue(grantType.name, e.target.checked)
                      }
                      title={`Set grant type ${grantType.name} as active og inactive`}
                    />
                    <HelpBox helpText={grantType.description} />
                  </div>
                )
              })}
            </div>

            <NoActiveConnections
              title={localization.noActiveConnections?.title}
              show={!props.grantTypes || props.grantTypes.length === 0}
              helpText={localization.noActiveConnections?.helpText}
            ></NoActiveConnections>

            <div className="client-grant-types__buttons__container">
              <div className="client-grant-types__button__container">
                <button
                  type="button"
                  className="client-grant-types__button__cancel"
                  onClick={props.handleBack}
                  title={localization.buttons['cancel'].helpText}
                >
                  {localization.buttons['cancel'].text}
                </button>
              </div>
              <div className="client-grant-types__button__container">
                <button
                  type="button"
                  className="client-grant-types__button__save"
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
export default ClientGrantTypesForm
