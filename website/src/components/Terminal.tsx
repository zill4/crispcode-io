import { useState, useCallback, useEffect, useRef, memo, useMemo } from 'react'
import ReactMarkdown from 'react-markdown'
import { transform, getFonts } from 'convert-unicode-fonts'
import { db } from '../firebase'  // Same import pattern as Contact.js
import { collection, addDoc, getDocs, query, where, serverTimestamp } from 'firebase/firestore';
import React from 'react';
import { firebaseConfig } from '../firebase';

interface Emoticon {
  face: string
  name: string
}

interface Tag {
  id: string;
  name: string;
  createdAt: Date;
  createdBy: string;
}

interface BlogPost {
  id: string;
  content: string;
  tags: string[];
  createdAt: Date;
  createdBy: string;
  markdown: boolean;
}

interface AICommand {
  name: string;
  description: string;
  command: string;
}

const EMOTICONS: Emoticon[] = [
  { face: '( •_•)', name: 'serious' },
  { face: '┌( ಠ‿ಠ)┘', name: 'dancing' },
  { face: '~(˘▾˘~)', name: 'wave' },
  { face: ' ', name: 'monkey' },
  { face: '(>ω<)', name: 'happy' },
  { face: '(^_^)/', name: 'hi' },
  { face: '(>A<)', name: 'frustrated' },
  { face: '(@_@)', name: 'dizzy' },
  { face: 'ε(･_･)з', name: 'cute' },
  { face: '(╯°□°）╯︵ ┻━┻', name: 'flip' },
  { face: '(´･_･`)', name: 'worried' },
  { face: '(◕‿◕)', name: 'adorable' },
  { face: '¯\\_(ツ)_/¯', name: 'shrug' },
  { face: '(｡♥‿♥｡)', name: 'love' },
  { face: '(╯︵╰,)', name: 'sad' }
]
const contextLocal = `Hi, my name is Justin Crisp and I started my journey as a software engineer in 2015.

I moved from Costa Mesa, CA to Cupertino, CA right after high school, enrolling in De Anza for Computer Engineering. There, I focused on computer science classes in the legendary Silicon Valley. It felt like hallowed ground, being the same school where Steve Jobs would unveil new Apple products. I excelled in computer science, joining the school's Computer Science club, The Developers Guild, and earning an A in Advanced C++. During this time, I was also interning at RingCentral, a voice-to-IP provider in Belmont, CA.

At RingCentral, I served as a product analyst intern supporting the product team with competitive analysis, learning more about the SaaS business. I was invited to stay for the rest of the year, working on projects like implementing an NLP model (Word2Vec) for sentiment analysis on NPS scores of the RingCentral Glip product.

Following a VP's recommendation to join the product team full-time, I decided to deepen my computer science knowledge at 42 Silicon Valley in Fremont, CA. Joining 42 required completing a one-month bootcamp with 12-hour minimum logged days working on C projects, with weekly exams testing C and Linux commands.

At 42, I maintained a minimum of 120 hours weekly in the lab, working on projects like recreating the 'ls' Linux command, the 'printf' function, and building the C standard library from scratch using only Makefiles and basic functions like 'malloc' and 'free'. I was actively involved in the community: volunteering in the kitchen weekly, co-founding the video game club, and joining the ambassador's program to volunteer at tech conferences like StartupGrind and Samsung Unbox.

My hackathon achievements include first place at Owl Hacks (Foothill College), third place at Samsung SXR Hackathon, and first place at the Samsung Bixby Hackathon. The Bixby victory led to a position on the Bixby Developer Relations team, where I helped launch the Bixby marketplace for Voice Apps.

After Samsung, I worked on personal projects for content creators before joining Shotcall, a startup building a point-based reward program for content creator fans. There, I worked on frontend development with React, backend development with Java Spring, and DevOps using Python for Lambda functions.

At Cubex, I worked as a software engineer on their frontend React app, created new endpoints in C# using .NET, and developed a microservice for discrepancy reporting. I gained valuable experience in Test Driven Development, C# design paradigms, and Azure CI/CD deployment processes.

Currently, I'm focusing on learning new frontend frameworks like Astro and Deno 2.0, while creating projects using Llama large language models. My active projects include this portfolio site (React), FixedW/ (a car diagnosis app using React Native and Claude), and SwitchTape (a cross-platform music playlist converter using Astro, Preact, and Deno 2.0).

My goal as an engineer is to continue learning and working on impactful projects that make people's lives easier. I aim to join a company that will challenge me to do my best work, encourages continuous learning, and fosters a supportive engineering community.`;


const MENU_COMMANDS = ['EDITOR','EMOJIS', 'STYLE', 'AI', 'TAG']

// Get available fonts once
const unicodeFonts = getFonts()

// Update FONT_STYLES to include all available fonts
const FONT_STYLES = [
  { name: 'normal', style: 'normal text' },
  { name: 'bold', style: '𝐛𝐨𝐥𝐝' },
  { name: 'italic', style: '𝑖𝑡𝑎𝑙𝑖𝑐' },
  { name: 'boldItalic', style: '𝒃𝒐𝒍𝒅 𝒊𝒕𝒂𝒍𝒊𝒄' },
  { name: 'scriptItalic', style: '𝒔𝒄𝒓𝒊𝒑𝒕' },
  { name: 'scriptBold', style: '𝓼𝓬𝓻𝓲𝓹𝓽' },
  { name: 'fraktur', style: '𝔣𝔯𝔞𝔠𝔱𝔲𝔯' },
  { name: 'boldFraktur', style: '𝖋𝖗𝖆𝖐𝖙𝖚𝖗' },
  { name: 'doubleStruck', style: '𝕕𝕠𝕦𝕓𝕝𝕖' },
  { name: 'sansSerif', style: '𝖲𝖺𝗇𝗌' },
  { name: 'sansSerifBold', style: '𝗦𝗮𝗻𝘀 𝗕𝗼𝗹𝗱' },
  { name: 'sansSerifItalic', style: '𝘚𝘢𝘯𝘴 𝘐𝘵𝘢𝘭𝘪𝘤' },
  { name: 'sansSerifBoldItalic', style: '𝙎𝙖𝙣𝙨 𝘽𝙤𝙡𝙙 𝙄𝙩𝙖𝙡𝙞𝙘' },
  { name: 'monospace', style: '𝚖𝚘𝚗𝚘' },
  { name: 'super', style: 'ˢᵘᵖᵉʳ' },
  { name: 'parenthesized', style: '⒫⒜⒭⒠⒩' },
  { name: 'circled', style: 'Ⓒⓘⓡⓒⓛⓔⓓ' },
  { name: 'squaredCapital', style: '🄲🄰🄿🄸🅃🄰🄻' },
  { name: 'negativeCircledCapital', style: '🅝🅔🅖 🅒🅘🅡🅒🅛🅔' },
  { name: 'negativeSquaredCapital', style: '🅽🅴🅶 🆂🆀🆄🅰🆁🅴' },
  { name: 'regionalIndicatorSymbol', style: '🇷 🇪 🇬 🇮 🇴 🇳' },
  { name: 'fullWidth', style: 'ｆｕｌｌ' },
  { name: 'myanmar', style: 'ꓟꓬꓰꓙꓣꓚꓰꓡ' },
  { name: 'cherokee', style: 'ᏟᎻᎬᎡᎤᎧᎬᎬ' },
  { name: 'romanNumerals', style: 'ⅠⅡⅢⅣⅤ' },
  { name: 'romanNumeralsSmall', style: 'ⅰⅱⅲⅳⅴ' }
]

