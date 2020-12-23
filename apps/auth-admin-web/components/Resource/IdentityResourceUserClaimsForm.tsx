import { ClaimService } from 'apps/auth-admin-web/services/ClaimService';
import React, { useEffect, useState } from 'react';
import HelpBox from '../Common/HelpBox';
import NoActiveConnections from '../Common/NoActiveConnections';
import { ResourcesService } from './../../services/ResourcesService';

interface Props {
  identityResourceName: string;
  claims?: string[]; 
  handleNext?: () => void;
  handleBack?: () => void;
  handleChanges?: () => void;
}

const IdentityResourceUserClaims: React.FC<Props> = (props: Props) => {
  const [claims, setClaims] = useState<string[]>([]);

  useEffect(() => {
    getGrantTypes();
  }, []);

  const getGrantTypes = async () => {
    const response = await ClaimService.findAll();
    if(response){
      setClaims(response.map(x => x.type));
    }
  };

  const add = async (claimName: string) => {
    const response = await ResourcesService.addResourceUserClaim(props.identityResourceName, claimName);
    if (response){
      if (props.handleChanges) {
        props.handleChanges();
      }
    }
  }

  const remove = async (claimName: string) => {
    const response = await ResourcesService.removeResourceUserClaim(props.identityResourceName, claimName);
    if (response){
      if (props.handleChanges) {
        props.handleChanges();
      }
    }
  }

  const setValue = (claimName: string, value: boolean) => {
    if (value) {
      add(claimName);
    } else {
      remove(claimName);
    }
  }

  return (
    <div className="client-grant-types">
      <div className="client-grant-types__wrapper">
        <div className="client-grant-types__container">
          <h1>Select the appropriate user claims</h1>

          <div className="client-grant-types__container__form">
            <div className="client-grant-types__help">
              Select all user claims for this Identity Resource
            </div>
            <div className="client-grant-types__container__fields">
              {claims?.map((claim: string) => {
                return (
                  <div
                    className="client-grant-types__container__checkbox__field"
                    key={claim}
                  >
                    <label
                      className="client-grant-types__label"
                      title={claim}
                    >
                      {claim}
                    </label>
                    <input
                      type="checkbox"
                      name={claim}
                      className="client__checkbox"
                      defaultChecked={props.claims?.includes(claim)}
                      onChange={(e) =>
                        setValue(claim, e.target.checked)
                      }
                      title={`Set claim ${claim} as active og inactive`}
                    />
                    <HelpBox helpText={claim} />
                  </div>
                );
              })}
            </div>

            
            <NoActiveConnections title="No User Claims are defined" show={!props.claims || props.claims.length === 0} helpText="Check the appropriate claims">
            </NoActiveConnections>

            <div className="client-grant-types__buttons__container">
              <div className="client-grant-types__button__container">
                <button
                  type="button"
                  className="client-grant-types__button__cancel"
                  onClick={props.handleBack}
                >
                  Back
                </button>
              </div>
              <div className="client-grant-types__button__container">
                <button
                  type="button"
                  className="client-grant-types__button__save"
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
export default IdentityResourceUserClaims;
