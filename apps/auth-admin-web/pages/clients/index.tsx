import React from 'react';
import ContentWrapper from './../../components/Layout/ContentWrapper';
import ClientsList from './../../components/Client/ClientsList';
import { useSession } from 'next-auth/client';

export default function Index() {
  const [session, loading] = useSession();

  if (loading) return null;

  if (!loading && !session) return <p>Access Denied</p>;

  return (
    <ContentWrapper>
      <ClientsList />
    </ContentWrapper>
  );
}
