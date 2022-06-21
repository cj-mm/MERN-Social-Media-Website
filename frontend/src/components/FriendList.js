import React from 'react';
import '../styles/FriendList.css'

class FriendList extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            curUserID: localStorage.getItem("userid"),
            friends: []
        }
    }

    // display the friend list (id of the current user in body)
    componentDidMount() {
        fetch("http://localhost:3001/displayfriends",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({curUserID: this.state.curUserID})
        })
        .then(response => response.json())
        .then(body => {
            this.setState({friends: body})
        })
    }

    render() {
        return(
            <div className="friend-list">
                <h2>Friends</h2>
                {   this.state.friends.length === 0 &&
                    <div><br />Search users up!</div>
                }
                <ul>
                    {  
                        this.state.friends.map((friend, index) => {
                            return <li key={index}><a href={"/profile?id="+friend._id}><span>{friend.firstName+" "+friend.lastName}</span></a></li>
                        })
                    }
                </ul>
            </div>
        )
    }
};

export default FriendList;