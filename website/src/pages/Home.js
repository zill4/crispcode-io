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
                <article key={post.id} className="blog-post section">
                <h2><Link to={`/blog/${post.id}`}>{post.title}</Link></h2>
                <p>{post.content.length > 100 ? `${post.content.substring(0, 100)}...` : post.content}</p>
                <div className="blog-date-container">
                    <p className="date">Created:{new Timestamp(post.createdAt.seconds, post.createdAt.nanoseconds).toDate().toLocaleString()}</p>
                     {post.updatedAt && <p className="date">Updated:{new Timestamp(post.updatedAt.seconds, post.updatedAt.nanoseconds).toDate().toLocaleString()}</p>}
                    </div>
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
                <section className="bio-section">
                    <p>Hi, my name is Justin Crisp and I started my journey as a software engineer in 2015.</p>
                    
                    <p>I moved from Costa Mesa, CA to Cupertino, CA right after high school, enrolling in De Anza for Computer Engineering. There, I focused on computer science classes in the legendary Silicon Valley. It felt like hallowed ground, being the same school where Steve Jobs would unveil new Apple products. I excelled in computer science, joining the school's Computer Science club, The Developers Guild, and earning an A in Advanced C++. During this time, I was also interning at RingCentral, a voice-to-IP provider in Belmont, CA.</p>
                    
                    <p>At RingCentral, I served as a product analyst intern supporting the product team with competitive analysis, learning more about the SaaS business. I was invited to stay for the rest of the year, working on projects like implementing an NLP model (Word2Vec) for sentiment analysis on NPS scores of the RingCentral Glip product.</p>
                    
                    <p>Following a VP's recommendation to join the product team full-time, I decided to deepen my computer science knowledge at 42 Silicon Valley in Fremont, CA. Joining 42 required completing a one-month bootcamp with 12-hour minimum logged days working on C projects, with weekly exams testing C and Linux commands.</p>
                    
                    <p>At 42, I maintained a minimum of 120 hours weekly in the lab, working on projects like recreating the 'ls' Linux command, the 'printf' function, and building the C standard library from scratch using only Makefiles and basic functions like 'malloc' and 'free'. I was actively involved in the community: volunteering in the kitchen weekly, co-founding the video game club, and joining the ambassador's program to volunteer at tech conferences like StartupGrind and Samsung Unbox.</p>
                    
                    <p>My hackathon achievements include first place at Owl Hacks (Foothill College), third place at Samsung SXR Hackathon, and first place at the Samsung Bixby Hackathon. The Bixby victory led to a position on the Bixby Developer Relations team, where I helped launch the Bixby marketplace for Voice Apps.</p>
                    
                    <p>After Samsung, I worked on personal projects for content creators before joining Shotcall, a startup building a point-based reward program for content creator fans. There, I worked on frontend development with React, backend development with Java Spring, and DevOps using Python for Lambda functions.</p>
                    
                    <p>At Cubex, I worked as a software engineer on their frontend React app, created new endpoints in C# using .NET, and developed a microservice for discrepancy reporting. I gained valuable experience in Test Driven Development, C# design paradigms, and Azure CI/CD deployment processes.</p>
                    
                    <p>Currently, I'm focusing on learning new frontend frameworks like Astro and Deno 2.0, while creating projects using Llama large language models. My active projects include this portfolio site (React), FixedW/ (a car diagnosis app using React Native and Claude), and SwitchTape (a cross-platform music playlist converter using Astro, Preact, and Deno 2.0).</p>
                    
                    <p>My goal as an engineer is to continue learning and working on impactful projects that make people's lives easier. I aim to join a company that will challenge me to do my best work, encourages continuous learning, and fosters a supportive engineering community.</p>
                </section>            </section>

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