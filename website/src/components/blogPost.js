import React, { useEffect, useState } from 'react';
import { getBlogPosts } from '../services/blogService';

function Blog() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    getBlogPosts().then(setPosts);
  }, []);

  return (
    <div>
      <h1>Blog Posts</h1>
      {posts.map((post) => (
        <div key={post.id}>
          <h2>{post.title}</h2>
          <p>{post.content}</p>
          <small>{post.date_posted.toDate().toLocaleDateString()}</small>
        </div>
      ))}
    </div>
  );
}

export default Blog;