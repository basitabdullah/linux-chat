# Nexus Chat Application 🚀

A modern real-time chat application built with a powerful tech stack that enables seamless communication with features like instant messaging, image sharing, and emoji support.

![Nexus Chat Logo](/client/public/logo.png)

## ✨ Features

### Core Functionality
- **Real-time Messaging**: Instant message delivery using Socket.io
- **Image Sharing**: Upload and share images in conversations with Cloudinary integration
- **Emoji Support**: Express yourself with a rich emoji picker
- **User Authentication**: Secure JWT-based authentication system
- **Responsive Design**: Seamless experience across all devices

### User Features
- **User Profiles**: Customizable profiles with avatars
- **Message Status**: Online status indicators
- **Image Preview**: Preview images before sending
- **Message History**: Persistent chat history
- **Auto Scroll**: Automatically scroll to latest messages

## 🛠️ Tech Stack

### Frontend
- **React.js**: UI library for building user interfaces
- **Tailwind CSS**: Utility-first CSS framework for styling
- **Zustand**: State management solution
- **Socket.io-client**: Real-time client-server communication
- **Emoji-picker-react**: Emoji selection interface
- **Lucide React**: Modern icon library

### Backend
- **Node.js**: Runtime environment
- **Express.js**: Web application framework
- **MongoDB**: NoSQL database for data storage
- **Mongoose**: MongoDB object modeling
- **Socket.io**: Real-time bidirectional communication
- **JWT**: User authentication and authorization
- **Cloudinary**: Cloud-based image management

## 🚀 Getting Started

### Prerequisites
```bash
node >= 14.0.0
npm >= 6.0.0
```

### Installation

1. Clone the repository
```bash
git clone https://github.com/Sauhardya27/Nexus.git
cd Nexus
```

2. Install dependencies for both server and client
```bash
npm run build
```

3. Set up environment variables
```bash
# Backend (.env)
PORT=5001
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
CLOUD_NAME=your_cloudinary_cloud_name
CLOUD_API_KEY=your_cloudinary_api_key
CLOUD_API_SECRET=your_cloudinary_api_secret
```

4. Start the Application
```bash
# To start the application:
npm start
```

5. Start the development servers
```bash
# Start frontend (from client directory)
npm run dev

# Start backend (from server directory)
npm run dev
```

## 📱 Application Structure

```
Nexus/
├── client/
│   ├── src/
│   │   ├── components/
|   |   ├── constants/
│   │   ├── lib/
│   │   ├── pages/
│   │   ├── store/
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   ├── public/
│   ├── index.html
│   ├── package-lock.json
│   ├── package.json
│   ├── postcss.config.js
│   ├── tailwind.config.js
│   └── vite.config.js
└── server/
    ├── controllers/
    ├── lib/
    ├── middleware/
    ├── models/
    ├── routes/
    ├── seeds/
    ├── index.js
    ├── package-lock.json
    └── package.json
```

## 🎨 Screenshots

### Login Page
![Login Page](/client/public/login.png)

### Chat Interface
![Chat Interface](/client/public/chat.png)

### Profile Page
![Profile Page](/client/public/profile.png)

### Settings Page
![Settings Page](/client/public/settings.png)

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details

## 📧 Contact

Sauhardya - sauhardyachakraborty2643@gmail.com<br>
Project Link: [https://github.com/Sauhardya27/Nexus](https://github.com/Sauhardya27/Nexus)

---
Made with ❤️ by Sauhardya
