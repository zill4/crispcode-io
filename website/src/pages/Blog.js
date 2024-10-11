import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { collection, query, orderBy, limit, startAfter, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import '../styles/Blog.css';
import { Timestamp } from 'firebase/firestore';

function Blog() {
    const [posts, setPosts] = useState([]);
    const [lastVisible, setLastVisible] = useState(null);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);

    const postsPerPage = 5; // Adjust as needed

    useEffect(() => {
        fetchPosts();
    }, []);

    const fetchPosts = async () => {
        setLoading(true);
        try {
            const q = query(collection(db, 'blogPosts'), orderBy('createdAt', 'desc'), limit(postsPerPage));
            const querySnapshot = await getDocs(q);
            const fetchedPosts = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setPosts(fetchedPosts);
            setLastVisible(querySnapshot.docs[querySnapshot.docs.length - 1]);
            setHasMore(querySnapshot.docs.length === postsPerPage);
        } catch (error) {
            console.error("Error fetching posts: ", error);
        }
        setLoading(false);
    };

    const fetchMorePosts = async () => {
        if (!lastVisible || !hasMore) return;
        setLoading(true);
        try {
            const q = query(collection(db, 'blogPosts'), 
                            orderBy('createdAt', 'desc'), 
                            startAfter(lastVisible), 
                            limit(postsPerPage));
            const querySnapshot = await getDocs(q);
            const fetchedPosts = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setPosts([...posts, ...fetchedPosts]);
            setLastVisible(querySnapshot.docs[querySnapshot.docs.length - 1]);
            setHasMore(querySnapshot.docs.length === postsPerPage);
        } catch (error) {
            console.error("Error fetching more posts: ", error);
        }
        setLoading(false);
    };

    return (
        <div className="blog container">
            <h1>Blog Posts</h1>

            {posts.map(post => (
                <article key={post.id} className="blog-post section">
                    <h2><Link to={`/blog/${post.id}`}>{post.title}</Link></h2>
                    <p className="date">{new Timestamp(post.createdAt.seconds, post.createdAt.nanoseconds).toDate().toLocaleDateString()}</p>
                    <p>{post.content.length > 200 ? `${post.content.substring(0, 200)}...` : post.content}</p>
                </article>
            ))}

            {loading && <p>Loading...</p>}
            
            {hasMore && !loading && (
                <button onClick={fetchMorePosts} className="btn">
                    Load More
                </button>
            )}
        </div>
    );
}

export default Blog;