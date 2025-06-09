import React, { useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import { TerminalState, TerminalAction } from "./terminalReducer";

interface VimEditorProps {
  state: TerminalState;
  dispatch: React.Dispatch<TerminalAction>;
  onCommand: (command: string) => void;
}

export function VimEditor({ state, dispatch, onCommand }: VimEditorProps) {
  const editorRef = useRef<HTMLTextAreaElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);

  // Focus editor when entering Vim mode
  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.focus();
    }
  }, []);

  // Handle vim commands
  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Escape") {
      if (!state.vimCommand) {
        event.preventDefault();
        dispatch({ type: "SET_VIM_COMMAND", payload: ":" });
      }
    } else if (state.vimCommand) {
      event.preventDefault();
      if (event.key === "Enter") {
        const cmd = state.vimCommand.toLowerCase();
        if (cmd === ":w" || cmd === ":write") {
          onCommand(`save:${state.editorContent}`);
          dispatch({ type: "SET_VIM_COMMAND", payload: "" });
        } else if (cmd === ":q" || cmd === ":quit") {
          dispatch({ type: "TOGGLE_VIM_MODE" });
          dispatch({ type: "SET_VIM_COMMAND", payload: "" });
          dispatch({ type: "SET_EDITOR_CONTENT", payload: "" });
        } else if (cmd === ":wq") {
          onCommand(`save:${state.editorContent}`);
          setTimeout(() => {
            dispatch({ type: "TOGGLE_VIM_MODE" });
            dispatch({ type: "SET_VIM_COMMAND", payload: "" });
            dispatch({ type: "SET_EDITOR_CONTENT", payload: "" });
          }, 100);
        }
      } else if (event.key === "Escape") {
        dispatch({ type: "SET_VIM_COMMAND", payload: "" });
      } else if (event.key.length === 1) {
        dispatch({
          type: "SET_VIM_COMMAND",
          payload: state.vimCommand + event.key,
        });
      } else if (event.key === "Backspace") {
        dispatch({
          type: "SET_VIM_COMMAND",
          payload: state.vimCommand.slice(0, -1),
        });
      }
    }
  };

  const handleEditorChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    dispatch({ type: "SET_EDITOR_CONTENT", payload: e.target.value });
  };

  return (
    <div className="flex-1 flex flex-col bg-gray-100" onKeyDown={handleKeyDown}>
      {/* Mobile: Stack vertically, Desktop: Side by side */}
      <div className="flex-1 flex flex-col lg:flex-row">
        {/* Editor Section */}
        <div className="w-full lg:w-1/2 h-64 lg:h-full border-b lg:border-b-0 lg:border-r border-gray-800 relative">
          <div className="h-full flex flex-col">
            {/* Current tag indicator */}
            {state.currentTag && (
              <div className="bg-gray-200 p-2 text-sm text-gray-600 border-b border-gray-300">
                Tagged as: #{state.currentTag}
              </div>
            )}

            {/* Editor textarea with proper scrolling */}
            <textarea
              ref={editorRef}
              value={state.editorContent}
              onChange={handleEditorChange}
              className="flex-1 w-full p-4 bg-gray-100 text-gray-800 resize-none focus:outline-none font-mono text-sm overflow-y-auto"
              placeholder="// Enter markdown text here..."
              spellCheck="false"
            />

            {/* Vim command line */}
            {state.vimCommand && (
              <div className="bg-gray-100 text-gray-800 p-2 border-t border-gray-700 font-mono text-sm">
                {state.vimCommand}
                <span className="animate-pulse">█</span>
              </div>
            )}
          </div>
        </div>

        {/* Preview Section with proper scrolling */}
        <div className="w-full lg:w-1/2 h-64 lg:h-full bg-white relative overflow-hidden">
          <div ref={previewRef} className="h-full overflow-y-auto p-4">
            <div className="prose prose-sm max-w-none">
              <ReactMarkdown
                components={{
                  // Mobile-optimized components
                  p: ({ children }) => (
                    <div className="my-2 break-words">{children}</div>
                  ),
                  code: ({ node, className, children, ...props }) => {
                    const isInline = !className?.includes("language-");
                    if (isInline) {
                      return (
                        <code
                          className="bg-gray-200 px-1 rounded font-mono text-sm break-words"
                          {...props}
                        >
                          {children}
                        </code>
                      );
                    }
                    return (
                      <pre className="bg-gray-100 p-2 rounded my-2 overflow-x-auto text-sm">
                        <code className="font-mono break-words" {...props}>
                          {children}
                        </code>
                      </pre>
                    );
                  },
                  ul: ({ children }) => (
                    <ul className="list-disc ml-4 my-2">{children}</ul>
                  ),
                  ol: ({ children }) => (
                    <ol className="list-decimal ml-4 my-2">{children}</ol>
                  ),
                  h1: ({ children }) => (
                    <h1 className="text-xl font-bold my-3 break-words">
                      {children}
                    </h1>
                  ),
                  h2: ({ children }) => (
                    <h2 className="text-lg font-bold my-2 break-words">
                      {children}
                    </h2>
                  ),
                  h3: ({ children }) => (
                    <h3 className="text-base font-bold my-2 break-words">
                      {children}
                    </h3>
                  ),
                  blockquote: ({ children }) => (
                    <blockquote className="border-l-4 border-gray-300 pl-4 my-2 italic break-words">
                      {children}
                    </blockquote>
                  ),
                  a: ({ href, children }) => (
                    <a
                      href={href}
                      className="text-blue-600 hover:underline break-words"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {children}
                    </a>
                  ),
                  img: ({ src, alt }) => (
                    <img
                      src={src}
                      alt={alt}
                      className="max-w-full h-auto rounded my-4"
                      loading="lazy"
                    />
                  ),
                }}
              >
                {state.editorContent}
              </ReactMarkdown>
            </div>
          </div>
        </div>
      </div>

      {/* Vim status line */}
      <div className="bg-gray-700 text-white px-4 py-2 font-mono text-sm">
        {state.vimCommand ||
          "Press : for commands -- :w (write) :q (quit) :wq (write & quit)"}
      </div>
    </div>
  );
}
