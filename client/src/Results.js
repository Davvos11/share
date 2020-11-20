import React from 'react';
import * as Bootstrap from 'react-bootstrap'

function addUrl(url) {
    const currentState = [...this.state.urls]
    currentState.push(url)
    this.setState({urls: currentState})
}

function showError(error) {
    this.setState({error})
}

export class Results extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            urls: [],
            error: ''
        }

        // Bind update functions
        addUrl = addUrl.bind(this)
        showError= showError.bind(this)
    }

    render() {
        // Show resulting URLS
        return(<div style={{width: "100%"}}>
            <Bootstrap.Alert variant="danger" dismissible show={this.state.error !== ''}
                             onClose={() => {this.setState({error: ''})}}>
                {this.state.error}
            </Bootstrap.Alert>
            <Bootstrap.ListGroup>
                {this.state.urls.map(url => <Bootstrap.ListGroupItem key={url}>
                    <a href={url} target="_blank" rel="noreferrer">{url}</a>
                </Bootstrap.ListGroupItem>)}
            </Bootstrap.ListGroup>
        </div>)
    }
}

export {addUrl, showError}