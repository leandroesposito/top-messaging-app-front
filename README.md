# Chat Application Frontend

A modern, single-page chat application featuring smart polling, automatic token refresh, and permission-based messaging. Built with React and Vite for a responsive, real-time chat experience without WebSockets.

## Related Links

- **Backend API Repository**: [https://github.com/leandroesposito/top-messaging-app-server](https://github.com/leandroesposito/top-messaging-app-server)
- **Live Demo**: [https://top-messaging-app-front.netlify.app/](https://top-messaging-app-front.netlify.app/)

## Key Features

- **Smart Polling System**: Dynamic polling intervals (2.5s/5s/30s) based on user activity and tab visibility
- **Auto Token Refresh**: Race condition prevention with intelligent cooldown mechanism
- **Permission-Based Messaging**: First-message restrictions for non-friends
- **Friend Code System**: Add friends via unique codes
- **Group Management**: Owner-only controls for member management and group editing
- **Online/Offline Indicators**: Real-time status with beforeunload event handling
- **Unread Message Tracking**: Count messages you haven't read yet
- **Collapsible UI**: Expand/collapse chat list for more message space
- **Fully Responsive Design**: Adapts seamlessly to all screen sizes and devices including desktop, tablet, and mobile phones

## Tech Stack

- **Framework**: React 18 (SPA without routing)
- **Build Tool**: Vite
- **Styling**: Plain CSS with CSS modules
- **Icons**: Lucide React
- **HTTP Client**: Native Fetch API
- **State Management**: Component-level state with custom hooks
- **Validation**: HTML5 Constraint Validation API

## Project Structure

seguir aca

```
src/
├── components/
│   ├── FlashMessage/         # Auto-dismissing notification system
│   ├── Form/                 # Reusable form validation components
│   │   ├── FormRow.jsx       # Wrapper with validation display
│   │   ├── FormValidation.js # Validation helper functions
│   ├── Header/               # App header with user menu
│   ├── Loading/              # Loading spinner component
│   ├── LogIn/                # Login form
│   ├── SignUp/               # Registration form
│   ├── SignedUserScreen/     # Main authenticated interface
│   │   ├── Chats/            # Chat list management
│   │   │   ├── ChatsPanel.jsx
│   │   │   ├── PrivateChats.jsx
│   │   │   ├── GroupChats.jsx
│   │   │   ├── AddFriend/    # Friend code form
│   │   │   └── JoinGroup/    # Group invite code form
│   │   └── MainPanel/        # Active chat area
│   │       ├── ChatContainer/    # Message display
│   │       ├── ChatHeader/       # Chat info & actions
│   │       ├── Dialog/           # Modal dialogs
│   │       │   ├── MyProfileDialog/  # Profile edit form
│   │       │   ├── ProfileDialog/
│   │       │   ├── PasswordDialog/   # Change password form
│   │       │   └── GroupDialog/  # Group management
│   │       └── NewMessageForm/   # Message input
│   └── UnsignedUserScreen/   # Unauthenticated landing
├── hooks/
│   └── useFetch.js           # API abstraction with auto-refresh
└── session/
    └── sessionManager.js     # Token storage & refresh logic
```

## Smart Polling Strategy

Instead of WebSockets, the app uses intelligent polling that adapts to user behavior:

| User State   | Polling Interval | Rationale                          |
| ------------ | ---------------- | ---------------------------------- |
| Active tab   | 2.5 seconds      | Real-time feel when actively using |
| Idle/Blurred | 5 seconds        | Reduced updates when not focused   |
| Hidden tab   | 30 seconds       | Minimal updates to save resources  |

### Implementation Example

```javascript
useEffect(() => {
  const getMessages = () => {
    if (currentChat.type === "group") {
      makeRequest(`/groups/${currentChat.id}/messages`, "GET", true);
    } else {
      makeRequest(`/messages/${currentChat.id}`, "GET", true);
    }
  };

  const updateInterval = () => {
    if (document.hidden) {
      schedule(hiddenInterval); // 30 seconds
    } else if (!document.hasFocus()) {
      schedule(idleInterval); // 5 seconds
    } else {
      schedule(pollInterval); // 2.5 seconds
    }
  };

  // Listen to visibility and focus changes
  document.addEventListener("visibilitychange", updateInterval);
  window.addEventListener("focus", updateInterval);
  window.addEventListener("blur", updateInterval);
}, [currentChat]);
```

This approach balances real-time communication with resource efficiency, making it perfect for demonstration.

## Token Refresh System

The app implements a sophisticated token refresh mechanism with race condition prevention:

### Features

- **Cooldown Protection**: Prevents multiple simultaneous refresh requests (10 second cooldown)
- **Promise Queue**: Subsequent requests wait for ongoing refresh to complete
- **Automatic Retry**: Failed API calls retry automatically after token refresh
- **LocalStorage Persistence**: Both access and refresh tokens stored securely

### Refresh Flow

```javascript
async function makeRequest(route, method, authenticate, body) {
  const response = await fetch(endpoint, options);

  if (response.status === 401) {
    if (error.startsWith("Access token expired")) {
      await refreshTokens();        // Get new tokens
      return await makeRequest(...); // Retry original request
    } else {
      logOut();  // Invalid refresh token
    }
  }
}

function refreshTokens() {
  if (!refreshCooldownPassed()) {
    // Wait for ongoing refresh instead of making new request
    return new Promise((resolve) => {
      const intervalId = setInterval(() => {
        if (isNewToken()) {
          clearInterval(intervalId);
          resolve(true);
        }
      }, 100);
    });
  }
  // Make actual refresh request
}
```

## UI/UX Highlights

### Responsive Layout

- Fluid grid system and flexible components that automatically adjust to different screen resolutions
- Optimal viewing experience across desktop, tablet, and mobile devices

### Collapsible Chat List

- Toggle button to hide/show friends and groups list
- Maximizes space for message viewing

### Smart Navigation

- **Click on message author** → Opens private chat with that user
- **Friend code system** → Add friends without searching usernames
- **Invite codes** → Join private groups easily

### Dialog-Based Interface

- Profile editing in modals (no page navigation)
- Group management dialogs for owners
- Password change modal
- Non-intrusive forms that don't break chat flow

### Flash Message System

Component-scoped notifications with:

- Smooth collapse animation
- Type-based styling (success, error, info)
- Accessible ARIA labels
- Context based location

```javascript
// Usage in any component
setErrors([...errors, "Friend code not found"]);
// Flash message automatically appears
```

### Dark Mode Only

- Consistent dark theme throughout the application
- Reduced eye strain for extended chat sessions
- Modern aesthetic

### Animated Loading Spinner

- Custom CSS animation with dotted border that spins continuously
- Size-adjustable prop for consistent loading states across all components
- Automatically displayed during any fetch operation

## Form Validation System

Custom validation architecture built on HTML5 Constraint Validation API:

### Components

**FormRow** - Wrapper component that manages validation display:

```jsx
<FormRow>
  <input type="text" required />
</FormRow>
// Automatically shows validation errors
```

**Validation Helpers**:

```javascript
setValidationResult(inputElement, "Username is required");
// Updates both native validation and custom display
```

### Features

- Real-time validation feedback
- Server error integration
- Required field indicators
- Custom validation messages
- Accessible error announcements

## Key Design Decisions

### Why Polling over WebSockets?

| Aspect         | Polling                      | WebSockets                     |
| -------------- | ---------------------------- | ------------------------------ |
| Complexity     | Low                          | High                           |
| Infrastructure | No persistent connections    | Requires WebSocket server      |
| Authentication | Works with token system      | Requires connection management |
| Resource usage | Adjustable intervals         | Constant connection            |
| Use case       | Perfect for demos/portfolios | Production real-time apps      |

**Our choice**: Polling provides a simpler implementation perfect for demonstration while still delivering a great user experience.

### Why No Routing Library?

- **Simplicity**: All state managed at component level
- **Performance**: No bundle overhead from React Router
- **UX**: Dialog-based navigation keeps context
- **Architecture**: SPA pattern works perfectly for chat apps

### Why localStorage over HTTP-only Cookies?

- **Control**: Manual token refresh logic
- **Simplicity**: Works seamlessly with fetch API
- **Flexibility**: Easy to inspect and debug
- **Demonstration**: Show understanding of token-based auth

## State Management Approach

The app uses component-level state with custom hooks:

- **useFetch**: Centralized API logic with auto-refresh
- **Component State**: Local state for UI (collapsed panels, form inputs)
- **Prop Drilling**: Intentional for simplicity and traceability
- **No Redux/Zustand**: Unnecessary complexity for this scale

## Unique Features

### Permission-Based Messaging

- Send first message to non-friends (request permission)
- Recipient can block or accept future messages
- Visual indicators for message permissions

### Online Status Tracking

- Sets user online on component mount
- Updates status on page unload
- Real-time indicator in chat lists and messages

### Unread Message Badges

- Track unread messages per conversation
- Updates based on last_seen timestamps
- Clear on chat focus

## Error Handling

- **Network errors**: Display user-friendly messages
- **Validation errors**: Inline form feedback
- **Auth errors**: Auto logout or token refresh
- **Server errors**: Flash messages with retry options
- **All errors**: Component-scoped notifications

## Performance Optimizations

- **Dynamic polling**: Reduces requests when user is away
- **Vite build**: Fast HMR and optimized production bundles
- **Conditional rendering**: Unmount hidden components
- **Efficient re-renders**: useEffect dependency management

## Acknowledgments

- Icons by [Lucide](https://lucide.dev/)
- Built with [React](https://reactjs.org/) and [Vite](https://vitejs.dev/)
- Backend API documentation provides the foundation for all data operations

## Screenshots

### Sign up screen

![Sign up screen](https://github.com/leandroesposito/top-messaging-app-front/blob/main/screenshots/01_1.png)

#### Form validation

![Form validation](https://github.com/leandroesposito/top-messaging-app-front/blob/main/screenshots/01_2.png)

### App view with group chat open

![App view with group chat open](https://github.com/leandroesposito/top-messaging-app-front/blob/main/screenshots/04_1.png)

### Group owner management dialog

![Group owner management dialog](https://github.com/leandroesposito/top-messaging-app-front/blob/main/screenshots/06.png)

### Add friend panel

![Add friend panel](https://github.com/leandroesposito/top-messaging-app-front/blob/main/screenshots/08_1.png)

### Not friend after first message view

![Not friend after first message view](https://github.com/leandroesposito/top-messaging-app-front/blob/main/screenshots/10.png)
