import APIResponse from 'apps/auth-admin-web/models/common/APIResponse';
import { useRouter } from 'next/router';
import { useState } from 'react';
import axios from 'axios';
import ResourceCreateForm from './components/forms/ResourceCreateForm';

export default function ApiScopeForm() {
  const [response, setResponse] = useState<APIResponse>(new APIResponse());
  const router = useRouter();

  const back = () => {
    router.back();
  };

  const save = async (data: any) => {
    await axios
      .post('/api/api-scope', data.resource)
      .then((response) => {
        const res = new APIResponse();
        res.statusCode = response.request.status;
        res.message = response.request.statusText;

        router.push('edit/api-scope/' + data.resource.name)
      })
      .catch(function (error) {
        if (error.response) {
          setResponse(error.response.data);
        }
      });
  };

  return (
    <ResourceCreateForm
      save={save}
      hideBooleanValues={false}
      texts={{
        header: 'Create new Api scope',
        details:
          "Enter some basic details for this new api scope. You will then be directed to it's page to continue adding additional information.",
        enabled: 'Specifies if the scope is enabled',
        name: "The scope's unique name",
        displayName: 'The name that will be used to display the scope',
        description:
          'It is optional to write some text to describe this scope',
        showInDiscoveryDocument:
          'Specifies whether this scope is shown in the discovery document.',
        required:
          'Specifies whether the user can de-select the scope on the consent screen (if the consent screen wants to implement such a feature)',
        emphasize:
          'Specifies whether the consent screen will emphasize this scope (if the consent screen wants to implement such a feature). Use this setting for sensitive or important scopes.',
      }}
    />
  );

  // return (
  //   <div className="api-scope-form">
  //     {/* <StatusBar status={response}></StatusBar> */}
  //     <div className="api-scope-form__wrapper">
  //       <div className="api-scope-form__container">
  //         <h1>Create new Api scope</h1>
  //         <div className="api-scope-form__container__form">
  //           <div className="api-scope-form__help">
  //             Enter some basic details for this new api scope. You will then be
  //             directed to it's page to continue adding additional information.
  //           </div>
  //         </div>

  //         <form onSubmit={handleSubmit(save)}>
  //           <div className="api-scope-form__container__fields">
  //             <div className="api-scope-form__container__field">
  //               <label htmlFor="name" className="api-scope-form__label">
  //                 Name
  //               </label>
  //               <input
  //                 ref={register({ required: true })}
  //                 id="name"
  //                 name="apiScope.name"
  //                 type="text"
  //                 className="api-scope-form__input"
  //                 defaultValue={apiScope.name}
  //               />
  //               <HelpBox helpText="The api scopes unique name" />
  //               <ErrorMessage
  //                 as="span"
  //                 errors={errors}
  //                 name="apiScope.name"
  //                 message="Name is required"
  //               />
  //             </div>
  //             <div className="api-scope-form__container__field">
  //               <label htmlFor="displayName" className="api-scope-form__label">
  //                 Display Name
  //               </label>
  //               <input
  //                 ref={register({ required: true })}
  //                 id="displayName"
  //                 name="apiScope.displayName"
  //                 type="text"
  //                 className="api-scope-form__input"
  //                 defaultValue={apiScope.displayName}
  //               />
  //               <HelpBox helpText="The name that will be used to display the api scope" />
  //               <ErrorMessage
  //                 as="span"
  //                 errors={errors}
  //                 name="apiScope.displayName"
  //                 message="Display name is required"
  //               />
  //             </div>
  //             <div className="api-scope-form__container__field">
  //               <label htmlFor="description" className="api-scope-form__label">
  //                 Description
  //               </label>
  //               <input
  //                 ref={register({ required: false })}
  //                 id="description"
  //                 name="apiScope.description"
  //                 type="text"
  //                 defaultValue={apiScope.description}
  //                 className="api-scope-form__input"
  //               />
  //               <HelpBox helpText="Optional to write some text that descripes the api scope" />
  //               {/* <ErrorMessage
  //                   as="span"
  //                   errors={errors}
  //                   name="apiScope.description"
  //                   message="Description is required"
  //                 /> */}
  //             </div>

  //             <div className="api-scope-form__container__checkbox__field">
  //               <label htmlFor="enabled" className="api-scope-form__label">
  //                 Enabled
  //               </label>
  //               <input
  //                 ref={register}
  //                 id="enabled"
  //                 name="apiScope.enabled"
  //                 type="checkbox"
  //                 defaultChecked={apiScope.enabled}
  //                 className="api-scope-form__checkbox"
  //               />
  //               <HelpBox helpText="Specifies if the api scope is enabled." />
  //             </div>

  //             <div className="api-scope-form__container__checkbox__field">
  //               <label htmlFor="emphasize" className="api-scope-form__label">
  //                 Emphasize
  //               </label>
  //               <input
  //                 ref={register}
  //                 id="emphasize"
  //                 name="apiScope.emphasize"
  //                 defaultChecked={apiScope.emphasize}
  //                 type="checkbox"
  //                 className="api-scope-form__checkbox"
  //               />
  //               <HelpBox helpText="Specifies whether the consent screen will emphasize this scope (if the consent screen wants to implement such a feature). Use this setting for sensitive or important scopes." />
  //             </div>

  //             <div className="api-scope-form__container__checkbox__field">
  //               <label htmlFor="required" className="api-scope-form__label">
  //                 Required
  //               </label>
  //               <input
  //                 ref={register}
  //                 id="required"
  //                 name="apiScope.required"
  //                 defaultChecked={apiScope.required}
  //                 type="checkbox"
  //                 className="api-scope-form__checkbox"
  //               />
  //               <HelpBox helpText="Specifies whether the user can de-select the scope on the consent screen (if the consent screen wants to implement such a feature)" />
  //             </div>

  //             <div className="api-scope-form__container__checkbox__field">
  //               <label
  //                 htmlFor="showInDiscoveryDocument"
  //                 className="api-scope-form__label"
  //               >
  //                 Show In Discovery Document
  //               </label>
  //               <input
  //                 ref={register}
  //                 id="showInDiscoveryDocument"
  //                 name="apiScope.showInDiscoveryDocument"
  //                 type="checkbox"
  //                 defaultChecked={apiScope.showInDiscoveryDocument}
  //                 className="api-scope-form__checkbox"
  //               />
  //               <HelpBox helpText="Specifies whether this scope is shown in the discovery document." />
  //             </div>

  //             <div className="api-scope-form__buttons__container">
  //               <div className="api-scope-form__button__container">
  //                 <button
  //                   className="api-scope-form__button__cancel"
  //                   onClick={back}
  //                 >
  //                   Cancel
  //                 </button>
  //               </div>
  //               <div className="api-scope-form__button__container">
  //                 <input
  //                   type="submit"
  //                   className="api-scope-form__button__save"
  //                   disabled={isSubmitting}
  //                   value="Save"
  //                 />
  //               </div>
  //             </div>
  //           </div>
  //         </form>
  //       </div>
  //     </div>
  //   </div>
  // );
}
