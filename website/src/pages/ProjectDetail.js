import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import ReactMarkdown from 'react-markdown';
import '../styles/ProjectDetail.css';

function ProjectDetail() {
    const [project, setProject] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { id } = useParams();

    useEffect(() => {
        const fetchProject = async () => {
            try {
                const docRef = doc(db, 'projects', id);
                const docSnap = await getDoc(docRef);
                
                if (docSnap.exists()) {
                    setProject({ id: docSnap.id, ...docSnap.data() });
                } else {
                    setError("No such project exists!");
                }
            } catch (err) {
                console.error("Error fetching project: ", err);
                setError("Failed to load project. Please try again later.");
            } finally {
                setLoading(false);
            }
        };

        fetchProject();
    }, [id]);

    if (loading) return <div>Loading...</div>;
    if (error) return <div className="error">{error}</div>;
    if (!project) return null;

    return (
        <div className="project-detail">
            <h1>{project.title}</h1>
            <div className="project-links">
                <a href={project.repoLink} target="_blank" rel="noopener noreferrer" className="btn">GitHub Repository</a>
                {project.liveLink && (
                    <a href={project.liveLink} target="_blank" rel="noopener noreferrer" className="btn">Live Demo</a>
                )}
            </div>
            <div className="project-description">
                <ReactMarkdown>{project.description}</ReactMarkdown>
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
            <div className="project-date">
                Created on: {new Date(project.createdAt).toLocaleDateString()}
            </div>
        </div>
    );
}

export default ProjectDetail;