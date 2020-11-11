import React from "react";
import { useRouter } from "next/router";

export default function () {
  const router = useRouter();

  const toMainPage = () => {
    router.replace("/");
  };

  return (
    <div className="error404">
      <h1>Page not found</h1>
      <button onClick={toMainPage} className="error404__button__back">
        <a>Back to main page</a>
      </button>
    </div>
  );
}
