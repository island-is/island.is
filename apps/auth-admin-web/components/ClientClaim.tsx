import React from 'react';
import { ClientClaimDTO } from '../models/dtos/client-claim.dto';

interface Props {
    claim: ClientClaimDTO,
    handleSaved?: (claim: ClientClaimDTO) => void
}

const ClientClaim: React.FC<Props> = (props: Props) =>
{
    const save = () => {
        const temp = new ClientClaimDTO();
        temp.clientId = props.claim.clientId;
        props.handleSaved(temp);
    }
    return (
        <div className="client-claim">
          {/* <StatusBar status={response}></StatusBar> */}
          <div className="client-claim__wrapper">
            <div className="client-claim__container">
              <h1>Select authentication types</h1>
              <div className="client-claim__help">
                Select claims for this client
              </div>
    
              <div className="client-claim__container__form">
                <div className="client-claim__container__fields">
                  
                </div>
    
                <div className="client-claim__buttons__container">
                  <div className="client-claim__button__container">
                    <button
                      type="button"
                      className="client-claim__button__cancel"
                    >
                      Back
                    </button>
                  </div>
                  <div className="client-claim__button__container">
                    <button
                      type="button"
                      className="client-claim__button__save"
                      value="Next"
                    >Next</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
}
export default ClientClaim;