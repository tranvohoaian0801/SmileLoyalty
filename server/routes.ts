import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, requireAuth } from "./auth";
import { insertPointRequestSchema, registerSchema, loginSchema } from "@shared/schema";
import { z } from "zod";

export function registerRoutes(app: Express): Server {
  // Auth middleware
  setupAuth(app);

  // Validation middleware
  app.use('/api/register', (req, res, next) => {
    try {
      registerSchema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Validation failed", errors: error.errors });
      } else {
        res.status(400).json({ message: "Invalid request data" });
      }
    }
  });

  app.use('/api/login', (req, res, next) => {
    try {
      loginSchema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Validation failed", errors: error.errors });
      } else {
        res.status(400).json({ message: "Invalid request data" });
      }
    }
  });

  // Point request routes
  app.get('/api/point-requests', requireAuth, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const requests = await storage.getPointRequestsByUser(userId);
      res.json(requests);
    } catch (error) {
      console.error("Error fetching point requests:", error);
      res.status(500).json({ message: "Failed to fetch point requests" });
    }
  });

  app.post('/api/point-requests', requireAuth, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const validatedData = insertPointRequestSchema.parse(req.body);
      const request = await storage.createPointRequest(userId, validatedData);
      res.status(201).json(request);
    } catch (error) {
      console.error("Error creating point request:", error);
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid request data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to create point request" });
      }
    }
  });

  app.get('/api/point-requests/:id', requireAuth, async (req: any, res) => {
    try {
      const { id } = req.params;
      const request = await storage.getPointRequest(id);
      if (!request) {
        return res.status(404).json({ message: "Point request not found" });
      }
      res.json(request);
    } catch (error) {
      console.error("Error fetching point request:", error);
      res.status(500).json({ message: "Failed to fetch point request" });
    }
  });

  // Point history routes
  app.get('/api/point-history', requireAuth, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const history = await storage.getPointHistoryByUser(userId);
      res.json(history);
    } catch (error) {
      console.error("Error fetching point history:", error);
      res.status(500).json({ message: "Failed to fetch point history" });
    }
  });

  // Profile update route
  app.patch('/api/profile', requireAuth, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const updatedUser = await storage.updateUser(userId, req.body);
      res.json({ ...updatedUser, password: undefined });
    } catch (error) {
      console.error("Error updating profile:", error);
      res.status(500).json({ message: "Failed to update profile" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
