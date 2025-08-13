# Smile Airlines Loyalty Program

## Overview

The Smile Airlines Loyalty Program is a full-stack web application that enables airline customers to earn and redeem points through their travel activities. The platform provides a premium, modern interface for users to manage their loyalty account, submit point requests, track their earning history, and maintain their profile information. Built with a focus on user experience, the application features a clean, airline-themed design with smooth interactions and responsive layouts.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
The client-side is built using Next.js v15 with App Router, leveraging React Server Components and TypeScript for a modern, performant web application. The application uses Next.js's file-based routing system with the app directory structure, providing seamless navigation between dashboard, requests, history, and profile pages. State management is handled through TanStack Query (React Query) for server state synchronization and caching, with custom hooks abstracting authentication and data fetching logic.

The UI framework leverages shadcn/ui components built on top of Radix UI primitives and Tailwind CSS for consistent, accessible design patterns. The design system implements a premium airline aesthetic with custom color schemes, smooth animations, and responsive layouts optimized for both desktop and mobile experiences. Next.js provides built-in SEO optimization, server-side rendering capabilities, and automatic performance optimizations.

### Backend Architecture
The application uses a hybrid architecture with Next.js API routes for frontend integration and a dedicated Express.js server for core business logic. The Express server follows a RESTful API pattern with TypeScript, implementing a service layer pattern through the storage interface that abstracts database operations and business logic from route handlers. Authentication is handled through Replit's OpenID Connect (OIDC) integration with session-based state management.

Next.js API routes act as a proxy layer, forwarding requests to the Express server while handling session cookies and providing seamless integration with the frontend. The Express API provides endpoints for user management, point request operations, and point history tracking, with centralized error handling through Express middleware for consistent error responses across all endpoints.

### Data Storage
The application uses PostgreSQL as the primary database with Drizzle ORM providing type-safe database operations and schema management. The database schema includes user profiles with membership tiers, point request tracking with approval workflows, and comprehensive point history logging.

Session management utilizes PostgreSQL for persistent session storage, ensuring reliable authentication state across server restarts. Database migrations are handled through Drizzle Kit, enabling version-controlled schema evolution.

### Authentication and Authorization
Authentication is implemented using Replit's OpenID Connect (OIDC) provider with Passport.js for session management. The system automatically creates user accounts on first login and maintains sessions in PostgreSQL using connect-pg-simple for secure, server-side session storage.

Authorization is handled through the `isAuthenticated` middleware that verifies valid sessions and tokens before allowing access to protected API endpoints. User context includes claims data and session tokens, enabling personalized experiences and secure data access throughout the application.

**Migration Notes**: 
- Successfully migrated from email/password authentication to Replit Auth on January 13, 2025, improving security and eliminating the need for custom credential management.
- Successfully migrated from React/Express SPA to Next.js v15 with App Router on January 13, 2025, providing better performance, SEO capabilities, and modern React features.

### Development and Build Pipeline
The development environment uses Vite for fast hot module replacement and optimized builds. The build process compiles both client-side React application and server-side Node.js code, with separate bundling strategies optimized for their respective environments.

The application supports both development and production modes with appropriate tooling and optimization strategies. TypeScript provides compile-time type checking across the entire stack, ensuring code reliability and developer productivity.

## External Dependencies

### Database Services
- **Neon Database**: Serverless PostgreSQL hosting with connection pooling and automatic scaling
- **Drizzle ORM**: Type-safe database toolkit with PostgreSQL dialect support

### Authentication Services  
- **Replit Auth**: OpenID Connect (OIDC) authentication provider for seamless user login and session management

### UI and Styling
- **Radix UI**: Unstyled, accessible UI component primitives providing the foundation for custom components
- **Tailwind CSS**: Utility-first CSS framework for responsive design and consistent styling
- **shadcn/ui**: Pre-built component library combining Radix UI with Tailwind CSS styling
- **Lucide React**: Icon library providing consistent iconography throughout the application

### Development Tools
- **Vite**: Modern build tool providing fast development server and optimized production builds
- **TypeScript**: Static type checking for enhanced code reliability and developer experience
- **TanStack Query**: Data fetching and caching library for efficient server state management

### Utility Libraries
- **date-fns**: Date manipulation and formatting utilities for handling temporal data
- **zod**: Schema validation library ensuring type-safe data validation across API boundaries
- **clsx**: Utility for conditionally constructing CSS class names with type safety