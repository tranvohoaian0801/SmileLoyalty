import { sql } from 'drizzle-orm';
import {
  index,
  jsonb,
  pgTable,
  timestamp,
  varchar,
  text,
  integer,
  pgEnum,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

// Session storage table.
// (IMPORTANT) This table is mandatory for Replit Auth, don't drop it.
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table.
// (IMPORTANT) This table is mandatory for Replit Auth, don't drop it.
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  phone: varchar("phone"),
  dateOfBirth: varchar("date_of_birth"),
  gender: varchar("gender"),
  address: text("address"),
  membershipId: varchar("membership_id").unique(),
  membershipTier: varchar("membership_tier").default("Silver"),
  currentPoints: integer("current_points").default(0),
  totalEarned: integer("total_earned").default(0),
  totalUsed: integer("total_used").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const requestStatusEnum = pgEnum("request_status", ["pending", "approved", "rejected"]);

export const pointRequests = pgTable("point_requests", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  flightNumber: varchar("flight_number").notNull(),
  departureAirport: varchar("departure_airport").notNull(),
  arrivalAirport: varchar("arrival_airport").notNull(),
  departureDate: varchar("departure_date").notNull(),
  additionalNotes: text("additional_notes"),
  status: requestStatusEnum("status").default("pending"),
  pointsAwarded: integer("points_awarded").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const pointHistory = pgTable("point_history", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  type: varchar("type").notNull(), // "earned" or "redeemed"
  points: integer("points").notNull(),
  description: text("description").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  pointRequests: many(pointRequests),
  pointHistory: many(pointHistory),
}));

export const pointRequestsRelations = relations(pointRequests, ({ one }) => ({
  user: one(users, {
    fields: [pointRequests.userId],
    references: [users.id],
  }),
}));

export const pointHistoryRelations = relations(pointHistory, ({ one }) => ({
  user: one(users, {
    fields: [pointHistory.userId],
    references: [users.id],
  }),
}));

// Schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertPointRequestSchema = createInsertSchema(pointRequests).omit({
  id: true,
  userId: true,
  status: true,
  pointsAwarded: true,
  createdAt: true,
  updatedAt: true,
});

export const insertPointHistorySchema = createInsertSchema(pointHistory).omit({
  id: true,
  createdAt: true,
});

// Types
export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;
export type PointRequest = typeof pointRequests.$inferSelect;
export type InsertPointRequest = z.infer<typeof insertPointRequestSchema>;
export type PointHistory = typeof pointHistory.$inferSelect;
export type InsertPointHistory = z.infer<typeof insertPointHistorySchema>;
