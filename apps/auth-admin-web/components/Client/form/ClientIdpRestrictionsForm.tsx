import React from 'react';
import HelpBox from '../../Common/HelpBox';
import NoActiveConnections from '../../Common/NoActiveConnections';
import { ClientService } from '../../../services/ClientService';

interface Props {
  clientId: string;
  restrictions?: string[]; // What is currently valid for updating existing Clients
  handleNext?: () => void;
  handleBack?: () => void;
  handleChanges?: () => void;
}

const ClientIdpRestrictionsForm: React.FC<Props> = (props: Props) => {
  const add = async (name: string) => {
    const createObj = {
      name: name,
      clientId: props.clientId,
    };

    const response = await ClientService.addIdpRestriction(createObj);
    if ( response ){
      if (props.handleChanges){
        props.handleChanges();
      }
    }
  };

  const remove = async (name: string) => {
    const response = await ClientService.removeIdpRestriction(props.clientId, name);
    if (response){
      if (props.handleChanges){
        props.handleChanges();
      }
    }
  }

  const setSim = (sim: boolean) => {
    if (sim) {
      add('audkenni_sim');
    } else {
      remove('audkenni_sim');
    }
  };

  const setCard = (card: boolean) => {
    if (card) {
      add('audkenni_card');
    } else {
      remove('audkenni_card');
    }
  };

  return (
    <div className="client-idp-restriction">
      <div className="client-idp-restriction__wrapper">
        <div className="client-idp-restriction__container">
          <h1>Identity provider restrictions</h1>

          <div className="client-idp-restriction__container__form">
            <div className="client-idp-restriction__help">
            Specifies which external IdPs can be used with this client.
            <p><strong>If selection is empty all IdPs are allowed</strong></p>
            </div>
            <div className="client-idp-restriction__container__fields">
              <div className="client-idp-restriction__container__checkbox__field">
                <label className="client-idp-restriction__label">
                  Sim card
                </label>
                <input
                  type="checkbox"
                  name="sim"
                  className="client__checkbox"
                  defaultChecked={props.restrictions?.includes('audkenni_sim')}
                  onChange={(e) => setSim(e.target.checked)}
                  title="Allows users to login with sim cards"
                />
                <HelpBox helpText="Allows users to login with sim cards" />
              </div>

              <div className="client-idp-restriction__container__checkbox__field">
                <label className="client-idp-restriction__label">
                  Identity card
                </label>
                <input
                  type="checkbox"
                  name="card"
                  className="client__checkbox"
                  defaultChecked={props.restrictions?.includes('audkenni_card')}
                  onChange={(e) => setCard(e.target.checked)}
                  title="Allows users to login with identity cards"
                />
                <HelpBox helpText="Allows users to login with identity cards" />
              </div>
            </div>

            <NoActiveConnections title="All external IdPs are enabled" show={!props.restrictions || props.restrictions.length === 0} helpText="Check the appropriate external IdPs for the client. If nothing is selected then all methods are allowed">
            </NoActiveConnections>

            <div className="client-idp-restriction__buttons__container">
              <div className="client-idp-restriction__button__container">
                <button
                  type="button"
                  className="client-idp-restriction__button__cancel"
                  onClick={props.handleBack}
                >
                  Back
                </button>
              </div>
              <div className="client-idp-restriction__button__container">
                <button
                  type="button"
                  className="client-idp-restriction__button__save"
                  value="Next"
                  onClick={props.handleNext}
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default ClientIdpRestrictionsForm;
