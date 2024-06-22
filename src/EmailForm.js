import React, { useState } from 'react';
import axios from 'axios';
import { useSnackbar } from 'notistack';
import './EmailForm.css';

const EmailForm = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const { enqueueSnackbar } = useSnackbar();

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Submitting email:', email, 'with message:', message);

    try {
      const response = await axios.post('https://email-portal-server.vercel.app/api/send-email', { email, message });
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
  };

  return (
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
        <button type="submit">Send Email</button>
      </form>
    </div>
  );
};


export default EmailForm;
