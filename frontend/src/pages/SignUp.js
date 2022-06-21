import React from 'react'
import '../styles/Form.css'

class SignUp extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            password: "",
            repeatedPassword: "",
            passwordError: "",
            isSuccess: false
        }

        // bind custom methods to this
        this.handlePWChange = this.handlePWChange.bind(this);
        this.handleRepPWChange = this.handleRepPWChange.bind(this);
        this.validatePassword = this.validatePassword.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.signup = this.signup.bind(this);
    }

    handlePWChange(e) {
        this.setState({password: e.target.value});
        if(e.target.value !== "") {
            document.getElementById('rep-password').disabled = false;
        } else {
            document.getElementById('rep-password').disabled = true;
        }
    }

    handleRepPWChange(e) {
        this.setState({repeatedPassword: e.target.value});
    }

    validatePassword() {
        if (this.state.password !== this.state.repeatedPassword) {
            this.setState({passwordError: "* Passwords should match"});
            return false;
        }

        /*
        References for regex:
            - https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions
            - https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp/test
        */
        const hasNumber = /\d/.test(this.state.password);
        const hasUpperCaseChar = /[A-Z]/.test(this.state.password);
        const hasLowerCaseChar = /[a-z]/.test(this.state.password);

        if (this.state.password.length < 8 || !hasNumber || !hasUpperCaseChar || !hasLowerCaseChar ) {
            this.setState({passwordError:"* Password should be at least 8 characters, have at least 1 number, 1 lowercase letter, and 1 uppercase letter"});
            return false
        }

        this.setState({passwordError: ""});
        return true
    }

    handleSubmit(event) {
        event.preventDefault();
        const isValid = this.validatePassword();
        if (isValid) {
            this.signup(event);
        }
    }

    signup(e) {
        e.preventDefault();

        const user = {
            firstName: document.getElementById("s-fname").value,
            lastName: document.getElementById("s-lname").value,
            email: document.getElementById("s-email").value,
            password: document.getElementById("s-password").value
        }

        // send a POST request to localhost:3001/signup
        fetch(
            "http://localhost:3001/signup",
            {
                method: "POST", // because the default is GET
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(user)
            })
            .then(response => response.json())
            .then(body => {
                if (body.success) { this.setState({isSuccess: true}); }
                else { alert("Failed to save user!"); }
            })  
    }

    render() {
        return(
            <div>
                <form className="form" onSubmit={this.handleSubmit} style={this.state.isSuccess ? {display: "none"} : {display: "inherit"}}>
                    <h2>Sign Up</h2>
                    <input type="text" id="s-fname" placeholder="First Name" required/><br/>
                    <input type="text" id="s-lname" placeholder="Last Name" required/><br/>
                    <input type="email" id="s-email" placeholder="Email" required/><br/>
                    <input 
                        type="password" 
                        id="s-password" 
                        placeholder="Password" 
                        value={this.state.password}
                        onChange={this.handlePWChange}
                        required
                    /><br/>
                    <input 
                        type="password" 
                        id="rep-password" 
                        placeholder="Repeat Password" 
                        value={this.state.repeatedPassword} 
                        onChange={this.handleRepPWChange}
                        disabled
                        required
                    /><br/>
                    <div id="error">
                        {this.state.passwordError}
                    </div><br/>
                    <input 
                        type="submit" 
                        id="signup"
                        value="Sign Up"
                    />
                </form>
                <div className="s-success" style={this.state.isSuccess ? {display: "inherit"} : {display: "none"}}>
                    <p id="success">You have successfully signed up!</p><br/>
                    <a href={"/sign-up"}><button>Sign up another user</button></a><br />
                    <a href={"/log-in"}><button>Login</button></a>
                </div>
            </div>
        )
    }
}

export default SignUp;