import React from 'react';
import '../styles/FriendRequest.css';

class FriendRequests extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            curUserID: localStorage.getItem("userid"),
            friendRequests: [],
            loading: false
        }

        this.acceptRequest = this.acceptRequest.bind(this);
        this.rejectRequest = this.rejectRequest.bind(this);
    }

    componentDidMount() {
        fetch("http://localhost:3001/postrequests",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({curUserId: this.state.curUserID})
        })
        .then(response => response.json())
        .then(body => {
            this.setState({friendRequests: body})
        })
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevState.loading !== this.state.loading) {
            fetch("http://localhost:3001/postrequests",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({curUserId: this.state.curUserID})
            })
            .then(response => response.json())
            .then(body => {
                this.setState({friendRequests: body})
            })
        }
    }

    acceptRequest(userID) {
        fetch("http://localhost:3001/acceptrequest",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({curUserID: this.state.curUserID, userID})
        })
        .then(body => {
                window.location.reload() // to display immediately the accepted user in the friends list
        })
    }

    rejectRequest(userID) {
        fetch("http://localhost:3001/rejectrequest",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({curUserID: this.state.curUserID, userID})
        })
        .then(
            this.setState({loading: !this.state.loading})
        )
    }

    render() {
        return(
            <div className="friend-requests">
                <h2>Friend Requests</h2>
                {   this.state.friendRequests.length === 0 &&
                    <p><br />No Friend Requests</p>
                }
                {  
                    this.state.friendRequests.map((friend, index) => {
                        return (
                            <div key={index}>
                                <a href={"/profile?id="+friend._id}>{friend.firstName+" "+friend.lastName}</a>
                                <div className="decision"><button className="accept-btn" onClick={() => this.acceptRequest(friend._id)}>Accept</button><button className="reject-btn" onClick={() => this.rejectRequest(friend._id)}>Reject</button></div>
                            </div>
                        )
                    })
                }
            </div>
        )
    }
};

export default FriendRequests;