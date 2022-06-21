import React, { Component } from "react";
import { withRouter } from 'react-router-dom';
import Cookies from 'universal-cookie';
import '../styles/Form.css'

class Login extends Component {
    constructor(props) {
        super(props);

        this.state = {
            error: ""
        }

        this.login = this.login.bind(this);
        this.goToSignup = this.goToSignup.bind(this);
    }

    
    login(e) {
        e.preventDefault();

        const credentials = {
            email: document.getElementById("l-email").value,
            password: document.getElementById("l-password").value,
        }

        // Send a POST request
        fetch(
            "http://localhost:3001/login",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(credentials)
            })
            .then(response => response.json())
            .then(body => {
                if (!body.success) { this.setState({error: "Invalid username or password"}) }
                else {
                    // successful log in, store the token as a cookie

                    const cookies = new Cookies();
                    cookies.set(
                        "authToken",
                        body.token,
                        {
                            path: "localhost:3001/",
                            age: 60*60,
                            sameSite: "lax"
                        }
                    );

                    // local storage to store the username get from the server, needed for client side rendering
                    localStorage.setItem("username", body.username);
                    localStorage.setItem("userid", body.userId);

                    let path = "/feed";
                    this.props.history.push(path);
                }
            })
    }

    goToSignup() {
        let path = "/sign-up";
        this.props.history.push(path);
    }

    render() {
        return(
            <div className="login">
                <form className="form" id="login-form">
                    <h2>Log In</h2>
                    <input type="text" id="l-email" placeholder="Email" />
                    <input type="password" id="l-password" placeholder="Password" />
                    <br/>
                    <div id="error">
                        {this.state.error}
                    </div>
                    <br/>
                    <button id="login" onClick={this.login}>Log In</button>
                </form>
                <div><span id="create-account" onClick={this.goToSignup}>Create New Account</span></div><br />
            </div>
        )
    }
}

export default withRouter(Login);