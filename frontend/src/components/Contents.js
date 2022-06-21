import React from 'react';
import MainContent from './MainContent';
import FriendList from './FriendList';
import FriendRequests from './FriendRequests';

// Contents section (Friends list, Main content, Friend Requests)
class Contents extends React.Component {
    render() {

        return(
            <div className="contents">
                <MainContent />
                <FriendList />
                <FriendRequests />
            </div>
        )
    }
};

export default Contents;