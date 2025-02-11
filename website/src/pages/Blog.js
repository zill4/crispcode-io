import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Link } from 'react-router-dom';
import { collection, query, orderBy, limit, startAfter, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import '../styles/Blog.css';
// import { Timestamp } from 'firebase/firestore';
import ReactMarkdown from 'react-markdown';
import { format, isValid, parseISO } from 'date-fns';

// Create a separate image component that only renders once
const StableImage = React.memo(({ src, alt }) => {
    const [loaded, setLoaded] = useState(false);
    const imgRef = useRef(null);

    useEffect(() => {
        if (imgRef.current?.complete) {
            setLoaded(true);
        }
    }, []);

    return (
        <div className="preview-image-container">
            <img
                ref={imgRef}
                src={src}
                alt={alt || ''}
                loading="lazy"
                style={{
                    maxWidth: '200px',
                    height: '150px',
                    objectFit: 'contain',
                    display: loaded ? 'block' : 'none',
                    margin: '10px auto'
                }}
                onLoad={() => setLoaded(true)}
                onError={(e) => {
                    e.target.style.display = 'none';
                }}
            />
        </div>
    );
}, (prevProps, nextProps) => prevProps.src === nextProps.src);

// Memoize the entire preview component
const PostPreview = React.memo(({ content }) => {
    return (
        <ReactMarkdown
            components={{
                a: ({node, ...props}) => <span {...props} />,
                img: ({src, alt}) => <StableImage src={src} alt={alt} />,
            }}
        >
            {content}
        </ReactMarkdown>
    );
}, (prevProps, nextProps) => prevProps.content === nextProps.content);

function Blog() {
    const [posts, setPosts] = useState([]);
    const [lastVisible, setLastVisible] = useState(null);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [currentTime, setCurrentTime] = useState(new Date());

    const postsPerPage = 5; // Adjust as needed

    useEffect(() => {
        fetchPosts();
    }, []);

    useEffect(() => {
        // Update time every second
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);

        return () => clearInterval(timer);
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
            console.log('Fetched posts:', fetchedPosts);
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

    // Memoize the preview content for all posts at once
    const previewContents = useMemo(() => {
        return posts.map(post => {
            const lines = post.content.split('\n').filter(line => line.trim() !== '');
            return lines.slice(0, 5).join('\n');
        });
    }, [posts]);

    const formatDate = (timestamp) => {
        if (!timestamp) return '';
        
        try {
            const date = timestamp.toDate();
            const isMobile = window.innerWidth <= 768;
            return format(date, isMobile ? "MM-dd-yyyy @ hh:mmaa" : "MM-dd-yyyy @ hh:mmaa 'CT'");
        } catch (error) {
            console.error('Date formatting error:', error);
            return '';
        }
    };

    useEffect(() => {
        // Log the posts when they're loaded
        console.log('Posts:', posts);
    }, [posts]);

    return (
        <div className="container">
            {posts.map((post, index) => (
                <div key={post.id} className="blog-post-wrapper">
                    <div className="date-container">
                        <span className="date-stamp created glow">
                            {formatDate(post.createdAt)}
                        </span>
                        <span className="date-stamp updated glow">
                            {formatDate(post.updatedAt)}
                        </span>
                    </div>
                    <Link 
                        to={`/blog/${post.id}`}
                        className="section"
                        style={{ textDecoration: 'none', display: 'block' }}
                    >
                        <article>
                            <h2>{post.title}</h2>
                            <div className="post-preview">
                                <PostPreview content={previewContents[index]} />
                                {post.content.split('\n').length > 5 && (
                                    <div className="read-more">...</div>
                                )}
                            </div>
                        </article>
                    </Link>
                </div>
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

export default React.memo(Blog);