import axios from 'axios';
import React, { Component, SyntheticEvent } from 'react';
import { Redirect } from 'react-router-dom';

class Login extends Component {
    username: string = "";
    password: string = "";
    state = {
        redirect: false
    }

    submit = async (e: SyntheticEvent) => {
        e.preventDefault();

        const data = {
            user: this.username,
            password: this.password
        };

        console.log(data)

        // TODO: Implement Login Server Side
        try {
            const response = await axios.post('/user-identities', data);
            console.log(response);        
            localStorage.setItem('token', response.data.token);
            // axios.defaults.headers.Authorization = `Bearer ${localStorage.getItem('token')}`;
        }
        catch {
            // TODO: Show Error and return
        }
        
        localStorage.setItem("token", "Unnar Snær Bjarnason"); 
        // axios.defaults.headers.Authorization = `Bearer ${localStorage.getItem('token')}`;       
        this.setState(this.state = { redirect: true});
    }

    render() {
        if (this.state.redirect)
        {
            return <Redirect to={'/resources'} />
        }
        return (
            <div className="login__container">
                <h2>Innskráning</h2>
                <form className="login__form" onSubmit={this.submit}>
                    <div className="login__container__field">
                        <label className="login__label" htmlFor="user">
                            Notandanafn
                        </label>
                        <input type="text" id="user" className="login__input" required placeholder="Notandanafn" autoFocus onChange={e => this.username = e.target.value} />
                    </div>
                    <div className="login__container__field">
                        <label className="login__label" htmlFor="password">
                            Lykilorð
                        </label>
                        <input type="password" id="password" className="login__input" required placeholder="Lykilorð" onChange={e => this.password = e.target.value } />
                    </div>
                    <div className="login__container__button">
                        <button className="login__button">Innskrá</button>
                    </div>
                </form>                
            </div>
        )
    }
}

export default Login;