import React, { useState } from 'react';
import axios from 'axios';
import { useSnackbar } from 'notistack';
import './EmailForm.css';

const EmailForm = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [files, setFiles] = useState([]);
  const [showFileInput, setShowFileInput] = useState(false);
  const [showCustomSubjectInput, setShowCustomSubjectInput] = useState(false);
  const [customSubject, setCustomSubject] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { enqueueSnackbar } = useSnackbar();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    console.log('Submitting email:', email, 'with message:', message, 'and files:', files, 'and subject:', customSubject);

    const formData = new FormData();
    formData.append('email', email);
    formData.append('message', message);
    if (showCustomSubjectInput) {
      formData.append('subject', customSubject); // Append subject if provided
    }
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

  const handleSubjectCheckboxChange = (e) => {
    setShowCustomSubjectInput(e.target.checked);
    if (!e.target.checked) {
      setCustomSubject('');
    }
  };

  const handleClearForm = () => {
    setEmail('');
    setMessage('');
    setFiles([]);
    setShowFileInput(false);
    setShowCustomSubjectInput(false);
    setCustomSubject('');
  };

  return (
    <>
      <p>MailMate</p>
      <div className="email-form">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
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
          </div>
          <div className="form-group">
            <label className='label2'>
              <input
                type="checkbox"
                className='checkbox1'
                checked={showFileInput}
                onChange={handleCheckboxChange}
              />
              Attach Files
            </label>
            {showFileInput && (
              <label className="file-input-label">
                <input
                  type="file"
                  multiple
                  onChange={handleFileChange}
                />
              </label>
            )}
          </div>
          <div className="form-group">
            <label className='label2'>
              <input
                type="checkbox"
                className='checkbox2'
                checked={showCustomSubjectInput}
                onChange={handleSubjectCheckboxChange}
              />
              Custom Subject
            </label>
            {showCustomSubjectInput && (
              <label>
                <input
                  type="text"
                  value={customSubject}
                  onChange={(e) => setCustomSubject(e.target.value)}
                  placeholder="Custom Subject"
                />
              </label>
            )}
          </div>
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
