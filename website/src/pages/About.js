import React, { useEffect, useState } from 'react';

function About() {

    return (
            <div class="about-container">
                <div class="about-image">
                    <img src="https://media.licdn.com/dms/image/v2/D5603AQEUpSn8cMgZ3w/profile-displayphoto-shrink_800_800/profile-displayphoto-shrink_800_800/0/1719878221109?e=1732752000&v=beta&t=GiX7H2TgGq9XPrGk9BpMYf1ah7-1wBDmqkaldCXJwuE" alt="Profile Picture"/>
                </div>
                <div class="about-content">
                    <h1>About Me</h1>
                    <p>I'm a software developer with a passion for building web applications and machine learning models.</p>
                    <p>This site is a work in progress. I'll add more content later, not really sure what I want to put here yet.</p>
                    <p>Currently working on an another application that is a less boring than this website.</p>
                </div>
            </div>
    );
}

export default About;