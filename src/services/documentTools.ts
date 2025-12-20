import { DocumentSearchService } from './documentSearch';

export interface DocumentTool {
  searchDocuments: (query: string) => Promise<any[]>;
  getAllDocuments: () => Promise<any[]>;
  getDocumentById: (id: string) => Promise<any | null>;
}

export class DocumentToolService implements DocumentTool {
  private searchService = new DocumentSearchService();

  async searchDocuments(query: string): Promise<any[]> {
    const result = await this.searchService.searchDocuments(query);
    return result.success ? result.results || [] : [];
  }

  async getAllDocuments(): Promise<any[]> {
    const result = await this.searchService.getAllDocuments();
    return result.success ? result.results || [] : [];
  }

  async getDocumentById(id: string): Promise<any | null> {
    const documents = await this.getAllDocuments();
    return documents.find(doc => doc.id === id) || null;
  }

  async getDocumentsByKeywords(keywords: string[]): Promise<any[]> {
    const allDocs = await this.getAllDocuments();
    return allDocs.filter(doc => 
      keywords.some(keyword => 
        doc.title.toLowerCase().includes(keyword.toLowerCase()) ||
        doc.content.toLowerCase().includes(keyword.toLowerCase())
      )
    );
  }

  async getRecentDocuments(limit: number = 5): Promise<any[]> {
    const documents = await this.getAllDocuments();
    return documents
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .slice(0, limit);
  }
}
