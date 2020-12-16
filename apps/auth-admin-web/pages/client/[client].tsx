import ClientDTO from '../../models/dtos/client-dto';
import ClientForm from '../../components/ClientForm';
import ClientRedirectUriForm from '../../components/ClientRedirectUriForm';
import ClientIdpRestrictionsForm from '../../components/ClientIdpRestrictionsForm';
import ClientPostLogoutRedirectUriForm from '../../components/ClientPostLogoutRedirectUriForm';
import ClientStepNav from '../../components/ClientStepNav';
import { useRouter } from 'next/router';
import React, { useState, useEffect } from 'react';

import axios from 'axios';
import { Step } from '../../models/common/Step';
import { Client } from '../../models/client.model';
import ClientAllowedCorsOriginsForm from '../../components/ClientAllowedCorsOriginsForm';
import ClientAllowedScopes from '../../components/ClientAllowedScopesForm';
import ClientSecretForm from '../../components/ClientSecretForm';
import { ClaimDTO } from '../../models/dtos/claim.dto';
import ClientClaimForm from '../../components/ClientClaimForm';
import ClientGrantTypesForm from '../../components/ClientGrantTypesForm';

const Index = () => {
  const { query } = useRouter();
  const clientId = query.client;

  const [step, setStep] = useState(1);
  const [client, setClient] = useState<Client>(new Client());
  const router = useRouter();

  useEffect(() => {
    async function loadClient() {
      if (clientId) {
        await getClient(clientId as string);
      }
    }
    loadClient();
    setStep(1);
  }, [clientId]);

  const getClient = async (clientId: string) => {
    await axios
      .get(`/api/clients/${clientId}`)
      .then((response) => {
        console.log(response);
        console.log(response.data);
        setClient(response.data);
        console.log(client);
      })
      .catch(function (error) {
        if (error.response) {
        }
      });
  };

  const changesMade = () => {
    getClient(clientId as string);
  };

  const handleNext = () => {
    setStep(step + 1);
  };

  const handleStepChange = (step: Step) => {
    setStep(step);
  };

  const handleBack = () => {
    setStep(step - 1);
  };

  const handleCancel = () => {
    router.back();
  };

  const handleFinished = () => {
    router.push('/');
  };

  const handleClientSaved = (clientSaved: ClientDTO) => {
    if (clientSaved) {
      getClient(clientSaved.clientId);
      handleNext();
    }
  };

  const handleClaimSaved = (claim: ClientClaimDTO) => {
    console.log(claim.clientId);
  };

  switch (step) {
    case Step.Client:
      return (
        <ClientStepNav handleStepChange={handleStepChange} activeStep={step}>
          <ClientForm
            handleCancel={handleCancel}
            client={client as ClientDTO}
            onNextButtonClick={handleClientSaved}
          />
        </ClientStepNav>
      );
    case Step.ClientRedirectUri: {
      return (
        <ClientStepNav handleStepChange={handleStepChange} activeStep={step}>
          <ClientRedirectUriForm
            clientId={client.clientId}
            defaultUrl={client.clientUri}
            uris={client.redirectUris?.map((r) => r.redirectUri)}
            handleNext={handleNext}
            handleBack={handleBack}
            handleChanges={changesMade}
          />
        </ClientStepNav>
      );
    }
    case Step.ClientIdpRestrictions: {
      return (
        <ClientStepNav handleStepChange={handleStepChange} activeStep={step}>
          <ClientIdpRestrictionsForm
            clientId={client.clientId}
            restrictions={client.identityProviderRestrictions?.map(
              (r) => r.name
            )}
            handleNext={handleNext}
            handleBack={handleBack}
            handleChanges={changesMade}
          />
        </ClientStepNav>
      );
    }
    case Step.ClientPostLogoutRedirectUri: {
      return (
        <ClientStepNav handleStepChange={handleStepChange} activeStep={step}>
          <ClientPostLogoutRedirectUriForm
            clientId={client.clientId}
            defaultUrl={client.clientUri}
            uris={client.postLogoutRedirectUris?.map((p) => p.redirectUri)}
            handleNext={handleNext}
            handleBack={handleBack}
            handleChanges={changesMade}
          />
        </ClientStepNav>
      );
    }
    case Step.ClientAllowedCorsOrigin: {
      return (
        <ClientStepNav handleStepChange={handleStepChange} activeStep={step}>
          <ClientAllowedCorsOriginsForm
            clientId={client.clientId}
            defaultOrigin={client.clientUri}
            origins={client.allowedCorsOrigins?.map((a) => a.origin)}
            handleNext={handleNext}
            handleBack={handleBack}
            handleChanges={changesMade}
          />
        </ClientStepNav>
      );
    }
    case Step.ClientGrantTypes: {
      return (
        <ClientStepNav handleStepChange={handleStepChange} activeStep={step}>
          <ClientGrantTypesForm
            clientId={client.clientId}
            grantTypes={client.allowedGrantTypes?.map((a) => a.grantType)}
            handleBack={handleBack}
            handleChanges={changesMade}
            handleNext={handleNext}
          />
        </ClientStepNav>
      );
    }
    case Step.ClientAllowedScopes: {
      return (
        <ClientStepNav handleStepChange={handleStepChange} activeStep={step}>
          <ClientAllowedScopes
            clientId={client.clientId}
            scopes={client.allowedScopes?.map((s) => s.scopeName)}
            handleChanges={changesMade}
            handleNext={handleNext}
            handleBack={handleBack}
          />
        </ClientStepNav>
      );
    }
    case Step.ClientClaims: {
      return (
        <ClientStepNav handleStepChange={handleStepChange} activeStep={step}>
          <ClientClaimForm
            claim={new ClaimDTO()}
            handleNext={handleNext}
            handleBack={handleBack}
            handleChanges={changesMade}
          ></ClientClaimForm>
        </ClientStepNav>
      );
    }
    case Step.ClientSecret: {
      return (
        <ClientStepNav handleStepChange={handleStepChange} activeStep={step}>
          <ClientSecretForm
            handleBack={handleBack}
            handleNext={handleNext}
            handleChanges={changesMade}
          />
        </ClientStepNav>
      );
    }
    default: {
      // TODO: Temp
      return <div>Step not found</div>;
    }
  }
};

export default Index;
