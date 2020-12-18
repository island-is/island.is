import React, { useState } from 'react';
import IdentityResourcesDTO from '../../entities/dtos/identity-resources.dto';
import axios from 'axios';
import StatusBar from '../Layout/StatusBar';
import { useForm } from 'react-hook-form';
import { ErrorMessage } from '@hookform/error-message';
import HelpBox from '../Common/HelpBox';
import { useRouter } from 'next/router';
import APIResponse from './../../entities/common/APIResponse'
import ResourceCreateForm from './components/forms/ResourceCreateForm';


export default function IdentityResourceForm() {
  const { register, handleSubmit, errors, formState } = useForm<
    IdentityResourcesDTO
  >();
  const { isSubmitting } = formState;
  const [response, setResponse] = useState<APIResponse>(new APIResponse());
  const [resource, setResource] = useState<IdentityResourcesDTO>(
    new IdentityResourcesDTO()
  );
  const router = useRouter();

  const back = () => {
    router.back();
  };

  const save = async (data: any) => {
    await axios
      .post('/api/identity-resource', data.resource)
      .then((response) => {
        const res = new APIResponse();
        res.statusCode = response.request.status;
        res.message = response.request.statusText;
        setResponse(res);

        // This is how we can direct to another page
        router.push('edit/identity-resource/' + data.resource.name)
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
        header: 'Create new identity resource',
        details:
          "Enter some basic details for this new identity resource. You will then be directed to it's page to continue adding additional information.",
        enabled: 'Specifies if the resource is enabled',
        name: "The resource's unique name",
        displayName: 'The name that will be used to display the resource',
        description:
          'It is optional to write some text to describe this resource',
        showInDiscoveryDocument:
          'Specifies whether this resource is shown in the discovery document.',
        required:
          'Specifies whether the user can de-select the resource on the consent screen (if the consent screen wants to implement such a feature)',
        emphasize:
          'Specifies whether the consent screen will emphasize this resource (if the consent screen wants to implement such a feature). Use this setting for sensitive or important scopes.',
      }}
    />
  );
}
