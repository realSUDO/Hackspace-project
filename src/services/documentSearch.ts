import { supabase } from './supabase';

export interface SearchResult {
  id: string;
  title: string;
  content: string;
  created_at: string;
  rank: number;
}

export interface DocumentSearchResult {
  success: boolean;
  results?: SearchResult[];
  error?: string;
}

export class DocumentSearchService {
  async searchDocuments(query: string): Promise<DocumentSearchResult> {
    try {
      console.log('🔍 Searching documents for:', query);

      // Multi-level search strategy for better matching
      let results: any[] = [];

      // 1. Exact tsvector search first
      try {
        const { data: exactData, error: exactError } = await supabase
          .from('documents')
          .select('id, title, full_text, created_at')
          .textSearch('search_index', query, { type: 'plain' })
          .limit(10);

        if (!exactError && exactData?.length) {
          results = exactData.map(doc => ({ ...doc, rank: 3 })); // High rank for exact matches
        }
      } catch (e) {
        console.log('tsvector not available, using fallback');
      }

      // 2. If no exact matches, try fuzzy search with ILIKE patterns
      if (results.length === 0) {
        const fuzzyPatterns = [
          `%${query}%`,                    // Contains exact
          `%${query.slice(0, -1)}%`,       // Missing last char: "broo" finds "brooo"
          `%${query}%${query.slice(-1)}%`, // Extra char: "brooo" finds "broo"
        ];

        for (const pattern of fuzzyPatterns) {
          const { data: fuzzyData, error: fuzzyError } = await supabase
            .from('documents')
            .select('id, title, full_text, created_at')
            .or(`full_text.ilike.${pattern},title.ilike.${pattern}`)
            .limit(10);

          if (!fuzzyError && fuzzyData?.length) {
            results = fuzzyData.map(doc => ({ ...doc, rank: 2 })); // Medium rank for fuzzy
            break;
          }
        }
      }

      // 3. Last resort: word-by-word search for partial matches
      if (results.length === 0) {
        const words = query.split(' ').filter(w => w.length > 2);
        if (words.length > 0) {
          const wordPattern = words.map(w => `%${w}%`).join('|');
          const { data: wordData, error: wordError } = await supabase
            .from('documents')
            .select('id, title, full_text, created_at')
            .or(`full_text.ilike.%${words[0]}%,title.ilike.%${words[0]}%`)
            .limit(10);

          if (!wordError && wordData?.length) {
            results = wordData.map(doc => ({ ...doc, rank: 1 })); // Low rank for word matches
          }
        }
      }

      console.log('✅ Search results:', results.length, 'documents found');
      
      return {
        success: true,
        results: results.map(doc => ({ 
          ...doc, 
          content: doc.full_text,
        })) || []
      };
    } catch (err: any) {
      console.log('❌ Search service error:', err);
      return {
        success: false,
        error: `Search failed: ${err.message}`
      };
    }
  }

  async getAllDocuments(): Promise<DocumentSearchResult> {
    try {
      console.log('📚 Fetching all user documents...');

      const { data, error } = await supabase
        .from('documents')
        .select('id, title, full_text, created_at')
        .order('created_at', { ascending: false });

      if (error) {
        console.log('❌ Fetch error:', error);
        return {
          success: false,
          error: `Fetch failed: ${error.message}`
        };
      }

      console.log('✅ Found', data?.length || 0, 'documents');
      
      return {
        success: true,
        results: data?.map(doc => ({ 
          ...doc, 
          content: doc.full_text, // Map full_text to content for compatibility
          rank: 1 
        })) || []
      };
    } catch (err: any) {
      console.log('❌ Fetch service error:', err);
      return {
        success: false,
        error: `Fetch failed: ${err.message}`
      };
    }
  }

  async updateDocument(id: string, title: string, content: string): Promise<{ success: boolean; error?: string }> {
    try {
      console.log('✏️ Updating document:', id);

      const { error } = await supabase
        .from('documents')
        .update({
          title,
          full_text: content,  // Use full_text for tsvector indexing
          updated_at: new Date().toISOString()
        })
        .eq('id', id);

      if (error) {
        console.log('❌ Update error:', error);
        return {
          success: false,
          error: `Update failed: ${error.message}`
        };
      }

      console.log('✅ Document updated successfully');
      
      return {
        success: true
      };
    } catch (err: any) {
      console.log('❌ Update service error:', err);
      return {
        success: false,
        error: `Update failed: ${err.message}`
      };
    }
  }

  async deleteDocument(id: string): Promise<{ success: boolean; error?: string }> {
    try {
      console.log('🗑️ Deleting document:', id);

      const { error } = await supabase
        .from('documents')
        .delete()
        .eq('id', id);

      if (error) {
        console.log('❌ Delete error:', error);
        return {
          success: false,
          error: `Delete failed: ${error.message}`
        };
      }

      console.log('✅ Document deleted successfully');
      
      return {
        success: true
      };
    } catch (err: any) {
      console.log('❌ Delete service error:', err);
      return {
        success: false,
        error: `Delete failed: ${err.message}`
      };
    }
  }
}
