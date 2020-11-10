import React from "react";
import Document, { Html, Head, Main, NextScript } from "next/document";
import Nav from "../components/Nav";
import Header from "../components/Header";

interface Props {
  lang: string;
}

class MyDocument extends Document<Props> {
  render() {
    return (
      <Html lang="en">
        <Head></Head>
        <body>
          <div className="wrapper__container">
            <Header />
            <Nav />
            <Main />
            <NextScript />
          </div>
        </body>
      </Html>
    );
  }
}

export default MyDocument;
