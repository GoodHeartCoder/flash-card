# Flash Card Application

This is my first complete React project - a flash card application for spaced repetition learning. I built it to help with my own studies!

## Project Overview

- **Frontend**: React 19.1.1 with Vite
- **Backend**: JSON Server for API simulation
- **State Management**: React Context
- **Key Features**:
  - Deck and card management
  - Spaced repetition learning
  - Due card tracking
  - Simple and clean UI

## Personal Notes

This was my first serious React project where I went beyond tutorials. A few things I'd do differently next time:

1. **UI/Fetching Separation**: The UI logic is currently mixed with data fetching logic in components like `DecksContext.jsx`. This works but makes the code harder to maintain.

2. **First Project Challenges**: As my first real project, I focused on getting features working rather than perfect architecture. The JSON Server backend was great for quick prototyping but has limitations for production use.

## Current Issues & Planned Improvements

- Add rich text editing to card editor
- Implement image support for cards
- Add Anki deck import functionality
- Navigation guard for unscheduled cards
- Migrate to a real backend

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Start JSON Server:
```bash
npm run server
```

3. Start development server:
```bash
npm run dev
```
