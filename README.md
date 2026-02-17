#  Real-Time Poll Rooms

A full-stack web application that allows users to create polls, share them via a link, and collect votes with real-time result updates across all viewers.

---

##  Live Demo

**Frontend (Vercel):**  
https://real-time-poll-rooms-pink.vercel.app/ 

**Backend (Render):**  
https://real-time-poll-rooms-l2by.onrender.com 

---

##  Tech Stack

### Frontend
- React (Vite)
- Tailwind CSS
- Axios
- Socket.io Client

### Backend
- Node.js
- Express
- MongoDB (Atlas)
- Socket.io

### Deployment
- Frontend → Vercel  
- Backend → Render  
- Database → MongoDB Atlas  

---

#  Features Implemented

## 1️ Poll Creation
- Create poll with a question and at least 2 options
- Frontend + backend validation
- Automatically generates unique shareable link

---

## 2️ Join by Link
- Anyone with the link can access the poll
- Single-choice voting
- Clean error handling for invalid poll IDs

---

## 3️ Real-Time Results
- Implemented using **Socket.io**
- Users join a socket room based on poll ID
- When a vote is cast:
  - Database updates
  - Server broadcasts updated results
  - All connected clients update instantly
- No manual refresh required

---

## 4️⃣ Fairness / Anti-Abuse Mechanisms

To reduce repeated or abusive voting, two layered mechanisms were implemented:

---

### 🔒 Mechanism 1: Device-Based Fingerprint (Client-Side Restriction)

- A unique UUID is generated and stored in `localStorage` when a user first votes
- This fingerprint is sent with each vote request
- Backend checks whether that fingerprint has already voted in this poll
- Prevents the same browser from voting multiple times

**What it prevents:**
- Multiple votes from the same browser/device
- Refresh-based vote spamming
- Casual duplicate voting attempts

**Limitations:**
- Incognito/private mode creates a new fingerprint (new localStorage)
- Clearing browser storage bypasses this restriction
- Different browsers on the same device are treated as different users

---

### ⏱️ Mechanism 2: Rate Limiting (Server-Side Restriction)

- Express rate limiter applied to the voting endpoint
- Limits: **5 vote attempts per IP address within 15 minutes**
- Prevents rapid-fire voting attempts from the same network
- Returns error message: "Too many vote attempts. Please try again later."

**What it prevents:**
- Automated voting bots
- Rapid spam attempts from the same IP
- Malicious users trying to skew results quickly
- Prevents abuse even if localStorage is cleared repeatedly

**Limitations:**
- Shared networks (e.g., college WiFi, offices) may hit rate limit affecting legitimate users
- VPN usage can bypass IP-based rate limiting
- Does not prevent slow, manual abuse attempts spread over time

---

### 🛡️ Combined Defense Strategy

These two mechanisms work together:
1. **Fingerprint** stops casual, accidental duplicate votes
2. **Rate limiting** stops automated/rapid abuse attempts

This layered approach significantly reduces voting abuse without requiring user authentication, while maintaining a frictionless voting experience.

---

## 5️ Persistence

- Polls and votes are stored in MongoDB
- Refreshing the page does not lose data
- Shareable links remain valid even after server restart
- Fully cloud-hosted database ensures durability

---

# ⚠️ Edge Cases Handled

- **Poll not found** - Invalid room ID returns proper error message
- **Empty question** - Submission blocked with validation error
- **Less than 2 valid options** - Prevented at frontend and backend
- **Empty options** - Filtered before submission
- **Invalid option index** - Backend validates index bounds
- **Duplicate vote attempt** - Blocked by fingerprint check
- **Rate limit exceeded** - Clear error message returned
- **Real-time disconnection** - Socket.io handles reconnection gracefully
- **Direct URL access** - Deployment routing fixed for `/poll/:id` paths
- **Missing fingerprint** - Generated on first vote attempt

---

# 🚧 Known Limitations

- **Fingerprint bypass** - Incognito mode or clearing localStorage creates new fingerprint
- **Rate limit on shared networks** - Legitimate users on same IP may be blocked after 5 votes
- **VPN usage** - Can bypass rate limiting by changing IP
- **No authentication** - Anyone with the link can vote (intentional for simplicity)
- **No poll expiration** - Polls remain active indefinitely
- **No poll deletion** - No admin controls to remove polls
- **No user identity tracking** - Cannot show "You voted for X" after page refresh

---

# 🚀 Future Improvements

If extended further, the system could include:

- **Optional authentication** - Email or OAuth for verified voting
- **Poll expiration timers** - Auto-close polls after specified time
- **Dynamic rate limiting** - Adjust limits based on poll popularity
- **Poll creator dashboard** - Manage and delete their polls
- **Analytics** - Detailed voting patterns and demographics
- **Multi-choice polls** - Allow voting for multiple options
- **Anonymous vs verified modes** - Toggle between public/private polls
- **Better mobile UX** - Enhanced animations and touch interactions
- **Export results** - Download poll data as CSV/PDF
- **Poll templates** - Pre-built question formats

---

#  Design Decisions

- Chose **Socket.io** for efficient real-time bidirectional communication.
- Kept architecture simple and modular.
- Prioritized stability, correctness, and clear tradeoffs over feature complexity.
- Focused on delivering a clean, production-ready MVP.

---

#  Conclusion

This project fulfills all required success criteria:

- Poll creation
- Shareable links
- Real-time updates
- Anti-abuse mechanisms
- Data persistence
- Public deployment

The implementation prioritizes correctness, user experience, and system stability while maintaining architectural simplicity.
