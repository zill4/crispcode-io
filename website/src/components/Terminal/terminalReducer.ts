export interface TerminalState {
  // Input and display
  input: string;
  lines: string[];

  // Modes and menus
  isVimMode: boolean;
  showEmotes: boolean;
  showStyles: boolean;
  showTags: boolean;
  showAI: boolean;

  // Editor state
  editorContent: string;
  vimCommand: string;
  currentStyle: string;

  // Tags and data
  tags: Array<{
    id: string;
    name: string;
    createdAt: Date;
    createdBy: string;
  }>;
  currentTag: string;

  // Search and selection
  searchQuery: string;
  selectedIndex: number;

  // Animation and status
  currentAnimation: {
    text: string;
    frame: string;
    messageIndex: number;
    frameIndex: number;
  };

  // Admin and auth
  isAdmin: boolean;
}

export type TerminalAction =
  | { type: "SET_INPUT"; payload: string }
  | { type: "ADD_LINE"; payload: string }
  | { type: "SET_LINES"; payload: string[] }
  | { type: "TOGGLE_VIM_MODE" }
  | { type: "TOGGLE_EMOTES" }
  | { type: "TOGGLE_STYLES" }
  | { type: "TOGGLE_TAGS" }
  | { type: "TOGGLE_AI" }
  | { type: "SET_EDITOR_CONTENT"; payload: string }
  | { type: "SET_VIM_COMMAND"; payload: string }
  | { type: "SET_CURRENT_STYLE"; payload: string }
  | { type: "SET_TAGS"; payload: TerminalState["tags"] }
  | { type: "SET_CURRENT_TAG"; payload: string }
  | { type: "SET_SEARCH_QUERY"; payload: string }
  | { type: "SET_SELECTED_INDEX"; payload: number }
  | { type: "SET_ANIMATION"; payload: TerminalState["currentAnimation"] }
  | { type: "SET_ADMIN"; payload: boolean }
  | { type: "CLOSE_ALL_MENUS" };

export const initialState: TerminalState = {
  input: "",
  lines: ["(｡♥‿♥｡) Welcome! /ask/ me anything..."],
  isVimMode: false,
  showEmotes: false,
  showStyles: false,
  showTags: false,
  showAI: false,
  editorContent: "",
  vimCommand: "",
  currentStyle: "normal",
  tags: [],
  currentTag: "",
  searchQuery: "",
  selectedIndex: 0,
  currentAnimation: {
    text: "",
    frame: "",
    messageIndex: 0,
    frameIndex: 0,
  },
  isAdmin: false,
};

export function terminalReducer(
  state: TerminalState,
  action: TerminalAction
): TerminalState {
  switch (action.type) {
    case "SET_INPUT":
      return { ...state, input: action.payload };

    case "ADD_LINE":
      return { ...state, lines: [...state.lines, action.payload] };

    case "SET_LINES":
      return { ...state, lines: action.payload };

    case "TOGGLE_VIM_MODE":
      return { ...state, isVimMode: !state.isVimMode };

    case "TOGGLE_EMOTES":
      return {
        ...state,
        showEmotes: !state.showEmotes,
        showStyles: false,
        showTags: false,
        showAI: false,
      };

    case "TOGGLE_STYLES":
      return {
        ...state,
        showStyles: !state.showStyles,
        showEmotes: false,
        showTags: false,
        showAI: false,
      };

    case "TOGGLE_TAGS":
      return {
        ...state,
        showTags: !state.showTags,
        showEmotes: false,
        showStyles: false,
        showAI: false,
      };

    case "TOGGLE_AI":
      return {
        ...state,
        showAI: !state.showAI,
        showEmotes: false,
        showStyles: false,
        showTags: false,
      };

    case "SET_EDITOR_CONTENT":
      return { ...state, editorContent: action.payload };

    case "SET_VIM_COMMAND":
      return { ...state, vimCommand: action.payload };

    case "SET_CURRENT_STYLE":
      return { ...state, currentStyle: action.payload };

    case "SET_TAGS":
      return { ...state, tags: action.payload };

    case "SET_CURRENT_TAG":
      return { ...state, currentTag: action.payload };

    case "SET_SEARCH_QUERY":
      return { ...state, searchQuery: action.payload };

    case "SET_SELECTED_INDEX":
      return { ...state, selectedIndex: action.payload };

    case "SET_ANIMATION":
      return { ...state, currentAnimation: action.payload };

    case "SET_ADMIN":
      return { ...state, isAdmin: action.payload };

    case "CLOSE_ALL_MENUS":
      return {
        ...state,
        showEmotes: false,
        showStyles: false,
        showTags: false,
        showAI: false,
      };

    default:
      return state;
  }
}
