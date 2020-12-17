import React from "react";
import Header from '../Header';
import Nav from '../Nav';

const ContentWrapper: React.FC = ({children}) =>{
  return( 
      <div className="content-wrapper">
          <Header></Header>
          <Nav></Nav>
          {children}
      </div>
    );
}
export default ContentWrapper;
