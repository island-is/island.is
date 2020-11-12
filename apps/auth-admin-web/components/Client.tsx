import React, { SyntheticEvent } from "react";
import ClientDTO from "../models/dtos/client-dto";
import axios from "axios";
import StatusBar from "./StatusBar";
import APIResponse from "../models/APIResponse";
import { useRouter } from "next/router";

type Props = {
  client: ClientDTO;
};
class Client extends React.Component<{ client: ClientDTO }> {
  client: ClientDTO;
  response: APIResponse;
  state: { response: APIResponse };

  constructor(props: Props) {
    super(props);
    this.state = {
      response: { statusCode: 0, message: null, error: null },
    };

    this.client = this.props.client;
    if (!this.client) {
      this.client = new ClientDTO();
    }
    this.response = { statusCode: 200, message: null, error: null };
  }

  componentDidMount() {
    this.setState({
      response: {
        statusCode: this.response.statusCode,
        message: this.response.message,
      },
    });
  }

  back = () => {
    const router = useRouter();
    router.back();
  };

  isValid = (): boolean => {
    return true;
  };

  submit = async (e: SyntheticEvent) => {
    e.preventDefault();

    const response = await axios.post("/api/clients", this.client).catch((err) => {
      console.log(err);
    });

    console.log(response);
    this.componentDidMount();
  };

