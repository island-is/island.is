import { ClaimService } from '../../../services/ClaimService';
import React, { useEffect, useState } from 'react';
import HelpBox from '../../Common/HelpBox';
import NoActiveConnections from '../../Common/NoActiveConnections';
import { ResourcesService } from '../../../services/ResourcesService';

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
    getAllAvailableClaims();
  }, []);

  const getAllAvailableClaims = async () => {
    const response = await ClaimService.findAll();
    if (response) {
      setClaims(response.map((x) => x.type));
    }
  };

  const add = async (claimName: string) => {
    const response = await ResourcesService.addIdentityResourceUserClaim(
      props.identityResourceName,
      claimName
    );
    if (response) {
      if (props.handleChanges) {
        props.handleChanges();
      }
    }
  };

  const remove = async (claimName: string) => {
    const response = await ResourcesService.removeIdentityResourceUserClaim(
      props.identityResourceName,
      claimName
    );
    if (response) {
      if (props.handleChanges) {
        props.handleChanges();
      }
    }
  };

  const setValue = (claimName: string, value: boolean) => {
    if (value) {
      add(claimName);
    } else {
      remove(claimName);
    }
  };

  return (
    <div className="identity-resource-user-claims">
      <div className="identity-resource-user-claims__wrapper">
        <div className="identity-resource-user-claims__container">
          <h1>Select the appropriate user claims</h1>

          <div className="identity-resource-user-claims__container__form">
            <div className="identity-resource-user-claims__help">
              If needed, select the user claims for this Identity Resource
            </div>
            <div className="identity-resource-user-claims__container__fields">
              {claims?.map((claim: string) => {
                return (
                  <div
                    className="identity-resource-user-claims__container__checkbox__field"
                    key={claim}
                  >
                    <label
                      className="identity-resource-user-claims__label"
                      title={claim}
                    >
                      {claim}
                    </label>
                    <input
                      type="checkbox"
                      name={claim}
                      className="client__checkbox"
                      defaultChecked={props.claims?.includes(claim)}
                      onChange={(e) => setValue(claim, e.target.checked)}
                      title={`Set claim ${claim} as active og inactive`}
                    />
                    <HelpBox helpText={claim} />
                  </div>
                );
              })}
            </div>

            <NoActiveConnections
              title="No User Claims are selected"
              show={!props.claims || props.claims.length === 0}
              helpText="If necessary, check user the user claims needed"
            ></NoActiveConnections>

            <div className="identity-resource-user-claims__buttons__container">
              <div className="identity-resource-user-claims__button__container">
                <button
                  type="button"
                  className="identity-resource-user-claims__button__cancel"
                  onClick={props.handleBack}
                >
                  Back
                </button>
              </div>
              <div className="identity-resource-user-claims__button__container">
                <button
                  type="button"
                  className="identity-resource-user-claims__button__save"
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
