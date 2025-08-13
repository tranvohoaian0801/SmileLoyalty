import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { insertPointRequestSchema } from "@shared/schema";
import { z } from "zod";

export function registerRoutes(app: Express): Server {
  // Auth middleware
  setupAuth(app);

  // User route to get current user info
  app.get("/api/user", isAuthenticated, async (req: any, res) => {
    try {
      const claims = req.user.claims;
      const user = await storage.getUser(claims.sub);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json({ ...user, password: undefined });
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Point request routes
  app.get('/api/point-requests', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const requests = await storage.getPointRequestsByUser(userId);
      res.json(requests);
    } catch (error) {
      console.error("Error fetching point requests:", error);
      res.status(500).json({ message: "Failed to fetch point requests" });
    }
  });

  app.post('/api/point-requests', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
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

  app.get('/api/point-requests/:id', isAuthenticated, async (req: any, res) => {
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
  app.get('/api/point-history', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const history = await storage.getPointHistoryByUser(userId);
      res.json(history);
    } catch (error) {
      console.error("Error fetching point history:", error);
      res.status(500).json({ message: "Failed to fetch point history" });
    }
  });

  // Profile update route
  app.patch('/api/profile', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
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
