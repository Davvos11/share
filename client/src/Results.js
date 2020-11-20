import React from 'react';
import * as Bootstrap from 'react-bootstrap'
import _ from 'lodash'

function addUrl(url) {
    const currentState = [...this.state.urls]
    currentState.push(url)
    this.setState({urls: currentState})
}

function showError(error) {
    const currentState = [...this.state.errors]
    currentState.push(error)
    this.setState({errors: currentState})
}

export class Results extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            urls: [],
            errors: []
        }

        // Bind update functions
        addUrl = addUrl.bind(this)
        showError= showError.bind(this)
    }

    render() {
        // Show resulting URLS
        return(<div style={{width: "100%"}}>
            {this.state.errors.map(error =>
                <Bootstrap.Alert variant="danger" dismissible onClose={() => {this.hideError(error)}} key={error}>
                {error}
            </Bootstrap.Alert>)}
            <Bootstrap.ListGroup>
                {this.state.urls.map(url => <Bootstrap.ListGroupItem key={url}>
                    <a href={url} target="_blank" rel="noreferrer">{url}</a>
                </Bootstrap.ListGroupItem>)}
            </Bootstrap.ListGroup>
        </div>)
    }

    hideError = error => {
        const currentState = [...this.state.errors]
        const newState = _.difference(currentState, [error])
        this.setState({errors: newState})
    }
}

export {addUrl, showError}