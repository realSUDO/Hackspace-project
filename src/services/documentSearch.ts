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

      // Use the custom search function with full-text search
      const { data, error } = await supabase
        .rpc('search_documents', { search_query: query });

      if (error) {
        console.log('❌ Search error:', error);
        return {
          success: false,
          error: `Search failed: ${error.message}`
        };
      }

      console.log('✅ Search results:', data?.length || 0, 'documents found');
      
      return {
        success: true,
        results: data || []
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
        .select('id, title, content, created_at')
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
        results: data?.map(doc => ({ ...doc, rank: 1 })) || []
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
          content,
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
