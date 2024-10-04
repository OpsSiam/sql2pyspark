import React from 'react';
import axios from 'axios';
import '../css/FileUpload.css'; 

function FileUpload() {
  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post('http://localhost:5001/api/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log('File uploaded:', response.data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="file-upload">
      <input type="file" onChange={handleFileUpload} />
    </div>
  );
}

export default FileUpload;
