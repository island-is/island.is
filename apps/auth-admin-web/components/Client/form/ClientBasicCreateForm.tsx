import React, { useEffect, useState } from 'react'
import ClientDTO from '../../../entities/dtos/client-dto'
import { useForm } from 'react-hook-form'
import { ErrorMessage } from '@hookform/error-message'
import HelpBox from '../../common/HelpBox'
import { ClientService } from '../../../services/ClientService'
import { Client } from './../../../entities/models/client.model'
import { ClientTypeInfoService } from './../../../services/ClientTypeInfoService'
import { TimeUtils } from './../../../utils/time.utils'
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
    const clientInfo = ClientTypeInfoService.getClientTypeInfo(clientType)

    return (
      <div className="detail-container">
        <div className="detail-title">{clientInfo.title}</div>
        <div className={`detail-flow${clientInfo.flow ? ' show' : ' hidden'}`}>
          {clientInfo.flow}
        </div>
        <div className="detail-description">{clientInfo.description}</div>
        <div className="detail-link">
          <a href={clientInfo.url} target="_blank" rel="noreferrer">
            {clientInfo.urlText}
          </a>
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
          <h1>{isEditing ? 'Edit Client' : 'Create a new Client'}</h1>
          <div className="client-basic__container__form">
            <div className="client-basic__help">
              Enter some basic information for this client.
            </div>
            <form onSubmit={handleSubmit(save)}>
              <div className="client-basic__container__fields">
                <div className={clientTypeSelected ? '' : 'field-with-details'}>
                  <div className="client-basic__container__field">
                    <label className="client-basic__label">Client Type</label>
                    <select
                      name="client.clientType"
                      ref={register({ required: true })}
                      title="Type of Client"
                      onChange={(e) => setClientType(e.target.value)}
                      onFocus={() => setShowClientTypeInfo(true)}
                      onBlur={hideClientInfo}
                    >
                      <option value="" selected={!client.clientType}>
                        Select Client Type
                      </option>
                      <option
                        value="spa"
                        selected={client.clientType === 'spa'}
                      >
                        Single Page App
                      </option>
                      <option
                        value="native"
                        selected={client.clientType === 'native'}
                      >
                        Native
                      </option>
                      <option
                        value="device"
                        selected={client.clientType === 'device'}
                        disabled
                      >
                        Device
                      </option>
                      <option
                        value="web"
                        selected={client.clientType === 'web'}
                      >
                        Web App
                      </option>
                      <option
                        value="machine"
                        selected={client.clientType === 'machine'}
                      >
                        Machine
                      </option>
                    </select>

                    <HelpBox helpText="Select the appropriate Client Type" />
                    <ErrorMessage
                      as="span"
                      errors={errors}
                      name="client.clientType"
                      message="Client Type is required"
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
                    <label className="client-basic__label">
                      National Id (Kennitala)
                    </label>
                    <input
                      type="text"
                      name="client.nationalId"
                      ref={register({
                        required: true,
                        maxLength: 10,
                        minLength: 10,
                        pattern: /\d+/,
                      })}
                      defaultValue={client.nationalId}
                      className="client-basic__input"
                      placeholder="0123456789"
                      maxLength={10}
                      title="The nationalId (Kennitala) registered for the client"
                    />
                    <HelpBox helpText="The nationalId (Kennitala) registered for the client" />
                    <ErrorMessage
                      as="span"
                      errors={errors}
                      name="client.nationalId"
                      message="NationalId must be 10 numeric characters"
                    />
                  </div>
                  <div className="client-basic__container__field">
                    <label className="client-basic__label">Contact email</label>
                    <input
                      type="text"
                      ref={register({
                        required: true,
                        pattern: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
                      })}
                      name="client.contactEmail"
                      defaultValue={client.contactEmail ?? ''}
                      className="client-basic__input"
                      title="The email of the person who can be contacted regarding this Client"
                      placeholder="john@example.com"
                    />
                    <ErrorMessage
                      as="span"
                      errors={errors}
                      name="client.contactEmail"
                      message="Contact email must be set and must be a valid email address"
                    />
                    <HelpBox helpText="The email of the person who can be contacted regarding this Client" />
                  </div>
                  <div className="client-basic__container__field">
                    <label className="client-basic__label">Client Id</label>
                    <input
                      type="text"
                      name="client.clientId"
                      ref={register({ required: true })}
                      defaultValue={client.clientId}
                      className="client-basic__input"
                      placeholder="example-client"
                      onChange={(e) => checkAvailability(e.target.value)}
                      title="The unique identifier for this application"
                      readOnly={isEditing}
                    />
                    <div
                      className={`client-basic__container__field__available ${
                        available ? 'ok ' : 'taken '
                      } ${clientIdLength > 0 ? 'show' : 'hidden'}`}
                    >
                      {available ? 'Available' : 'Unavailable'}
                    </div>
                    <HelpBox helpText="The unique identifier for this application" />
                    <ErrorMessage
                      as="span"
                      errors={errors}
                      name="client.clientId"
                      message="Client Id is required"
                    />
                  </div>
                  <div className="field-with-details">
                    <div className="client-basic__container__field">
                      <label className="client-basic__label">Base Url:</label>
                      <input
                        name="baseUrl"
                        type="text"
                        ref={register({ required: true })}
                        defaultValue={client.clientUri ?? ''}
                        className="client-basic__input"
                        placeholder="https://localhost:4200"
                        title="Base Url of the application. Used for Cors Origin and callback URI. The callback uri will be the specified Base Url /signin-oidc"
                        onChange={(e) => setCallbackUri(e.target.value)}
                        onFocus={() => setShowBaseUrlInfo(true)}
                        onBlur={() => setShowBaseUrlInfo(false)}
                      />
                      <HelpBox helpText="Base Url of the application. Used for adding Cors Origin, Redirect (callback) URI and Post Logout URI. The Redirect (callback) URI will be the specified Base Url /signin-oidc" />
                      <ErrorMessage
                        as="span"
                        errors={errors}
                        name="baseUrl"
                        message="Base Url is required"
                      />
                      <div
                        className={`client-basic__container__field__details${
                          showBaseUrlInfo ? ' show' : ' hidden'
                        }`}
                      >
                        <div className="detail-title">
                          Redirect (Callback) Uri will be:
                        </div>
                        <div className="detail-uri">
                          {callbackUri}/signin-oidc
                        </div>
                        <div className="detail-link">
                          This can be changed later
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
                    Cancel
                  </button>
                </div>
                <div className="client-basic__button__container">
                  <input
                    type="submit"
                    className="client-basic__button__save"
                    disabled={isSubmitting || !available}
                    value="Next"
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
