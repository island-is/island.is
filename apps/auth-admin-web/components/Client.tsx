import React, { useMemo } from "react";
import ClientDTO from "../models/dtos/client-dto";
import axios from "axios";
import StatusBar from "./StatusBar";
import APIResponse from "../models/APIResponse";
import { useRouter } from "next/router";
import { useForm, Controller  } from "react-hook-form";
import { ErrorMessage } from '@hookform/error-message';
import * as yup from "yup";

type Props = {
  client: ClientDTO;
};
export default function Client<ClientDTO>(client: ClientDTO){
  const validationSchema = useMemo(
    () =>
      yup.object({
        firstName: yup.string().required("Required"),
        lastName: yup.string().required("Required")
      }),
    []
  );
  
  const { register, handleSubmit, errors, formState, control } = useForm<ClientDTO>();
  const { isDirty, isSubmitting } = formState;
  client = client.client;

  const save = async (data) => {
    console.log(data.client);
    const response = await axios.post("/api/clients", data.client).catch((err) => {
      console.log(err);
    });

    console.log(response);
    
  };

    return (
      <div className="client">
        {/* <StatusBar status={null}></StatusBar> */}
        <div className="client__wrapper">
          <div className="client__help">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Consequatur
            sed alias neque ullam repudiandae, iste reiciendis suscipit rerum
            officiis necessitatibus doloribus incidunt libero distinctio
            consequuntur voluptatibus tenetur aliquid ut inventore!
          </div>

          <div className="client__container">
            <h1>Create a new Client</h1>
            <div className="client__container__form">
              <form onSubmit={handleSubmit(save)}>
                <div className="client__container__fields">
                  {/* <HookField name='client.clientId' errors={errors} required={true} label="Client Id" value={client.clientId}  /> */}
                  <div className="client__container__field">
                    <label className="client__label">
                      Client Id</label>
                    <input
                      type="text"
                      name="client.clientId"
                      ref={register({ required: true })}
                      defaultValue={client.clientId}
                      className="client__input"
                    />
                    <ErrorMessage as="span" errors={errors} name="client.clientId" message="Id is required" />
                  </div>
                  <div className="client__container__field">
                    <label className="client__label">Name</label>
                    <input
                      type="text"
                      name="client.clientName"
                      ref={register({ required: true })}
                      defaultValue={client.clientName}
                      className="client__input"
                    />
                    <ErrorMessage as="span" errors={errors} name="client.clientName" message="Name is required" />
                  </div>
                  <div className="client__container__field">
                    <label className="client__label">URI</label>
                    <input
                      name="client.clientUri"
                      ref={register}
                      type="text"
                      defaultValue={client.clientUri ?? ""}
                      className="client__input"
                    />
                    
                  </div>
                  <div className="client__container__field">
                    <label className="client__label">Description</label>
                    <input
                      type="text"
                      ref={register}
                      name="client.description"
                      defaultValue={client.description ?? ""}
                      className="client__input"
                    />
                  </div>

                  <div className="client__container__field">
                    <label className="client__label">
                      Client claims prefix
                    </label>
                    <input
                      ref={register({ required: true })}
                      type="text"
                      name="client.clientClaimsPrefix"
                      defaultValue={
                        client.clientClaimsPrefix
                          ? client.clientClaimsPrefix
                          : "client__"
                      }
                      className="client__input"
                    />
                    <ErrorMessage as="span" errors={errors} name="client.clientClaimsPrefix" message="Client claims prefix is required" />
                  </div>

                  <div className="client__container__field">
                    <label className="client__label">Protocol Type</label>
                    <input
                    ref={register({ required: true })}
                      type="text"
                      name="client.protocolType"
                      defaultValue={
                        client.protocolType
                          ? client.protocolType
                          : "oidc"
                      }
                      className="client__input"
                    />
                    <ErrorMessage as="span" errors={errors} name="client.protocolType" message="Protocol Type is required" />
                  </div>

                  <div className="client__container__field">
                    <label className="client__label">Virkur</label>
                    <input
                      type="checkbox"
                      name="client.enabled"
                      className="client__checkbox"
                      defaultChecked={client.enabled}
                      ref={register}
                    ></input>
                  </div>

                  <div className="client__container__button">
                    <button className="client__button__show">Advanced</button>
                  </div>

                  <div className="client__container__advanced">
                    <div className="client__container__field">
                      <label className="client__label">
                        Absolute Refresh Token Lifetime
                      </label>
                      <input
                        type="number"
                        ref={register({ required: true })}
                        name="client.absoluteRefreshTokenLifetime"
                        defaultValue={client.absoluteRefreshTokenLifetime}
                        className="client__input"
                      />
                      <ErrorMessage as="span" errors={errors} name="client.absoluteRefreshTokenLifetime" message="Absolute Refresh Token Lifetime is required" />
                    </div>
                    <div className="client__container__field">
                      <label className="client__label">
                        Access Token Lifetime
                      </label>
                      <Controller
                      as={<input />}
                      name="client.accessTokenLifetime"
                      control={control}
                      defaultValue={client.accessTokenLifetime}
                      ref={register({ required: true })}
                      onChange={([e]) => {
                        return parseInt(e.target.value, 10);
                      }}
                      />
                      <ErrorMessage as="span" errors={errors} name="client.accessTokenLifetime" message="Access Token Lifetime is required" /> 
                      {/* <input
                        ref={register({ required: true })}
                        type="number"
                        name="client.accessTokenLifetime"
                        defaultValue={client.accessTokenLifetime}
                        className="client__input"
                      />
                      <ErrorMessage as="span" errors={errors} name="client.accessTokenLifetime" message="Access Token Lifetime is required" /> */}
                    </div>
                    <div className="client__container__field">
                      <label className="client__label">
                        Authorization code lifetime
                      </label>
                      <input
                        type="number"
                        name="client.authorizationCodeLifetime"
                        defaultValue={client.authorizationCodeLifetime}
                        ref={register({ required: true })}
                        className="client__input"
                      />
                      <ErrorMessage as="span" errors={errors} name="client.authorizationCodeLifetime" message="Authorization code lifetime is required" />
                    </div>
                    <div className="client__container__field">
                      <label className="client__label">Consent lifetime</label>
                      <input
                        type="number"
                        name="client.consentLifetime"
                        defaultValue={client.consentLifetime ?? null}
                        className="client__input"
                        ref={register}
                      />
                    </div>
                    <div className="client__container__field">
                      <label className="client__label">
                        Device code lifetime
                      </label>
                      <input
                        type="number"
                        ref={register({ required: true })}
                        name="client.deviceCodeLifetime"
                        defaultValue={client.deviceCodeLifetime}
                        className="client__input"
                      />
                      <ErrorMessage as="span" errors={errors} name="client.deviceCodeLifetime" message="Device code lifetime is required" />
                    </div>

                    <div className="client__container__field">
                      <label className="client__label">
                        Front channel logout uri
                      </label>
                      <input
                        type="text"
                        name="client.frontChannelLogoutUri"
                        defaultValue={client.frontChannelLogoutUri ?? ""}
                        className="client__input"
                        ref={register}
                      />
                    </div>

                    <div className="client__container__field">
                      <label className="client__label">
                        Identity token lifetime
                      </label>
                      <input
                        type="number"
                        name="client.identityTokenLifetime"
                        defaultValue={client.identityTokenLifetime}
                        ref={register({ required: true })}
                        className="client__input"
                      />
                      <ErrorMessage as="span" errors={errors} name="client.identityTokenLifetime" message="Key is required" />
                    </div>

                    <div className="client__container__field">
                      <label className="client__label">
                        Rair wise subject salt
                      </label>
                      <input
                        type="text"
                        defaultValue={client.pairWiseSubjectSalt ?? ""}
                        className="client__input"
                        name="client.pairWiseSubjectSalt"
                        ref={register}
                      />
                    </div>

                    <div className="client__container__field">
                      <label className="client__label">
                        Refresh token expiration
                      </label>
                      <input
                        type="number"
                        defaultValue={client.refreshTokenExpiration}
                        ref={register({ required: true })}
                        className="client__input"
                        name="client.refreshTokenExpiration"
                      />
                    </div>

                    <div className="client__container__field">
                      <label className="client__label">Refresh Token Usage</label>
                      <input
                        type="number"
                        defaultValue={client.refreshTokenUsage}
                        ref={register({ required: true })}
                        className="client__input"
                        name="client.refreshTokenUsage"
                      />
                    </div>

                    <div className="client__container__field">
                      <label className="client__label">
                        Sliding refresh token lifetime
                      </label>
                      <input
                        type="number"
                        defaultValue={client.slidingRefreshTokenLifetime}
                        name="client.slidingRefreshTokenLifetime"
                        className="client__input"
                        ref={register}
                      />
                    </div>

                    <div className="client__container__field">
                      <label className="client__label">User code type</label>
                      <input
                        type="text"
                        defaultValue={client.userCodeType ?? ""}
                        name="client.userCodeType"
                        className="client__input"
                        ref={register}
                      />
                    </div>

                    <div className="client__container__field">
                      <label className="client__label">User Sso Lifetime</label>
                      <input
                        type="number"
                        defaultValue={client.userSsoLifetime}
                        name="client.userSsoLifetime"
                        className="client__input"
                        ref={register}
                      />
                    </div>


                    {/* Checkboxes */}
                    <div className="client__container__field">
                      <label className="client__label">
                        allow access token via browser
                      </label>
                      <input
                        type="checkbox"
                        name="client.allowAccessTokenViaBrowser"
                        defaultChecked={client.allowAccessTokenViaBrowser}
                        className="client__input"
                        ref={register}
                      />
                    </div>
                    <div className="client__container__field">
                      <label className="client__label">
                        Allow offline access
                      </label>
                      <input
                        name="client.allowOfflineAccess"
                        type="checkbox"
                        defaultChecked={client.allowOfflineAccess}
                        className="client__input"
                        ref={register}
                      />
                    </div>
                    <div className="client__container__field">
                      <label className="client__label">
                        Allow plain text Pkce
                      </label>
                      <input
                        name="client.allowPlainTextPkce"
                        type="checkbox"
                        defaultChecked={client.allowPlainTextPkce}
                        className="client__input"
                        ref={register}
                      />
                    </div>
                    <div className="client__container__field">
                      <label className="client__label">
                        Allow remember consent
                      </label>
                      <input
                        name="client.allowRememberConsent"
                        type="checkbox"
                        defaultChecked={client.allowRememberConsent}
                        className="client__input"
                        ref={register}
                      />
                    </div>
                    <div className="client__container__field">
                      <label className="client__label">
                        Always include user claims in Id token
                      </label>
                      <input
                        type="checkbox"
                        name="client.alwaysIncludeUserClaimsInIdToken"
                        defaultChecked={
                          client.alwaysIncludeUserClaimsInIdToken
                        }
                        className="client__input"
                        ref={register}
                      />
                    </div>
                    <div className="client__container__field">
                      <label className="client__label">
                        Always send client claims
                      </label>
                      <input
                        type="checkbox"
                        name="client.alwaysSendClientClaims"
                        defaultChecked={client.alwaysSendClientClaims}
                        className="client__input"
                        ref={register}
                      />
                    </div>
                   
                    <div className="client__container__field">
                      <label className="client__label">
                        Back channel logout session required
                      </label>
                      <input
                        type="checkbox"
                        name="client.backChannelLogoutSessionRequired"
                        defaultChecked={
                          client.backChannelLogoutSessionRequired
                        }
                        className="client__input"
                        ref={register}
                      />
                    </div>

                    

                   

                    <div className="client__container__field">
                      <label className="client__label">
                        Enable local login
                      </label>
                      <input
                        type="checkbox"
                        defaultChecked={client.enableLocalLogin}
                        className="client__input"
                        name="client.enableLocalLogin"
                        ref={register}
                      />
                    </div>

                    <div className="client__container__field">
                      <label className="client__label">
                        Front channel logout session required
                      </label>
                      <input
                        type="checkbox"
                        name="client.frontChannelLogoutSessionRequired"
                        defaultChecked={
                          client.frontChannelLogoutSessionRequired
                        }
                        className="client__input"
                        ref={register}
                      />
                    </div>

                    
                    

                    <div className="client__container__field">
                      <label className="client__label">Include Jwt Id</label>
                      <input
                        type="checkbox"
                        defaultChecked={client.includeJwtId}
                        className="client__input"
                        name="client.includeJwtId"
                        ref={register}
                      />
                    </div>

                    

                    

                    

                    <div className="client__container__field">
                      <label className="client__label">
                        Require client secret
                      </label>
                      <input
                        type="checkbox"
                        defaultChecked={client.requireClientSecret}
                        className="client__input"
                        name="client.requireClientSecret"
                        ref={register}
                      />
                    </div>

                    <div className="client__container__field">
                      <label className="client__label">Require consent</label>
                      <input
                        type="checkbox"
                        defaultChecked={client.requireConsent}
                        className="client__input"
                        name="client.requireConsent"
                        ref={register}
                      />
                    </div>

                    <div className="client__container__field">
                      <label className="client__label">Require Pkce</label>
                      <input
                        type="checkbox"
                        defaultChecked={client.requirePkce}
                        name="client.requirePkce"
                        className="client__input"
                        ref={register}
                      />
                    </div>

                    

                    <div className="client__container__field">
                      <label className="client__label">
                        Update access token claims on refresh
                      </label>
                      <input
                        type="checkbox"
                        defaultChecked={
                          client.updateAccessTokenClaimsOnRefresh
                        }
                        name="client.updateAccessTokenClaimsOnRefresh"
                        className="client__input"
                        ref={register}
                      />
                    </div>

                    

                    
                  </div>
                </div>
                <div className="client__buttons__container">
                  <div className="client__button__container">
                    <button
                      className="client__button__cancel"
                      
                    >
                      Cancel
                    </button>
                  </div>
                  <div className="client__button__container">
                    <input
                      type="submit"
                      className="client__button__save"
                      disabled={isSubmitting}
                      value="Save"
                    />
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    );
}

