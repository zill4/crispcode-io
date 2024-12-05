import React from 'react';
import '../styles/About.css'; 

function About() {
    return (
        <div className="about-container">
            <div className="about-image">
                <img src="https://github.com/zill4/crispcode-io/blob/main/media/me.jpeg?raw=true" alt="Profile Picture"/>
            </div>
            <div className="about-content">
                <h1>About Me</h1>
                
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
                </section>
            </div>
        </div>
    );
}

export default About;