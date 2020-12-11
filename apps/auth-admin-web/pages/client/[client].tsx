import ClientDTO from '../../models/dtos/client-dto';
import Client from './../../components/Client';
import ClientRedirectUri from './../../components/ClientRedirectUri';
import ClientIdpRestrictions from './../../components/ClientIdpRestrictions';
import ClientPostLogoutRedirectUri from './../../components/ClientPostLogoutRedirectUri';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';

import axios from 'axios';
import { Steps } from '../../models/utils/Steps';

const Index = () => {
  const { query } = useRouter();
  const clientId = query.client;

  const [step, setStep] = useState(1);
  const [client, setClient] = useState<ClientDTO>(new ClientDTO());
  const router = useRouter();

  const getClient = async (clientId: string) => {
    await axios
      .get(`/api/clients/${clientId}`)
      .then((response) => {
        console.log('RESPONSE');
        console.log(response);
        console.log(response.data);
        setClient(response.data);
      })
      .catch(function (error) {
        if (error.response) {
        }
      });
  };

  useEffect(() => {
    console.log('calling effect: ' + clientId);
    async function loadClient() {
      if (clientId) {
        await getClient(clientId as string);
      }
    }
    loadClient();
    setStep(1);
  }, [clientId]);

  let clientObj: ClientDTO = new ClientDTO();

  const handleNext = () => {
    console.log(step);
    console.log('handle next called');
    setStep(step + 1);
    console.log(step);
  };

  const handleBack = () => {
    console.log('handleback called');
    setStep(step - 1);
  };

  const handleCancel = () => {
    router.back();
  };

  const handleFinished = () => {
    console.log('Got to main');
    router.push('/');
  };

  const handleClientSaved = (clientSaved: ClientDTO) => {
    console.log('Client SAVED');
    console.log(clientSaved);
    if (clientSaved.clientId) {
      setClient(clientSaved);
      if (clientSaved.clientType === 'spa') {
        setStep(2);
        console.log('Setting step 2');
      } else {
        console.log('Setting step 3');
        setStep(3);
      }
    }
  };

  const handleClaimSaved = (claim: ClientClaimDTO) => {
    console.log(claim.clientId);
  };

  console.log(step);

  switch (step) {
    case Steps.Client:
      return (
        <Client
          handleCancel={handleCancel}
          client={client}
          onNextButtonClick={handleClientSaved}
        />
      );
    case Steps.ClientRedirectUri: {
      // Set the callback URI .. ALLT
      const rObj = new ClientRedirectUriDTO();
      rObj.clientId = client.clientId;
      return (
        <ClientRedirectUri
          redirectObject={client}
          uris={null}
          handleNext={handleNext}
          handleBack={handleBack}
        />
      );
    }
    case Steps.ClientIdpRestrictions: {
      return (
        <ClientIdpRestrictions
          clientId={client.clientId}
          restrictions={[]}
          handleNext={handleNext}
          handleBack={handleBack}
        />
      );
    }
    case Steps.ClientPostLogoutRedirectUri: {
      return (
        <ClientPostLogoutRedirectUri
          clientId={client.clientId}
          defaultUrl={''}
          uris={null}
          handleNext={handleNext}
          handleBack={handleBack}
        />
      );
    }
    case Steps.ClientAllowedCorsOrigin: {
      // Allowed Cors Origin
      // Default Display URL ?
    }
    case Steps.ClientGrantTypes: {
      // Grant Types
      // Authorization code ALLT NEMA SERVICE TO SERVICE - [Client credentials - SERVICE to SERVICE]
    }
    case Steps.ClientAllowedScopes: {
      // Allowed Scopes
      // Ákveðin scope sem við eigum og veljum úr lista - Skilgreinum scopes fyrir resource-a
      // Sett á bið?
    }
    case Steps.ClientClaims: {
      // Add Claims - Custom Claims (Vitum ekki alveg) - Setja í BID
      //    const claim = new ClientClaimDTO();
      //    console.log("Client ID: " + client);
      //    claim.clientId = client;
      //    return <ClientClaim claim={claim} handleSaved={handleClaimSaved} />
    }
    case Steps.ClientSecret: {
      //ClientSecret
      // EF SPA eða NATIVE þá sýna ekkert
      // Generate og sýna
    }
    default: {
      return (
        <StepEnd
          buttonText="Home"
          handleButtonFinishedClick={handleFinished}
          title="Success"
        >
          Client has been created
        </StepEnd>
      );
    }
  }
};

export default Index;
