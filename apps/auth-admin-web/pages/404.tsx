import React from 'react';
import { useRouter } from 'next/router';
import ContentWrapper from '../components/Layout/ContentWrapper';

const ErrorPage: React.FC = () => {
  const router = useRouter();

  const toMainPage = () => {
    router.replace('/');
  };

  return (
    <ContentWrapper>
      <div className="error404">
        <h1>Page not found</h1>
        <button onClick={toMainPage} className="error404__button__back">
          <a>Back to main page</a>
        </button>
      </div>
    </ContentWrapper>
  );
}
export default ErrorPage;
