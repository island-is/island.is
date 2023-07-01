import React, { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { ErrorMessage } from '@hookform/error-message'
import HelpBox from './../../common/HelpBox'
import NoActiveConnections from './../../common/NoActiveConnections'
import { ApiResourceSecret } from './../../../entities/models/api-resource-secret.model'
import { ApiResourceSecretDTO } from './../../../entities/dtos/api-resource-secret.dto'
import { ResourcesService } from './../../../services/ResourcesService'
import ConfirmModal from './../../common/ConfirmModal'
import InfoModal from './../../common/InfoModal'
import ValidationUtils from './../../../utils/validation.utils'
import LocalizationUtils from '../../../utils/localization.utils'
import { FormControl } from '../../../entities/common/Localization'

interface Props {
  apiResourceName: string
  secrets: ApiResourceSecret[]
  handleNext?: () => void
  handleBack?: () => void
  handleChanges?: () => void
}

const ApiResourceSecretForm: React.FC<React.PropsWithChildren<Props>> = (
  props: Props,
) => {
  const { register, handleSubmit, formState } = useForm<ApiResourceSecretDTO>()
  const { isSubmitting, errors } = formState
  const defaultSecretLength = 25
  const [defaultSecret, setDefaultSecret] = useState<string>('')
  const [confirmModalIsOpen, setConfirmModalIsOpen] = useState(false)
  const [infoModalIsOpen, setInfoModalIsOpen] = useState(false)
  const [secretValue, setSecretValue] = useState<string>('')
  const [secretToRemove, setSecretToRemove] = useState<ApiResourceSecret>(
    new ApiResourceSecret(),
  )
  const [localization] = useState<FormControl>(
    LocalizationUtils.getFormControl('ApiResourceSecretForm'),
  )

  const makeDefaultSecret = (length: number) => {
    let result = ''
    const characters =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    const charactersLength = characters.length
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength))
    }
    return result
  }

  useEffect(() => {
    setDefaultSecret(makeDefaultSecret(defaultSecretLength))
  }, [])

  const copyToClipboard = (val: string) => {
    const selBox = document.createElement('textarea')
    selBox.style.position = 'fixed'
    selBox.style.left = '0'
    selBox.style.top = '0'
    selBox.style.opacity = '0'
    selBox.value = val
    document.body.appendChild(selBox)
    selBox.focus()
    selBox.select()
    document.execCommand('copy')
    document.body.removeChild(selBox)
  }

  const add = async (data: ApiResourceSecret) => {
    const secretObj = new ApiResourceSecretDTO()
    secretObj.apiResourceName = props.apiResourceName
    secretObj.description = data.description
    secretObj.type = data.type
    secretObj.value = data.value

    const response = await ResourcesService.addApiResourceSecret(secretObj)
    if (response) {
      if (props.handleChanges) {
        props.handleChanges()
      }

      copyToClipboard(data.value)
      setSecretValue(data.value)
      setInfoModalIsOpen(true)

      const form = document.getElementById('secretForm') as HTMLFormElement
      if (form) {
        form.reset()
      }
      setDefaultSecret(makeDefaultSecret(defaultSecretLength))
    }
  }

  const closeInfoModal = () => {
    setInfoModalIsOpen(false)
  }

  const remove = async () => {
    const secretDTO = new ApiResourceSecretDTO()
    secretDTO.apiResourceName = secretToRemove.apiResourceName
    secretDTO.value = secretToRemove.value
    secretDTO.type = secretToRemove.type
    secretDTO.description = secretToRemove.description

    const response = await ResourcesService.removeApiResourceSecret(secretDTO)
    if (response) {
      if (props.handleChanges) {
        props.handleChanges()
      }
    }

    closeConfirmModal()
  }

  const closeConfirmModal = () => {
    setConfirmModalIsOpen(false)
  }

  const confirmRemove = async (secret: ApiResourceSecret) => {
    setSecretToRemove(secret)
    setConfirmModalIsOpen(true)
  }

  const setHeaderElement = () => {
    return (
      <p>
        {localization.removeConfirmation}:<span>{secretToRemove.type}</span> -
        <span>{secretToRemove.description}</span>
      </p>
    )
  }

  return (
    <div className="api-resource-secret-form">
      <div className="api-resource-secret-form__wrapper">
        <div className="api-resource-secret-form__container">
          <h1>{localization.title}</h1>
          <div className="api-resource-secret-form__container__form">
            <div className="api-resource-secret-form__help">
              {localization.help}
            </div>
            <form id="secretForm" onSubmit={handleSubmit(add)}>
              <div className="api-resource-secret-form__container__fields">
                <div className="api-resource-secret-form__container__field">
                  <label
                    className="api-resource-secret-form__label"
                    htmlFor="secretValue"
                  >
                    {localization.fields['secretValue'].label}
                  </label>
                  <input
                    id="secretValue"
                    type="text"
                    {...register('value', { required: true })}
                    defaultValue={defaultSecret}
                    className="api-resource-secret-form__input"
                    placeholder={localization.fields['secretValue'].placeholder}
                    title={localization.fields['secretValue'].helpText}
                  />
                  <HelpBox
                    helpText={localization.fields['secretValue'].helpText}
                  />
                  <ErrorMessage
                    as="span"
                    errors={errors}
                    name="value"
                    message={localization.fields['secretValue'].errorMessage}
                  />
                  <input
                    type="submit"
                    className="api-resource-secret-form__button__add"
                    disabled={isSubmitting}
                    value={localization.buttons['add'].text}
                    title={localization.buttons['add'].helpText}
                  />
                </div>
                <div className="api-resource-secret-form__container__field">
                  <label
                    className="api-resource-secret-form__label"
                    htmlFor="type"
                  >
                    {localization.fields['type'].label}
                  </label>
                  <input
                    id="type"
                    type="text"
                    {...register('type', { required: true })}
                    defaultValue={'SharedSecret'}
                    className="api-resource-secret-form__input"
                    placeholder={localization.fields['type'].placeholder}
                    title={localization.fields['type'].helpText}
                    readOnly
                  />
                  <HelpBox helpText={localization.fields['type'].helpText} />
                  <ErrorMessage
                    as="span"
                    errors={errors}
                    name="type"
                    message={localization.fields['type'].errorMessage}
                  />
                </div>
                <div className="api-resource-secret-form__container__field">
                  <label
                    className="api-resource-secret-form__label"
                    htmlFor="description"
                  >
                    {localization.fields['description'].label}
                  </label>
                  <input
                    id="description"
                    type="text"
                    {...register('description', {
                      required: true,
                      validate: ValidationUtils.validateDescription,
                    })}
                    defaultValue={''}
                    className="api-resource-secret-form__input"
                    placeholder={localization.fields['description'].placeholder}
                    title={localization.fields['description'].helpText}
                  />
                  <HelpBox
                    helpText={localization.fields['description'].helpText}
                  />
                  <ErrorMessage
                    as="span"
                    errors={errors}
                    name="description"
                    message={localization.fields['description'].errorMessage}
                  />
                </div>
              </div>

              <NoActiveConnections
                title={localization.noActiveConnections?.title}
                show={!props.secrets || props.secrets.length === 0}
                helpText={localization.noActiveConnections?.helpText}
              ></NoActiveConnections>

              <div
                className={`api-resource-secret-form__container__list ${
                  props.secrets && props.secrets.length > 0 ? 'show' : 'hidden'
                }`}
              >
                <h3>{localization.sections['active'].title}</h3>
                {props.secrets?.map((secret: ApiResourceSecret) => {
                  return (
                    <div
                      className="api-resource-secret-form__container__list__item"
                      key={secret.created.toString()}
                    >
                      <div className="list-value">{secret.type}</div>
                      <div className="list-name">{secret.description}</div>
                      <div className="list-value">
                        {new Date(secret.created).toDateString()}
                      </div>
                      <div className="list-remove">
                        <button
                          type="button"
                          onClick={() => confirmRemove(secret)}
                          className="api-resource-secret-form__container__list__button__remove"
                          title={localization.buttons['remove'].helpText}
                        >
                          <i className="icon__delete"></i>
                          <span>{localization.buttons['remove'].text}</span>
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>

              <div className="api-resource-secret-form__buttons__container">
                <div className="api-resource-secret-form__button__container">
                  <button
                    type="button"
                    className="api-resource-secret-form__button__cancel"
                    onClick={props.handleBack}
                    title={localization.buttons['cancel'].helpText}
                  >
                    {localization.buttons['cancel'].text}
                  </button>
                </div>
                <div className="api-resource-secret-form__button__container">
                  <button
                    type="button"
                    className="api-resource-secret-form__button__save"
                    onClick={props.handleNext}
                    title={localization.buttons['save'].helpText}
                  >
                    {localization.buttons['save'].text}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
      <ConfirmModal
        modalIsOpen={confirmModalIsOpen}
        headerElement={setHeaderElement()}
        closeModal={closeConfirmModal}
        confirmation={remove}
        confirmationText={localization.buttons['remove'].text}
      ></ConfirmModal>
      <InfoModal
        modalIsOpen={infoModalIsOpen}
        headerText={localization.infoModal?.headerText}
        closeModal={closeInfoModal}
        handleButtonClicked={closeInfoModal}
        infoText={secretValue}
        buttonText={localization.infoModal?.buttonText}
      ></InfoModal>
    </div>
  )
}
export default ApiResourceSecretForm
