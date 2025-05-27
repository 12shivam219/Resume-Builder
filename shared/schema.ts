import { pgTable, text, serial, integer, boolean, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const resumes = pgTable("resumes", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull(),
  title: text("title").notNull(),
  data: jsonb("data").notNull(),
  template: text("template").notNull().default("modern"),
  createdAt: text("created_at").notNull(),
  updatedAt: text("updated_at").notNull(),
});

// Personal Information Schema
export const personalInfoSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Valid email is required"),
  phone: z.string().min(1, "Phone number is required"),
  title: z.string().optional(),
  address: z.string().optional(),
  linkedin: z.string().url().optional().or(z.literal("")),
  summary: z.string().optional(),
});

// Work Experience Schema
export const workExperienceSchema = z.object({
  id: z.string(),
  title: z.string().min(1, "Job title is required"),
  company: z.string().min(1, "Company name is required"),
  location: z.string().optional(),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().optional(),
  current: z.boolean().default(false),
  description: z.string().optional(),
});

// Education Schema
export const educationSchema = z.object({
  id: z.string(),
  degree: z.string().min(1, "Degree is required"),
  field: z.string().min(1, "Field of study is required"),
  institution: z.string().min(1, "Institution is required"),
  location: z.string().optional(),
  startYear: z.number().optional(),
  endYear: z.number().optional(),
  gpa: z.number().min(0).max(4).optional(),
});

// Skills Schema
export const skillCategorySchema = z.object({
  id: z.string(),
  name: z.string().min(1, "Category name is required"),
  skills: z.array(z.string()).default([]),
});

// Complete Resume Data Schema
export const resumeDataSchema = z.object({
  personalInfo: personalInfoSchema,
  workExperience: z.array(workExperienceSchema).default([]),
  education: z.array(educationSchema).default([]),
  skillCategories: z.array(skillCategorySchema).default([]),
});

export const insertResumeSchema = createInsertSchema(resumes).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertResume = z.infer<typeof insertResumeSchema>;
export type Resume = typeof resumes.$inferSelect;
export type ResumeData = z.infer<typeof resumeDataSchema>;
export type PersonalInfo = z.infer<typeof personalInfoSchema>;
export type WorkExperience = z.infer<typeof workExperienceSchema>;
export type Education = z.infer<typeof educationSchema>;
export type SkillCategory = z.infer<typeof skillCategorySchema>;
