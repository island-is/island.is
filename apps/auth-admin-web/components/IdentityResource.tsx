import React, { SyntheticEvent } from "react";
import IdentityResourcesDTO from "../models/dtos/identity-resources-dto";
import axios from "axios";
import StatusBar from "./StatusBar";
import APIResponse from "../models/APIResponse";
import { useRouter } from "next/router";
import { Formik, Field, Form, FormikHelpers } from 'formik';
import { __asyncValues } from 'tslib';

type Props = {
  resource: IdentityResourcesDTO;
};

class IdentityResource extends React.Component<{ resource: IdentityResourcesDTO }> {
  resource: IdentityResourcesDTO;
  response: APIResponse;
  state: { response: APIResponse };

  constructor(props: Props) {
    super(props);
    this.state = {
      response: { statusCode: 0, message: null, error: null },
    };

    this.resource = this.props.resource;
    if (!this.resource) {
      
      this.resource = new IdentityResourcesDTO();
      this.resource.key = "1234";
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
    // TODO: Go back
    // const router = useRouter();
    // router.back();
  };

  isValid = (): boolean => {
    return true;
  };

  submit = async (e: SyntheticEvent) => {
    e.preventDefault();
    const response = await axios.post("http://localhost:3333/clients", this.resource).catch((err) => {
      console.log(err);
    });

    console.log(response);
    this.componentDidMount();
  };

  render() {
    return (
      
      <div className="identity-resource">
        <StatusBar status={this.state.response}></StatusBar>
        <div className="identity-resource__wrapper">
          <div className="identity-resource__help">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Consequatur
            sed alias neque ullam repudiandae, iste reiciendis suscipit rerum
            officiis necessitatibus doloribus incidunt libero distinctio
            consequuntur voluptatibus tenetur aliquid ut inventore!
          </div>

          <div className="identity-resource__container">
            <h1>Create new Identity Resource</h1>
            <div className="identity-resource__container__form">
            <Formik
              initialValues={{
                resource: this.resource,
              }}
              onSubmit={(
              values: Props,
                { setSubmitting }: FormikHelpers<Props>
              ) => {
                setTimeout(() => {
                  alert(JSON.stringify(values, null, 2));
                  setSubmitting(false);
                }, 500);
              }}
            >
              <Form>
                <div className="identity-resource__container__fields">
                  <div className="identity-resource__container__field">
                    <label className="identity-resource__label">
                      Key</label>
                    <Field
                      type="text"
                      name="resource.key"
                      className="identity-resource__input"
                    />
                  </div>
                  <div className="identity-resource__container__field">
                    <label className="identity-resource__label">Name</label>
                    <Field
                      name="resource.name"
                      type="text"
                      className="identity-resource__input"
                    />
                  </div>
                  <div className="identity-resource__container__field">
                    <label className="identity-resource__label">Display Name</label>
                    <Field
                      name="resource.displayName"
                      type="text"
                      className="identity-resource__input"
                    />
                  </div>
                  <div className="identity-resource__container__field">
                    <label className="identity-resource__label">Description</label>
                    <Field
                      name="resource.description"
                      type="text"
                      className="identity-resource__input"
                    />
                  </div>
                  

                  <div className="identity-resource__container__field">
                    <label className="identity-resource__label">Enabled</label>
                    <Field
                      name="resource.enabled"
                      type="checkbox"
                      className="identity-resource__checkbox"
                    />
                  </div>

                  <div className="identity-resource__container__field">
                    <label className="identity-resource__label">Emphasize</label>
                    <Field
                      name="resource.emphasize"
                      type="checkbox"
                      className="identity-resource__checkbox"
                    />
                  </div>


                  <div className="identity-resource__container__field">
                    <label className="identity-resource__label">Required</label>
                    <Field
                      name="resource.required"
                      type="checkbox"
                      className="identity-resource__checkbox"
                    />
                  </div>

                  <div className="identity-resource__container__field">
                    <label className="identity-resource__label">Show In Discovery Document</label>
                    <Field
                      name="resource.showInDiscoveryDocument"
                      type="checkbox"
                      className="identity-resource__checkbox"
                    />
                  </div>


                  <div className="identity-resource__buttons__container">
                  <div className="identity-resource__button__container">
                    <button
                      className="identity-resource__button__cancel"
                      onClick={this.back}
                    >
                      Hætta við
                    </button>
                  </div>
                  <div className="identity-resource__button__container">
                    <input
                      type="submit"
                      className="identity-resource__button__save"
                      disabled={!this.isValid()}
                      value="Save"
                    />
                  </div>
                </div>
                </div>
              </Form>
              </Formik>
            </div>
          </div>
          </div>
        </div>
    );
  }
}

export default IdentityResource;