// Replace the transformText function with the package's transform function
const transformText = (text: string, style: string): string => {
  if (style === 'normal' || !unicodeFonts[style]) {
    return text;
  }
  
  return transform(text, unicodeFonts[style]);
}

// Create an array of dance move frames
const DANCE_FRAMES = [
  '┌( ಠ‿ಠ)┘ ',
  '└( ಠ‿ಠ)┐ ',
  '┌( ಠ‿ಠ)┐ ',
  '└( ಠ‿ಠ)┘ ',
];

// Add AI commands interface and array
const AI_COMMANDS: AICommand[] = [
  { name: 'Help', description: 'Shows list of commands', command: 'help' },
  { name: 'Joke', description: 'Tells a joke', command: 'joke' },
  { name: 'Ask', description: 'Any question answered', command: 'ask' }
];

// Update the callAnthropic function to use the API key from firebaseConfig
const callAnthropic = async (prompt: string, context: string) => {
  try {
    const response = await fetch('https://us-central1-website-mein.cloudfunctions.net/callAnthropic', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ prompt, context })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.content[0].text;
  } catch (error) {
    console.error('Error calling Anthropic:', error);
    return "Oops! I had a little hiccup. Could you try asking me that again?";
  }
};

// Memoize the MessageLine component
const MemoizedMessageLine = memo(({ line }: { line: string }) => {
  if (!line) return null;
  
  const timestampMatch = line.match(/^\[(.*?)\]/);
  if (!timestampMatch) {
    return <div className="mb-4 font-mono">{line}</div>;
  }

  const timestamp = timestampMatch[0];
  const content = line.slice(timestamp.length).trim();
  
  let markdownContent = content;
  const markdownMatch = content.match(/<markdown>([\s\S]*)<\/markdown>/);
  if (markdownMatch) {
    markdownContent = markdownMatch[1];
  }

  return (
    <div className="mb-4 font-mono">
      <div className="text-gray-600">
        {timestamp}
        {content.startsWith('User:') && (
          <span className="text-gray-800">User:</span>
        )}
      </div>
      <div className="mt-2 ml-8">
        <ReactMarkdown 
          className="prose prose-sm prose-gray max-w-none"
          components={{
            // Headings
            h1: ({children}) => <h1 className="text-2xl font-bold my-4">{children}</h1>,
            h2: ({children}) => <h2 className="text-xl font-bold my-3">{children}</h2>,
            h3: ({children}) => <h3 className="text-lg font-bold my-2">{children}</h3>,
            h4: ({children}) => <h4 className="text-base font-bold my-2">{children}</h4>,
            h5: ({children}) => <h5 className="text-sm font-bold my-1">{children}</h5>,
            h6: ({children}) => <h6 className="text-xs font-bold my-1">{children}</h6>,
            
            // Text formatting
            p: ({children}) => <div className="my-2">{children}</div>,
            strong: ({children}) => <strong className="font-bold">{children}</strong>,
            em: ({children}) => <em className="italic">{children}</em>,
            del: ({children}) => <del className="line-through">{children}</del>,
            
            // Lists
            ul: ({children}) => <ul className="list-disc ml-4 my-2">{children}</ul>,
            ol: ({children}) => <ol className="list-decimal ml-4 my-2">{children}</ol>,
            li: ({children}) => <li className="my-1">{children}</li>,
            
            // Code
            //@ts-ignore
            code: ({inline, className, children}) => {
              const match = /language-(\w+)/.exec(className || '');
              return !inline && match ? (
                <pre className="bg-gray-800 text-white p-4 rounded my-4 overflow-x-auto">
                  <code className={className}>{children}</code>
                </pre>
              ) : (
                <code className="bg-gray-200 px-1 rounded font-mono text-sm">{children}</code>
              );
            },
            
            // Blockquotes
            blockquote: ({children}) => (
              <blockquote className="border-l-4 border-gray-300 pl-4 my-4 italic">
                {children}
              </blockquote>
            ),
            
            // Links and Images
            a: ({href, children}) => (
              <a 
                href={href} 
                className="text-blue-600 hover:underline" 
                target="_blank" 
                rel="noopener noreferrer"
              >
                {children}
              </a>
            ),
            img: ({src, alt}) => (
              <img 
                src={src} 
                alt={alt} 
                className="max-w-full rounded my-4"
                loading="lazy"
              />
            ),
            
            // Tables
            table: ({children}) => (
              <div className="overflow-x-auto my-4">
                <table className="min-w-full divide-y divide-gray-300">
                  {children}
                </table>
              </div>
            ),
            thead: ({children}) => <thead className="bg-gray-100">{children}</thead>,
            tbody: ({children}) => <tbody className="divide-y divide-gray-200">{children}</tbody>,
            tr: ({children}) => <tr>{children}</tr>,
            th: ({children}) => (
              <th className="px-4 py-2 text-left font-bold">{children}</th>
            ),
            td: ({children}) => <td className="px-4 py-2">{children}</td>,
            
            // Horizontal Rule
            hr: () => <hr className="my-4 border-t border-gray-300" />,
            
            // Task Lists
            input: ({checked}) => (
              <input 
                type="checkbox" 
                checked={checked} 
                readOnly 
                className="mr-2"
              />
            ),
          }}
        >
          {markdownContent}
        </ReactMarkdown>
      </div>
    </div>
  );
}, (prevProps, nextProps) => prevProps.line === nextProps.line);

