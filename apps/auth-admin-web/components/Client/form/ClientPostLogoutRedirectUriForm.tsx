import React, { useState } from 'react'
import { ClientPostLogoutRedirectUriDTO } from '../../../entities/dtos/client-post-logout-redirect-uri.dto'
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
        Are you sure want to delete this post logout uri:{' '}
        <span>{uriToRemove}</span>
      </p>
    )
  }

  return (
    <div>
      <div className="client-post-logout">
        <div className="client-post-logout__wrapper">
          <div className="client-post-logout__container">
            <h1>Enter a post logout redirect URL</h1>
            <div className="client-post-logout__container__form">
              <div className="client-post-logout__help">
                Specifies allowed URIs to redirect to after logout. See the{' '}
                <a
                  href="https://openid.net/specs/openid-connect-session-1_0.html"
                  target="_blank"
                  rel="noreferrer"
                >
                  OIDC Connect Session Management spec
                </a>{' '}
                for more details.
              </div>
              <form id="postLogoutForm" onSubmit={handleSubmit(add)}>
                <div className="client-post-logout__container__fields">
                  <div className="client-post-logout__container__field">
                    <label className="client-post-logout__label">
                      Logout URL
                    </label>
                    <input
                      type="text"
                      name="redirectUri"
                      ref={register({ required: true })}
                      defaultValue={defaultUrl}
                      className="client-post-logout__input"
                      placeholder="https://localhost:4200"
                      title="Users can be returned to this URL after logging out. These protocols rely upon TLS in production"
                    />
                    <HelpBox helpText="Users can be returned to this URL after logging out. These protocols rely upon TLS in production" />
                    <ErrorMessage
                      as="span"
                      errors={errors}
                      name="redirectUri"
                      message="Path is required"
                    />
                    <input
                      type="submit"
                      className="client-post-logout__button__add"
                      disabled={isSubmitting}
                      value="Add"
                    />
                  </div>
                </div>

                <NoActiveConnections
                  title="No client post logout redirect uris are defined"
                  show={!props.uris || props.uris.length === 0}
                  helpText="Add a post logout uri (if needed) and push the Add button. If a uri exists in the form, it's the display uri defined in the Client form"
                ></NoActiveConnections>

                <div
                  className={`client-post-logout__container__list ${
                    props.uris && props.uris.length > 0 ? 'show' : 'hidden'
                  }`}
                >
                  <h3>Active post logout URLs</h3>
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

                <div className="client-post-logout__buttons__container">
                  <div className="client-post-logout__button__container">
                    <button
                      type="button"
                      className="client-post-logout__button__cancel"
                      onClick={props.handleBack}
                    >
                      Back
                    </button>
                  </div>
                  <div className="client-post-logout__button__container">
                    <button
                      type="button"
                      className="client-post-logout__button__save"
                      onClick={props.handleNext}
                    >
                      Next
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
