import React, { Component } from 'react';
import Wrapper from './Wrapper';
import axios from 'axios'

class UsersCard extends Component {
    state = {
        
    }
    componentDidMount = async () => {
        const response = await axios.get('./user-identities/1234');
        console.log(response);
    }

    getUser = () => {}


    render() {
        return (
            <div className="users__container">
                <label className="users__search__label">
                    Leit eftir subject Id
                </label>
                <input id="search" type="text" className="users__search__input" />
            </div>
        );
    }
}

export default UsersCard;