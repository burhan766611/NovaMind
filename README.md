🧠 NovaMind – AI Chat Assistant
🌐 Live Demo
NovaMind is a full-stack MERN application that allows users to chat with an AI assistant using OpenAI's GPT models.
It includes authentication, persistent chat threads, and a clean modern UI.
🚀 Tech Stack

Frontend: React, Context API, CSS
Backend: Node.js, Express.js, MongoDB, JWT Auth
AI Engine: OpenAI GPT-3.5-turbo API
Hosting: Render (Backend) + Netlify (Frontend)

✨ Features

Secure user authentication (JWT + cookies)
Persistent chat threads per user
OpenAI API integration for intelligent responses
Clean UI with Sidebar + Chat Window
Responsive and mobile-friendly

⚙️ Installation
bashgit clone https://github.com/burhan766611/NovaMind.git
cd NovaMind
cd backend && npm install
cd ../frontend && npm install
🔧 Environment Variables
Create a .env file in the backend folder:
envMONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
OPENAI_API_KEY=your_openai_api_key
PORT=5000
🏃 Running the Application
Backend:
bashcd backend
npm start
Frontend:
bashcd frontend
npm start
📂 Project Structure
NovaMind/
├── backend/
│   ├── models/
│   ├── routes/
│   ├── controllers/
│   └── server.js
└── frontend/
    ├── src/
    │   ├── components/
    │   ├── context/
    │   └── App.js
    └── public/
🤝 Contributing
Contributions are welcome! Please feel free to submit a Pull Request.
📄 License
This project is open source and available under the MIT License.
👤 Author
Burhan

GitHub: @burhan766611
