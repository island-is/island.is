import { ErrorMessage } from '@hookform/error-message';
import React from 'react';
import { useForm } from 'react-hook-form';
import { ClientClaim } from '../../entities/models/client-claim.model';
import { ClientClaimDTO } from '../../entities/dtos/client-claim.dto';
import HelpBox from '../Common/HelpBox';
import NoActiveConnections from '../Common/NoActiveConnections';
import { ClientService } from './../../services/ClientService';
import ConfirmModal from './../common/ConfirmModal';

interface Props {
  clientId: string;
  claims?: ClientClaim[];
  handleNext?: () => void;
  handleBack?: () => void;
  handleChanges?: () => void;
}

const ClientClaimForm: React.FC<Props> = (props: Props) => {
  const { register, handleSubmit, errors, formState } = useForm<
    ClientClaimDTO
  >();
  const { isSubmitting } = formState;
  const [modalIsOpen, setIsOpen] = React.useState(false);
  const [claimToRemove, setClaimToRemove] = React.useState<ClientClaimDTO>(
    new ClientClaimDTO()
  );

  const add = async (data: any) => {
    const clientClaim = new ClientClaimDTO();
    clientClaim.clientId = props.clientId;
    clientClaim.type = data.type;
    clientClaim.value = data.value;

    const response = ClientService.addClaim(clientClaim);
    if (response) {
      if (props.handleChanges) {
        props.handleChanges();
      }
      document.getElementById('claimForm').reset();
    }
  };

  const remove = async () => {
    const response = await ClientService.removeClaim(
      claimToRemove.clientId,
      claimToRemove.type,
      claimToRemove.value
    );
    if (response) {
      if (props.handleChanges) {
        props.handleChanges();
      }
    }

    closeModal();
  };

  const confirmRemove = async (claim: ClientClaimDTO) => {
    setClaimToRemove(claim);
    setIsOpen(true);
  };

  function closeModal() {
    setIsOpen(false);
  }

  const setHeaderElement = () => {
    return (
      <p>
        Are you sure want to delete this claim:{' '}
        <span>{claimToRemove.type}</span> - <span>{claimToRemove.value}</span>
      </p>
    );
  };

  return (
    <div className="client-claim">
      <div className="client-claim__wrapper">
        <div className="client-claim__container">
          <h1>Add claims for the Client</h1>
          <div className="client-claim__help">
            Allows settings claims for the client (will be included in the
            access token).
          </div>
          <form id="claimForm" onSubmit={handleSubmit(add)}>
            <div className="client-claim__container__form">
              <div className="client-claim__container__fields">
                <div className="client-claim__container__field">
                  <label className="client-claim__label">
                    Claim type (key)
                  </label>
                  <input
                    type="text"
                    name="type"
                    ref={register({ required: true })}
                    defaultValue={''}
                    className="client-claim__input"
                    placeholder="exampleClaim"
                    title="The key that represents this claim"
                  />
                  <HelpBox helpText="The key that represents this claim" />
                  <ErrorMessage
                    as="span"
                    errors={errors}
                    name="type"
                    message="Claim type is required"
                  />
                  <input
                    type="submit"
                    className="client-claim__button__add"
                    disabled={isSubmitting}
                    value="Add"
                  />
                </div>
                <div className="client-claim__container__field">
                  <label className="client-claim__label">Claim value</label>
                  <input
                    type="text"
                    name="value"
                    ref={register({ required: true })}
                    defaultValue={''}
                    className="client-claim__input"
                    placeholder="exampleClaim"
                    title="The value of the claim"
                  />
                  <HelpBox helpText="The value of the claim" />
                  <ErrorMessage
                    as="span"
                    errors={errors}
                    name="value"
                    message="Value is required"
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
                <h3>Active client claims</h3>
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
                          title="Remove"
                        >
                          <i className="icon__delete"></i>
                          <span>Remove</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="client-claim__buttons__container">
                <div className="client-claim__button__container">
                  <button
                    type="button"
                    className="client-claim__button__cancel"
                    onClick={props.handleBack}
                  >
                    Back
                  </button>
                </div>
                <div className="client-claim__button__container">
                  <button
                    type="button"
                    className="client-claim__button__save"
                    onClick={props.handleNext}
                    value="Next"
                  >
                    Next
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
  );
};
export default ClientClaimForm;
