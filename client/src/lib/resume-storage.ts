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

  static saveVersion(data: ResumeData, template: string = 'modern'): void {
    try {
      const versionsRaw = localStorage.getItem('resume_builder_versions');
      const versions = versionsRaw ? JSON.parse(versionsRaw) : [];
      const timestamp = new Date().toISOString();
      versions.push({ data, template, timestamp });
      localStorage.setItem('resume_builder_versions', JSON.stringify(versions));
    } catch (error) {
      console.warn('Failed to save resume version:', error);
    }
  }

  static getVersions(): Array<{ data: ResumeData; template: string; timestamp: string }> {
    try {
      const versionsRaw = localStorage.getItem('resume_builder_versions');
      return versionsRaw ? JSON.parse(versionsRaw) : [];
    } catch (error) {
      return [];
    }
  }

  static restoreVersion(index: number): { data: ResumeData; template: string } | null {
    try {
      const versionsRaw = localStorage.getItem('resume_builder_versions');
      if (!versionsRaw) return null;
      const versions = JSON.parse(versionsRaw);
      return versions[index] || null;
    } catch (error) {
      return null;
    }
  }

  static clearVersions(): void {
    try {
      localStorage.removeItem('resume_builder_versions');
    } catch (error) {
      // ignore
    }
  }
}
