# Resume Builder Pro

A modern, dynamic resume builder web application built with React and Express that allows users to create, preview, and download professional resumes in both PDF and Word formats.

![Resume Builder](https://img.shields.io/badge/Resume-Builder-blue.svg)
![React](https://img.shields.io/badge/React-18.x-blue.svg)
![Express](https://img.shields.io/badge/Express-4.x-green.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue.svg)

## 🌟 Features

### ✨ Core Functionality
- **Dynamic Form Builder** - Intuitive forms for personal information, work experience, education, and skills
- **Real-time Preview** - Live preview of resume as you type
- **Multiple Templates** - Choose from Modern, Classic, Creative, and Minimal designs
- **Progress Tracking** - Visual progress indicator showing completion status
- **Auto-save** - Automatic saving of resume data as you work

### 📄 Export Options
- **PDF Export** - High-quality PDF generation with professional formatting
- **Word Export** - Native .docx file generation for easy editing
- **Multiple Formats** - Download in both PDF and Word formats

### 🎨 User Experience
- **Responsive Design** - Works perfectly on desktop, tablet, and mobile
- **Zoom Controls** - Adjust preview zoom level for better viewing
- **Template Switching** - Switch between templates instantly
- **Data Validation** - Real-time form validation with helpful error messages

## 🚀 Live Demo

Experience the resume builder in action: [Live Demo](https://your-deployment-url.com)

## 🛠️ Technology Stack

### Frontend
- **React 18** - Modern React with hooks and functional components
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **Radix UI** - Accessible component primitives
- **React Hook Form** - Performant forms with validation
- **Zod** - TypeScript-first schema validation
- **TanStack Query** - Data fetching and caching
- **Wouter** - Lightweight routing

### Backend
- **Express.js** - Fast web framework for Node.js
- **TypeScript** - Type-safe server development
- **In-memory Storage** - Fast data persistence for development
- **Zod Validation** - Server-side data validation

### Document Generation
- **jsPDF** - PDF generation library
- **html2canvas** - HTML to canvas conversion
- **docx** - Professional Word document generation

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/12shivam219/Resume-Builder.git
   cd Resume-Builder
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5000`

## 🎯 Usage

1. **Fill out your information** - Start with personal details, then add work experience, education, and skills
2. **Choose a template** - Select from our professionally designed templates
3. **Preview in real-time** - Watch your resume update as you type
4. **Download** - Export as PDF or Word document when ready

## 📁 Project Structure

```
Resume-Builder/
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/         # Page components
│   │   ├── hooks/         # Custom React hooks
│   │   ├── lib/           # Utility functions and templates
│   │   └── main.tsx       # Application entry point
│   └── index.html
├── server/                # Backend Express application
│   ├── index.ts          # Server entry point
│   ├── routes.ts         # API routes
│   ├── storage.ts        # Data storage layer
│   └── vite.ts           # Vite development setup
├── shared/               # Shared types and schemas
│   └── schema.ts         # Zod schemas and TypeScript types
└── package.json
```

## 🎨 Available Templates

### Modern Template
- Clean, professional design
- Blue accent color scheme
- Optimized for tech professionals

### Classic Template
- Traditional resume layout
- Serif typography
- Perfect for conservative industries

### Creative Template
- Two-column layout with sidebar
- Modern color scheme
- Great for creative professionals

### Minimal Template
- Ultra-clean design
- Plenty of white space
- Excellent for any industry

## 🔧 Development

### Prerequisites
- Node.js 18 or higher
- npm or yarn package manager

### Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

### Environment Variables
No environment variables required for basic functionality.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Shivam** - [GitHub](https://github.com/12shivam219)

## 🙏 Acknowledgments

- Built with modern web technologies
- Inspired by professional resume design principles
- Thanks to the open-source community for amazing libraries

---

⭐ Star this repository if you found it helpful!
