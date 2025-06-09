import React, { useState, useEffect, useRef, useReducer } from "react";
import {
  TerminalState,
  TerminalAction,
  initialState,
  terminalReducer,
} from "./terminalReducer";
import { VimEditor } from "./VimEditor";
import { MessageDisplay } from "./MessageDisplay";
import { InputSection } from "./InputSection";
import { MenuBar } from "./MenuBar";
import { useFetchData } from "./hooks/useFetchData";
import { useTerminalCommands } from "./hooks/useTerminalCommands";

export default function Terminal() {
  const [state, dispatch] = useReducer(terminalReducer, initialState);
  const messagesRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Custom hooks for data and commands
  useFetchData(dispatch);
  const { handleCommand } = useTerminalCommands(state, dispatch);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (messagesRef.current) {
      messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
    }
  }, [state.lines]);

  return (
    <div className="flex flex-col w-full h-full max-w-[800px] mx-auto">
      {state.isVimMode ? (
        <VimEditor
          state={state}
          dispatch={dispatch}
          onCommand={handleCommand}
        />
      ) : (
        <div className="flex flex-col h-full">
          <MessageDisplay
            lines={state.lines}
            messagesRef={messagesRef}
            currentAnimation={state.currentAnimation}
          />

          <InputSection
            input={state.input}
            currentTag={state.currentTag}
            dispatch={dispatch}
            inputRef={inputRef}
            onCommand={handleCommand}
          />

          <MenuBar
            state={state}
            dispatch={dispatch}
            onCommand={handleCommand}
          />
        </div>
      )}
    </div>
  );
}
