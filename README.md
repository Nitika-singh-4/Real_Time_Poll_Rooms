# 📊 Real-Time Poll Rooms

A full-stack web application that allows users to create polls, share them via a link, and collect votes with real-time result updates across all viewers.

---

## 🚀 Live Demo

**Frontend (Vercel):**  
https://real-time-poll-rooms-pink.vercel.app/ 

**Backend (Render):**  
https://real-time-poll-rooms-l2by.onrender.com 

---

## 🛠 Tech Stack

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

# ✅ Features Implemented

## 1️⃣ Poll Creation
- Create poll with a question and at least 2 options
- Frontend + backend validation
- Automatically generates unique shareable link

---

## 2️⃣ Join by Link
- Anyone with the link can access the poll
- Single-choice voting
- Clean error handling for invalid poll IDs

---

## 3️⃣ Real-Time Results
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

### 🔒 Mechanism 1: Device-Based Fingerprint (Browser-Level Restriction)

- A unique UUID is generated and stored in `localStorage`
- This fingerprint is sent with each vote request
- Backend checks whether that fingerprint has already voted

**Prevents:**
- Multiple votes from the same browser
- Refresh-based vote spamming

**Limitations:**
- Incognito mode resets localStorage
- Clearing browser storage bypasses this restriction

---

### 🌐 Mechanism 2: IP Address Tracking (Server-Side Restriction)

- Backend extracts the client IP address
- Each poll stores voted IP addresses
- If the same IP attempts to vote again, the request is rejected

**Prevents:**
- Multiple votes from the same network
- Basic spam attempts

**Limitations:**
- Shared networks (e.g., college WiFi) may block multiple legitimate users
- VPN usage can bypass restriction

---

### Fairness Design Philosophy

This project uses a **layered anti-abuse strategy**, combining device-level and network-level restrictions.  
While not foolproof (since authentication was not required), it significantly reduces casual abuse without introducing unnecessary complexity.

---

## 5️⃣ Persistence

- Polls and votes are stored in MongoDB
- Refreshing the page does not lose data
- Shareable links remain valid even after server restart
- Fully cloud-hosted database ensures durability

---

# ⚠ Edge Cases Handled

- Poll not found (invalid room ID)
- Empty question submission blocked
- Less than 2 valid options prevented
- Empty options filtered before submission
- Invalid option index handled
- Duplicate vote attempt blocked
- Real-time reconnection handled gracefully
- Deployment routing fixed for direct `/poll/:id` access

---

# 📌 Known Limitations

- IP-based restriction may block users on shared networks
- Fingerprint can be bypassed using incognito mode
- No authentication system implemented
- No poll expiration or deletion feature
- No admin moderation system

---

# 🔮 Future Improvements

If extended further, the system could include:

- Optional authentication (email or OAuth)
- Poll expiration timers
- Rate limiting instead of strict IP blocking
- Admin controls for poll creators
- Analytics dashboard
- Improved mobile UX animations

---

# 🧠 Design Decisions

- Chose **Socket.io** for efficient real-time bidirectional communication.
- Kept architecture simple and modular.
- Prioritized stability, correctness, and clear tradeoffs over feature complexity.
- Focused on delivering a clean, production-ready MVP.

---

# 🏁 Conclusion

This project fulfills all required success criteria:

- Poll creation
- Shareable links
- Real-time updates
- Anti-abuse mechanisms
- Data persistence
- Public deployment

The implementation prioritizes correctness, user experience, and system stability while maintaining architectural simplicity.
