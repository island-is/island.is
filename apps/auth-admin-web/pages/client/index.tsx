import ClientDTO from '../../models/dtos/client-dto';
import ClientForm from '../../components/ClientForm';
import React from 'react';
import { useRouter } from 'next/router';
import ContentWrapper from 'apps/auth-admin-web/components/common/ContentWrapper';

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
    <ContentWrapper>
      <ClientForm
        handleCancel={handleCancel}
        client={new ClientDTO()}
        onNextButtonClick={handleClientSaved}
      />
    </ContentWrapper>
  );
}
