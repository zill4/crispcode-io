import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import ReactMarkdown from 'react-markdown';
import '../styles/BlogDetail.css';
import { Timestamp } from 'firebase/firestore';
function BlogDetail() {
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { id } = useParams();

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const docRef = doc(db, 'blogPosts', id);
                const docSnap = await getDoc(docRef);
                
                if (docSnap.exists()) {
                    setPost({ id: docSnap.id, ...docSnap.data() });
                } else {
                    setError("No such blog post exists!");
                }
            } catch (err) {
                console.error("Error fetching blog post: ", err);
                setError("Failed to load blog post. Please try again later.");
            } finally {
                setLoading(false);
            }
        };

        fetchPost();
    }, [id]);

    if (loading) return <div className="loading">Loading...</div>;
    if (error) return <div className="error">{error}</div>;
    if (!post) return null;

    return (
        <div className="blog-detail">
            <h1>{post.title}</h1>
            <div className="blog-meta">
                <span className="author">By {post.authorName}</span>
                <span className="date">Published on {new Timestamp(post.createdAt.seconds, post.createdAt.nanoseconds).toDate().toLocaleDateString()}</span>
            </div>
            <div className="blog-content">
                <ReactMarkdown>{post.content}</ReactMarkdown>
            </div>
            {post.tags && post.tags.length > 0 && (
                <div className="blog-tags">
                    Tags: {post.tags.join(', ')}
                </div>
            )}
        </div>
    );
}

export default BlogDetail;