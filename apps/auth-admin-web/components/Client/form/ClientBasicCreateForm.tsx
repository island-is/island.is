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
import TranslationUtils from './../../../utils/translation.utils'
import { FormPage } from './../../../entities/common/Translation'
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
  const [translation] = useState<FormPage>(
    TranslationUtils.getFormPage('ClientCreateForm'),
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
            translation.fields['clientType'].selectItems[clientType]
              .selectItemText
          }
        </div>
        <div
          className={`detail-flow${
            translation.fields['clientType'].selectItems[clientType].flow
              ? ' show'
              : ' hidden'
          }`}
        >
          {translation.fields['clientType'].selectItems[clientType].flow}
        </div>
        <div className="detail-description">
          {translation.fields['clientType'].selectItems[clientType].helpText}
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
          <h1>{isEditing ? translation.editTitle : translation.title}</h1>
          <div className="client-basic__container__form">
            <div className="client-basic__help">{translation.help}</div>
            <form onSubmit={handleSubmit(save)}>
              <div className="client-basic__container__fields">
                <div className={clientTypeSelected ? '' : 'field-with-details'}>
                  <div className="client-basic__container__field">
                    <label className="client-basic__label" htmlFor="clientType">
                      {translation.fields['clientType'].label}
                    </label>
                    <select
                      id="clientType"
                      name="client.clientType"
                      ref={register({ required: true })}
                      title={translation.fields['clientType'].helpText}
                      onChange={(e) => setClientType(e.target.value)}
                      onFocus={() => setShowClientTypeInfo(true)}
                      onBlur={hideClientInfo}
                    >
                      <option value="" selected={!client.clientType}>
                        {
                          translation.fields['clientType'].selectItems['']
                            .selectItemText
                        }
                      </option>
                      <option
                        value="spa"
                        selected={client.clientType === 'spa'}
                      >
                        {
                          translation.fields['clientType'].selectItems['spa']
                            .selectItemText
                        }
                      </option>
                      <option
                        value="native"
                        selected={client.clientType === 'native'}
                      >
                        {
                          translation.fields['clientType'].selectItems['native']
                            .selectItemText
                        }
                      </option>
                      <option
                        value="web"
                        selected={client.clientType === 'web'}
                      >
                        {
                          translation.fields['clientType'].selectItems['web']
                            .selectItemText
                        }
                      </option>
                      <option
                        value="machine"
                        selected={client.clientType === 'machine'}
                      >
                        {
                          translation.fields['clientType'].selectItems[
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
                          translation.fields['clientType'].selectItems['device']
                            .selectItemText
                        }
                      </option>
                    </select>

                    <HelpBox helpText="Select the appropriate Client Type" />
                    <ErrorMessage
                      as="span"
                      errors={errors}
                      name="client.clientType"
                      message={translation.fields['clientType'].errorMessage}
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
                      {translation.fields['nationalId'].label}
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
                      placeholder={translation.fields['nationalId'].placeholder}
                      maxLength={10}
                      title={translation.fields['nationalId'].helpText}
                    />
                    <HelpBox
                      helpText={translation.fields['nationalId'].helpText}
                    />
                    <ErrorMessage
                      as="span"
                      errors={errors}
                      name="client.nationalId"
                      message={translation.fields['nationalId'].errorMessage}
                    />
                  </div>
                  <div className="client-basic__container__field">
                    <label
                      className="client-basic__label"
                      htmlFor="contactEmail"
                    >
                      {translation.fields['contactEmail'].label}
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
                      title={translation.fields['contactEmail'].helpText}
                      placeholder={
                        translation.fields['contactEmail'].placeholder
                      }
                    />
                    <ErrorMessage
                      as="span"
                      errors={errors}
                      name="client.contactEmail"
                      message={translation.fields['contactEmail'].errorMessage}
                    />
                    <HelpBox
                      helpText={translation.fields['contactEmail'].helpText}
                    />
                  </div>
                  <div className="client-basic__container__field">
                    <label className="client-basic__label" htmlFor="clientId">
                      {translation.fields['clientId'].label}
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
                      placeholder={translation.fields['clientId'].placeholder}
                      onChange={(e) => checkAvailability(e.target.value)}
                      title={translation.fields['clientId'].helpText}
                      readOnly={isEditing}
                    />
                    <div
                      className={`client-basic__container__field__available ${
                        available ? 'ok ' : 'taken '
                      } ${clientIdLength > 0 ? 'show' : 'hidden'}`}
                    >
                      {available
                        ? translation.fields['clientId'].available
                        : translation.fields['clientId'].unAvailable}
                    </div>
                    <HelpBox
                      helpText={translation.fields['clientId'].helpText}
                    />
                    <ErrorMessage
                      as="span"
                      errors={errors}
                      name="client.clientId"
                      message={translation.fields['clientId'].errorMessage}
                    />
                  </div>
                  <div className="field-with-details">
                    <div className="client-basic__container__field">
                      <label className="client-basic__label" htmlFor="baseUrl">
                        {translation.fields['baseUrl'].label}
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
                        placeholder={translation.fields['baseUrl'].placeholder}
                        title={translation.fields['baseUrl'].helpText}
                        onChange={(e) => setCallbackUri(e.target.value)}
                        onFocus={() => setShowBaseUrlInfo(true)}
                        onBlur={() => setShowBaseUrlInfo(false)}
                      />
                      <HelpBox
                        helpText={translation.fields['baseUrl'].helpText}
                      />
                      <ErrorMessage
                        as="span"
                        errors={errors}
                        name="baseUrl"
                        message={translation.fields['baseUrl'].errorMessage}
                      />
                      <div
                        className={`client-basic__container__field__details${
                          showBaseUrlInfo ? ' show' : ' hidden'
                        }`}
                      >
                        <div className="detail-title">
                          {translation.fields['baseUrl'].popUpTitle}
                        </div>
                        <div className="detail-uri">
                          {callbackUri}/signin-oidc
                        </div>
                        <div className="detail-link">
                          {translation.fields['baseUrl'].popUpDescription}
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
                  >
                    {translation.cancelButton}
                  </button>
                </div>
                <div className="client-basic__button__container">
                  <input
                    type="submit"
                    className="client-basic__button__save"
                    disabled={isSubmitting || !available}
                    value={translation.saveButton}
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
