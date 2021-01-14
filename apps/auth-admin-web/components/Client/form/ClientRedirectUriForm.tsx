import React, { useState } from 'react'
import { ClientRedirectUriDTO } from '../../../entities/dtos/client-redirect-uri.dto'
import { useForm } from 'react-hook-form'
import { ErrorMessage } from '@hookform/error-message'
import HelpBox from '../../common/HelpBox'
import NoActiveConnections from '../../common/NoActiveConnections'
import { ClientService } from '../../../services/ClientService'
import ConfirmModal from '../../common/ConfirmModal'

interface Props {
  clientId: string
  defaultUrl?: string
  uris?: string[]
  handleNext?: () => void
  handleBack?: () => void
  handleChanges?: () => void
}

const ClientRedirectUriForm: React.FC<Props> = (props: Props) => {
  const { register, handleSubmit, errors, formState } = useForm<
    ClientRedirectUriDTO
  >()
  const { isSubmitting } = formState
  const [defaultUrl, setDefaultUrl] = useState(
    !props.uris || props.uris.length === 0 ? props.defaultUrl : '',
  )
  const [modalIsOpen, setIsOpen] = React.useState(false)
  const [uriToRemove, setUriToRemove] = React.useState('')

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
            <h1>Enter a callback URL</h1>
            <div className="client-redirect__container__form">
              <div className="client-redirect__help">
                Specifies the allowed URIs to return tokens or authorization
                codes to
              </div>
              <form id="redirectForm" onSubmit={handleSubmit(add)}>
                <div className="client-redirect__container__fields">
                  <div className="client-redirect__container__field">
                    <label className="client-redirect__label">
                      Callback URL
                    </label>
                    <input
                      type="text"
                      name="redirectUri"
                      ref={register({ required: true })}
                      defaultValue={defaultUrl ?? ''}
                      className="client-redirect__input"
                      placeholder="https://localhost:4200/signin-oidc"
                      title="Full path of the redirect URL. These protocols rely upon TLS in production"
                    />
                    <HelpBox helpText="Full path of the redirect URL. These protocols rely upon TLS in production" />
                    <ErrorMessage
                      as="span"
                      errors={errors}
                      name="redirectUri"
                      message="Path is required"
                    />
                    <input
                      type="submit"
                      className="client-redirect__button__add"
                      disabled={isSubmitting}
                      value="Add"
                    />
                  </div>
                </div>
              </form>

              <NoActiveConnections
                title="No client redirect uris (Callback uris) are defined"
                show={!props.uris || props.uris.length === 0}
                helpText="Add a redirect uri and push the Add button. If a uri exists in the form, it's the display uri defined in the Client form"
              ></NoActiveConnections>

              <div
                className={`client-redirect__container__list ${
                  props.uris && props.uris.length > 0 ? 'show' : 'hidden'
                }`}
              >
                <h3>Active callback URLs</h3>
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
                          title="Remove"
                        >
                          <i className="icon__delete"></i>
                          <span>Remove</span>
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
                    title="Back"
                    onClick={props.handleBack}
                  >
                    Back
                  </button>
                </div>
                <div className="client-redirect__button__container">
                  <button
                    type="button"
                    className="client-redirect__button__save"
                    onClick={props.handleNext}
                    title="Next"
                  >
                    Next
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
        confirmationText="Delete"
      ></ConfirmModal>
    </div>
  )
}
export default ClientRedirectUriForm
