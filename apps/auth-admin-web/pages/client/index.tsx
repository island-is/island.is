import ClientDTO from '../../models/dtos/client-dto';
import ClientForm from '../../components/ClientForm';
import React from 'react';
import { useRouter } from 'next/router';

export default function Index() {
  const router = useRouter();
  const handleCancel = () => {
    router.back();
  };

  const handleClientSaved = (clientSaved: ClientDTO) => {
    if (clientSaved.clientId) {
      router.push(`/client/${clientSaved.clientId}?step=2`);
    }
  };

  return (
    <ClientForm
      handleCancel={handleCancel}
      client={new ClientDTO()}
      onNextButtonClick={handleClientSaved}
    />
  );
}
