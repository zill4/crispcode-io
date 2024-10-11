import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { addDoc, collection } from 'firebase/firestore';
import { db } from '../firebase';
import MarkdownEditor from '../components/markdownEditor';
import '../styles/CreateProject.css';

function CreateProject() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [repoLink, setRepoLink] = useState('');
  const [liveLink, setLiveLink] = useState('');
  const [mediaLink, setMediaLink] = useState('');
  const [mediaType, setMediaType] = useState('photo'); // 'photo' or 'video'
  const [status, setStatus] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ type: 'info', message: 'Creating project...' });

    try {
      await addDoc(collection(db, 'projects'), {
        title,
        description,
        repoLink,
        liveLink,
        mediaLink,
        mediaType,
        createdAt: new Date().toISOString()
      });
      setStatus({ type: 'success', message: 'Project created successfully!' });
      setTimeout(() => navigate('/dashboard'), 2000); // Redirect after 2 seconds
    } catch (error) {
      console.error("Error creating project: ", error);
      setStatus({ type: 'error', message: 'Failed to create project. Please try again.' });
    }
  };

  return (
    <div className="create-project">
      <h1>Create Project</h1>

      {status && (
        <div className={`alert alert-${status.type}`}>
          {status.message}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title">Project Title:</label>
          <input 
            type="text" 
            id="title" 
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="description">Project Description:</label>
          <MarkdownEditor 
            value={description}
            onChange={setDescription}
          />
        </div>

        <div className="form-group">
          <label htmlFor="repoLink">Repository Link:</label>
          <input 
            type="url" 
            id="repoLink" 
            value={repoLink}
            onChange={(e) => setRepoLink(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="liveLink">Live Application Link:</label>
          <input 
            type="url" 
            id="liveLink" 
            value={liveLink}
            onChange={(e) => setLiveLink(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label htmlFor="mediaLink">Media Link (Photo or Video):</label>
          <input 
            type="url" 
            id="mediaLink" 
            value={mediaLink}
            onChange={(e) => setMediaLink(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Media Type:</label>
          <div>
            <label>
              <input 
                type="radio" 
                value="photo" 
                checked={mediaType === 'photo'}
                onChange={() => setMediaType('photo')}
              /> Photo
            </label>
            <label>
              <input 
                type="radio" 
                value="video" 
                checked={mediaType === 'video'}
                onChange={() => setMediaType('video')}
              /> Video
            </label>
          </div>
        </div>

        <button type="submit" className="btn">Create Project</button>
      </form>
    </div>
  );
}

export default CreateProject;