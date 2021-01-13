import React, { useState, useEffect } from 'react';
import HelpBox from '../../Common/HelpBox';
import NoActiveConnections from '../../Common/NoActiveConnections';
import { ClientService } from '../../../services/ClientService';
import { IdpRestriction } from './../../../entities/models/idp-restriction.model';

interface Props {
  clientId: string;
  restrictions?: string[]; // What is currently valid for updating existing Clients
  handleNext?: () => void;
  handleBack?: () => void;
  handleChanges?: () => void;
}

const ClientIdpRestrictionsForm: React.FC<Props> = (props: Props) => {
  const [idpRestrictions, setIdpRestrictions] = useState<IdpRestriction[]>([]);

  useEffect(() => {
    getIdpRestrictions();
  }, []);

  const getIdpRestrictions = async () => {
    const restrictions = await ClientService.findAllIdpRestrictions();
    if (restrictions) setIdpRestrictions(restrictions);
  };

  const add = async (name: string) => {
    const createObj = {
      name: name,
      clientId: props.clientId,
    };

    const response = await ClientService.addIdpRestriction(createObj);
    if (response) {
      if (props.handleChanges) {
        props.handleChanges();
      }
    }
  };

  const remove = async (name: string) => {
    const response = await ClientService.removeIdpRestriction(
      props.clientId,
      name
    );
    if (response) {
      if (props.handleChanges) {
        props.handleChanges();
      }
    }
  };

  const setIdp = (name: string, value: boolean) => {
    if (value) {
      add(name);
    } else {
      remove(name);
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
              <p>
                <strong>If selection is empty all IdPs are allowed</strong>
              </p>
            </div>
            <div className="client-idp-restriction__container__fields">
              {idpRestrictions?.map((idpRestriction: IdpRestriction) => {
                return (
                  <div
                    key={idpRestriction.name}
                    className="client-idp-restriction__container__checkbox__field"
                  >
                    <label className="client-idp-restriction__label">
                      {idpRestriction.description}
                    </label>
                    <input
                      type="checkbox"
                      name={idpRestriction.name}
                      className="client__checkbox"
                      defaultChecked={props.restrictions?.includes(
                        idpRestriction.name
                      )}
                      onChange={(e) =>
                        setIdp(idpRestriction.name, e.target.checked)
                      }
                      title={idpRestriction.helptext}
                    />
                    <HelpBox helpText={idpRestriction.helptext} />
                  </div>
                );
              })}
            </div>

            <NoActiveConnections
              title="All external IdPs are enabled"
              show={!props.restrictions || props.restrictions.length === 0}
              helpText="Check the appropriate external IdPs for the client. If nothing is selected then all methods are allowed"
            ></NoActiveConnections>

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
