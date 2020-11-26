import React, { useState } from 'react';
import { ClientRedirectUriDTO } from '../models/dtos/client-redirect-uri.dto';
import { useForm } from 'react-hook-form';
import { ErrorMessage } from '@hookform/error-message';
import StatusBar from './StatusBar';
import HelpBox from './HelpBox';
 
interface Props {
    redirectObject: ClientRedirectUriDTO,
    handlePageChange?: () => void
}

const ClientRedirectUri: React.FC<Props> = (props: Props) =>
{
    const { register, handleSubmit, errors, formState } = useForm<ClientRedirectUriDTO>();
    const { isSubmitting } = formState;
    const [response, setResponse] = useState(null);
    const [uris, setUris] = useState<string[]>([]);
    
    const save = (data) => {
        const temp = new ClientRedirectUriDTO();
        temp.clientId = props.redirectObject.clientId;
        temp.redirectUri = data.redirectUri;
        console.log(temp);
        uris.push(temp.redirectUri);
        setUris(uris);
    }
    return  <div className="client-redirect">
    <StatusBar status={response}></StatusBar>
    <div className="client-redirect__wrapper">
      

      <div className="client-redirect__container">
      <h1>Enter a callback URL</h1>
      <div className="client-redirect__help">
       Tokens will be sent to this endpoint
      </div>
        
        <div className="client-redirect__container__form">
          <form onSubmit={handleSubmit(save)}>
            <div className="client-redirect__container__fields">
              
              <div className="client-redirect__container__field">

                <label className="client-redirect__label">Callback URL</label>
                <input
                  type="text"
                  name="redirectUri"
                  ref={register({ required: true })}
                  defaultValue={props.redirectObject.redirectUri}
                  className="client-redirect__input"
                  placeholder="https://localhost:4200/signin-oidc"
                  title="Full path of the redirect URL. These protocols rely upon TLS in production"
                />
                <HelpBox helpText="Full path of the redirect URL. These protocols rely upon TLS in production" />
                <ErrorMessage
                  as="span"
                  errors={errors}
                  name="client.nationalId"
                  message="Path is required"
                />
                <input
                    type="submit"
                    className="client-redirect__button__save"
                    disabled={isSubmitting}
                    value="Add"
                />
              </div>
              </div>

               <div className="client-redirect__container__list">
               {uris.map((uri: string) => {
                return (
                  <p>{uri}</p>
                );
              })}
              </div>
              

              <div className="client-redirect__buttons__container">
                <div className="client-redirect__button__container">
                  <button type="button" className="client-redirect__button__cancel">Back</button>
                </div>
                <div className="client-redirect__button__container">
                  <button
                    type="button"
                    className="client-redirect__button__save"
                    onClick={props.handlePageChange}
                  >Next</button>
                </div>
              </div>
           
              </form>

        </div>
    </div>
    </div></div>


}
export default ClientRedirectUri;
