import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import MarkdownEditor from '../components/markdownEditor';
import ReactMarkdown from 'react-markdown';
import { AuthContext } from '../contexts/authContext';
import { addDoc, collection } from 'firebase/firestore';
import { db } from '../firebase';

function CreateBlogPost() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isPreview, setIsPreview] = useState(false);
  const { currentUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !content) {
      alert('Please fill in both title and content');
      return;
    }

    try {
      await addDoc(collection(db, 'blogPosts'), {
        title,
        content,
        authorId: currentUser.uid,
        authorName: currentUser.displayName,
        createdAt: new Date(),
      });
      navigate('/blog');
    } catch (error) {
      console.error('Error adding document: ', error);
      alert('Failed to create blog post. Please try again.');
    }
  };

  return (
    <div className="create-blog-post">
      <h1>Create Blog Post</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title">Title:</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Content:</label>
          {isPreview ? (
            <div className="preview">
              <ReactMarkdown>{content}</ReactMarkdown>
            </div>
          ) : (
            <MarkdownEditor value={content} onChange={setContent} />
          )}
        </div>
        <div className="form-actions">
          <button type="button" onClick={() => setIsPreview(!isPreview)}>
            {isPreview ? 'Edit' : 'Preview'}
          </button>
          <button type="submit">Publish Post</button>
        </div>
      </form>
    </div>
  );
}

export default CreateBlogPost;