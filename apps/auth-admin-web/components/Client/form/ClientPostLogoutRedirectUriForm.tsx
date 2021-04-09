import React, { useState } from 'react'
import { ClientPostLogoutRedirectUriDTO } from '../../../entities/dtos/client-post-logout-redirect-uri.dto'
import { useForm } from 'react-hook-form'
import { ErrorMessage } from '@hookform/error-message'
import HelpBox from '../../common/HelpBox'
import NoActiveConnections from '../../common/NoActiveConnections'
import { ClientService } from '../../../services/ClientService'
import ConfirmModal from '../../common/ConfirmModal'
import ValidationUtils from './../../../utils/validation.utils'
import TranslationUtils from './../../../utils/translation.utils'
import { FormPage } from './../../../entities/common/Translation'
interface Props {
  clientId: string
  defaultUrl?: string
  uris?: string[]
  handleNext?: () => void
  handleBack?: () => void
  handleChanges?: () => void
}

const ClientPostLogoutRedirectUriForm: React.FC<Props> = (props: Props) => {
  const {
    register,
    handleSubmit,
    errors,
    formState,
  } = useForm<ClientPostLogoutRedirectUriDTO>()
  const { isSubmitting } = formState
  const [defaultUrl, setDefaultUrl] = useState(
    !props.uris || props.uris.length === 0 ? props.defaultUrl : '',
  )
  const [modalIsOpen, setIsOpen] = React.useState(false)
  const [uriToRemove, setUriToRemove] = React.useState('')
  const [translation] = useState<FormPage>(
    TranslationUtils.getFormPage('ClientPostLogoutRedirectUriForm'),
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
        {translation.removeConfirmation}:<span>{uriToRemove}</span>
      </p>
    )
  }

  return (
    <div>
      <div className="client-post-logout">
        <div className="client-post-logout__wrapper">
          <div className="client-post-logout__container">
            <h1>{translation.title}</h1>
            <div className="client-post-logout__container__form">
              <div
                className="client-post-logout__help"
                dangerouslySetInnerHTML={{ __html: translation.help }}
              ></div>
              <form id="postLogoutForm" onSubmit={handleSubmit(add)}>
                <div className="client-post-logout__container__fields">
                  <div className="client-post-logout__container__field">
                    <label
                      className="client-post-logout__label"
                      htmlFor="redirectUri"
                    >
                      {translation.fields['redirectUri'].label}
                    </label>
                    <input
                      id="redirectUri"
                      type="text"
                      name="redirectUri"
                      ref={register({
                        required: true,
                        validate: ValidationUtils.validateUrl,
                      })}
                      defaultValue={defaultUrl}
                      className="client-post-logout__input"
                      placeholder={
                        translation.fields['redirectUri'].placeholder
                      }
                      title={translation.fields['redirectUri'].helpText}
                    />
                    <HelpBox helpText="Users can be returned to this URL after logging out. These protocols rely upon TLS in production" />
                    <ErrorMessage
                      as="span"
                      errors={errors}
                      name="redirectUri"
                      message={translation.fields['redirectUri'].errorMessage}
                    />
                    <input
                      type="submit"
                      className="client-post-logout__button__add"
                      disabled={isSubmitting}
                      value={translation.addButton}
                    />
                  </div>
                </div>

                <NoActiveConnections
                  title={translation.noActiveConnections?.title}
                  show={!props.uris || props.uris.length === 0}
                  helpText={translation.noActiveConnections?.helpText}
                ></NoActiveConnections>

                <div
                  className={`client-post-logout__container__list ${
                    props.uris && props.uris.length > 0 ? 'show' : 'hidden'
                  }`}
                >
                  <h3>{translation.sectionTitle1}</h3>
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
                            title={translation.removeButton}
                          >
                            <i className="icon__delete"></i>
                            <span>{translation.removeButton}</span>
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
                    >
                      {translation.cancelButton}
                    </button>
                  </div>
                  <div className="client-post-logout__button__container">
                    <button
                      type="button"
                      className="client-post-logout__button__save"
                      onClick={props.handleNext}
                    >
                      {translation.saveButton}
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
        confirmationText="Delete"
      ></ConfirmModal>
    </div>
  )
}
export default ClientPostLogoutRedirectUriForm
