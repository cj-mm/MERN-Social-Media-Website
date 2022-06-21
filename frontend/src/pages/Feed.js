import React, { Component } from 'react';
import Contents from '../components/Contents'
import '../styles/App.css';

export default class Feed extends Component {
    
    render() {
        return (
            <div className="container">
                <Contents />
            </div>
        )
    }
}