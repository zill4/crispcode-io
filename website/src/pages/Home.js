import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import { Timestamp } from 'firebase/firestore';
function Home() {
    const [recentPosts, setRecentPosts] = useState([]);
    const [featuredProjects, setFeaturedProjects] = useState([]);
    useEffect(() => {
        fetchRecentPosts();
        fetchFeaturedProjects();
    }, []);

    const fetchRecentPosts = async () => {
        try {
            const q = query(collection(db, 'blogPosts'), orderBy('createdAt', 'desc'), limit(3));
            const querySnapshot = await getDocs(q);
            const posts = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setRecentPosts(posts);
        } catch (error) {
            console.error("Error fetching recent posts: ", error);
        }
    };

    const fetchFeaturedProjects = async () => {
        try {
            const q = query(collection(db, 'projects'), orderBy('createdAt', 'desc'), limit(3));
            const querySnapshot = await getDocs(q);
            const projects = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setFeaturedProjects(projects);
        } catch (error) {
            console.error("Error fetching featured projects: ", error);
        }
    };

    return (
        <div className="home container">
            <section className="hero section">
                <h1>Welcome to crispcode.io</h1>
                <p>Work in progress, check back soon.</p>
                <p>Contact me at <a href="mailto:justin@crispcode.io">Justin@crispcode.io</a></p>
            </section>

            <section className="featured-posts section">
                <h2>Latest Blog Posts</h2>
                {recentPosts.map(post => (
                    <article key={post.id} className="blog-post">
                        <h3><Link to={`/blog/${post.id}`}>{post.title}</Link></h3>
                        <p className="date">{new Timestamp(post.createdAt.seconds, post.createdAt.nanoseconds).toDate().toLocaleDateString()}</p>
                    </article>
                ))}
            </section>

            <section className="featured-projects section">
                <h2>Featured Projects</h2>
                {featuredProjects.map(project => (
                    <div key={project.id} className="project">
                        <h3><Link to={`/project/${project.id}`}>{project.title}</Link></h3>
                        <p>{project.description.substring(0, 100)}...</p>
                    </div>
                ))}
                <Link to="/projects" className="btn">View All Projects</Link>
            </section>

            <section className="about-me section">
                <h2>About Me</h2>
                <p>Software engineer with 5+ years of experience working with small, medium, to large companies. My expertise is in Full Stack development using React frontend and .NET or Spring backend. Adaptable, I've had to work across AWS and Azure to scale services and deploy IoC pipelines.</p>
            </section>

            <section className="important-links section">
                <h2>Links</h2>
                <ul>
                    <li><a href="https://github.com/zill4" target="_blank" rel="noopener noreferrer">GitHub</a></li>
                    <li><a href="https://linkedin.com/in/justcrisp" target="_blank" rel="noopener noreferrer">LinkedIn</a></li>
                    <li><Link to="/blog">Blog</Link></li>
                </ul>
            </section>
        </div>
    );
}

export default Home;