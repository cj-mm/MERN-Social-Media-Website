import React from 'react';
import '../styles/Header.css';
import home_icon from '../images/home.png';
import user_icon from '../images/user.png';
import out_icon from '../images/logout.png';
import logo from '../images/logo.png'
import Cookies from 'universal-cookie';
import { withRouter } from 'react-router-dom'; // to redirect
const queryString = require('query-string');

// Header section
class Header extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            searchValue: queryString.parse(props.location.search).user ? queryString.parse(props.location.search).user : ""
        }

        this.logout = this.logout.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.searchUser = this.searchUser.bind(this);
    }

    logout() {
        // Delete cookie with authToken
        const cookies = new Cookies();
        cookies.remove("authToken");

        // Delete username in local storage
        localStorage.removeItem("username");
        localStorage.removeItem("userid");
        this.props.history.push("/log-in");
    }

    handleChange(e) {
        this.setState({ searchValue: e.target.value });
    }
  
    searchUser(e) {
        if(e.keyCode === 13 && e.target.value !== ""){
            console.log('value', e.target.value);
            this.props.history.push("/search?user="+e.target.value);
            window.location.reload(false);
        }
    }

    render() {
        const user = localStorage.getItem("username");

        return(
            <div className="header">
                <div id="logo"><a href="/feed"><img src={logo} alt="logo"/></a></div>
                <input className="search" type="text" placeholder="Search" value={this.state.searchValue} onKeyDown={this.searchUser} onChange={this.handleChange} ></input>
                <p></p>
                <ul className="links">
                    <li id="user-profile"><a href={"/profile?id=" + localStorage.getItem("userid")}><img src={user_icon} alt="user"/><span>{user}</span></a></li>
                    <li><a href="/feed"><img src={home_icon} alt="home"/></a></li>
                    <li><img onClick={this.logout} src={out_icon} alt="logout" id="logout"/></li>
                </ul>
            </div>
        )
    }
};

export default withRouter(Header);