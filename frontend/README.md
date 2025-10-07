DOCS/
├── backend/
│   ├── node_modules/
│   ├── package.json
│   ├── package-lock.json
│   ├── .env                     # PORT, DB_URI, JWT_SECRET
│   │
│   ├── uploads/                 # File storage
│   │   ├── docs/
│   │   └── profiles/
│   │
│   ├── src/
│   │   ├── server.js            # Main entry point
│   │
│   │   ├── config/
│   │   │   └── db.js            # Database connection
│   │
│   │   ├── controllers/         # Controllers (business logic)
│   │   │   ├── authController.js
│   │   │   ├── docsController.js
│   │   │   └── profileController.js
│   │
│   │   ├── middleware/          # Express middlewares
│   │   │   ├── authMiddleware.js
│   │   │   └── uploadMiddleware.js
│   │
│   │   ├── models/              # Mongoose Models
│   │   │   ├── User.js
│   │   │   └── Doc.js
│   │
│   │   ├── routes/              # Routes
│   │   │   ├── auth.js
│   │   │   ├── docs.js
│   │   │   ├── profile.js
│   │   │   ├── upload.js
│   │   │   ├── tools/           # 🛠 Each tool route here
│   │   │   │   ├── pdfToWord.js
│   │   │   │   ├── wordToPdf.js
│   │   │   │   ├── pdfMerge.js
│   │   │   │   ├── pdfSplit.js
│   │   │   │   ├── pdfCompress.js
│   │   │   │   ├── pdfEditor.js
│   │   │   │   ├── pdfToImage.js
│   │   │   │   ├── imageToPdf.js
│   │   │   │   ├── excelToPdf.js
│   │   │   │   ├── powerpointToPdf.js
│   │   │   │   ├── textExtractor.js
│   │   │   │   ├── passwordProtect.js
│   │   │   │   ├── unlockPdf.js
│   │   │   │   ├── esignPdf.js
│   │   │   │   ├── docTranslator.js
│   │   │   │   ├── 
│   │   │   │   └── repairPdf.js
│   │   │   └── tools.js         # Central tools router
│   │
│   │   └── utils/               # Helpers
│   │       └── token.js
│   │
│   └── tools.py                 # Optional Python utilities
│
├── frontend/
│   ├── node_modules/
│   ├── package.json
│   ├── vite.config.js / webpack.config.js
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   ├── .env
│   │
│   ├── public/
│   │   ├── index.html
│   │   ├── favicon.ico
│   │   └── assets/
│   │       └── logo2.jpg
│   │
│   ├── src/
│   │   ├── main.jsx             # Entry point
│   │   ├── App.jsx              # Routes setup
│   │   ├── index.css            # Global styles
│   │
│   │   ├── assets/              # Images, icons
│   │   │   └── logo2.jpg
│   │
│   │   ├── components/          # Shared UI components
│   │   │   ├── Header/
│   │   │   │   └── Header.jsx
│   │   │   ├── Footer/
│   │   │   │   └── Footer.jsx
│   │   │   └── common/
│   │   │       └── Button.jsx
│   │
│   │   ├── pages/               # Main pages
│   │   │   ├── Home.jsx
│   │   │   ├── Signup.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Profile.jsx
│   │   │   ├── CreateDoc.jsx
│   │   │   ├── Favorites.jsx
│   │   │   ├── Tools.jsx
│   │   │   ├── DocAI.jsx
│   │   │   └── tools/           # 🛠 Tool Pages (UI for each tool)
│   │   │       ├── pdf-to-word.jsx
│   │   │       ├── word-to-pdf.jsx
│   │   │       ├── pdf-merge.jsx
│   │   │       ├── pdf-split.jsx
│   │   │       ├── pdf-compress.jsx
│   │   │       ├── pdf-editor.jsx
│   │   │       ├── pdf-to-image.jsx
│   │   │       ├── image-to-pdf.jsx
│   │   │       ├── excel-to-pdf.jsx
│   │   │       ├── powerpoint-to-pdf.jsx
│   │   │       ├── text-extractor.jsx
│   │   │       ├── password-protect.jsx
│   │   │       ├── unlock-pdf.jsx
│   │   │       ├── esign-pdf.jsx
│   │   │       ├── doc-translator.jsx
│   │   │       ├
│   │   │       └── repair-pdf.jsx
│   │
│   │   ├── styles/
│   │   │   └── home.css
│   │   │
│   │   └── ...
│   │
│   └── README.md
│
└── README.md                    # Main project documentation
