import React, { useState, useRef, useEffect } from 'react';
import '../styles/WhoAmI.css';
import Terminal from '../components/Terminal.tsx';

export default function WhoAmI() {
  const initialHistory = [
    { type: 'system', content: 'Welcome to the contact form. Type "help" for commands.' },
    { type: 'prompt', content: 'contact>> ready...' }
  ];

  const [inputValue, setInputValue] = useState('');
  const [visibleButtons, setVisibleButtons] = useState({
    aboutme: true,
    streams: true,
    socials: true
  });
  const [showSocials, setShowSocials] = useState(false);
  const [showStreams, setShowStreams] = useState(false);
  const [terminalHistory, setTerminalHistory] = useState([
    { type: 'system', content: 'Type a command or click a suggestion button above.' },
    { type: 'prompt', content: 'whoami>> ask away...' }
  ]);
  
  const inputRef = useRef(null);
  const terminalRef = useRef(null);

  useEffect(() => {
    inputRef.current?.focus();
    terminalRef.current?.scrollTo(0, terminalRef.current.scrollHeight);
  }, [terminalHistory]);

  useEffect(() => {
    if (showSocials) {
      const twitterScript = document.createElement('script');
      twitterScript.src = "https://platform.twitter.com/widgets.js";
      twitterScript.async = true;
      document.body.appendChild(twitterScript);
      
      return () => {
        document.body.removeChild(twitterScript);
      };
    }
  }, [showSocials]);

  useEffect(() => {
    if (showStreams) {
      const twitchScript = document.createElement('script');
      twitchScript.src = "https://embed.twitch.tv/embed/v1.js";
      twitchScript.async = true;
      twitchScript.onload = () => {
        new window.Twitch.Embed("twitch-embed", {
          width: "100%",
          height: 480,
          channel: "zill4",
          parent: [window.location.hostname]
        });
      };
      document.body.appendChild(twitchScript);
      
      return () => {
        document.body.removeChild(twitchScript);
      };
    }
  }, [showStreams]);

  const handleCommand = (command) => {
    if (command === 'socials') {
      setShowSocials(!showSocials);
      return;
    }
    if (command === 'streams') {
      setShowStreams(!showStreams);
      return;
    }

    if (visibleButtons[command]) {
      setVisibleButtons(prev => ({ ...prev, [command]: false }));
    }

    // Add command to terminal history
    const newHistory = [...terminalHistory, { type: 'command', content: `whoami>> ${command}` }];
    
    // Add response based on command
    let response;
    switch(command) {
      case 'aboutme':
        response = "Hi, my name is Justin Crisp and I started my journey as a software engineer in 2015...";
        break;
      case 'resume':
        response = "Opening resume in new tab...";
        window.open('/resume.pdf', '_blank');
        break;
      case 'socials':
        response = "Socials toggled...";
        break;
      case 'streams':
        response = "Streams toggled...";
        break;
      default:
        response = "Command not recognized. Try 'aboutme', 'resume', 'socials', or 'streams'";
    }
    
    setTerminalHistory([...newHistory, { type: 'response', content: response }]);
    setInputValue('');
  };

  return (
    <div className="whoami-container">
      <div className="intro-section">
        <div className="headshot-container">
          <img 
            src="https://github.com/zill4/crispcode-io/blob/main/media/me.jpeg?raw=true" 
            alt="Justin Crisp"
            className="headshot"
          />
        </div>
        <div className="speech-bubble">
          <p>
            Welcome to crispcode.io, the nexus for all things justin crisp. Ask my{' '}
            <span className="ai-highlight">AI</span>{' '}
            <span className="anything">anything</span>,{' '}
            <span className="anytime">anytime</span>.
          </p>
        </div>
      </div>

      <div className="command-buttons">
        <button className="command-btn streams" onClick={() => handleCommand('streams')}>
          <svg className="twitch-icon" viewBox="0 0 24 24" width="14" height="14">
            <path d="M11.571 4.714h1.715v5.143H11.57zm4.715 0H18v5.143h-1.714zM6 0L1.714 4.286v15.428h5.143V24l4.286-4.286h3.428L22.286 12V0zm14.571 11.143l-3.428 3.428h-3.429l-3 3v-3H6.857V1.714h13.714Z"/>
          </svg>
          /
          <svg className="youtube-icon" viewBox="0 0 24 24" width="14" height="14">
            <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
          </svg>
        </button>
        <button className="command-btn socials" onClick={() => handleCommand('socials')}>
           𝕏 /<svg className="linkedin-icon" viewBox="0 0 24 24" width="14" height="14">
            <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
          </svg>
        </button>
      </div>

      {showStreams && (
        <div className="streams-container">
          <div className="twitch-embed-container">
            <div id="twitch-embed"></div>
          </div>
          <div className="youtube-embed-container">
            <iframe
              width="100%"
              height="480"
              src="https://www.youtube.com/embed/hymnwQSjQa8"
              title="YouTube Video"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        </div>
      )}

      {showSocials && (
        <div className="social-embeds">
          <div className="twitter-embed">
            <blockquote className="twitter-tweet">
              <p lang="en" dir="ltr">
                ░▒▓ M U S E _ 0 ▓▒░<br />
                Q U A R T E R W A Y T O M V P<br /><br />
                Progress: 25%<br />
                MVP =&gt; Generated Cards (0%) → 3D Model (50%) → Rose Chess (20%)<br /><br />
                • Cards: placeholders only<br />
                • 3D: wicked spines, but textures still need love<br />
                • Chess: core moves done, deck mechanic next<br />
                • Solana…
              </p>
              &mdash; Zill4 (@__Zill4__)
              <a href="https://twitter.com/__Zill4__/status/1886646154579804370?ref_src=twsrc%5Etfw">
                February 4, 2025
              </a>
            </blockquote>
          </div>
          <div className="linkedin-embed">
            <iframe 
              src="https://www.linkedin.com/embed/feed/update/urn:li:share:7286071426690793472" 
              height="600" 
              width="100%" 
              frameBorder="0" 
              allowFullScreen="" 
              title="Embedded LinkedIn post"
            />
          </div>
        </div>
      )}

<Terminal
        initialHistory={initialHistory}
        prompt="contact>>"
        onCommand={handleCommand}
        className="contact-terminal terminal-container"
        style={{
          marginBottom: '1rem',
          height: '600px',
          maxHeight: '70vh'
        }}
      />    </div>
  );
}