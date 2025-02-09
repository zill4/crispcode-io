import React from 'react';
import '../styles/Contact.css';

function Contact() {
    return (
        <div className="contact-container">
            <h1>Contact Me</h1>
            
            <form className="contact-form">
                <div className="form-group">
                    <label>Name:</label>
                    <input 
                        type="text" 
                        required 
                    />
                </div>

                <div className="form-group">
                    <label>Email:</label>
                    <input 
                        type="email" 
                        required 
                    />
                </div>

                <div className="form-group">
                    <label>Subject:</label>
                    <input 
                        type="text" 
                        required 
                    />
                </div>

                <div className="form-group">
                    <label>Message:</label>
                    <textarea 
                        rows="10" 
                        required 
                    />
                </div>

                <button type="submit">Send</button>
            </form>
        </div>
    );
}

export default Contact;