// In the main Terminal component, memoize the messages section
const MemoizedMessages = memo(({ lines, messagesRef }: { 
  lines: string[], 
  messagesRef: React.RefObject<HTMLDivElement> 
}) => (
  <div 
    ref={messagesRef}
    className="flex-1 overflow-auto overscroll-contain p-2 sm:p-4 text-sm text-gray-800 font-mono bg-gray-100"
  >
    {lines.map((line, index) => (
      <MemoizedMessageLine key={index} line={line} />
    ))}
  </div>
));

export default function Terminal() {
  const [input, setInput] = useState('')
  const [lines, setLines] = useState<string[]>([
    '(｡♥‿♥｡) Welcome! /ask/ me anything...'
  ])
  const [showEmotes, setShowEmotes] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const messagesRef = useRef<HTMLDivElement>(null)
  const searchInputRef = useRef<HTMLInputElement>(null)
  const [selectedIndex, setSelectedIndex] = useState<number>(0)
  const [commandIndex, setCommandIndex] = useState<number>(-1)
  const [previewText, setPreviewText] = useState('')
  const [isPreviewConfirmed, setIsPreviewConfirmed] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const [isVimMode, setIsVimMode] = useState(false)
  const [editorContent, setEditorContent] = useState('')
  const [vimCommand, setVimCommand] = useState('')
  const [showStyles, setShowStyles] = useState(false)
  const [currentStyle, setCurrentStyle] = useState('normal')
  const editorRef = useRef<HTMLTextAreaElement>(null)
  const [tags, setTags] = useState<Tag[]>([]);
  const [showTags, setShowTags] = useState(false);
  const [selectedTag, setSelectedTag] = useState<string>('');
  const [isCreatingTag, setIsCreatingTag] = useState(false);
  const [tagSearchQuery, setTagSearchQuery] = useState('');
  const tagInputRef = useRef<HTMLInputElement>(null);
  const [currentTag, setCurrentTag] = useState<string>('');

  // Add state for the current animation
  const [currentAnimation, setCurrentAnimation] = useState({
    text: '',
    frame: '',
    messageIndex: 0,
    frameIndex: 0
  });

  // Add state for AI menu
  const [showAI, setShowAI] = useState(false);
  const [selectedAICommand, setSelectedAICommand] = useState<string>('');

  // Add admin state
  const [isAdmin, setIsAdmin] = useState(false);

  // Add state for input focus
  const [isInputFocused, setIsInputFocused] = useState(false);

  // Fetch tags on component mount
  useEffect(() => {
    const fetchTags = async () => {
      const tagsCollection = collection(db, 'tags');
      const tagsSnapshot = await getDocs(tagsCollection);
      const tagsList = tagsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Tag[];
      setTags(tagsList);
    };

    fetchTags();
  }, []);

  // Fetch posts on component mount
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const postsCollection = collection(db, 'rssBlog');
        const postsSnapshot = await getDocs(postsCollection);
        const posts = postsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        // Sort posts by createdAt
        const sortedPosts = posts.sort((a: any, b: any) => {
          const dateA = a.createdAt?.toDate?.() || new Date(a.createdAt);
          const dateB = b.createdAt?.toDate?.() || new Date(b.createdAt);
          return dateA.getTime() - dateB.getTime();
        });

        // Format and add each post to lines
        const formattedPosts = sortedPosts.map((post: any) => {
          const date = post.createdAt?.toDate?.() || new Date(post.createdAt);
          const tags = post.tags?.length > 0 ? ` - ${post.tags.join(',')} ` : '';
          
          // Format timestamp with tags
          const time = date.toLocaleTimeString('en-US', { 
            hour: 'numeric', 
            minute: '2-digit',
            hour12: true
          });
          const dateStr = date.toLocaleDateString('en-US', { 
            month: '2-digit', 
            day: '2-digit', 
            year: 'numeric'
          });
          const timezone = date.getTimezoneOffset() / -60;
          
          // If the post contains markdown or multiple lines, wrap it
          const content = post.markdown || post.content.includes('\n')
            ? `${post.content}\n<markdown>${post.content}</markdown>`
            : post.content;

          return `[${dateStr}${tags}- ${time}${timezone >= 0 ? '+' : '-'}${Math.abs(timezone)}] User: ${content}`;
        });

        // Update lines with welcome message and posts
        setLines(prev => [
          prev[0], // Keep the welcome message
          ...formattedPosts
        ]);
      } catch (error) {
        console.error('Error fetching posts:', error);
        setLines(prev => [
          ...prev,
          formatMessage('Error loading previous messages.', 'system')
        ]);
      }
    };

    fetchPosts();
  }, []); // Empty dependency array means this runs once on mount

  // Add a separate dance animation function
  const getDanceAnimation = (text: string) => {
    return {
      text,
      frames: ['┌( ಠ‿ಠ)┘', '└( ಠ‿ಠ)┐', '┌( ಠ‿ಠ)┐', '└( ಠ‿ಠ)┘']
    };
  };

  // Remove or simplify the animation useEffect to just set the initial message
  useEffect(() => {
    setLines(['(｡♥‿♥｡) Welcome! /ask/ me anything...']);
  }, []);

  // Simplified tag creation
  const handleCreateTag = async (tagName: string) => {
    const newTag = {
      name: tagName.toLowerCase(),
      createdAt: serverTimestamp(),
      createdBy: 'JCRISP'
    };

    try {
      const docRef = await addDoc(collection(db, 'tags'), newTag);
      setTags(prev => [...prev, { ...newTag, id: docRef.id, createdAt: new Date() }]);
      setIsCreatingTag(false);
      setSelectedTag(tagName);
    } catch (error) {
      console.error('Error creating tag:', error);
    }
  };

  // Update the formatMessage function to handle oomi's messages
  const formatMessage = useCallback((message: string, tag?: string, messageTags: string[] = []) => {
    const now = new Date()
    const date = now.toLocaleDateString('en-US', { 
      month: '2-digit', 
      day: '2-digit', 
      year: 'numeric'
    })
    const time = now.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true
    })
    const timezone = now.getTimezoneOffset() / -60
    
    const tagString = messageTags[0] ? ` - ${messageTags[0]} ` : ''
    const timestamp = `[${date}${tagString}- ${time}${timezone >= 0 ? '+' : '-'}${Math.abs(timezone)}]`
    
    if (tag === 'oomi') {
      return `${timestamp} ${message}`; // Don't apply any transformations to oomi's messages
    }
    
    // Don't transform markdown content with unicode styles
    const shouldTransform = !containsMarkdown(message) && currentStyle !== 'normal'
    const styledMessage = shouldTransform ? transformText(message, currentStyle) : message
    
    if (tag === 'USER') {
      // If message contains markdown, don't wrap it again
      if (containsMarkdown(message)) {
        return `${timestamp} User: ${styledMessage}`
      }
      // Otherwise, wrap it in markdown tags for proper rendering
      return `${timestamp} User: ${styledMessage}\n<markdown>${styledMessage}</markdown>`
    }
    return `${timestamp} ${styledMessage}`
  }, [currentStyle]);

  // Update handleSavePost to properly store markdown content
  const handleSavePost = async (content: string, tags: string[]) => {
    if (!content.trim()) return;
    
    const post = {
      content: content,
      tags,
      createdAt: serverTimestamp(),
      createdBy: 'JCRISP',
      markdown: containsMarkdown(content)
    };

    try {
      await addDoc(collection(db, 'rssBlog'), post);
    } catch (error) {
      console.error('Error saving post:', error);
    }
  };

  // Modify the input display to show single tag
  const getInputDisplay = useCallback(() => {
    const tagDisplay = currentTag ? `[${currentTag}] ` : '';
    return `~ ${tagDisplay}${input}`;
  }, [input, currentTag]);

  // Update tag selection to only set one tag
  const handleTagSelect = (tagName: string) => {
    setCurrentTag(tagName);
    setShowTags(false);
    setTagSearchQuery('');
  };

  // Move processCommand before handleCommand
  const processCommand = useCallback((command: string) => {
    // Add your command processing logic here
    return ''; // Return empty string or appropriate response
  }, []);

  // Update handleCommand to handle both AI and existing menu commands
  const handleCommand = useCallback(async (command: string, isMenuCommand: boolean = false) => {
    // Add admin authentication
    if (command === '!admin_jcrisp') {
      setIsAdmin(true);
      setLines(prev => [...prev, 
        formatMessage('Admin access granted', 'system')
      ]);
      setInput('');
      return;
    }

    // Check for admin status before allowing chat/save operations
    if (command.startsWith('/chat/')) {
      if (!isAdmin) {
        setLines(prev => [...prev, 
          formatMessage('(>A<) Admin access required for chat functionality', 'oomi')
        ]);
        setInput('');
        return;
      }
      
      // Existing chat functionality for admins
      const message = command.slice(6).trim();
      if (message) {
        try {
          await addDoc(collection(db, 'messages'), {
            content: message,
            timestamp: serverTimestamp(),
            user: 'admin'
          });
          // ... rest of chat handling
        } catch (error) {
          console.error('Error saving message:', error);
        }
      }
    }

    if (command === '/ai/') {
      setShowEmotes(false);
      setShowStyles(false);
      setShowTags(false);
      setShowAI(prev => !prev);
      if (!isMenuCommand) setInput('');
      return;
    }

    if (command === '/emojis/') {
      setShowAI(false);
      setShowStyles(false);
      setShowTags(false);
      setShowEmotes(prev => !prev);
      if (!isMenuCommand) setInput('');
      return;
    }

    if (command === '/style/') {
      setShowAI(false);
      setShowEmotes(false);
      setShowTags(false);
      setShowStyles(prev => !prev);
      if (!isMenuCommand) setInput('');
      return;
    }

    if (command === '/tag/') {
      setShowAI(false);
      setShowEmotes(false);
      setShowStyles(false);
      setShowTags(prev => !prev);
      if (!isMenuCommand) setInput('');
      return;
    }

    if (command === '/editor/') {
      setIsVimMode(prev => !prev);
      if (!isMenuCommand) setInput('');
      return;
    }

    // Handle AI-specific commands
    if (command.startsWith('/ask/')) {
      const question = command.slice(5).trim();
      if (!question) {
        setLines(prev => [...prev, 
          formatMessage(`(｡♥‿♥｡) What would you like to know? Type your question after /ask/`, 'oomi')
        ]);
        return;
      }

      // Show thinking animation
      const thinkingAnim = getDanceAnimation('*thinking*');
      setCurrentAnimation({
        text: thinkingAnim.text,
        frame: thinkingAnim.frames[0],
        messageIndex: 0,
        frameIndex: 0
      });

      // Get response from Anthropic using contextLocal
      const response = await callAnthropic(question, contextLocal);
      
      // Add the response to lines without saving to Firebase
      setLines(prev => [...prev, 
        formatMessage(command, 'USER'),
        formatMessage(`(^‿^) ${response}`, 'oomi')
      ]);
      
      // Clear thinking animation
      setCurrentAnimation({
        text: '',
        frame: '',
        messageIndex: 0,
        frameIndex: 0
      });

      setInput('');
      return;
    }

    // Handle other AI menu commands
    if (command === '/ai/help/') {
      const response = await callAnthropic("List available commands and what they do", contextLocal);
      setLines(prev => [...prev, formatMessage(`(｀･ω･´) ${response}`, 'oomi')]);
      return;
    }

    if (command === '/ai/joke/') {
      const response = await callAnthropic("Tell a programming joke related to Justin's background", contextLocal);
      setLines(prev => [...prev, formatMessage(`(^‿^) ${response}`, 'oomi')]);
      return;
    }

    // Only save to Firestore if admin is authenticated
    if (!isMenuCommand) {
      const response = processCommand(command)
      setLines(prev => [...prev, formatMessage(command, 'USER', currentTag ? [currentTag] : []), response])
      
      // Only save to Firestore if admin
      if (isAdmin) {
        handleSavePost(command, currentTag ? [currentTag] : []);
      }
      
      setInput('')
      setCurrentTag('') 
    }
    setCommandIndex(-1)
  }, [processCommand, formatMessage, currentTag, handleSavePost, isAdmin]);

  // Update handleKeyDown to handle Vim commands properly
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (showTags || showEmotes || showStyles) return;

    if (isVimMode) {
      if (event.key === 'Escape') {
        if (!vimCommand) {
          event.preventDefault();
          setVimCommand(':');
        }
      } else if (vimCommand) {
        event.preventDefault();
        if (event.key === 'Enter') {
          const cmd = vimCommand.toLowerCase();
          if (cmd === ':w' || cmd === ':write') {
            // Add to terminal lines first
            setLines(prev => [...prev, formatMessage(editorContent, 'USER', currentTag ? [currentTag] : [])]);
            // Then save to database
            handleSavePost(editorContent, currentTag ? [currentTag] : []);
            setVimCommand('');
          } else if (cmd === ':q' || cmd === ':quit') {
            setIsVimMode(false);
            setVimCommand('');
            setEditorContent('');
          } else if (cmd === ':wq') {
            // Add to terminal lines first, then update state
            const formattedMessage = formatMessage(editorContent, 'USER', currentTag ? [currentTag] : []);
            setLines(prev => [...prev, formattedMessage]);
            handleSavePost(editorContent, currentTag ? [currentTag] : []);
            
            // Use a callback to ensure state updates happen in order
            setTimeout(() => {
              setIsVimMode(false);
              setVimCommand('');
              setEditorContent('');
              // Force scroll to bottom after state updates
              if (messagesRef.current) {
                messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
              }
            }, 0);
          }
        } else if (event.key === 'Escape') {
          setVimCommand('');
        } else if (event.key.length === 1) {
          setVimCommand(prev => prev + event.key);
        } else if (event.key === 'Backspace') {
          setVimCommand(prev => prev.slice(0, -1));
        }
      }
      return;
    }

    if (showEmotes) return

    if (event.key === 'Tab') {
      event.preventDefault()
      setCommandIndex(prev => {
        const nextIndex = prev + 1 >= MENU_COMMANDS.length ? 0 : prev + 1
        setInput('/' + MENU_COMMANDS[nextIndex].toLowerCase() + '/')
        return nextIndex
      })
    } else if (event.key === 'Enter') {
      const command = input.toLowerCase()
      if (command === '/style/') {
        setShowStyles(true)
        setInput('')
      } else if (command === '/emojis/') {
        setShowEmotes(true)
        setInput('')
      } else if (command === '/vi' || command === '/vim' || command === '/editor/') {
        setIsVimMode(true)
        setInput('')
      } else {
        handleCommand(command) // Only call handleCommand for non-menu commands
      }
      setCommandIndex(-1)
    } else if (event.key === 'Backspace') {
      setInput(prev => prev.slice(0, -1))
      if (input.length <= 1) {
        setCommandIndex(-1)
      }
    } else if (event.key.length === 1) {
      setInput(prev => prev + event.key)
      setCommandIndex(-1)  // Reset command index when typing
    }
  }, [
    input, 
    handleCommand, 
    showEmotes, 
    formatMessage, 
    isVimMode, 
    editorContent, 
    vimCommand, 
    showStyles, 
    showTags,
    handleSavePost
  ]);

  const handleEmoticonClick = (emoticon: string) => {
    setInput(prev => prev + emoticon + ' ')
    setShowEmotes(false)
    setSearchQuery('')
  }

  const handleSearchKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') {
      setShowEmotes(false)
      setSearchQuery('')
      setSelectedIndex(0)
      setPreviewText('')
      setIsPreviewConfirmed(false)
    } else if (event.key === 'Tab') {
      event.preventDefault()
      if (filteredEmoticons.length > 0) {
        if (event.shiftKey) {
          setSelectedIndex((prev) => 
            prev > 0 ? prev - 1 : filteredEmoticons.length - 1
          )
        } else {
          setSelectedIndex((prev) => 
            prev < filteredEmoticons.length - 1 ? prev + 1 : 0
          )
        }
        // Update preview text instead of search query
        setPreviewText(filteredEmoticons[selectedIndex].name)
        setIsPreviewConfirmed(false)
      }
    } else if (event.key === 'Enter') {
      event.preventDefault()
      if (filteredEmoticons.length > 0) {
        if (!isPreviewConfirmed) {
          // First enter: confirm the preview
          setSearchQuery(previewText)
          setIsPreviewConfirmed(true)
        } else {
          // Second enter: select the emoticon
          handleEmoticonClick(filteredEmoticons[selectedIndex].face)
          setPreviewText('')
          setIsPreviewConfirmed(false)
        }
      }
    }
  }

  // Reset preview when search query changes manually
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
    setPreviewText('')
    setIsPreviewConfirmed(false)
  }

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])

  useEffect(() => {
    if (showEmotes && searchInputRef.current) {
      searchInputRef.current.focus()
    }
  }, [showEmotes])

  const filteredEmoticons = EMOTICONS.filter(emoticon => 
    emoticon.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    emoticon.face.includes(searchQuery)
  )

  useEffect(() => {
    if (messagesRef.current) {
      messagesRef.current.scrollTop = messagesRef.current.scrollHeight
    }
  }, [lines, showEmotes])

  useEffect(() => {
    setSelectedIndex(0)
  }, [searchQuery, showEmotes])

  const getCaretPosition = () => {
    if (inputRef.current) {
      const rect = inputRef.current.getBoundingClientRect()
      const caretPos = inputRef.current.selectionStart || searchQuery.length
      const textBeforeCaret = searchQuery.substring(0, caretPos)
      const tempSpan = document.createElement('span')
      tempSpan.style.font = window.getComputedStyle(inputRef.current).font
      tempSpan.style.visibility = 'hidden'
      tempSpan.style.position = 'absolute'
      tempSpan.textContent = `/emojis/ ${textBeforeCaret}`
      document.body.appendChild(tempSpan)
      const caretX = tempSpan.getBoundingClientRect().width
      document.body.removeChild(tempSpan)
      return caretX
    }
    return 0
  }

  // Add helper function to check if text contains markdown
  const containsMarkdown = (text: string): boolean => {
    const markdownPatterns = [
      /\*\*(.*?)\*\*/,  // bold
      /\*(.*?)\*/,      // italic
      /\[(.*?)\]\((.*?)\)/, // links
      /```[\s\S]*?```/, // code blocks
      /#{1,6}\s/,       // headers
      /^\s*[-*+]\s/m,   // lists
      /^\s*\d+\.\s/m,   // numbered lists
    ]
    return markdownPatterns.some(pattern => pattern.test(text))
  }

  // Focus editor when entering Vim mode
  useEffect(() => {
    if (isVimMode && editorRef.current) {
      editorRef.current.focus()
    }
  }, [isVimMode])

  // Transform menu text based on current style
  const getStyledMenuText = (text: string) => {
    return text === 'STYLE' ? transformText(text.toLowerCase(), currentStyle) : text
  }

  // Add new handler for Vim editor emoticon clicks
  const handleVimEmoticonClick = (emoticon: string) => {
    if (editorRef.current) {
      const start = editorRef.current.selectionStart;
      const end = editorRef.current.selectionEnd;
      const newContent = editorContent.substring(0, start) + 
                        emoticon + ' ' + 
                        editorContent.substring(end);
      setEditorContent(newContent);
      
      // Set cursor position after emoticon
      setTimeout(() => {
        if (editorRef.current) {
          const newPosition = start + emoticon.length + 1;
          editorRef.current.selectionStart = newPosition;
          editorRef.current.selectionEnd = newPosition;
          editorRef.current.focus();
        }
      }, 0);
    }
    setShowEmotes(false);
    setSearchQuery('');
  };

  // Add new function for Vim style changes
  const handleVimStyleChange = (style: string) => {
    if (editorRef.current) {
      const start = editorRef.current.selectionStart;
      const end = editorRef.current.selectionEnd;
      const selectedText = editorContent.substring(start, end);
      
      if (selectedText) {
        // Transform selected text
        const transformedText = transformText(selectedText, style);
        const newContent = editorContent.substring(0, start) + 
                          transformedText + 
                          editorContent.substring(end);
        setEditorContent(newContent);
      } else {
        // If no text is selected, just set the style for future input
        setCurrentStyle(style);
      }
    }
    setShowStyles(false);
  };

  // Modify the editor onChange handler to apply current style
  const handleEditorChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newText = e.target.value
    const prevText = editorContent
    
    // Only transform the newly added text
    if (newText.length > prevText.length) {
      const diff = newText.length - prevText.length
      const newChars = newText.slice(-diff)
      const transformedChars = transformText(newChars, currentStyle)
      setEditorContent(newText.slice(0, -diff) + transformedChars)
    } else {
      setEditorContent(newText)
    }
  }

  // Update the TagMenu positioning and styling
  const TagMenu = () => (
    <div className="absolute bottom-[88px] left-0 right-0 bg-gray-100 border-t-2 border-gray-800 shadow-lg z-50">
      <div className="p-4">
        <input
          ref={tagInputRef}
          type="text"
          value={tagSearchQuery}
          onChange={(e) => setTagSearchQuery(e.target.value)}
          onKeyDown={(e) => {
            e.stopPropagation();
            if (e.key === 'Enter' && tagSearchQuery.trim()) {
              if (isCreatingTag) {
                handleCreateTag(tagSearchQuery.trim());
                setTagSearchQuery('');
              }
            } else if (e.key === 'Escape') {
              setShowTags(false);
              setTagSearchQuery('');
            }
          }}
          placeholder={isCreatingTag ? "Type new tag name and press Enter..." : "Search tags..."}
          className="w-full p-2 border border-gray-300 rounded"
          autoFocus
        />
      </div>
      
      <div className="p-4 max-h-[300px] overflow-y-auto">
        {currentTag && (
          <button
            onClick={() => {
              setCurrentTag('');
              setTagSearchQuery('');
              setShowTags(false);
            }}
            className="w-full p-2 text-left hover:bg-gray-200 text-red-600 mb-2 border-b border-gray-200"
          >
            [x] Remove #{currentTag}
          </button>
        )}
        
        {tags.length === 0 || isCreatingTag ? (
          <div className="text-gray-600">
            {isCreatingTag ? 
              "Type your new tag name above..." : 
              <button
                onClick={() => setIsCreatingTag(true)}
                className="w-full p-2 text-left hover:bg-gray-200"
              >
                Create your first tag...
              </button>
            }
          </div>
        ) : (
          <>
            {tags
              .filter(tag => tag.name.includes(tagSearchQuery.toLowerCase()))
              .map(tag => (
                <button
                  key={tag.id}
                  onClick={() => {
                    setCurrentTag(tag.name);
                    setShowTags(false);
                    setTagSearchQuery('');
                  }}
                  className={`w-full p-2 text-left hover:bg-gray-200 ${
                    currentTag === tag.name ? 'bg-gray-200' : ''
                  }`}
                >
                  #{tag.name}
                </button>
              ))
            }
            {isCreatingTag ? null : (
              <button
                onClick={() => setIsCreatingTag(true)}
                className="w-full p-2 text-left hover:bg-gray-200 text-gray-600 mt-2 border-t border-gray-200"
              >
                + Create new tag...
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );

  // Update menu buttons to use handleCommand
  const MenuButtons = () => (
    <div className="grid grid-cols-5 gap-2 w-full">
      {MENU_COMMANDS.map((button) => (
        <button
          key={button}
          onClick={() => {
            const command = `/${button.toLowerCase()}/`;
            handleCommand(command, true);
          }}
          className={`w-full px-2 py-1 text-gray-800 text-xs font-mono focus:outline-none 
                   flex items-center justify-center ${
                     (button === 'STYLE' && showStyles) ||
                     (button === 'EMOJIS' && showEmotes) ||
                     (button === 'TAG' && showTags)
                       ? 'bg-gray-200'
                       : ''
                   }`}
        >
          [{getStyledMenuText(button)}]
        </button>
      ))}
    </div>
  );

  // Update the CurrentAnimation component to only show if there's content
  const CurrentAnimation = () => {
    if (!currentAnimation.text || !currentAnimation.frame) return null;
    
    return (
      <div className="mb-4 font-mono animate-fade-in">
        {formatMessage(`${currentAnimation.frame} ${currentAnimation.text}`, 'oomi')}
      </div>
    );
  };

  // Update AIMenu component to handle async commands
  const AIMenu = () => (
    <div className="absolute bottom-[64px] left-0 right-0 bg-gray-100 max-h-[400px] flex flex-col font-mono border-t-2 border-gray-800">
      <div className="p-4 overflow-y-auto flex-1">
        <div className="grid grid-cols-1 gap-4">
          {AI_COMMANDS.map((cmd) => (
            <button
              key={cmd.command}
              onClick={async () => {
                setSelectedAICommand(cmd.command);
                setShowAI(false);
                
                // Show thinking animation
                const thinkingAnim = getDanceAnimation('*processing command*');
                setCurrentAnimation({
                  text: thinkingAnim.text,
                  frame: thinkingAnim.frames[0],
                  messageIndex: 0,
                  frameIndex: 0
                });

                if (cmd.command === 'help') {
                  const response = await callAnthropic("List available commands and what they do", contextLocal);
                  setLines(prev => [...prev, formatMessage(`(｀･ω･´) ${response}`, 'oomi')]);
                } else if (cmd.command === 'joke') {
                  const response = await callAnthropic("Tell a programming joke related to Justin's background", contextLocal);
                  setLines(prev => [...prev, formatMessage(`(^‿^) ${response}`, 'oomi')]);
                } else if (cmd.command === 'ask') {
                  setLines(prev => [...prev, 
                    formatMessage(`(｡♥‿♥｡) What would you like to know? Type your question after /ask/`, 'oomi')
                  ]);
                }

                // Clear thinking animation
                setCurrentAnimation({
                  text: '',
                  frame: '',
                  messageIndex: 0,
                  frameIndex: 0
                });
              }}
              className="p-4 text-left hover:bg-gray-200 rounded-lg transition-colors flex items-center space-x-4"
            >
              <div className="flex-1">
                <div className="text-lg font-bold">/{cmd.command}/</div>
                <div className="text-sm text-gray-600">{cmd.description}</div>
              </div>
              <div className="text-gray-400">→</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  // Add useEffect to handle viewport adjustments
  useEffect(() => {
    // Prevent viewport adjustments when keyboard appears
    const meta = document.createElement('meta');
    meta.name = 'viewport';
    meta.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover, height=' + window.innerHeight;
    document.head.appendChild(meta);

    // Prevent scroll on body when keyboard opens
    const handleFocus = () => {
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';
    };

    const handleBlur = () => {
      document.body.style.position = '';
      document.body.style.width = '';
    };

    if (inputRef.current) {
      inputRef.current.addEventListener('focus', handleFocus);
      inputRef.current.addEventListener('blur', handleBlur);
    }

    return () => {
      document.head.removeChild(meta);
      if (inputRef.current) {
        inputRef.current.removeEventListener('focus', handleFocus);
        inputRef.current.removeEventListener('blur', handleBlur);
      }
    };
  }, []);

  return (
    <div className="flex flex-col justify-start items-center w-full">
      <div 
        className="w-full max-w-[800px] flex flex-col relative terminal-text"
        style={{
          height: window.innerWidth <= 768 ? 'calc(75vh - 200px)' : 'calc(100vh - 200px)',
          minHeight: window.innerWidth <= 768 ? '180px' : '400px',
          maxHeight: window.innerWidth <= 768 ? 'calc(75vh - 200px)' : 'calc(100vh - 180px)',
        }}
      >
        {isVimMode ? (
          <div className="flex-1 flex flex-col bg-gray-100">
            <div className="flex-1 flex">
              {/* Vim Editor */}
              <div className="w-1/2 h-full border-r border-gray-800 relative">
                <textarea
                  ref={editorRef}
                  value={editorContent}
                  onChange={handleEditorChange}
                  className="w-full h-full p-4 bg-gray-100 text-gray-800 resize-none focus:outline-none font-mono text-sm"
                  placeholder="// Enter markdown text here..."
                  spellCheck="false"
                  style={{ zIndex: showEmotes || showStyles || showTags ? 0 : 1 }}
                />
                {vimCommand && (
                  <div className="absolute bottom-0 left-0 right-0 bg-gray-100 text-gray-800 p-2 border-t border-gray-700 font-mono">
                    {vimCommand}
                    <span className="animate-pulse">█</span>
                  </div>
                )}

                {/* Show menus in editor when active */}
                {showTags && <TagMenu />}
                
                {/* Style menu in editor */}
                {showStyles && (
                  <div className="absolute top-0 left-0 right-0 bg-gray-100 max-h-[400px] flex flex-col font-mono border-t-2 border-gray-800">
                    <div className="p-4 overflow-y-auto flex-1">
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                        {FONT_STYLES.map((style) => (
                          <button
                            key={style.name}
                            onClick={() => {
                              if (isVimMode) {
                                handleVimStyleChange(style.name);
                              } else {
                                setCurrentStyle(style.name);
                              }
                              setShowStyles(false);
                            }}
                            className={`flex flex-col items-center p-4 hover:bg-gray-200 rounded-lg transition-colors ${
                              currentStyle === style.name ? 'bg-gray-200' : ''
                            }`}
                          >
                            <span className="text-lg mb-2">{style.style}</span>
                            <span className="text-sm text-gray-600">{style.name}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Emoticon menu in editor */}
                {showEmotes && (
                  <div className="absolute top-0 left-0 right-0 bg-gray-100 max-h-[400px] flex flex-col font-mono border-t-2 border-gray-800">
                    <div className="p-4">
                      <input
                        ref={searchInputRef}
                        type="text"
                        value={searchQuery}
                        onChange={handleSearchChange}
                        onKeyDown={handleSearchKeyDown}
                        placeholder="Search emoticons..."
                        className="w-full p-2 border border-gray-300 rounded"
                        autoFocus
                      />
                    </div>
                    <div className="p-4 overflow-y-auto flex-1">
                      <div className="grid grid-cols-3 gap-6">
                        {filteredEmoticons.map((emoticon, index) => (
                          <button
                            key={emoticon.face}
                            onClick={() => {
                              if (isVimMode) {
                                handleVimEmoticonClick(emoticon.face);
                              } else {
                                handleEmoticonClick(emoticon.face);
                              }
                            }}
                            className={`flex flex-col items-center ${
                              index === selectedIndex ? 'bg-gray-200 rounded-lg' : ''
                            }`}
                          >
                            <span className="text-2xl mb-2">{emoticon.face}</span>
                            <span className="text-sm">{emoticon.name}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Markdown Preview */}
              <div className="w-1/2 h-full overflow-auto bg-white font-mono relative">
                {currentTag && (
                  <div className="sticky top-0 bg-gray-100 p-2 text-sm text-gray-600 border-b border-gray-200">
                    Tagged as: #{currentTag}
                  </div>
                )}
                <div className="p-4">
                  <ReactMarkdown 
                    className="prose prose-sm max-w-none"
                    components={{
                      p: ({children}) => <div className="my-2">{children}</div>,
                      code: ({inline, children}) => {
                        if (inline) {
                          return <code className="font-mono text-sm">{children}</code>
                        }
                        return (
                          <pre className="bg-gray-100 p-2 rounded my-2 overflow-x-auto">
                            <code className="font-mono text-sm">{children}</code>
                          </pre>
                        )
                      },
                      ul: ({children}) => <ul className="list-disc ml-4 my-2">{children}</ul>,
                      ol: ({children}) => <ol className="list-decimal ml-4 my-2">{children}</ol>,
                      blockquote: ({children}) => (
                        <blockquote className="border-l-4 border-gray-300 pl-4 my-2 italic">{children}</blockquote>
                      ),
                      h1: ({children}) => <h1 className="text-xl font-bold my-3">{children}</h1>,
                      h2: ({children}) => <h2 className="text-lg font-bold my-2">{children}</h2>,
                      h3: ({children}) => <h3 className="text-base font-bold my-2">{children}</h3>,
                      a: ({href, children}) => (
                        <a href={href} className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">
                          {children}
                        </a>
                      ),
                    }}
                  >
                    {editorContent}
                  </ReactMarkdown>
                </div>
              </div>
            </div>

            {/* Menu Bar - Moved outside the flex container */}
            <div className="bg-gray-100 px-3 sm:px-4 py-2 sm:py-3 border-t-2 border-gray-800 sticky bottom-0 z-50">
              <div className="grid grid-cols-5 gap-2 w-full max-w-[800px] mx-auto">
                {MENU_COMMANDS.map((button) => (
                  <button
                    key={button}
                    onClick={() => {
                      const command = `/${button.toLowerCase()}/`;
                      handleCommand(command, true);
                    }}
                    className={`w-full px-2 py-1 text-gray-800 text-xs font-mono focus:outline-none 
                             flex items-center justify-center ${
                               (button === 'STYLE' && showStyles) ||
                               (button === 'EMOJIS' && showEmotes) ||
                               (button === 'TAG' && showTags)
                                 ? 'bg-gray-200'
                                 : ''
                               }`}
                  >
                    [{getStyledMenuText(button)}]
                  </button>
                ))}
              </div>
            </div>

            {/* Vim status line */}
            <div className="bg-gray-700 text-white px-4 py-1 font-mono text-sm">
              {vimCommand || 'Press : for commands -- :w (write) :q (quit) :wq (write & quit)'}
            </div>
          </div>
        ) : (
          <div className="flex flex-col h-full relative">
            <div 
              ref={messagesRef}
              className="flex-1 overflow-auto overscroll-contain p-4 sm:p-6 text-sm sm:text-base text-gray-800 font-mono bg-gray-100"
            >
              <MemoizedMessages lines={lines} messagesRef={messagesRef} />
            </div>

            {/* Menus - Moved above the input container */}
            {showStyles && (
              <div className="absolute bottom-[88px] left-0 right-0 bg-gray-100 border-t-2 border-gray-800 shadow-lg z-50">
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 p-4">
                  {FONT_STYLES.map((style) => (
                    <button
                      key={style.name}
                      onClick={() => {
                        setCurrentStyle(style.name);
                        setShowStyles(false);
                      }}
                      className={`px-2 py-1 text-gray-800 text-sm font-mono hover:bg-gray-200 focus:outline-none
                                 ${currentStyle === style.name ? 'bg-gray-200' : ''}`}
                    >
                      {style.style}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {showEmotes && (
              <div className="absolute bottom-[88px] left-0 right-0 bg-gray-100 border-t-2 border-gray-800 shadow-lg z-50">
                <div className="p-4">
                  <input
                    ref={searchInputRef}
                    type="text"
                    value={searchQuery}
                    onChange={handleSearchChange}
                    onKeyDown={handleSearchKeyDown}
                    placeholder="Search emoticons..."
                    className="w-full p-2 border border-gray-300 rounded"
                    autoFocus
                  />
                </div>
                <div className="p-4 grid grid-cols-3 gap-6 max-h-[300px] overflow-y-auto">
                  {filteredEmoticons.map((emoticon, index) => (
                    <button
                      key={emoticon.face}
                      onClick={() => handleEmoticonClick(emoticon.face)}
                      className={`flex flex-col items-center ${
                        index === selectedIndex ? 'bg-gray-200 rounded-lg p-2' : 'p-2'
                      }`}
                    >
                      <span className="text-2xl mb-2">{emoticon.face}</span>
                      <span className="text-sm">{emoticon.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div 
              style={{ 
                position: window.innerWidth <= 768 ? 'fixed' : 'sticky',
                bottom: window.innerWidth <= 768 ? (isInputFocused ? '50%' : '0') : '0',
                left: window.innerWidth <= 768 ? '0' : 'auto',
                right: window.innerWidth <= 768 ? '0' : 'auto',
                background: 'white',
                zIndex: 40,
                borderTop: '1px solid #ccc',
                width: '100%',
                maxWidth: '800px',
                margin: '0 auto',
                transition: 'bottom 0.3s ease-in-out'
              }}
            >
              <div className="border-t-2 border-gray-800 bg-gray-100 p-3 sm:p-4 font-mono">
                <div className="text-gray-800 flex items-center min-h-[44px] relative">
                  <div className="text-sm sm:text-base w-full">{getInputDisplay()}</div>
                  <input
                    ref={inputRef}
                    type="text"
                    value={input}
                    onChange={(e) => {
                      const newValue = e.target.value;
                      const lastChar = newValue[newValue.length - 1];
                      const prevChar = input[input.length - 1];
                      
                      // Prevent duplicate characters for both mobile and desktop
                      if (newValue === input + prevChar) {
                        return;
                      }
                      
                      setInput(newValue);
                      setIsInputFocused(newValue.length > 0);
                    }}
                    onFocus={() => setIsInputFocused(true)}
                    onBlur={() => setIsInputFocused(false)}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-text"
                    autoComplete="off"
                    autoCorrect="off"
                    autoCapitalize="off"
                    spellCheck="false"
                  />
                  <span className="animate-pulse ml-1">_</span>
                </div>
              </div>

              {/* Menu Bar */}
              <div className="bg-gray-100 px-3 sm:px-4 py-2 sm:py-3 border-t-2 border-gray-800">
                <div className="grid grid-cols-5 gap-2 w-full max-w-[800px] mx-auto">
                  {MENU_COMMANDS.map((button) => (
                    <button
                      key={button}
                      onClick={() => {
                        const command = `/${button.toLowerCase()}/`;
                        handleCommand(command, true);
                      }}
                      className={`w-full px-2 py-1 text-gray-800 text-xs font-mono focus:outline-none 
                               flex items-center justify-center ${
                                 (button === 'STYLE' && showStyles) ||
                                 (button === 'EMOJIS' && showEmotes) ||
                                 (button === 'TAG' && showTags)
                                   ? 'bg-gray-200'
                                   : ''
                                 }`}
                    >
                      [{getStyledMenuText(button)}]
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {showTags && <TagMenu />}
            {showAI && <AIMenu />}
          </div>
        )}
      </div>
    </div>
  )
}
