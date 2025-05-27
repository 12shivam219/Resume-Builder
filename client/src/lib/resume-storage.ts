import type { ResumeData } from '@shared/schema';

const STORAGE_KEY = 'resume_builder_data';
const TEMPLATE_KEY = 'resume_builder_template';

export class ResumeStorage {
  static saveToLocal(data: ResumeData, template: string = 'modern'): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      localStorage.setItem(TEMPLATE_KEY, template);
    } catch (error) {
      console.warn('Failed to save resume to local storage:', error);
    }
  }

  static loadFromLocal(): { data: ResumeData | null; template: string } {
    try {
      const savedData = localStorage.getItem(STORAGE_KEY);
      const savedTemplate = localStorage.getItem(TEMPLATE_KEY) || 'modern';
      
      return {
        data: savedData ? JSON.parse(savedData) : null,
        template: savedTemplate,
      };
    } catch (error) {
      console.warn('Failed to load resume from local storage:', error);
      return { data: null, template: 'modern' };
    }
  }

  static clearLocal(): void {
    try {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(TEMPLATE_KEY);
    } catch (error) {
      console.warn('Failed to clear resume from local storage:', error);
    }
  }

  static hasLocalData(): boolean {
    try {
      return localStorage.getItem(STORAGE_KEY) !== null;
    } catch (error) {
      return false;
    }
  }
}
