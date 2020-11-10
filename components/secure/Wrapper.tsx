import React, { Component } from 'react';
import Header from './Header';
import Nav from './Nav';

class Wrapper extends Component {
    render() {
        return (
            <div className='wrapper__container'>
                <Header />
                <Nav />
                <main className="wrapper__main">
                    {this.props.children}
                </main>
            </div>
        );
    }
}

export default Wrapper;