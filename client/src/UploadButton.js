import React, {useCallback} from 'react';
import styled from 'styled-components';
import {useDropzone} from "react-dropzone";

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
        }).then(r => {
            console.debug(r)
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
        <div>
            <div className="container">
                <Container {...getRootProps({isDragActive, isDragAccept, isDragReject})}>
                    <input {...getInputProps()} />
                    <p>Drag 'n' drop some files here, or click to select files</p>
                </Container>
            </div>
        </div>
    );
}

const getColor = (props) => {
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

const Container = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  border-width: 2px;
  border-radius: 2px;
  border-color: ${props => getColor(props)};
  border-style: dashed;
  background-color: #fafafa;
  color: #bdbdbd;
  outline: none;
  transition: border .24s ease-in-out;
`;