import React, { useState } from 'react'
import { ClientRedirectUriDTO } from '../../../entities/dtos/client-redirect-uri.dto'
import { useForm } from 'react-hook-form'
import { ErrorMessage } from '@hookform/error-message'
import HelpBox from '../../common/HelpBox'
import NoActiveConnections from '../../common/NoActiveConnections'
import { ClientService } from '../../../services/ClientService'
import ConfirmModal from '../../common/ConfirmModal'
import ValidationUtils from './../../../utils/validation.utils'
import LocalizationUtils from '../../../utils/localization.utils'
import { FormControl } from '../../../entities/common/Localization'

interface Props {
  clientId: string
  defaultUrl?: string
  uris?: string[]
  handleNext?: () => void
  handleBack?: () => void
  handleChanges?: () => void
}

const ClientRedirectUriForm: React.FC<React.PropsWithChildren<Props>> = (
  props: Props,
) => {
  const { register, handleSubmit, formState } = useForm<ClientRedirectUriDTO>()
  const { isSubmitting, errors } = formState
  const [defaultUrl, setDefaultUrl] = useState(
    !props.uris || props.uris.length === 0 ? props.defaultUrl : '',
  )
  const [modalIsOpen, setIsOpen] = React.useState(false)
  const [uriToRemove, setUriToRemove] = React.useState('')
  const [localization] = useState<FormControl>(
    LocalizationUtils.getFormControl('ClientRedirectUriForm'),
  )

  const add = async (data: ClientRedirectUriDTO) => {
    const clientRedirect = new ClientRedirectUriDTO()
    clientRedirect.clientId = props.clientId
    clientRedirect.redirectUri = data.redirectUri

    const response = await ClientService.addRedirectUri(clientRedirect)

    if (response) {
      if (props.handleChanges) {
        props.handleChanges()
      }

      const form = document.getElementById('redirectForm') as HTMLFormElement
      if (form) {
        form.reset()
      }
      setDefaultUrl('')
    }
  }

  const remove = async () => {
    const response = await ClientService.removeRedirectUri(
      props.clientId,
      uriToRemove,
    )
    if (response) {
      if (props.handleChanges) {
        props.handleChanges()
      }
    }

    closeModal()
  }

  const confirmRemove = async (name: string) => {
    setUriToRemove(name)
    setIsOpen(true)
  }

  function closeModal() {
    setIsOpen(false)
  }

  const setHeaderElement = () => {
    return (
      <p>
        Are you sure want to delete this redirect uri:{' '}
        <span>{uriToRemove}</span>
      </p>
    )
  }

  return (
    <div>
      <div className="client-redirect">
        <div className="client-redirect__wrapper">
          <div className="client-redirect__container">
            <h1>{localization.title}</h1>
            <div className="client-redirect__container__form">
              <div className="client-redirect__help">{localization.help}</div>
              <form id="redirectForm" onSubmit={handleSubmit(add)}>
                <div className="client-redirect__container__fields">
                  <div className="client-redirect__container__field">
                    <label
                      className="client-redirect__label"
                      htmlFor="redirectUri"
                    >
                      {localization.fields['redirectUri'].label}
                    </label>
                    <input
                      id="redirectUri"
                      type="text"
                      {...register('redirectUri', {
                        required: true,
                        validate: ValidationUtils.validateUri,
                      })}
                      defaultValue={defaultUrl ?? ''}
                      className="client-redirect__input"
                      placeholder={
                        localization.fields['redirectUri'].placeholder
                      }
                      title={localization.fields['redirectUri'].helpText}
                    />
                    <HelpBox
                      helpText={localization.fields['redirectUri'].helpText}
                    />
                    <ErrorMessage
                      as="span"
                      errors={errors}
                      name="redirectUri"
                      message={localization.fields['redirectUri'].errorMessage}
                    />
                    <input
                      type="submit"
                      className="client-redirect__button__add"
                      disabled={isSubmitting}
                      value={localization.buttons['add'].text}
                      title={localization.buttons['add'].helpText}
                    />
                  </div>
                </div>
              </form>

              <NoActiveConnections
                title={localization.noActiveConnections?.title}
                show={!props.uris || props.uris.length === 0}
                helpText={localization.noActiveConnections?.helpText}
              ></NoActiveConnections>

              <div
                className={`client-redirect__container__list ${
                  props.uris && props.uris.length > 0 ? 'show' : 'hidden'
                }`}
              >
                <h3>{localization.sections['active'].title}</h3>
                {props.uris?.map((uri: string) => {
                  return (
                    <div
                      className="client-redirect__container__list__item"
                      key={uri}
                    >
                      <div className="list-value">{uri}</div>
                      <div className="list-remove">
                        <button
                          type="button"
                          onClick={() => confirmRemove(uri)}
                          className="client-redirect__container__list__button__remove"
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

              <div className="client-redirect__buttons__container">
                <div className="client-redirect__button__container">
                  <button
                    type="button"
                    className="client-redirect__button__cancel"
                    title={localization.buttons['cancel'].helpText}
                    onClick={props.handleBack}
                  >
                    {localization.buttons['cancel'].text}
                  </button>
                </div>
                <div className="client-redirect__button__container">
                  <button
                    type="button"
                    className="client-redirect__button__save"
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
      <ConfirmModal
        modalIsOpen={modalIsOpen}
        headerElement={setHeaderElement()}
        closeModal={closeModal}
        confirmation={remove}
        confirmationText={localization.buttons['remove'].text}
      ></ConfirmModal>
    </div>
  )
}
export default ClientRedirectUriForm
