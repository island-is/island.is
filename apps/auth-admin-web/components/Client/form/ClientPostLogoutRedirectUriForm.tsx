import React, { useState } from 'react'
import { ClientPostLogoutRedirectUriDTO } from '../../../entities/dtos/client-post-logout-redirect-uri.dto'
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

const ClientPostLogoutRedirectUriForm: React.FC<
  React.PropsWithChildren<Props>
> = (props: Props) => {
  const { register, handleSubmit, formState } =
    useForm<ClientPostLogoutRedirectUriDTO>()
  const { isSubmitting, errors } = formState
  const [defaultUrl, setDefaultUrl] = useState(
    !props.uris || props.uris.length === 0 ? props.defaultUrl : '',
  )
  const [modalIsOpen, setIsOpen] = React.useState(false)
  const [uriToRemove, setUriToRemove] = React.useState('')
  const [localization] = useState<FormControl>(
    LocalizationUtils.getFormControl('ClientPostLogoutRedirectUriForm'),
  )

  const add = async (data: ClientPostLogoutRedirectUriDTO) => {
    const postLogoutUri = new ClientPostLogoutRedirectUriDTO()
    postLogoutUri.clientId = props.clientId
    postLogoutUri.redirectUri = data.redirectUri

    const response = ClientService.addPostLogoutRedirectUri(postLogoutUri)
    if (response) {
      if (props.handleChanges) {
        props.handleChanges()
      }
      const form = document.getElementById('postLogoutForm') as HTMLFormElement
      if (form) {
        form.reset()
      }
      setDefaultUrl('')
    }
  }

  const remove = async () => {
    const response = ClientService.removePostLogoutRedirectUri(
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
        {localization.removeConfirmation}:<span>{uriToRemove}</span>
      </p>
    )
  }

  return (
    <div>
      <div className="client-post-logout">
        <div className="client-post-logout__wrapper">
          <div className="client-post-logout__container">
            <h1>{localization.title}</h1>
            <div className="client-post-logout__container__form">
              <div
                className="client-post-logout__help"
                dangerouslySetInnerHTML={{ __html: localization.help }}
              ></div>
              <form id="postLogoutForm" onSubmit={handleSubmit(add)}>
                <div className="client-post-logout__container__fields">
                  <div className="client-post-logout__container__field">
                    <label
                      className="client-post-logout__label"
                      htmlFor="redirectUri"
                    >
                      {localization.fields['redirectUri'].label}
                    </label>
                    <input
                      id="redirectUri"
                      type="text"
                      {...register('redirectUri', {
                        required: true,
                        validate: ValidationUtils.validateUrl,
                      })}
                      defaultValue={defaultUrl}
                      className="client-post-logout__input"
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
                      className="client-post-logout__button__add"
                      disabled={isSubmitting}
                      title={localization.buttons['add'].helpText}
                      value={localization.buttons['add'].text}
                    />
                  </div>
                </div>

                <NoActiveConnections
                  title={localization.noActiveConnections?.title}
                  show={!props.uris || props.uris.length === 0}
                  helpText={localization.noActiveConnections?.helpText}
                ></NoActiveConnections>

                <div
                  className={`client-post-logout__container__list ${
                    props.uris && props.uris.length > 0 ? 'show' : 'hidden'
                  }`}
                >
                  <h3>{localization.sections['active'].title}</h3>
                  {props.uris?.map((uri: string) => {
                    return (
                      <div
                        className="client-post-logout__container__list__item"
                        key={uri}
                      >
                        <div className="list-value">{uri}</div>
                        <div className="list-remove">
                          <button
                            type="button"
                            onClick={() => confirmRemove(uri)}
                            className="client-post-logout__container__list__button__remove"
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

                <div className="client-post-logout__buttons__container">
                  <div className="client-post-logout__button__container">
                    <button
                      type="button"
                      className="client-post-logout__button__cancel"
                      onClick={props.handleBack}
                      title={localization.buttons['cancel'].helpText}
                    >
                      {localization.buttons['cancel'].text}
                    </button>
                  </div>
                  <div className="client-post-logout__button__container">
                    <button
                      type="button"
                      className="client-post-logout__button__save"
                      onClick={props.handleNext}
                      title={localization.buttons['remove'].helpText}
                    >
                      {localization.buttons['save'].text}
                    </button>
                  </div>
                </div>
              </form>
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
export default ClientPostLogoutRedirectUriForm
