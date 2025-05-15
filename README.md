# Za-Frontend

Za-Frontend is the client-side application of the **Za-Ecommerce** platform, built using **React** with **Vite** for lightning-fast performance and modern developer experience. It includes real-time features, user authentication, and a responsive UI.

---

## ⚙️ Tech Stack

- **React 18**
- **Vite**
- **React Router**
- **PrimeReact** for UI components
- **React-Toastify** for notifications
- **Axios** for API requests
- **Socket.IO Client** for real-time chat
- **JWT + HTTP-only cookies** for auth
- **Tailwind CSS** (if used)

---

## 🔐 Core Features

- Buyer and Seller role-based registration & login
- JWT-based authentication with secure cookie storage
- Responsive layout with dashboard navigation
- Real-time chat with sellers
- Product listing, cart, checkout (Stripe), and profile management
- Live message count and cart modal in the navbar

---

## 🚀 Getting Started

### Prerequisites

- Node.js ≥ 18
- npm or yarn

### Installation
- env variable 
VITE_API_BASE_URL=https://your-backend-url.com/api

```bash
# Clone the repo
git clone https://github.com/zoheb799/za-frontend.git
cd za-frontend

# Install dependencies
npm install

# Run the development server
npm run dev
