import React from 'react';
import '../styles/MainContent.css'
import user from '../images/user.png'

// Main content section (w/ form for adding more posts.)
class MainContent extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            content: "",
            posts: [],
            edit: false,
            postToEdit: null,
            editedContent: "",
            reload: false // used for componentDidUpdate 
        }

        this.handleChange = this.handleChange.bind(this);
        this.addPost = this.addPost.bind(this);
        this.deletePost = this.deletePost.bind(this);
        this.editPost = this.editPost.bind(this);
    }


    componentDidMount() {
        fetch("http://localhost:3001/displayposts",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({curUserID: localStorage.getItem("userid")})
        })
        .then(response => response.json())
        .then(body => {
            this.setState({posts: body})
        })
    }

    // for the page to not reload every time a user add/delete/edit post
    componentDidUpdate(prevProps, prevState) {
        // condition is needed to not have infinite loop since we need to setState inside it
        if (prevState.reload !== this.state.reload) {
            fetch("http://localhost:3001/displayposts",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({curUserID: localStorage.getItem("userid")})
            })
            .then(response => response.json())
            .then(body => {
                this.setState({posts: body})
            })
        }
    }

    handleChange(e) {
        if (!this.state.edit) {
            this.setState({ content: e.target.value });
        } else {
            this.setState({ editedContent: e.target.value });
        }
    }

    addPost() {
        if (this.state.content !== "") {

            fetch('http://localhost:3001/addpost',
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    authorID: localStorage.getItem("userid"),
                    authorName: localStorage.getItem("username"),
                    timestamp: Date(),
                    content: this.state.content
                })
            })
            .then(this.setState({content: "", reload: !this.state.reload}))
        } else {
            alert("Write some contents!")
        }
    }

    deletePost(post) {
        fetch('http://localhost:3001/deletepost',
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    authorID: localStorage.getItem("userid"),
                    post
                })
            })
            .then(this.setState({reload: !this.state.reload}))
    }

    editPost() {
        if(this.state.editedContent !== "") {
            fetch('http://localhost:3001/editpost',
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        authorID: localStorage.getItem("userid"),
                        post: this.state.postToEdit,
                        editedContent: this.state.editedContent
                    })
                })
                .then(this.setState({edit: false, reload: !this.state.reload}))
        } else {
            alert("Write some contents!")
        }
    }
        
    render() {
        if(this.state.edit) {
            return(
                <div className="main-content">
                    <div className="edit-post">
                            <textarea id="write-post" type="text" placeholder="What's on your mind?" value={this.state.editedContent} onChange={this.handleChange}/><br />  
                            <button onClick={this.editPost}>DONE</button>
                            <button onClick={() => this.setState({edit: false})}>CANCEL</button>
                    </div>
                </div>
            )
        } else {
            return(
                <div className="main-content">
                    <div className="create-post">
                        <img src={user} alt="user"/>
                        <textarea id="write-post" type="text" placeholder="What's on your mind?" value={this.state.content} onChange={this.handleChange}/>    
                        <button onClick={this.addPost}>POST</button>
                    </div>
                    { this.state.posts.length === 0 && <p><br />Posts show here</p>}
                    { this.state.posts.length !== 0 &&
                        <div className="posts">
                        {
                            this.state.posts.map((post, index) => {
                                let timestamp = new Date(post.timestamp).toLocaleDateString() + " " + new Date(post.timestamp).toLocaleTimeString(); // convert timestamp to more readable format
                                return (
                                <div className="post" key={index}>
                                    <div>
                                        <a href={"/profile?id="+post.authorID} className="post-author">{post.authorName}</a><span> - {timestamp}</span>
                                    { post.authorID === localStorage.getItem("userid") &&
                                        <span className="post-options">
                                            <a href="#" onClick={() => this.setState({edit: true, postToEdit: post, editedContent: post.content})}>Edit</a>
                                            <a href="#"onClick={() => this.deletePost(post)}>Delete</a>
                                        </span>
                                    }
                                    </div>
                                    <div className="post-content">{post.content}</div>
                                </div>  
                                );
                            })
                        }
                        </div>
                    }
                    
                </div>
            )
        }
    }
};

export default MainContent;