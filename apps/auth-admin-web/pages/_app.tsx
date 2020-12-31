import '../styles/App.scss';
import React from 'react';
import { Provider } from 'next-auth/client';

function MyApp({ Component, pageProps }) {
  return (
    <Provider session={pageProps.session} options={{ keepAlive: 300 }}>
      <Component {...pageProps} />
    </Provider>
  );
}

export default MyApp;
