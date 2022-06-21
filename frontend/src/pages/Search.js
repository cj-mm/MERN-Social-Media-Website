import React from 'react';
import '../styles/Search.css';
const queryString = require('query-string');

class Search extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            resultUser: queryString.parse(props.location.search).user,
            haveResults: false,
            searchResults: []
        }
    }


    componentDidMount() {
        fetch("http://localhost:3001/search?user="+this.state.resultUser)
        .then(response => response.json())
        .then(body => {
            this.setState({haveResults: true, searchResults: body})
        })
    }

    render() {
        if(!this.state.haveResults) {
            // delay redirect/render
            return <div style={{height:"100vh", width: "100vw", color: "black"}}></div>
        } else {
            if (this.state.searchResults.length !== 0) {
                return(
                    <div className="search-results">
                        <h2>Results</h2>
                        <ul>
                            {
                                this.state.searchResults.map((result, i) => {
                                    return <li key={i}><a href={"/profile?id="+ result._id}>{result.firstName+" "+result.lastName }</a></li>
                                })
                            }   
                        </ul>
                    </div>
                )
            } else {
                return (
                    <div className="search-results">
                        <h2>No Results Found</h2>
                    </div>
                )
            }
        }
    }
};

export default Search;