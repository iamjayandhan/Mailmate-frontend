import React, { useState } from 'react';
import axios from 'axios';
import { useSnackbar } from 'notistack';
import './EmailForm.css';

const EmailForm = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [files, setFiles] = useState([]);
  const [showFileInput, setShowFileInput] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { enqueueSnackbar } = useSnackbar();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    console.log('Submitting email:', email, 'with message:', message, 'and files:', files);

    const formData = new FormData();
    formData.append('email', email);
    formData.append('message', message);
    files.forEach((file) => {
      formData.append('files', file); // Use 'files' as the field name for the backend
    });

    try {
      const response = await axios.post('https://mailmate-server.vercel.app/api/send-email', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log('Server response:', response);
      enqueueSnackbar('Email sent successfully!', { variant: 'success' });
    } catch (error) {
      if (error.response) {
        console.error('Error response data:', error.response.data);
        console.error('Error response status:', error.response.status);
        console.error('Error response headers:', error.response.headers);
        enqueueSnackbar(`Failed to send email: ${error.response.data}`, { variant: 'error' });
      } else if (error.request) {
        console.error('Error request:', error.request);
        enqueueSnackbar('Failed to send email: No response from server.', { variant: 'error' });
      } else {
        console.error('Error message:', error.message);
        enqueueSnackbar(`Failed to send email: ${error.message}`, { variant: 'error' });
      }
      console.error('Error config:', error.config);
    }
    setIsSubmitting(false);
  };

  const handleFileChange = (e) => {
    setFiles([...files, ...e.target.files]);
  };

  const handleRemoveFile = (index) => {
    const newFiles = files.filter((_, i) => i !== index);
    setFiles(newFiles);
  };

  const handleCheckboxChange = (e) => {
    setShowFileInput(e.target.checked);
    if (!e.target.checked) {
      setFiles([]);
    }
  };

  const handleClearForm = () => {
    setEmail('');
    setMessage('');
    setFiles([]);
    setShowFileInput(false);
  };

  return (
    <>
    <p>MailMate</p>
    <div className="email-form">
      <form onSubmit={handleSubmit}>
        <label>
          Email:
          <input
            type="email"
            value={email}
            name='email'
            autoComplete='email'
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Target Email"
            required
          />
        </label>
        <label>
          Message:
          <textarea
            value={message}
            name='message'
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Your message"
            required
          />
        </label>
        <div className="file-attach-section">
          <label className='label2'>
            Attach Files
          </label>
          <input
            type="checkbox"
            className='checkbox'
            checked={showFileInput}
            onChange={handleCheckboxChange}
          />
        </div>
        {showFileInput && (
          <label>
            <input
              type="file"
              multiple
              onChange={handleFileChange}
            />
          </label>
        )}
        {files.length > 0 && (
          <div className="attachments">
            {files.map((file, index) => (
              <div key={index} className="attachment">
                {file.name}
                <button type="button" onClick={() => handleRemoveFile(index)}>&times;</button>
              </div>
            ))}
          </div>
        )}
        <div className="button-group">
          
          <button className="sendbtn" type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Sending...' : 'Send Email'}
          </button>
          <button type="button" onClick={handleClearForm} disabled={isSubmitting}>
            Clear
          </button>
        </div>
      </form>
    </div>
    </>
  );
};

export default EmailForm;
