import React from 'react';
import Document, { Html, Head, Main, NextScript } from 'next/document';
import Nav from '../components/Layout/Nav';
import Header from '../components/Layout/Header';

interface Props {
  lang: string;
}

class MyDocument extends Document<Props> {
  render() {
    return (
      <Html lang="en">
        <Head></Head>
        <body>
          <div className="document__wrapper">
            <Main />
            <NextScript />
          </div>
          <footer>
            Identity Server Admin - <a href="">Help pages</a>
          </footer>
        </body>
      </Html>
    );
  }
}

export default MyDocument;
