import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { collection, query, orderBy, limit, startAfter, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import ReactMarkdown from 'react-markdown';
import '../styles/Projects.css';

function Projects() {
    const [projects, setProjects] = useState([]);
    const [lastVisible, setLastVisible] = useState(null);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const postsPerPage = 5;

    useEffect(() => {
        fetchProjects();
    }, []);

    const fetchProjects = async () => {
        setLoading(true);
        try {
            const q = query(collection(db, 'projects'), orderBy('createdAt', 'desc'), limit(postsPerPage));
            const querySnapshot = await getDocs(q);
            const fetchedProjects = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setProjects(fetchedProjects);
            setLastVisible(querySnapshot.docs[querySnapshot.docs.length - 1]);
            setHasMore(querySnapshot.docs.length === postsPerPage);
        } catch (error) {
            console.error("Error fetching projects: ", error);
        }
        setLoading(false);
    };

    const fetchMoreProjects = async () => {
        if (!lastVisible || !hasMore) return;
        setLoading(true);
        try {
            const q = query(
                collection(db, 'projects'),
                orderBy('createdAt', 'desc'),
                startAfter(lastVisible),
                limit(postsPerPage)
            );
            const querySnapshot = await getDocs(q);
            const fetchedProjects = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setProjects([...projects, ...fetchedProjects]);
            setLastVisible(querySnapshot.docs[querySnapshot.docs.length - 1]);
            setHasMore(querySnapshot.docs.length === postsPerPage);
        } catch (error) {
            console.error("Error fetching more projects: ", error);
        }
        setLoading(false);
    };

    const handleImageClick = (url) => {
        if (url) {
            window.open(url, '_blank');
        }
    };

    return (
        <div className="projects container">
            {projects.map(project => (
                <article key={project.id} className="project section">
                    <h2>{project.title}</h2>
                    {project.imageLink && (
                        <div className="project-image-container">
                            <img 
                                src={project.imageLink} 
                                alt={project.title} 
                                className="project-image"
                                onClick={() => handleImageClick(project.links?.[0]?.url)}
                            />
                        </div>
                    )}
                    <div className="project-description">
                        <ReactMarkdown>
                            {project.description}
                        </ReactMarkdown>
                    </div>
                    <div className="project-links">
                        {project.links && project.links.map((link, index) => (
                            link.name.toLowerCase() !== 'live demo' && (
                                <a
                                    key={index}
                                    href={link.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="btn"
                                >
                                    {link.name}
                                </a>
                            )
                        ))}
                    </div>
                </article>
            ))}
            {loading && <p>Loading...</p>}
            {hasMore && !loading && (
                <button onClick={fetchMoreProjects} className="btn">
                    Load More
                </button>
            )}
        </div>
    );
}

export default Projects;