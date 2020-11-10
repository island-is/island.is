import Link from "next/link";
import React from "react";

export default function(){
    return <div className="error404">
        <h1>Page not found</h1>
        <Link href="/"><a>Back to main page</a></Link>
        </div>
}