  render() {
    return (
      <div className="client">
        <StatusBar status={this.state.response}></StatusBar>
        <div className="client__wrapper">
          <div className="client__help">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Consequatur
            sed alias neque ullam repudiandae, iste reiciendis suscipit rerum
            officiis necessitatibus doloribus incidunt libero distinctio
            consequuntur voluptatibus tenetur aliquid ut inventore!
          </div>

          <div className="client__container">
            <h1>Stofna nýjann Client</h1>
            <div className="client__container__form">
              <form onSubmit={this.submit}>
                <div className="client__container__fields">
                  <div className="client__container__field">
                    <label className="client__label">
                      Client Id</label>
                    <input
                      type="text"
                      defaultValue={this.client.clientId}
                      onChange={(e) => (this.client.clientId = e.target.value)}
                      className="client__input"
                    />
                  </div>
                  <div className="client__container__field">
                    <label className="client__label">Name</label>
                    <input
                      type="text"
                      defaultValue={this.client.clientName}
                      onChange={(e) =>
                        (this.client.clientName = e.target.value)
                      }
                      className="client__input"
                    />
                  </div>
                  <div className="client__container__field">
                    <label className="client__label">URI</label>
                    <input
                      type="text"
                      defaultValue={this.client.clientUri ?? ""}
                      onChange={(e) => (this.client.clientUri = e.target.value)}
                      className="client__input"
                    />
                  </div>
                  <div className="client__container__field">
                    <label className="client__label">Description</label>
                    <input
                      type="text"
                      defaultValue={this.client.description ?? ""}
                      onChange={(e) => (this.client.clientUri = e.target.value)}
                      className="client__input"
                    />
                  </div>

                  <div className="client__container__field">
                    <label className="client__label">
                      Client claims prefix
                    </label>
                    <input
                      type="text"
                      defaultValue={
                        this.client.clientClaimsPrefix
                          ? this.client.clientClaimsPrefix
                          : "client__"
                      }
                      onChange={(e) =>
                        (this.client.clientClaimsPrefix = e.target.value)
                      }
                      className="client__input"
                    />
                  </div>

                  <div className="client__container__field">
                    <label className="client__label">Protocol Type</label>
                    <input
                      type="text"
                      defaultValue={
                        this.client.protocolType
                          ? this.client.protocolType
                          : "oidc"
                      }
                      onChange={(e) =>
                        (this.client.protocolType = e.target.value)
                      }
                      className="client__input"
                    />
                  </div>

                  <div className="client__container__field">
                    <label className="client__label">Virkur</label>
                    <input
                      type="checkbox"
                      className="client__checkbox"
                      defaultChecked={this.client.enabled}
                      onChange={(e) => (this.client.enabled = e.target.checked)}
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
                        defaultValue={this.client.absoluteRefreshTokenLifetime}
                        onChange={(e) =>
                          (this.client.absoluteRefreshTokenLifetime = +e.target
                            .value)
                        }
                        className="client__input"
                      />
                    </div>
                    <div className="client__container__field">
                      <label className="client__label">
                        Access Token Lifetime
                      </label>
                      <input
                        type="number"
                        defaultValue={this.client.accessTokenLifetime}
                        onChange={(e) =>
                          (this.client.absoluteRefreshTokenLifetime = +e.target
                            .value)
                        }
                        className="client__input"
                      />
                    </div>
                    <div className="client__container__field">
                      <label className="client__label">
                        allow access token via browser
                      </label>
                      <input
                        type="checkbox"
                        defaultChecked={this.client.allowAccessTokenViaBrowser}
                        onChange={(e) =>
                          (this.client.allowAccessTokenViaBrowser =
                            e.target.checked)
                        }
                        className="client__input"
                      />
                    </div>
                    <div className="client__container__field">
                      <label className="client__label">
                        Allow offline access
                      </label>
                      <input
                        type="checkbox"
                        defaultChecked={this.client.allowOfflineAccess}
                        onChange={(e) =>
                          (this.client.allowOfflineAccess = e.target.checked)
                        }
                        className="client__input"
                      />
                    </div>
                    <div className="client__container__field">
                      <label className="client__label">
                        Allow plain text Pkce
                      </label>
                      <input
                        type="checkbox"
                        defaultChecked={this.client.allowPlainTextPkce}
                        onChange={(e) =>
                          (this.client.allowPlainTextPkce = e.target.checked)
                        }
                        className="client__input"
                      />
                    </div>
                    <div className="client__container__field">
                      <label className="client__label">
                        Allow remember consent
                      </label>
                      <input
                        type="checkbox"
                        defaultChecked={this.client.allowRememberConsent}
                        onChange={(e) =>
                          (this.client.allowRememberConsent = e.target.checked)
                        }
                        className="client__input"
                      />
                    </div>
                    <div className="client__container__field">
                      <label className="client__label">
                        Always include user claims in Id token
                      </label>
                      <input
                        type="checkbox"
                        defaultChecked={
                          this.client.alwaysIncludeUserClaimsInIdToken
                        }
                        onChange={(e) =>
                          (this.client.alwaysIncludeUserClaimsInIdToken =
                            e.target.checked)
                        }
                        className="client__input"
                      />
                    </div>
                    <div className="client__container__field">
                      <label className="client__label">
                        Always send client claims
                      </label>
                      <input
                        type="checkbox"
                        defaultChecked={this.client.alwaysSendClientClaims}
                        onChange={(e) =>
                          (this.client.alwaysSendClientClaims =
                            e.target.checked)
                        }
                        className="client__input"
                      />
                    </div>
                    <div className="client__container__field">
                      <label className="client__label">
                        Authorization code lifetime
                      </label>
                      <input
                        type="number"
                        defaultValue={this.client.authorizationCodeLifetime}
                        onChange={(e) =>
                          (this.client.authorizationCodeLifetime = +e.target
                            .value)
                        }
                        className="client__input"
                      />
                    </div>
                    <div className="client__container__field">
                      <label className="client__label">
                        Back channel logout session required
                      </label>
                      <input
                        type="checkbox"
                        defaultChecked={
                          this.client.backChannelLogoutSessionRequired
                        }
                        onChange={(e) =>
                          (this.client.backChannelLogoutSessionRequired =
                            e.target.checked)
                        }
                        className="client__input"
                      />
                    </div>

                    <div className="client__container__field">
                      <label className="client__label">Consent lifetime</label>
                      <input
                        type="number"
                        defaultValue={this.client.consentLifetime ?? ""}
                        onChange={(e) =>
                          (this.client.consentLifetime =
                            e.target.value === "" ? null : +e.target.value)
                        }
                        className="client__input"
                      />
                    </div>

                    <div className="client__container__field">
                      <label className="client__label">
                        Device code lifetime
                      </label>
                      <input
                        type="number"
                        defaultValue={this.client.deviceCodeLifetime.toString()}
                        onChange={(e) =>
                          (this.client.consentLifetime = +e.target.value)
                        }
                        className="client__input"
                      />
                    </div>

                    <div className="client__container__field">
                      <label className="client__label">
                        Enable local login
                      </label>
                      <input
                        type="checkbox"
                        defaultChecked={this.client.enableLocalLogin}
                        onChange={(e) =>
                          (this.client.enableLocalLogin = e.target.checked)
                        }
                        className="client__input"
                      />
                    </div>

                    <div className="client__container__field">
                      <label className="client__label">
                        Front channel logout session required
                      </label>
                      <input
                        type="checkbox"
                        defaultChecked={
                          this.client.frontChannelLogoutSessionRequired
                        }
                        onChange={(e) =>
                          (this.client.frontChannelLogoutSessionRequired =
                            e.target.checked)
                        }
                        className="client__input"
                      />
                    </div>

                    <div className="client__container__field">
                      <label className="client__label">
                        Front channel logout uri
                      </label>
                      <input
                        type="text"
                        defaultValue={this.client.frontChannelLogoutUri ?? ""}
                        onChange={(e) =>
                          (this.client.frontChannelLogoutUri = e.target.value)
                        }
                        className="client__input"
                      />
                    </div>

                    <div className="client__container__field">
                      <label className="client__label">
                        Identity token lifetime
                      </label>
                      <input
                        type="number"
                        defaultValue={this.client.identityTokenLifetime}
                        onChange={(e) =>
                          (this.client.identityTokenLifetime = +e.target.value)
                        }
                        className="client__input"
                      />
                    </div>

                    <div className="client__container__field">
                      <label className="client__label">Include Jwt Id</label>
                      <input
                        type="checkbox"
                        defaultChecked={this.client.includeJwtId}
                        onChange={(e) =>
                          (this.client.includeJwtId = e.target.checked)
                        }
                        className="client__input"
                      />
                    </div>

                    <div className="client__container__field">
                      <label className="client__label">
                        Rair wise subject salt
                      </label>
                      <input
                        type="text"
                        defaultValue={this.client.pairWiseSubjectSalt ?? ""}
                        onChange={(e) =>
                          (this.client.pairWiseSubjectSalt = e.target.value)
                        }
                        className="client__input"
                      />
                    </div>

                    <div className="client__container__field">
                      <label className="client__label">
                        Refresh token expiration
                      </label>
                      <input
                        type="number"
                        defaultValue={this.client.refreshTokenExpiration}
                        onChange={(e) =>
                          (this.client.refreshTokenExpiration = +e.target.value)
                        }
                        className="client__input"
                      />
                    </div>

                    <div className="client__container__field">
                      <label className="client__label">refreshTokenUsage</label>
                      <input
                        type="number"
                        defaultValue={this.client.refreshTokenUsage}
                        onChange={(e) =>
                          (this.client.refreshTokenUsage = +e.target.value)
                        }
                        className="client__input"
                      />
                    </div>

                    <div className="client__container__field">
                      <label className="client__label">
                        Require client secret
                      </label>
                      <input
                        type="checkbox"
                        defaultChecked={this.client.requireClientSecret}
                        onChange={(e) =>
                          (this.client.requireClientSecret = e.target.checked)
                        }
                        className="client__input"
                      />
                    </div>

                    <div className="client__container__field">
                      <label className="client__label">Require consent</label>
                      <input
                        type="checkbox"
                        defaultChecked={this.client.requireConsent}
                        onChange={(e) =>
                          (this.client.requireConsent = e.target.checked)
                        }
                        className="client__input"
                      />
                    </div>

                    <div className="client__container__field">
                      <label className="client__label">Require Pkce</label>
                      <input
                        type="checkbox"
                        defaultChecked={this.client.requirePkce}
                        onChange={(e) =>
                          (this.client.requirePkce = e.target.checked)
                        }
                        className="client__input"
                      />
                    </div>

                    <div className="client__container__field">
                      <label className="client__label">
                        Sliding refresh token lifetime
                      </label>
                      <input
                        type="number"
                        defaultValue={this.client.slidingRefreshTokenLifetime}
                        onChange={(e) =>
                          (this.client.slidingRefreshTokenLifetime = +e.target
                            .checked)
                        }
                        className="client__input"
                      />
                    </div>

                    <div className="client__container__field">
                      <label className="client__label">
                        Update access token claims on refresh
                      </label>
                      <input
                        type="checkbox"
                        defaultChecked={
                          this.client.updateAccessTokenClaimsOnRefresh
                        }
                        onChange={(e) =>
                          (this.client.updateAccessTokenClaimsOnRefresh =
                            e.target.checked)
                        }
                        className="client__input"
                      />
                    </div>

                    <div className="client__container__field">
                      <label className="client__label">User code type</label>
                      <input
                        type="text"
                        defaultValue={this.client.userCodeType ?? ""}
                        onChange={(e) =>
                          (this.client.userCodeType = e.target.value)
                        }
                        className="client__input"
                      />
                    </div>

                    <div className="client__container__field">
                      <label className="client__label">userSsoLifetime</label>
                      <input
                        type="number"
                        defaultValue={this.client.userSsoLifetime?.toString()}
                        onChange={(e) =>
                          (this.client.userSsoLifetime = +e.target.value)
                        }
                        className="client__input"
                      />
                    </div>
                  </div>
                </div>
                <div className="client__buttons__container">
                  <div className="client__button__container">
                    <button
                      className="client__button__cancel"
                      onClick={this.back}
                    >
                      Hætta við
                    </button>
                  </div>
                  <div className="client__button__container">
                    <input
                      type="submit"
                      className="client__button__save"
                      disabled={!this.isValid()}
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
}

export default Client;
