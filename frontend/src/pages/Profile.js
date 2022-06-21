import React from 'react';
import '../styles/Profile.css'
import check from '../images/checked.png'
const queryString = require('query-string');

class Profile extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            userId: queryString.parse(props.location.search).id,
            username: "",
            userEmail: "",
            status: ""
        }

        this.sendRequest = this.sendRequest.bind(this);
    }

    componentDidMount() {
        fetch("http://localhost:3001/profile?id=" + this.state.userId,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({userId: localStorage.getItem("userid")}) // send id of the current user to the body for status
                }
            )
            .then(response => response.json())
            .then(body => {
                this.setState({
                    username: body.result.firstName + " " + body.result.lastName,
                    userEmail: body.result.email,
                    status: body.status
                })
            });
    
    }

    // send friend request
    sendRequest() {
        fetch("http://localhost:3001/sendrequest",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({profileId: this.state.userId, curUserId: localStorage.getItem("userid")})
        }).then(
            this.setState({status: "sent_request"})
        )
    }

    render() {
        return(
            <div className="profile">
                <p id="p-username">{this.state.username}</p>
                <p id="p-email">{this.state.userEmail}</p><br />
                { this.state.status === "current_user" &&
                    <div></div>
                }
                { this.state.status === "friend" &&
                    <h2>Friend <img src={check} alt="check"></img></h2>
                }
                { this.state.status === "sent_request" &&
                    <h2>Sent Request</h2>
                }
                { this.state.status === "friend_request" &&
                    <h2>Sent you a Friend Request</h2>
                }
                { this.state.status === "none" &&
                    <button onClick={this.sendRequest}>ADD USER</button>
                }
            </div>
        )
    }
};

export default Profile;