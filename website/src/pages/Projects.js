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
            const q = query(collection(db, 'projects'), 
                            orderBy('createdAt', 'desc'), 
                            startAfter(lastVisible), 
                            limit(postsPerPage));
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

    return (
        <div className="projects container">
            <h1>My Projects</h1>
            {projects.map(project => (
                <article key={project.id} className="project section">
                    <h2>
                        <Link to={`/project/${project.id}`}>{project.title}</Link>
                    </h2>
                    <ReactMarkdown>
                        {project.description.length > 200 
                            ? `${project.description.substring(0, 200)}...` 
                            : project.description}
                    </ReactMarkdown>
                    <div className="project-links">
                        <a href={project.repoLink} target="_blank" rel="noopener noreferrer" className="btn">GitHub</a>
                        {project.liveLink && (
                            <a href={project.liveLink} target="_blank" rel="noopener noreferrer" className="btn">Live Demo</a>
                        )}
                    </div>
                    {project.mediaLink && (
                        <div className="project-media">
                            {project.mediaType === 'photo' ? (
                                <img src={project.mediaLink} alt={project.title} />
                            ) : (
                                <video src={project.mediaLink} controls>
                                    Your browser does not support the video tag.
                                </video>
                            )}
                        </div>
                    )}
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