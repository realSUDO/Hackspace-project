import React, { createContext, useContext, ReactNode } from 'react';
import { DocumentToolService } from '../services/documentTools';

interface DocumentContextType {
  documentTools: DocumentToolService;
  searchDocuments: (query: string) => Promise<any[]>;
  getAllDocuments: () => Promise<any[]>;
  getDocumentById: (id: string) => Promise<any | null>;
  getRecentDocuments: (limit?: number) => Promise<any[]>;
}

const DocumentContext = createContext<DocumentContextType | undefined>(undefined);

export function DocumentProvider({ children }: { children: ReactNode }) {
  const documentTools = new DocumentToolService();

  const contextValue: DocumentContextType = {
    documentTools,
    searchDocuments: (query: string) => documentTools.searchDocuments(query),
    getAllDocuments: () => documentTools.getAllDocuments(),
    getDocumentById: (id: string) => documentTools.getDocumentById(id),
    getRecentDocuments: (limit?: number) => documentTools.getRecentDocuments(limit),
  };

  return (
    <DocumentContext.Provider value={contextValue}>
      {children}
    </DocumentContext.Provider>
  );
}

export function useDocuments() {
  const context = useContext(DocumentContext);
  if (!context) {
    throw new Error('useDocuments must be used within a DocumentProvider');
  }
  return context;
}
