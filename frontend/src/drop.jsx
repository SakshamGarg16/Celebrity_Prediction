import { useDropzone } from 'react-dropzone';
import React, { useState } from 'react';


export default function DropzoneComponent({ setFieldValue , clearPrediction } ) {
    const [uploadedImage, setUploadedImage] = useState(null);
    const onDrop = (acceptedFiles) => {
      const file = acceptedFiles[0];
  
      // Convert to Base64
      const reader = new FileReader();
      reader.readAsDataURL(file);
  
      reader.onloadend = () => {
        const base64data = reader.result; // This will be the base64 string
        setFieldValue('image', base64data); // Set the base64 string in Formik
        setUploadedImage(base64data);
      };
    };

    const removeFile = () => {
        setUploadedImage(null); // Clear the uploaded image
        setFieldValue('image', null); // Remove the file from Formik
        clearPrediction()
      };
  
    const { getRootProps, getInputProps, isDragActive } = useDropzone({
      onDrop,
      accept: 'image/*',
      multiple: false,
    });
  
    return (
        <div className="dropzone-wrapper">
          {uploadedImage ? (
            <div className="uploaded-image-wrapper">
              <img src={uploadedImage} alt="Uploaded preview" className="uploaded-image" />
              <button onClick={removeFile} className="remove-file-button">Remove file</button>
            </div>
          ) : (
            <div
              {...getRootProps()}
              className={`dropzone ${isDragActive ? 'active' : ''}`}
            >
              <input {...getInputProps()} />
              {isDragActive ? (
                <p>Drop the files here...</p>
              ) : (
                <p>Drag & drop an image here, or click to select one</p>
              )}
            </div>
          )}
        </div>
      );
  }
  