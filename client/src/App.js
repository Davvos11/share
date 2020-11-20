import React from 'react';
import * as Bootstrap from 'react-bootstrap'

import './App.css'
import {UploadButton} from "./UploadButton";
import {Results} from "./Results";

export class App extends React.Component {
    render() {
        return (
            <Bootstrap.Col lg={8} className="mx-auto">
                <Bootstrap.Jumbotron>
                    <Bootstrap.Row>
                        <Bootstrap.Col sm="auto">
                            <h1 className="display-1">File Share</h1>
                            <p className="lead">Upload a file to get a URL.<br />
                            Uploads expire after one week.</p>
                        </Bootstrap.Col>
                        <Bootstrap.Col><UploadButton /></Bootstrap.Col>
                    </Bootstrap.Row>
                    <Bootstrap.Row>
                        <Results/>
                    </Bootstrap.Row>
                </Bootstrap.Jumbotron>
            </Bootstrap.Col>
        );
    }

}