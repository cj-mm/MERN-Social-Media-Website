import React from 'react';
import { Redirect } from 'react-router-dom';
import Header from './components/Header';

class PrivateRoute extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            checkedIfLoggedIn: false,
            isLoggedIn: null,
        }
    }

    componentDidMount() {
        // Send POST request to check if the user is logged in
        fetch("http://localhost:3001/checkifloggedin",
            {
                method: "POST",
                credentials: "include"
            })
            .then(response => response.json())
            .then(body => {
                if (body.isLoggedIn) {
                    this.setState({ checkedIfLoggedIn: true, isLoggedIn: true, userId: body.userId, username: localStorage.getItem("username")});
                } else {
                    this.setState({ checkedIfLoggedIn: true, isLoggedIn: false });
                }
            })
    }

    render() {
        const Component = this.props.component;
        const rest = {...this.props};

        if (!this.state.checkedIfLoggedIn) {
            // delay redirect/render
            return (<div style={{height:"100vh", width: "100vw", color: "black"}}></div>);
        } else {
            if (this.state.isLoggedIn) {
                // render the page (with header)
                return (
                    <div>
                        <Header />
                        <Component {...rest}/>
                    </div>
                )
            } else {
                return <Redirect to="/log-in" />
            }
        }
    }
}

export default PrivateRoute;