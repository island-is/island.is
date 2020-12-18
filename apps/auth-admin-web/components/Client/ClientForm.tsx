import React, { useEffect, useState } from 'react';
import ClientDTO from '../../entities/dtos/client-dto';
import StatusBar from '../Layout/StatusBar';
import APIResponse from '../../entities/common/APIResponse';
import { useForm } from 'react-hook-form';
import { ErrorMessage } from '@hookform/error-message';
import HelpBox from '../Common/HelpBox';
import api from '../../services/api'

interface Props {
  client: ClientDTO;
  onNextButtonClick?: (client: ClientDTO) => void;
  handleCancel?: () => void;
}

const ClientForm: React.FC<Props> = (props: Props) => {
  const { register, handleSubmit, errors, formState } = useForm<
    ClientDTO
  >();
  const { isSubmitting } = formState;
  const [show, setShow] = useState(false);
  const [response, setResponse] = useState<APIResponse>(null);
  const [available, setAvailable] = useState<boolean>(false);
  const [clientIdLength, setClientIdLength] = useState<number>(0);
  const [isEditing, setIsEditing] = useState<boolean>(false);

  // TODO: Fix
  const client = props.client;

  const castToNumbers = (obj: ClientDTO): ClientDTO => {
    obj.absoluteRefreshTokenLifetime = +obj.absoluteRefreshTokenLifetime;
    obj.accessTokenLifetime = +obj.accessTokenLifetime;
    obj.authorizationCodeLifetime = +obj.authorizationCodeLifetime;
    obj.deviceCodeLifetime = +obj.deviceCodeLifetime;
    obj.refreshTokenExpiration = +obj.refreshTokenExpiration;
    obj.refreshTokenUsage = +obj.refreshTokenUsage;
    obj.slidingRefreshTokenLifetime = +obj.slidingRefreshTokenLifetime;
    obj.identityTokenLifetime = +obj.identityTokenLifetime;
    obj.accessTokenType = +obj.accessTokenType;

    if (obj.consentLifetime === '') {
      obj.consentLifetime = null;
    } else {
      obj.consentLifetime = +obj.consentLifetime;
    }

    if (obj.userSsoLifetime === '') {
      obj.userSsoLifetime = null;
    } else {
      obj.userSsoLifetime = +obj.userSsoLifetime;
    }

    return obj;
  };

  useEffect(() => {
    if (props.client && props.client.clientId){
      setIsEditing(true);
      setAvailable(true);
    }
  }, [props.client])

  

  const create = async (data: any) => {
    await api.post('clients', data)
    .then((response) => {
      const res = new APIResponse();
      res.statusCode = response.request.status;
      res.message = response.request.statusText;
      setResponse(res);
      if (res.statusCode === 201) {
        if (props.onNextButtonClick)
        {
          props.onNextButtonClick(data);
        }
      }
    })
    .catch(function (error) {
      if (error.response) {
        setResponse(error.response.data);
      } else {
        // TODO: Handle and show error
      }
    });
  }

  const edit = async (data: any) => {
    const handleObject = {...data};
    delete data.clientId;
    await api.put(`clients/${props.client.clientId}`, data)
    .then((response) => {
      const res = new APIResponse();
      res.statusCode = response.request.status;
      res.message = response.request.statusText;
      setResponse(res);
      if (res.statusCode === 200) {
        if (props.onNextButtonClick)
        {
          props.onNextButtonClick(handleObject);
        }
      }
    })
    .catch(function (error) {
      if (error.response) {
        setResponse(error.response.data);
      } else {
        // TODO: Handle and show error
      }
    });
  }

  const save = (data: any) => {
    const clientObject = castToNumbers(data.client);
    if (!isEditing) {
      create(clientObject);
    }
    else {
      edit(clientObject);
    }
  };

  const checkAvailability = async (clientId: string) => {
    setClientIdLength(clientId.length);
    await api
      .get(`clients/${clientId}`)
      .then((response) => {
        if (response.request.status !== 404) setAvailable(false);
      })
      .catch(function (error) {
        if (error.response) {
          if (error.response.status === 404) {
            setAvailable(true);
          }
        }
      });
  };

  return (
    <div className="client">
      <StatusBar status={response}></StatusBar>
      <div className="client__wrapper">
        

        <div className="client__container">
          <h1>{ isEditing ? "Edit Client" : "Create a new Client"}</h1>
          <div className="client__container__form">
          <div className="client__help">
          Enter some basic details for this client. Click <a href="#advanced">advanced</a> to configure preferences if default settings need to be changed. 
          You will then go through steps to configure and add additional properties.
        </div>
            <form onSubmit={handleSubmit(save)}>
              <div className="client__container__fields">
                <div className="client__container__field">
                  <label className="client__label">
                    National Id (Kennitala)
                  </label>
                  <input
                    type="text"
                    name="client.nationalId"
                    ref={register({
                      required: true,
                      maxLength: 10,
                      minLength: 10,
                      pattern: /\d+/,
                    })}
                    defaultValue={client.nationalId}
                    className="client__input"
                    placeholder="0123456789"
                    maxLength={10}
                    title="The nationalId (Kennitala) registered for the client"
                  />
                  <HelpBox helpText="The nationalId (Kennitala) registered for the client" />
                  <ErrorMessage
                    as="span"
                    errors={errors}
                    name="client.nationalId"
                    message="NationalId must be 10 numeric characters"
                  />
                </div>
                <div className="client__container__field">
                  <label className="client__label">Client Id</label>
                  <input
                    type="text"
                    name="client.clientId"
                    ref={register({ required: true })}
                    defaultValue={client.clientId}
                    className="client__input"
                    placeholder="example-client"
                    onChange={(e) => checkAvailability(e.target.value)}
                    title="The unique identifier for this application"
                    readOnly={isEditing}
                  />
                  <div
                    className={`client__container__field__available ${
                      available ? 'ok ' : 'taken '
                    } ${clientIdLength > 0 ? 'show' : 'hidden'}`}
                  >
                    {available ? 'Available' : 'Unavailable'}
                  </div>
                  <HelpBox helpText="The unique identifier for this application" />
                  <ErrorMessage
                    as="span"
                    errors={errors}
                    name="client.clientId"
                    message="°Client Id is required"
                  />
                </div>
                <div className="client__container__field">
                  <label className="client__label">Display Name</label>
                  <input
                    type="text"
                    name="client.clientName"
                    ref={register({ required: true })}
                    defaultValue={client.clientName}
                    className="client__input"
                    title="Application name that will be seen on consent screens"
                    placeholder="Example name"
                  />
                  <HelpBox helpText="Application name that will be seen on consent screens" />
                  <ErrorMessage
                    as="span"
                    errors={errors}
                    name="client.clientName"
                    message="Display Name is required"
                  />
                </div>
                <div className="client__container__field">
                  <label className="client__label">Client Type</label>
                  <select
                    name="client.clientType"
                    ref={register({ required: true })}
                    title="Type of Client"
                  >
                    <option value="spa">Single Page Application</option>
                    <option value="native">
                      Native - authorization code flow + PKCE
                    </option>
                    <option value="device">
                      Device - flow using external browser
                    </option>
                    <option value="web">
                      Web App - Hyprid flow with client authentication
                    </option>
                    <option value="machine">
                      Machine - client credentials
                    </option>
                  </select>

                  <HelpBox helpText="Select the appropriate client Type" />
                  <ErrorMessage
                    as="span"
                    errors={errors}
                    name="client.clientName"
                    message="Client Type is required"
                  />
                </div>
                <div className="client__container__field">
                  <label className="client__label">Display URL</label>
                  <input
                    name="client.clientUri"
                    ref={register}
                    type="text"
                    defaultValue={client.clientUri ?? ''}
                    className="client__input"
                    placeholder="https://localhost:4200"
                    title="Application URL that will be seen on consent screens"
                  />
                  <HelpBox helpText="URI to further information about client (used on consent screen)" />
                </div>
                <div className="client__container__field">
                  <label className="client__label">Description</label>
                  <input
                    type="text"
                    ref={register}
                    name="client.description"
                    defaultValue={client.description ?? ''}
                    className="client__input"
                    title="Application description for use within AdminUI"
                    placeholder="Example description"
                  />
                  <HelpBox helpText="Application description for use within IDS management" />
                </div>

                <div className="client__container__field">
                  <label className="client__label">Client claims prefix</label>
                  <input
                    ref={register({ required: true })}
                    type="text"
                    name="client.clientClaimsPrefix"
                    defaultValue={
                      client.clientClaimsPrefix
                        ? client.clientClaimsPrefix
                        : 'client__'
                    }
                    className="client__input"
                  />
                  <HelpBox helpText="If set, the prefix client claim types will be prefixed with. Defaults to client_. The intent is to make sure they don’t accidentally collide with user claims." />
                  <ErrorMessage
                    as="span"
                    errors={errors}
                    name="client.clientClaimsPrefix"
                    message="Client claims prefix is required"
                  />
                </div>

                <div className="client__container__field">
                  <label className="client__label">Protocol Type</label>
                  <input
                    ref={register({ required: true })}
                    type="text"
                    name="client.protocolType"
                    defaultValue={
                      client.protocolType ? client.protocolType : 'oidc'
                    }
                    className="client__input"
                  />
                  <HelpBox helpText="Lorem ipsum, dolor sit amet consectetur adipisicing elit. Dolorem architecto a odit ea distinctio consequatur autem nesciunt cupiditate eos, error reprehenderit illum dolor, mollitia modi vitae. Ducimus esse eos explicabo." />
                  <ErrorMessage
                    as="span"
                    errors={errors}
                    name="client.protocolType"
                    message="Protocol Type is required"
                  />
                </div>

                <div className="client__container__checkbox__field">
                  <label className="client__label">Require consent</label>
                  <input
                    type="checkbox"
                    defaultChecked={client.requireConsent}
                    className="client__input"
                    name="client.requireConsent"
                    ref={register}
                    title="Specifies whether a consent screen is required"
                  />
                  <HelpBox helpText="Specifies whether a consent screen is required" />
                </div>

                <div className="client__container__checkbox__field">
                  <label className="client__label">Enabled</label>
                  <input
                    type="checkbox"
                    name="client.enabled"
                    className="client__checkbox"
                    defaultChecked={client.enabled}
                    ref={register}
                  ></input>
                  <HelpBox helpText="Lorem ipsum, dolor sit amet consectetur adipisicing elit. Dolorem architecto a odit ea distinctio consequatur autem nesciunt cupiditate eos, error reprehenderit illum dolor, mollitia modi vitae. Ducimus esse eos explicabo." />
                </div>

                <div className="client__container__button" id="advanced">
                  <a
                    className="client__button__show"
                    onClick={() => setShow(!show)}
                  >
                    <i className="client__button__show__icon"></i>
                    Advanced
                  </a>
                </div>

                <div
                  className={`client__container__advanced ${
                    show === true ? 'show' : 'hidden'
                  }`}
                >
                  <div className="client__container__field">
                    <label className="client__label">
                      Front channel logout uri
                    </label>
                    <input
                      type="text"
                      name="client.frontChannelLogoutUri"
                      defaultValue={client.frontChannelLogoutUri ?? ''}
                      className="client__input"
                      ref={register}
                    />
                  </div>

                  <div className="client__container__field">
                    <label className="client__label">
                      Rair wise subject salt
                    </label>
                    <input
                      type="text"
                      defaultValue={client.pairWiseSubjectSalt ?? ''}
                      className="client__input"
                      name="client.pairWiseSubjectSalt"
                      ref={register}
                    />
                    <HelpBox helpText="Salt value used in pair-wise subjectId generation for users of this client." />
                  </div>

                  <div className="client__container__field">
                    <label className="client__label">User code type</label>
                    <input
                      type="text"
                      defaultValue={client.userCodeType ?? ''}
                      name="client.userCodeType"
                      className="client__input"
                      ref={register}
                    />
                    <HelpBox helpText="Specifies the type of user code to use for the client. Otherwise falls back to default" />
                  </div>

                  {/* Number inputs */}
                  <div className="client__container__field">
                    <label className="client__label">Access Token Type</label>
                    <select name="client.accessTokenType" className="client__select" defaultValue={client.accessTokenType} ref={register({ required: true })}>
                      <option value={0}>JWT</option>
                      <option value={1}>Reference</option>
                    </select>
                    <HelpBox helpText="Specifies whether the access token is a reference token or a self contained JWT token (defaults to Jwt)." />
                    <ErrorMessage
                      as="span"
                      errors={errors}
                      name="client.accessTokenType"
                      message="Absolute Refresh Token Lifetime is required"
                    />
                  </div>

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
                    <HelpBox helpText="Maximum lifetime of a refresh token in seconds. Defaults to 2592000 seconds / 30 days" />
                    <ErrorMessage
                      as="span"
                      errors={errors}
                      name="client.absoluteRefreshTokenLifetime"
                      message="Absolute Refresh Token Lifetime is required"
                    />
                  </div>
                  <div className="client__container__field">
                    <label className="client__label">
                      Access Token Lifetime
                    </label>

                    <input
                      ref={register({ required: true })}
                      type="number"
                      name="client.accessTokenLifetime"
                      defaultValue={client.accessTokenLifetime}
                      className="client__input"
                    />
                    <HelpBox helpText="Lifetime of access token in seconds (defaults to 3600 seconds / 1 hour)" />
                    <ErrorMessage
                      as="span"
                      errors={errors}
                      name="client.accessTokenLifetime"
                      message="Access Token Lifetime is required"
                    />
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
                    <HelpBox helpText="Lifetime of authorization code in seconds (defaults to 300 seconds / 5 minutes)" />
                    <ErrorMessage
                      as="span"
                      errors={errors}
                      name="client.authorizationCodeLifetime"
                      message="Authorization code lifetime is required"
                    />
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
                    <HelpBox helpText="Lifetime of a user consent in seconds. Defaults to null (no expiration)." />
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
                    <HelpBox helpText="Lifetime to device code in seconds (defaults to 300 seconds / 5 minutes)" />
                    <ErrorMessage
                      as="span"
                      errors={errors}
                      name="client.deviceCodeLifetime"
                      message="Device code lifetime is required"
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
                    <HelpBox helpText="The maximum duration (in seconds) since the last time the user authenticated. (Default null)" />
                  </div>

                  <div className="client__container__field">
                    <label className="client__label">
                      Refresh token expiration
                    </label>
                    <select name="client.refreshTokenExpiration" className="client__select" defaultValue={client.refreshTokenExpiration} ref={register({ required: true })}>
                      <option value={0}>Sliding</option>
                      <option value={1}>Absolute</option>
                    </select>
                    <HelpBox helpText="Absolute the refresh token will expire on a fixed point in time (specified by the AbsoluteRefreshTokenLifetime)

Sliding when refreshing the token, the lifetime of the refresh token will be renewed (by the amount specified in SlidingRefreshTokenLifetime). The lifetime will not exceed AbsoluteRefreshTokenLifetime." />
                  </div>

                  <div className="client__container__field">
                    <label className="client__label">Refresh Token Usage</label>
                    <select name="client.refreshTokenUsage" className="client__select" defaultValue={client.refreshTokenUsage} ref={register({ required: true })}>
                      <option value={0}>ReUse</option>
                      <option value={1}>OneTime</option>
                    </select>
                    <HelpBox helpText="ReUse the refresh token handle will stay the same when refreshing tokens
                    OneTime the refresh token handle will be updated when refreshing tokens. This is the default" />
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
                    <HelpBox helpText="Sliding lifetime of a refresh token in seconds. Defaults to 1296000 seconds / 15 days" />
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
                    <HelpBox helpText="Lifetime to identity token in seconds (defaults to 300 seconds / 5 minutes)" />
                    <ErrorMessage
                      as="span"
                      errors={errors}
                      name="client.identityTokenLifetime"
                      message="Key is required"
                    />
                  </div>

                  {/* Checkboxes */}
                  <div className="client__container__checkbox__field">
                    <label className="client__label">
                      Allow access token via browser
                    </label>
                    <input
                      type="checkbox"
                      name="client.allowAccessTokenViaBrowser"
                      defaultChecked={client.allowAccessTokenViaBrowser}
                      className="client__input"
                      ref={register}
                    />
                    <HelpBox helpText="Specifies whether this client is allowed to receive access tokens via the browser. This is useful to harden flows that allow multiple response types (e.g. by disallowing a hybrid flow client that is supposed to use code id_token to add the token response type and thus leaking the token to the browser." />
                  </div>
                  <div className="client__container__checkbox__field">
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
                  <div className="client__container__checkbox__field">
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
                    <HelpBox helpText="Specifies whether clients using PKCE can use a plain text code challenge (not recommended)" />
                  </div>
                  <div className="client__container__checkbox__field">
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
                    <HelpBox helpText="Specifies whether user can choose to store consent decisions." />
                  </div>
                  <div className="client__container__checkbox__field">
                    <label className="client__label">
                      Always include user claims in Id token
                    </label>
                    <input
                      type="checkbox"
                      name="client.alwaysIncludeUserClaimsInIdToken"
                      defaultChecked={client.alwaysIncludeUserClaimsInIdToken}
                      className="client__input"
                      ref={register}
                    />
                    <HelpBox helpText="When requesting both an id token and access token, should the user claims always be added to the id token instead of requring the client to use the userinfo endpoint. Default is false." />
                  </div>
                  <div className="client__container__checkbox__field">
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
                    <HelpBox helpText="If set, the client claims will be sent for every flow. If not, only for client credentials flow (default is false)" />
                  </div>

                  <div className="client__container__checkbox__field">
                    <label className="client__label">
                      Back channel logout session required
                    </label>
                    <input
                      type="checkbox"
                      name="client.backChannelLogoutSessionRequired"
                      defaultChecked={client.backChannelLogoutSessionRequired}
                      className="client__input"
                      ref={register}
                    />
                    <HelpBox helpText="Specifies if the user’s session id should be sent in the request to the BackChannelLogoutUri" />
                  </div>

                  <div className="client__container__checkbox__field">
                    <label className="client__label">Enable local login</label>
                    <input
                      type="checkbox"
                      defaultChecked={client.enableLocalLogin}
                      className="client__input"
                      name="client.enableLocalLogin"
                      ref={register}
                    />
                    <HelpBox helpText="Specifies if this client can use local accounts, or external IdPs only" />
                  </div>

                  <div className="client__container__checkbox__field">
                    <label className="client__label">
                      Front channel logout session required
                    </label>
                    <input
                      type="checkbox"
                      name="client.frontChannelLogoutSessionRequired"
                      defaultChecked={client.frontChannelLogoutSessionRequired}
                      className="client__input"
                      ref={register}
                    />
                    <HelpBox helpText="Specifies if the user’s session id should be sent to the FrontChannelLogoutUri" />
                  </div>

                  <div className="client__container__checkbox__field">
                    <label className="client__label">Include Jwt Id</label>
                    <input
                      type="checkbox"
                      defaultChecked={client.includeJwtId}
                      className="client__input"
                      name="client.includeJwtId"
                      ref={register}
                    />
                    <HelpBox helpText="Specifies whether JWT access tokens should have an embedded unique ID (via the jti claim)" />
                  </div>

                  <div className="client__container__checkbox__field">
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
                    <HelpBox helpText="Specifies whether this client needs a secret to request tokens from the token endpoint" />
                  </div>

                  <div className="client__container__checkbox__field">
                    <label className="client__label">Require Pkce</label>
                    <input
                      type="checkbox"
                      defaultChecked={client.requirePkce}
                      name="client.requirePkce"
                      className="client__input"
                      ref={register}
                    />
                    <HelpBox helpText="Specifies whether clients using an authorization code based grant type must send a proof key" />
                  </div>

                  <div className="client__container__checkbox__field">
                    <label className="client__label">
                      Update access token claims on refresh
                    </label>
                    <input
                      type="checkbox"
                      defaultChecked={client.updateAccessTokenClaimsOnRefresh}
                      name="client.updateAccessTokenClaimsOnRefresh"
                      className="client__input"
                      ref={register}
                    />
                    <HelpBox helpText="Gets or sets a value indicating whether the access token (and its claims) should be updated on a refresh token request." />
                  </div>
                </div>
              </div>
              <div className="client__buttons__container">
                <div className="client__button__container">
                  <button className="client__button__cancel" type="button" onClick={props.handleCancel}>Cancel</button>
                </div>
                <div className="client__button__container">
                  <input
                    type="submit"
                    className="client__button__save"
                    disabled={isSubmitting || !available}
                    value="Next"
                  />
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
export default ClientForm;
