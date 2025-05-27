import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertResumeSchema, resumeDataSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Get all resumes for a user
  app.get("/api/resumes", async (req, res) => {
    try {
      const userId = req.query.userId as string || "anonymous";
      const resumes = await storage.getResumesByUserId(userId);
      res.json(resumes);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch resumes" });
    }
  });

  // Get a specific resume
  app.get("/api/resumes/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const resume = await storage.getResume(id);
      
      if (!resume) {
        return res.status(404).json({ message: "Resume not found" });
      }
      
      res.json(resume);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch resume" });
    }
  });

  // Create a new resume
  app.post("/api/resumes", async (req, res) => {
    try {
      // Validate the resume data
      const validatedData = resumeDataSchema.parse(req.body.data);
      
      const resumeData = {
        userId: req.body.userId || "anonymous",
        title: req.body.title || "Untitled Resume",
        data: validatedData,
        template: req.body.template || "modern",
      };

      const resume = await storage.createResume(resumeData);
      res.status(201).json(resume);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          message: "Invalid resume data", 
          errors: error.errors 
        });
      }
      res.status(500).json({ message: "Failed to create resume" });
    }
  });

  // Update a resume
  app.put("/api/resumes/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      
      // Validate the resume data if provided
      let updateData: any = {};
      
      if (req.body.data) {
        updateData.data = resumeDataSchema.parse(req.body.data);
      }
      
      if (req.body.title) {
        updateData.title = req.body.title;
      }
      
      if (req.body.template) {
        updateData.template = req.body.template;
      }

      const resume = await storage.updateResume(id, updateData);
      
      if (!resume) {
        return res.status(404).json({ message: "Resume not found" });
      }
      
      res.json(resume);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          message: "Invalid resume data", 
          errors: error.errors 
        });
      }
      res.status(500).json({ message: "Failed to update resume" });
    }
  });

  // Delete a resume
  app.delete("/api/resumes/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const deleted = await storage.deleteResume(id);
      
      if (!deleted) {
        return res.status(404).json({ message: "Resume not found" });
      }
      
      res.json({ message: "Resume deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete resume" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
