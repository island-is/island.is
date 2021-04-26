import React, { useEffect, useState } from 'react'
import ClientDTO from '../../../entities/dtos/client-dto'
import { useForm } from 'react-hook-form'
import { ErrorMessage } from '@hookform/error-message'
import HelpBox from '../../common/HelpBox'
import { ClientService } from '../../../services/ClientService'
import { Client } from './../../../entities/models/client.model'
import { ClientTypeInfoService } from './../../../services/ClientTypeInfoService'
import { TimeUtils } from './../../../utils/time.utils'
import ValidationUtils from './../../../utils/validation.utils'
import LocalizationUtils from '../../../utils/localization.utils'
import { FormControl } from '../../../entities/common/Localization'
interface Props {
  client: ClientDTO
  onNextButtonClick?: (client: Client) => void
  handleCancel?: () => void
}

interface FormOutput {
  client: ClientDTO
  baseUrl: string
}

const ClientBasicCreateForm: React.FC<Props> = (props: Props) => {
  const { register, handleSubmit, errors, formState } = useForm<FormOutput>()
  const { isSubmitting } = formState
  const [available, setAvailable] = useState<boolean>(false)
  const [clientIdLength, setClientIdLength] = useState<number>(0)
  const [isEditing, setIsEditing] = useState<boolean>(false)
  const [clientTypeSelected, setClientTypeSelected] = useState<boolean>(false)
  const [clientTypeInfo, setClientTypeInfo] = useState<JSX.Element>(<div></div>)
  const client = props.client
  const [callbackUri, setCallbackUri] = useState('')
  const [showClientTypeInfo, setShowClientTypeInfo] = useState<boolean>(false)
  const [showBaseUrlInfo, setShowBaseUrlInfo] = useState<boolean>(false)
  const [localization] = useState<FormControl>(
    LocalizationUtils.getFormControl('ClientCreateForm'),
  )

  useEffect(() => {
    if (props.client && props.client.clientId) {
      setIsEditing(true)
      setAvailable(true)
      setClientTypeSelected(true)
      setClientType(props.client.clientType)
    } else {
      setClientTypeInfo(getClientTypeHTML(''))
    }
  }, [props.client])

  const create = async (data: ClientDTO): Promise<Client | null> => {
    const response = await ClientService.create(data)
    if (response) {
      if (props.onNextButtonClick) {
        props.onNextButtonClick(response)
      }
      return response
    }
    return null
  }

  const save = async (data: FormOutput) => {
    if (!isEditing) {
      const dto = new ClientDTO()
      dto.clientType = data.client.clientType
      dto.clientId = data.client.clientId
      dto.nationalId = data.client.nationalId
      dto.protocolType = 'oidc'
      dto.contactEmail = data.client.contactEmail

      const clientSaved = await create(dto)
      if (clientSaved) {
        ClientService.setDefaults(clientSaved, data.baseUrl)
      }
    }
  }

  const checkAvailability = async (clientId: string) => {
    setClientIdLength(clientId.length)
    if (!clientId) {
      return
    }

    const response = await ClientService.findClientById(clientId)
    if (response) {
      setAvailable(false)
    } else {
      setAvailable(true)
    }
  }

  const getClientTypeHTML = (clientType): JSX.Element => {
    return (
      <div className="detail-container">
        <div className="detail-title">
          {
            localization.fields['clientType'].selectItems[clientType]
              .selectItemText
          }
        </div>
        <div
          className={`detail-flow${
            localization.fields['clientType'].selectItems[clientType].flow
              ? ' show'
              : ' hidden'
          }`}
        >
          {localization.fields['clientType'].selectItems[clientType].flow}
        </div>
        <div className="detail-description">
          {localization.fields['clientType'].selectItems[clientType].helpText}
        </div>
      </div>
    )
  }

  const setClientType = async (clientType: string) => {
    if (clientType) {
      if (clientType === 'spa') {
        client.requireClientSecret = false
        client.requirePkce = true

        setClientTypeInfo(getClientTypeHTML('spa'))
      }

      if (clientType === 'native') {
        client.requireClientSecret = false
        client.requirePkce = true

        setClientTypeInfo(getClientTypeHTML('native'))
      }

      if (clientType === 'web') {
        client.requireClientSecret = true
        client.requirePkce = false

        setClientTypeInfo(getClientTypeHTML('web'))
      }

      if (clientType === 'machine') {
        client.requireClientSecret = true
        client.requirePkce = false

        setClientTypeInfo(getClientTypeHTML('machine'))
      }

      setClientTypeSelected(true)
    } else {
      setClientTypeInfo(getClientTypeHTML(''))
      setClientTypeSelected(false)
    }
  }

  const hideClientInfo = async () => {
    await TimeUtils.delay(1000)
    setShowClientTypeInfo(false)
  }

  return (
    <div className="client-basic">
      <div className="client-basic__wrapper">
        <div className="client-basic__container">
          <h1>{isEditing ? localization.editTitle : localization.title}</h1>
          <div className="client-basic__container__form">
            <div className="client-basic__help">{localization.help}</div>
            <form onSubmit={handleSubmit(save)}>
              <div className="client-basic__container__fields">
                <div className={clientTypeSelected ? '' : 'field-with-details'}>
                  <div className="client-basic__container__field">
                    <label className="client-basic__label" htmlFor="clientType">
                      {localization.fields['clientType'].label}
                    </label>
                    <select
                      id="clientType"
                      name="client.clientType"
                      ref={register({ required: true })}
                      title={localization.fields['clientType'].helpText}
                      onChange={(e) => setClientType(e.target.value)}
                      onFocus={() => setShowClientTypeInfo(true)}
                      onBlur={hideClientInfo}
                    >
                      <option value="" selected={!client.clientType}>
                        {
                          localization.fields['clientType'].selectItems['']
                            .selectItemText
                        }
                      </option>
                      <option
                        value="spa"
                        selected={client.clientType === 'spa'}
                      >
                        {
                          localization.fields['clientType'].selectItems['spa']
                            .selectItemText
                        }
                      </option>
                      <option
                        value="native"
                        selected={client.clientType === 'native'}
                      >
                        {
                          localization.fields['clientType'].selectItems[
                            'native'
                          ].selectItemText
                        }
                      </option>
                      <option
                        value="web"
                        selected={client.clientType === 'web'}
                      >
                        {
                          localization.fields['clientType'].selectItems['web']
                            .selectItemText
                        }
                      </option>
                      <option
                        value="machine"
                        selected={client.clientType === 'machine'}
                      >
                        {
                          localization.fields['clientType'].selectItems[
                            'machine'
                          ].selectItemText
                        }
                      </option>
                      <option
                        value="device"
                        selected={client.clientType === 'device'}
                        disabled
                      >
                        {
                          localization.fields['clientType'].selectItems[
                            'device'
                          ].selectItemText
                        }
                      </option>
                    </select>

                    <HelpBox
                      helpText={localization.fields['clientType'].helpText}
                    />
                    <ErrorMessage
                      as="span"
                      errors={errors}
                      name="client.clientType"
                      message={localization.fields['clientType'].errorMessage}
                    />
                    <div
                      className={`client__container__field__details${
                        showClientTypeInfo ? ' show' : ' hidden'
                      }`}
                    >
                      {clientTypeInfo}
                    </div>
                  </div>
                </div>

                <div className={clientTypeSelected ? '' : 'hidden'}>
                  <div className="client-basic__container__field">
                    <label className="client-basic__label" htmlFor="nationalId">
                      {localization.fields['nationalId'].label}
                    </label>
                    <input
                      id="nationalId"
                      type="text"
                      name="client.nationalId"
                      ref={register({
                        required: true,
                        maxLength: 10,
                        minLength: 10,
                        validate: ValidationUtils.validateNationalId,
                      })}
                      defaultValue={client.nationalId}
                      className="client-basic__input"
                      placeholder={
                        localization.fields['nationalId'].placeholder
                      }
                      maxLength={10}
                      title={localization.fields['nationalId'].helpText}
                    />
                    <HelpBox
                      helpText={localization.fields['nationalId'].helpText}
                    />
                    <ErrorMessage
                      as="span"
                      errors={errors}
                      name="client.nationalId"
                      message={localization.fields['nationalId'].errorMessage}
                    />
                  </div>
                  <div className="client-basic__container__field">
                    <label
                      className="client-basic__label"
                      htmlFor="contactEmail"
                    >
                      {localization.fields['contactEmail'].label}
                    </label>
                    <input
                      id="contactEmail"
                      type="text"
                      ref={register({
                        required: true,
                        validate: ValidationUtils.validateEmail,
                      })}
                      name="client.contactEmail"
                      defaultValue={client.contactEmail ?? ''}
                      className="client-basic__input"
                      title={localization.fields['contactEmail'].helpText}
                      placeholder={
                        localization.fields['contactEmail'].placeholder
                      }
                    />
                    <ErrorMessage
                      as="span"
                      errors={errors}
                      name="client.contactEmail"
                      message={localization.fields['contactEmail'].errorMessage}
                    />
                    <HelpBox
                      helpText={localization.fields['contactEmail'].helpText}
                    />
                  </div>
                  <div className="client-basic__container__field">
                    <label className="client-basic__label" htmlFor="clientId">
                      {localization.fields['clientId'].label}
                    </label>
                    <input
                      id="clientId"
                      type="text"
                      name="client.clientId"
                      ref={register({
                        required: true,
                        validate: ValidationUtils.validateIdentifier,
                      })}
                      defaultValue={client.clientId}
                      className="client-basic__input"
                      placeholder={localization.fields['clientId'].placeholder}
                      onChange={(e) => checkAvailability(e.target.value)}
                      title={localization.fields['clientId'].helpText}
                      readOnly={isEditing}
                    />
                    <div
                      className={`client-basic__container__field__available ${
                        available ? 'ok ' : 'taken '
                      } ${clientIdLength > 0 ? 'show' : 'hidden'}`}
                    >
                      {available
                        ? localization.fields['clientId'].available
                        : localization.fields['clientId'].unAvailable}
                    </div>
                    <HelpBox
                      helpText={localization.fields['clientId'].helpText}
                    />
                    <ErrorMessage
                      as="span"
                      errors={errors}
                      name="client.clientId"
                      message={localization.fields['clientId'].errorMessage}
                    />
                  </div>
                  <div className="field-with-details">
                    <div className="client-basic__container__field">
                      <label className="client-basic__label" htmlFor="baseUrl">
                        {localization.fields['baseUrl'].label}
                      </label>
                      <input
                        id="baseUrl"
                        name="baseUrl"
                        type="text"
                        ref={register({
                          required: true,
                          validate: ValidationUtils.validateUrl,
                        })}
                        defaultValue={client.clientUri ?? ''}
                        className="client-basic__input"
                        placeholder={localization.fields['baseUrl'].placeholder}
                        title={localization.fields['baseUrl'].helpText}
                        onChange={(e) => setCallbackUri(e.target.value)}
                        onFocus={() => setShowBaseUrlInfo(true)}
                        onBlur={() => setShowBaseUrlInfo(false)}
                      />
                      <HelpBox
                        helpText={localization.fields['baseUrl'].helpText}
                      />
                      <ErrorMessage
                        as="span"
                        errors={errors}
                        name="baseUrl"
                        message={localization.fields['baseUrl'].errorMessage}
                      />
                      <div
                        className={`client-basic__container__field__details${
                          showBaseUrlInfo ? ' show' : ' hidden'
                        }`}
                      >
                        <div className="detail-title">
                          {localization.fields['baseUrl'].popUpTitle}
                        </div>
                        <div className="detail-uri">
                          {callbackUri}/signin-oidc
                        </div>
                        <div className="detail-link">
                          {localization.fields['baseUrl'].popUpDescription}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="client-basic__buttons__container">
                <div className="client-basic__button__container">
                  <button
                    className="client-basic__button__cancel"
                    type="button"
                    onClick={props.handleCancel}
                    title={localization.buttons['cancel'].helpText}
                  >
                    {localization.buttons['cancel'].text}
                  </button>
                </div>
                <div className="client-basic__button__container">
                  <input
                    type="submit"
                    className="client-basic__button__save"
                    disabled={isSubmitting || !available}
                    title={localization.buttons['save'].helpText}
                    value={localization.buttons['save'].text}
                  />
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
export default ClientBasicCreateForm
