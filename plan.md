# LiveKit Agent Tools Implementation Plan

## 🧩 Document Chunking Strategy (For Large PDFs)

### Why Chunking is Needed:
- **Large PDFs** → 50+ pages → 100k+ characters
- **LLM Context Limits** → GPT-4 can't process entire large documents
- **Search Precision** → Find specific sections, not entire document
- **Voice Response** → Return relevant chunks, not overwhelming text

### Chunking Implementation:
```python
# When storing OCR results
async def store_document_with_chunks(title: str, full_text: str, user_id: str):
    # 1. Store full document
    doc_id = await store_full_document(title, full_text, user_id)
    
    # 2. Create chunks (500-1000 chars each)
    chunks = create_chunks(full_text, chunk_size=800, overlap=100)
    
    # 3. Store each chunk with metadata
    for i, chunk in enumerate(chunks):
        await store_chunk(doc_id, chunk, chunk_index=i, page_hint=estimate_page(i))

def create_chunks(text: str, chunk_size: int = 800, overlap: int = 100) -> List[str]:
    """Split text into overlapping chunks for better search"""
    chunks = []
    start = 0
    while start < len(text):
        end = start + chunk_size
        chunk = text[start:end]
        
        # Try to break at sentence boundary
        if end < len(text):
            last_period = chunk.rfind('.')
            if last_period > chunk_size * 0.7:  # If period is reasonably close to end
                end = start + last_period + 1
                chunk = text[start:end]
        
        chunks.append(chunk.strip())
        start = end - overlap  # Overlap for context continuity
    
    return chunks
```

### Database Schema Update:
```sql
-- Add chunks table
CREATE TABLE document_chunks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  document_id UUID REFERENCES documents(id) ON DELETE CASCADE,
  chunk_text TEXT NOT NULL,
  chunk_index INTEGER NOT NULL,
  page_hint INTEGER,  -- Estimated page number
  created_at TIMESTAMPTZ DEFAULT NOW(),
  -- Full-text search on chunks
  search_index tsvector GENERATED ALWAYS AS (
    to_tsvector('english', chunk_text)
  ) STORED
);

CREATE INDEX chunks_search_idx ON document_chunks USING GIN(search_index);
```

## 🛠️ Tools to Implement

### 1. Document Management Tools ✅
```python
@agents.tool(desc="Get total count of user's scanned documents")
async def count_documents() -> str:
    # ✅ IMPLEMENTED - User ID hardcoded for testing
    # TODO: Need proper LiveKit→Supabase user mapping
```

### 2. Document Search Tool (NEXT)
```python
@agents.tool(desc="Search across ALL documents for any content or keywords")
async def search_documents(query: str) -> str:
    # Uses tsvector full-text search for fast results
    # Returns: "Found in Medical Report: Take 2 tablets daily..."
```

### 3. Document List Tool
```python
@agents.tool(desc="List all document titles with creation dates")  
async def list_documents() -> str:
    # SQL: SELECT title, created_at FROM documents ORDER BY created_at DESC LIMIT 10
    # Returns: "1. Medical Report (Dec 19), 2. Prescription (Dec 18)..."
```

### 2. Document Content Tools
```python
@agents.tool(desc="Get full content of a specific document by title")
async def read_document(title: str) -> str:
    # SQL: SELECT full_text FROM documents WHERE title ILIKE %title%
    # Returns: Full document text (truncated if too long)

@agents.tool(desc="Get recent documents from last N days")
async def recent_documents(days: int = 7) -> str:
    # SQL: WHERE created_at >= NOW() - INTERVAL '{days} days'
    # Returns: Documents from specified timeframe
```

### 3. Medical Context Tools
```python
@agents.tool(desc="Find medication information in documents")
async def find_medications(query: str = "medication") -> str:
    # Search for: medication, pills, tablets, dosage, prescription
    # Returns: Medication names, dosages, schedules

@agents.tool(desc="Find doctor instructions or prescriptions")
async def find_prescriptions() -> str:
    # Search for: doctor, prescription, instructions, take, daily
    # Returns: Doctor notes, prescription details
```

## 🎯 Voice Interaction Examples

| User Voice Input | Tool Called | Expected Response |
|------------------|-------------|-------------------|
| "How many documents do I have?" | `count_documents()` | "You have 12 documents saved" |
| "What did I scan yesterday?" | `recent_documents(1)` | "Yesterday: Prescription from Dr. Smith" |
| "Find my blood pressure medication" | `search_documents("blood pressure")` | "Found: Take Lisinopril 10mg daily" |
| "Show me all my documents" | `list_documents()` | "1. Lab Results (Dec 19), 2. Prescription..." |
| "What does my prescription say?" | `find_prescriptions()` | "Dr. Smith: Take 2 tablets twice daily" |

## 📊 Implementation Steps

### Step 1: Create Supabase API Endpoint
- Create `/api/documents` endpoint for agent to call
- Implement all document operations (count, list, search, read)
- Add authentication for agent access

### Step 2: Add Tools to Python Agent
- Import LiveKit agents tools
- Define each tool with proper descriptions
- Connect tools to Supabase API

### Step 3: Test Voice Interactions
- Test each tool with voice commands
- Verify responses are natural and helpful
- Optimize tool descriptions for better LLM understanding

## 🔧 Technical Requirements

### API Endpoints Needed:
- `GET /api/documents/count` - Document count
- `GET /api/documents/list` - Document list  
- `GET /api/documents/search?q=query` - Search chunks with context
- `GET /api/documents/read?title=name&chunk=3` - Read specific chunk
- `GET /api/documents/recent?days=7` - Recent documents

### Chunking Benefits:
- **Precise Search** → "Find dosage info" returns exact paragraph, not entire 50-page PDF
- **Page Context** → "Found on page 12: Take with food"
- **Voice Friendly** → Returns 2-3 sentences instead of overwhelming text
- **Better Ranking** → Smaller chunks = more precise relevance scoring

### Agent Integration:
- Add tools to `agent.py`
- Configure HTTP client for API calls
- Handle authentication and user context
- Format responses for voice output

## 🎯 Success Criteria
- User can ask "How many documents?" and get accurate count
- Voice search works: "Find my medication info"
- Document listing works: "What did I scan today?"
- Natural conversation flow with document management
