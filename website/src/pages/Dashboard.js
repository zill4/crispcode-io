import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { collection, query, orderBy, limit, startAfter, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../firebase';
import '../styles/Dashboard.css';
function Dashboard() {
    const [posts, setPosts] = useState([]);
    const [projects, setProjects] = useState([]);
    const [lastPostVisible, setLastPostVisible] = useState(null);
    const [lastProjectVisible, setLastProjectVisible] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchPosts();
        fetchProjects();
    }, []);

    const fetchPosts = async () => {
        setLoading(true);
        try {
            const q = query(collection(db, 'blogPosts'), orderBy('createdAt', 'desc'), limit(10));
            const querySnapshot = await getDocs(q);
            const fetchedPosts = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setPosts(fetchedPosts);
            setLastPostVisible(querySnapshot.docs[querySnapshot.docs.length - 1]);
        } catch (error) {
            console.error("Error fetching posts: ", error);
        }
        setLoading(false);
    };

    const fetchProjects = async () => {
        setLoading(true);
        try {
            const q = query(collection(db, 'projects'), orderBy('createdAt', 'desc'), limit(10));
            const querySnapshot = await getDocs(q);
            const fetchedProjects = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setProjects(fetchedProjects);
            setLastProjectVisible(querySnapshot.docs[querySnapshot.docs.length - 1]);
        } catch (error) {
            console.error("Error fetching projects: ", error);
        }
        setLoading(false);
    };

    const deletePost = async (postId) => {
        if (window.confirm('Are you sure you want to delete this post?')) {
            try {
                await deleteDoc(doc(db, 'blogPosts', postId));
                setPosts(posts.filter(post => post.id !== postId));
            } catch (error) {
                console.error("Error deleting post: ", error);
            }
        }
    };

    const deleteProject = async (projectId) => {
        if (window.confirm('Are you sure you want to delete this project?')) {
            try {
                await deleteDoc(doc(db, 'projects', projectId));
                setProjects(projects.filter(project => project.id !== projectId));
            } catch (error) {
                console.error("Error deleting project: ", error);
            }
        }
    };

    return (
        <div className="dashboard">
            <h1>Admin Dashboard</h1>
            
            <section id="blog-posts">
                <h2>Blog Posts</h2>
                <Link to="/create-blog-post" className="btn">Create New Post</Link>
                <table>
                    <thead>
                        <tr>
                            <th>Title</th>
                            <th>Date Posted</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {posts.map(post => (
                            <tr key={post.id}>
                                <td>{post.title}</td>
                                <td>{new Date(post.createdAt).toLocaleString()}</td>
                                <td>
                                    <Link to={`/edit-post/${post.id}`} className="btn btn-small">Edit</Link>
                                    <button onClick={() => deletePost(post.id)} className="btn btn-small btn-danger">Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </section>

            <section id="projects">
                <h2>Projects</h2>
                <Link to="/create-project" className="btn">Create New Project</Link>
                <table>
                    <thead>
                        <tr>
                            <th>Title</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {projects.map(project => (
                            <tr key={project.id}>
                                <td>{project.title}</td>
                                <td>
                                    <Link to={`/edit-project/${project.id}`} className="btn btn-small">Edit</Link>
                                    <button onClick={() => deleteProject(project.id)} className="btn btn-small btn-danger">Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </section>

            {loading && <p>Loading...</p>}
        </div>
    );
}

export default Dashboard;