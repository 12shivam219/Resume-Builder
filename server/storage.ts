import { resumes, type Resume, type InsertResume } from "@shared/schema";

export interface IStorage {
  getResume(id: number): Promise<Resume | undefined>;
  getResumesByUserId(userId: string): Promise<Resume[]>;
  createResume(resume: InsertResume): Promise<Resume>;
  updateResume(id: number, resume: Partial<InsertResume>): Promise<Resume | undefined>;
  deleteResume(id: number): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private resumes: Map<number, Resume>;
  private currentId: number;

  constructor() {
    this.resumes = new Map();
    this.currentId = 1;
  }

  async getResume(id: number): Promise<Resume | undefined> {
    return this.resumes.get(id);
  }

  async getResumesByUserId(userId: string): Promise<Resume[]> {
    return Array.from(this.resumes.values()).filter(
      (resume) => resume.userId === userId,
    );
  }

  async createResume(insertResume: InsertResume): Promise<Resume> {
    const id = this.currentId++;
    const now = new Date().toISOString();
    const resume: Resume = { 
      id, 
      userId: insertResume.userId,
      title: insertResume.title,
      data: insertResume.data,
      template: insertResume.template || 'modern',
      createdAt: now,
      updatedAt: now,
    };
    this.resumes.set(id, resume);
    return resume;
  }

  async updateResume(id: number, updateData: Partial<InsertResume>): Promise<Resume | undefined> {
    const existingResume = this.resumes.get(id);
    if (!existingResume) {
      return undefined;
    }

    const updatedResume: Resume = {
      ...existingResume,
      ...updateData,
      updatedAt: new Date().toISOString(),
    };
    
    this.resumes.set(id, updatedResume);
    return updatedResume;
  }

  async deleteResume(id: number): Promise<boolean> {
    return this.resumes.delete(id);
  }
}

export const storage = new MemStorage();
