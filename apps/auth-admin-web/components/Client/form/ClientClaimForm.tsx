import { ErrorMessage } from '@hookform/error-message'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { ClientClaim } from '../../../entities/models/client-claim.model'
import { ClientClaimDTO } from '../../../entities/dtos/client-claim.dto'
import HelpBox from '../../common/HelpBox'
import NoActiveConnections from '../../common/NoActiveConnections'
import { ClientService } from '../../../services/ClientService'
import ConfirmModal from '../../common/ConfirmModal'
import ValidationUtils from './../../../utils/validation.utils'
import TranslationUtils from './../../../utils/translation.utils'
import { FormPage } from './../../../entities/common/Translation'
interface Props {
  clientId: string
  claims?: ClientClaim[]
  handleNext?: () => void
  handleBack?: () => void
  handleChanges?: () => void
}

const ClientClaimForm: React.FC<Props> = (props: Props) => {
  const {
    register,
    handleSubmit,
    errors,
    formState,
  } = useForm<ClientClaimDTO>()
  const { isSubmitting } = formState
  const [modalIsOpen, setIsOpen] = useState(false)
  const [translation, setTranslation] = useState<FormPage>(
    TranslationUtils.getFormPage('ClientClaimForm'),
  )
  const [claimToRemove, setClaimToRemove] = useState<ClientClaimDTO>(
    new ClientClaimDTO(),
  )

  const add = async (data: ClientClaimDTO) => {
    const clientClaim = new ClientClaimDTO()
    clientClaim.clientId = props.clientId
    clientClaim.type = data.type
    clientClaim.value = data.value

    const response = ClientService.addClaim(clientClaim)
    if (response) {
      if (props.handleChanges) {
        props.handleChanges()
      }
      const form = document.getElementById('claimForm') as HTMLFormElement
      if (form) {
        form.reset()
      }
    }
  }

  const remove = async () => {
    const response = await ClientService.removeClaim(
      claimToRemove.clientId,
      claimToRemove.type,
      claimToRemove.value,
    )
    if (response) {
      if (props.handleChanges) {
        props.handleChanges()
      }
    }

    closeModal()
  }

  const confirmRemove = async (claim: ClientClaimDTO) => {
    setClaimToRemove(claim)
    setIsOpen(true)
  }

  function closeModal() {
    setIsOpen(false)
  }

  const setHeaderElement = () => {
    return (
      <p>
        {translation.removeConfirmation}:<span>{claimToRemove.type}</span>-
        <span>{claimToRemove.value}</span>
      </p>
    )
  }

  return (
    <div className="client-claim">
      <div className="client-claim__wrapper">
        <div className="client-claim__container">
          <h1>{translation.title}</h1>
          <form id="claimForm" onSubmit={handleSubmit(add)}>
            <div className="client-claim__container__form">
              <div className="client-claim__help">{translation.help}</div>
              <div className="client-claim__container__fields">
                <div className="client-claim__container__field">
                  <label className="client-claim__label" htmlFor="type">
                    {translation.fields['type'].label}
                  </label>
                  <input
                    id="type"
                    type="text"
                    name="type"
                    ref={register({
                      required: true,
                      validate: ValidationUtils.validateIdentifier,
                    })}
                    defaultValue={''}
                    className="client-claim__input"
                    placeholder={translation.fields['type'].placeholder}
                    title={translation.fields['type'].helpText}
                  />
                  <HelpBox helpText={translation.fields['type'].helpText} />
                  <ErrorMessage
                    as="span"
                    errors={errors}
                    name="type"
                    message={translation.fields['type'].errorMessage}
                  />
                  <input
                    type="submit"
                    className="client-claim__button__add"
                    disabled={isSubmitting}
                    value={translation.addButton}
                  />
                </div>
                <div className="client-claim__container__field">
                  <label className="client-claim__label" htmlFor="value">
                    {translation.fields['value'].label}
                  </label>
                  <input
                    id="value"
                    type="text"
                    name="value"
                    ref={register({
                      required: true,
                      validate: ValidationUtils.validateDescription,
                    })}
                    defaultValue={''}
                    className="client-claim__input"
                    placeholder={translation.fields['value'].placeholder}
                    title={translation.fields['value'].helpText}
                  />
                  <HelpBox helpText={translation.fields['value'].helpText} />
                  <ErrorMessage
                    as="span"
                    errors={errors}
                    name="value"
                    message={translation.fields['value'].errorMessage}
                  />
                </div>
              </div>

              <NoActiveConnections
                title="No active claims"
                show={!props.claims || props.claims.length === 0}
                helpText="Fill out the form and push the Add button to add a claim"
              ></NoActiveConnections>

              <div
                className={`client-claim__container__list ${
                  props.claims && props.claims.length > 0 ? 'show' : 'hidden'
                }`}
              >
                <h3>{translation.sectionTitle1}</h3>
                {props.claims?.map((claim: ClientClaim) => {
                  return (
                    <div
                      className="client-claim__container__list__item"
                      key={claim.type}
                    >
                      <div className="list-name">{claim.type}</div>
                      <div className="list-value">{claim.value}</div>
                      <div className="list-remove">
                        <button
                          type="button"
                          onClick={() => confirmRemove(claim)}
                          className="client-claim__container__list__button__remove"
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
              <div className="client-claim__buttons__container">
                <div className="client-claim__button__container">
                  <button
                    type="button"
                    className="client-claim__button__cancel"
                    onClick={props.handleBack}
                  >
                    {translation.cancelButton}
                  </button>
                </div>
                <div className="client-claim__button__container">
                  <button
                    type="button"
                    className="client-claim__button__save"
                    onClick={props.handleNext}
                    value={translation.saveButton}
                  >
                    {translation.saveButton}
                  </button>
                </div>
              </div>
            </div>
          </form>
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
export default ClientClaimForm
