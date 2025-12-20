# Pulse

A comprehensive medication tracking and health management app with AI-powered voice assistance and document scanning capabilities.

## Features

- **Medication Management**: Track medications, set reminders, and manage dosages
- **Document Scanning**: OCR-powered document scanning with ML Kit
- **AI Voice Assistant**: Real-time voice chat with medical knowledge
- **Health Reports**: Comprehensive health tracking and reporting
- **Accessibility**: Full WCAG compliance with screen reader support
- **Multi-user Support**: Secure user isolation with RLS policies

## Tech Stack

- **Frontend**: React Native with Expo Router
- **Styling**: NativeWind (Tailwind CSS for React Native)
- **Database**: Supabase with Row Level Security
- **AI Agent**: Python-based medical assistant
- **Voice**: LiveKit for real-time voice communication
- **OCR**: React Native ML Kit for text recognition

## Project Structure

```
VoiceChatAI/
├── app/                    # Expo Router pages
├── src/
│   ├── components/         # React Native components
│   ├── contexts/          # React contexts
│   ├── hooks/             # Custom hooks
│   └── services/          # API and database services
├── voice-agent/           # Python AI agent
├── assets/                # Static assets
└── android/               # Android native code
```

## Setup

### Prerequisites

- Node.js 18+
- Expo CLI
- Python 3.11+
- Supabase account

### Installation

1. **Clone and install dependencies**:
```bash
npm install
```

2. **Environment setup**:
```bash
cp .env.example .env.local
# Fill in your Supabase and other API keys
```

3. **Database setup**:
```bash
# Run the SQL scripts in your Supabase dashboard
# 1. create_medications_table.sql
# 2. modify_rls_policies.sql
```

4. **Voice agent setup**:
```bash
cd voice-agent
cp .env.example .env.local
# Add your API keys and user ID
uv sync
```

### Running the App

**Development**:
```bash
npm start
```

**Android**:
```bash
npm run android
```

**Voice Agent**:
```bash
cd voice-agent
uv run python src/agent.py
```

## Key Components

### Medication Management
- Database-backed medication storage
- User-specific medication lists with RLS
- Medication reminders and tracking

### Document Scanning
- ML Kit OCR integration
- Document storage and retrieval
- Search functionality across documents

### AI Voice Assistant
- Medical knowledge base
- Document and medication context awareness
- Guardrails for medical-only assistance

### Accessibility
- Screen reader support
- WCAG 2.1 AA compliance
- Semantic navigation and announcements

## Database Schema

### Medications Table
```sql
CREATE TABLE medications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  dosage TEXT,
  frequency TEXT,
  taken BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### Documents Table
```sql
CREATE TABLE documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT,
  file_path TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);
```

## Security

- **Row Level Security**: All tables use RLS policies for user isolation
- **Environment Variables**: Sensitive data in `.env.local` (gitignored)
- **API Keys**: Secure key management for external services

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - see LICENSE file for details
