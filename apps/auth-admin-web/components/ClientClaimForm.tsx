import React from 'react';
import { ClientClaimDTO } from '../models/dtos/client-claim.dto';

interface Props {
    claim: ClientClaimDTO,
    handleNext?: () => void;
    handleBack?: () => void;
    handleChanges?: () => void
}

const ClientClaimForm: React.FC<Props> = (props: Props) =>
{
  const save = (data: any) => {
    if (props.handleChanges) {
      props.handleChanges();
    }
  }
    
    return (
        <div className="client-claim">
          {/* <StatusBar status={response}></StatusBar> */}
          <div className="client-claim__wrapper">
            <div className="client-claim__container">
              <h1>Add claims for the Client</h1>
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
                    >Next</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
}
export default ClientClaimForm;