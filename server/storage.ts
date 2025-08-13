import {
  users,
  pointRequests,
  pointHistory,
  type User,
  type UpsertUser,
  type RegisterUser,
  type PointRequest,
  type InsertPointRequest,
  type PointHistory,
  type InsertPointHistory,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc } from "drizzle-orm";

// Interface for storage operations
export interface IStorage {
  // User operations for Replit auth
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(userData: Omit<RegisterUser, 'confirmPassword'>): Promise<User>;
  updateUser(id: string, userData: Partial<User>): Promise<User>;
  upsertUser(userData: UpsertUser): Promise<User>;
  
  // Point request operations
  getPointRequestsByUser(userId: string): Promise<PointRequest[]>;
  createPointRequest(userId: string, request: InsertPointRequest): Promise<PointRequest>;
  getPointRequest(id: string): Promise<PointRequest | undefined>;
  
  // Point history operations
  getPointHistoryByUser(userId: string): Promise<PointHistory[]>;
  addPointHistory(entry: InsertPointHistory): Promise<PointHistory>;
  
  // Update user points
  updateUserPoints(userId: string, pointsToAdd: number, type: "earned" | "redeemed"): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  // User operations for email/password auth

  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }

  async createUser(userData: Omit<RegisterUser, 'confirmPassword'>): Promise<User> {
    // Generate membership ID
    const membershipId = `SA-SILVER-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
    
    const [user] = await db
      .insert(users)
      .values({
        ...userData,
        membershipId,
        membershipTier: 'Silver',
        currentPoints: 0,
        totalEarned: 0,
        totalUsed: 0,
      })
      .returning();
    return user;
  }

  async updateUser(id: string, userData: Partial<User>): Promise<User> {
    const [user] = await db
      .update(users)
      .set({
        ...userData,
        updatedAt: new Date(),
      })
      .where(eq(users.id, id))
      .returning();
    return user;
  }

  // Point request operations
  async getPointRequestsByUser(userId: string): Promise<PointRequest[]> {
    return await db
      .select()
      .from(pointRequests)
      .where(eq(pointRequests.userId, userId))
      .orderBy(desc(pointRequests.createdAt));
  }

  async createPointRequest(userId: string, request: InsertPointRequest): Promise<PointRequest> {
    const [pointRequest] = await db
      .insert(pointRequests)
      .values({ ...request, userId })
      .returning();
    return pointRequest;
  }

  async getPointRequest(id: string): Promise<PointRequest | undefined> {
    const [request] = await db
      .select()
      .from(pointRequests)
      .where(eq(pointRequests.id, id));
    return request;
  }

  // Point history operations
  async getPointHistoryByUser(userId: string): Promise<PointHistory[]> {
    return await db
      .select()
      .from(pointHistory)
      .where(eq(pointHistory.userId, userId))
      .orderBy(desc(pointHistory.createdAt));
  }

  async addPointHistory(entry: InsertPointHistory): Promise<PointHistory> {
    const [historyEntry] = await db
      .insert(pointHistory)
      .values(entry)
      .returning();
    return historyEntry;
  }

  // Update user points
  async updateUserPoints(userId: string, pointsToAdd: number, type: "earned" | "redeemed"): Promise<void> {
    const user = await this.getUser(userId);
    if (!user) return;

    const updates: Partial<User> = {
      updatedAt: new Date(),
    };

    if (type === "earned") {
      updates.currentPoints = (user.currentPoints || 0) + pointsToAdd;
      updates.totalEarned = (user.totalEarned || 0) + pointsToAdd;
    } else {
      updates.currentPoints = (user.currentPoints || 0) - pointsToAdd;
      updates.totalUsed = (user.totalUsed || 0) + pointsToAdd;
    }

    await db
      .update(users)
      .set(updates)
      .where(eq(users.id, userId));
  }

  // Upsert user for Replit auth
  async upsertUser(userData: UpsertUser): Promise<User> {
    const existingUser = await this.getUser(userData.id!);
    
    if (existingUser) {
      const [user] = await db
        .update(users)
        .set({
          ...userData,
          updatedAt: new Date(),
        })
        .where(eq(users.id, userData.id!))
        .returning();
      return user;
    } else {
      // Generate membership ID for new users
      const membershipId = `SA-SILVER-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
      
      const [user] = await db
        .insert(users)
        .values({
          ...userData,
          id: userData.id!,
          membershipId,
          membershipTier: 'Silver',
          currentPoints: 0,
          totalEarned: 0,
          totalUsed: 0,
        })
        .returning();
      return user;
    }
  }
}

export const storage = new DatabaseStorage();
