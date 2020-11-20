import React, {useCallback} from 'react';
import styled from 'styled-components';
import {useDropzone} from "react-dropzone";
import {addUrl, showError} from "./Results";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faUpload} from "@fortawesome/free-solid-svg-icons";

export function UploadButton(props){
    const onDrop = useCallback(acceptedFiles => {
        // Add files to form data
        const formData  = new FormData();
        acceptedFiles.forEach(file => {
            formData.append('files', file);
        })

        // Make a request to the backend, i.e. upload the files
        fetch('/upload', {
            method: 'POST',
            body: formData
        }).then(r => r.json()).then(data => {
            data.forEach(url => addUrl(url))
        }).catch(e => {
            console.error(e)
            showError(String(e))
        });
    }, [])

    const {
        getRootProps,
        getInputProps,
        isDragActive,
        isDragAccept,
        isDragReject
    } = useDropzone({onDrop});

    return (
        <div className="upload-container" style={{height: "90%", cursor: "pointer"}}>
            <Container {...getRootProps({isDragActive, isDragAccept, isDragReject})}>
                <input {...getInputProps()} />
                <FontAwesomeIcon icon={faUpload} size="4x"/>
                <p>Drop some files, or click <u>here</u> to select files</p>
            </Container>
        </div>
    );
}

const getBorderColour = (props) => {
    if (props.isDragAccept) {
        return '#00e676';
    }
    if (props.isDragReject) {
        return '#ff1744';
    }
    if (props.isDragActive) {
        return '#2196f3';
    }
    return '#eeeeee';
}

const getColour = (props) => {
    if (props.isDragAccept) {
        return '#047100';
    }
    if (props.isDragReject) {
        return '#ff1744';
    }
    if (props.isDragActive) {
        return '#2196f3';
    }
    return '#bdbdbd';
}

const Container = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-around;
  padding: 20px;
  border-width: 2px;
  border-radius: 2px;
  border-color: ${props => getBorderColour(props)};
  color: ${props => getColour(props)};
  border-style: dashed;
  background-color: #fafafa;
  outline: none;
  transition: border .24s ease-in-out;
  height: 100%;
`;