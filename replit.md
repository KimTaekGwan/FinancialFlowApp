# Fintech Mobile App

## Overview

This is a Korean fintech mobile application built with React, Express.js, and TypeScript. The app provides AI-powered banking services with a focus on user-friendly interfaces for financial transactions, particularly designed for Korean speakers. It features a mobile-first design with AI chat assistance, money transfers, transaction history, and user profile management.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter for client-side routing
- **UI Components**: Radix UI with shadcn/ui design system
- **Styling**: Tailwind CSS with custom fintech color palette
- **State Management**: TanStack Query for server state management
- **Build Tool**: Vite with custom configuration for mobile-optimized builds

### Backend Architecture
- **Runtime**: Node.js with Express.js
- **Language**: TypeScript with ES modules
- **API Pattern**: RESTful API design
- **Development Server**: Vite middleware integration for hot reloading
- **Error Handling**: Centralized error middleware with structured responses

### Data Storage
- **ORM**: Drizzle ORM with PostgreSQL dialect
- **Database**: PostgreSQL (configured for Neon serverless)
- **Schema**: Shared schema definitions between client and server
- **Validation**: Zod schemas for runtime type validation
- **Migrations**: Drizzle Kit for database migrations

## Key Components

### Core Pages
1. **Welcome Page**: Onboarding with app introduction
2. **Dashboard**: Main hub showing balance and quick actions
3. **Send Money**: Transfer interface with contact selection
4. **Transactions**: Transaction history with filtering
5. **AI Chat**: Conversational interface for banking assistance
6. **Profile**: User account management and settings

### Shared Infrastructure
- **Schema Definitions**: Centralized in `/shared/schema.ts`
- **Type Safety**: Full TypeScript coverage from database to UI
- **Component Library**: Comprehensive UI components in `/client/src/components/ui/`
- **Navigation**: Bottom navigation for mobile UX

### Database Schema
- **Users**: Profile information, balance, and account details
- **Transactions**: Financial transactions with type categorization
- **Contacts**: Saved recipients for money transfers
- **AI Conversations**: Chat history and AI interactions

## Data Flow

1. **Client Requests**: React components use TanStack Query for API calls
2. **API Layer**: Express routes handle business logic and validation
3. **Data Access**: Storage layer abstracts database operations
4. **Response Flow**: Structured JSON responses with error handling
5. **State Updates**: Query invalidation ensures UI consistency

The application uses a memory storage implementation for development with the interface designed to easily swap to database persistence.

## External Dependencies

### UI and Styling
- **Radix UI**: Comprehensive component primitives
- **Tailwind CSS**: Utility-first styling framework
- **Lucide React**: Icon library for consistent iconography
- **Class Variance Authority**: Component variant management

### Development Tools
- **Vite**: Build tool with hot module replacement
- **TSX**: TypeScript execution for development
- **ESBuild**: Production bundling
- **PostCSS**: CSS processing with Autoprefixer

### Backend Services
- **Neon Database**: Serverless PostgreSQL hosting
- **Connect PG Simple**: Session store for PostgreSQL
- **Date-fns**: Date manipulation utilities

## Deployment Strategy

### Development Environment
- **Hot Reloading**: Vite dev server with Express middleware integration
- **Type Checking**: Continuous TypeScript compilation
- **Database**: Development schema push with Drizzle

### Production Build
- **Frontend**: Vite optimized build with code splitting
- **Backend**: ESBuild bundling for Node.js deployment
- **Static Assets**: Served from Express with caching headers
- **Environment**: Production configuration with environment variables

The architecture supports deployment to platforms like Replit, Vercel, or traditional VPS with minimal configuration changes.