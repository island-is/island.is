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
          <div className="document__wrapper">
            <Main />
            <NextScript />
          </div>
          <footer>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Aspernatur magnam fugit porro.
          </footer>
        </body>
      </Html>
    );
  }
}

export default MyDocument;
