# Reply System Documentation

The Reply system enables users to communicate with document senders through a threaded conversation interface. This system handles both user replies and responses from Zendesk agents.

## 🏗️ System Architecture

```
ReplyContainer (Main orchestrator)
├── ReplyHeader (User info & metadata)
├── ReplySent (Display sent messages)
├── ReplyForm (Input & submission)
└── Mobile/ (Mobile-optimized components)
```

## 📦 Components

### ReplyContainer

**Purpose**: Main orchestrator that manages the entire reply flow and state  
**Key Features**:

- Handles reply thread state management
- Manages first-time vs. subsequent reply logic
- Controls visibility of reply form and messages
- Fetches and displays conversation history

### ReplyHeader

**Purpose**: Displays user information, timestamps, and metadata  
**Key Features**:

- Shows user avatar and initials
- Displays sender/receiver information
- Handles case number copying
- Mobile-responsive header layout

### ReplySent

**Purpose**: Displays sent reply messages with optional confirmation  
**Key Features**:

- Shows reply body content with preserved formatting
- Displays intro message for first-time replies
- Handles loading states during submission

### ReplyForm

**Purpose**: Input form for composing and submitting replies  
**Key Features**:

- Form validation and submission
- Email requirement handling
- Character limits and formatting
- Integration with reply mutations

## 🔄 Reply Flow

### 1. Initial State

- User views document with replyable capability
- Reply button is displayed if `documentLine.replyable` is true

### 2. First-Time Reply

- User clicks reply button
- Form opens with user details pre-filled
- Upon submission, intro message is shown with confirmation details
- Reply is added to conversation thread

### 3. Subsequent Replies

- User clicks reply button on existing conversation
- Form opens (no intro message on submission)
- Reply is added to existing thread

### 4. Agent Responses

- Zendesk agents can respond to user replies
- Agent responses are marked with `isZendeskAgent: true`
- Agent responses appear in the conversation thread

## 🎛️ State Management

### ReplyState Interface

```typescript
interface ReplyState {
  replyable: boolean // Can user reply to this document
  replyOpen: boolean // Is reply form currently open
  replies: Reply // Conversation thread data
  sentReply?: SentReply // Most recent sent reply
  closedForMoreReplies: boolean // Is conversation closed
}
```

### Key State Logic

- **First-time detection**: Checks if user has any previous non-agent replies
- **Form visibility**: Controlled by `replyOpen` state
- **Thread management**: Handles expanding/collapsing reply history
- **Loading states**: Manages submission and fetching states

## 🎨 UI Behavior

### Desktop

- Full reply thread displayed
- Expandable conversation history (shows more than 4 replies)
- Side-by-side user info and reply content

### Mobile

- Condensed reply thread (shows more than 2 replies)
- Stacked layout for better mobile experience
- Optimized header and form layouts

## 🔧 Usage Examples

### Basic Implementation

```tsx
// In document view
{
  documentLine.replyable && <ReplyContainer />
}
```

### With Document Context

```tsx
const { replyState, setReplyState } = useDocumentContext()

// Reply state is managed at document context level
// Individual components access state through context
```

## 📋 Key Features

### ✅ Conversation Threading

- Maintains chronological order of replies
- Separates user replies from agent responses
- Preserves reply formatting and timestamps

### ✅ First-Time Reply Detection

- Shows confirmation message only on first reply
- Tracks user's reply history per document
- Filters out agent replies from user count

### ✅ Responsive Design

- Mobile-optimized layouts in `Mobile/` folder
- Adaptive reply thread display
- Touch-friendly form controls

### ✅ Email Integration

- Requires valid email for reply submission
- Sends email confirmations to users
- Displays email addresses in reply headers

### ✅ Loading States

- Visual feedback during reply submission
- Loading indicators for form processing
- Handles network errors gracefully

## 🚀 Integration Points

### Document Context

- Integrates with `useDocumentContext()` hook
- Shares state with document viewing system
- Handles document-specific reply permissions

### GraphQL Queries

- `useGetDocumentTicketQuery` - Fetches conversation data
- `useReplyMutation` - Submits new replies
- Handles caching and refetching automatically

### User Management

- Integrates with `useUserInfo()` and `useUserProfile()`
- Handles user authentication state
- Manages user email requirements
