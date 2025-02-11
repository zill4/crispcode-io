import React, { useState } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../firebase';  // Updated import to match your config
import '../styles/Contact.css';

function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [status, setStatus] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('sending');

    try {
      // Add document to 'mail' collection using your Firebase instance
      await addDoc(collection(db, 'mail'), {
        to: 'justin@crispcode.io',
        message: {
          subject: `New Contact Form Message from ${formData.name}`,
          html: `
            <p><strong>Name:</strong> ${formData.name}</p>
            <p><strong>Email:</strong> ${formData.email}</p>
            <br/>
            <p><strong>Message:</strong></p>
            <p>${formData.message.replace(/\n/g, '<br/>')}</p>
          `,
          text: `
            Name: ${formData.name}
            Email: ${formData.email}
            
            Message:
            ${formData.message}
          `
        }
      });

      setStatus('success');
      setFormData({ name: '', email: '', message: '' });
    } catch (error) {
      console.error('Error sending message:', error);
      setStatus('error');
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="contact-container">
      <h1>Contact Me</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="message">Message</label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            required
          />
        </div>
        <button 
          type="submit" 
          disabled={status === 'sending'}
          className={status === 'sending' ? 'sending' : ''}
        >
          {status === 'sending' ? 'Sending...' : 'Send Message'}
        </button>
      </form>
      
      {status === 'success' && (
        <div className="success-message">
          Message sent successfully! I'll get back to you soon.
        </div>
      )}
      
      {status === 'error' && (
        <div className="error-message">
          Sorry, there was an error sending your message. Please try again.
        </div>
      )}
    </div>
  );
}

export default Contact;