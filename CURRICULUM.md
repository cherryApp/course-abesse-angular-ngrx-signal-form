# Angular 21 Signals, Stores & Forms - Complete Development Curriculum

## 📚 Table of Contents
- [Project Overview](#project-overview)
- [Architecture Overview](#architecture-overview)
- [Development Journey](#development-journey)
- [Step-by-Step Implementation Guide](#step-by-step-implementation-guide)
- [Core Services & Systems](#core-services--systems)
- [State Management with NgRx Signals](#state-management-with-ngrx-signals)
- [Advanced Form Patterns](#advanced-form-patterns)
- [Testing Strategy](#testing-strategy)
- [Best Practices & Lessons Learned](#best-practices--lessons-learned)

---

## Project Overview

This curriculum documents the creation of a modern Angular 21 application demonstrating cutting-edge features including Signal Forms, NgRx Signals stores, standalone components, and reactive programming patterns. The application serves as a user management system with two distinct form implementations.

### Key Technologies
- **Angular 21.0.0-next.0** - Latest standalone component architecture
- **NgRx Signals 20.1.0** - Modern signal-based state management
- **Signal Forms API** - Experimental Angular form handling
- **TailwindCSS 4.1.12** - Utility-first CSS framework
- **TypeScript 5.9.2** - Strict typing throughout
- **Vitest** - Modern testing framework

---

## Architecture Overview

### Core Principles
1. **Signal-First Architecture** - All state management uses Angular signals
2. **Standalone Components** - No NgModules, modern Angular architecture
3. **Reactive Programming** - Computed signals and linked signals for data flow
4. **Type Safety** - Strict TypeScript with proper interfaces
5. **Test-Driven Development** - Comprehensive unit tests

### Application Structure
```
src/
├── app/
│   ├── app.config.ts          # App configuration with providers
│   ├── app.routes.ts          # Standalone routing configuration
│   ├── model/user.ts          # Core user interface
│   ├── service/user.service.ts   # HTTP service layer
│   ├── stores/user.store.ts       # Signal-based state management
│   ├── common/navigation/     # Navigation component
│   ├── page/
│   │   ├── home/              # Home page
│   │   ├── users/             # Users list page
│   │   ├── user-create/       # Dynamic form implementation
│   │   ├── user-editor.component/ # Signal form implementation
│   │   └── user-creator.component/ # Alternative user creation form
```

---

## Development Journey

### Phase 1: Foundation Setup
**Objective:** Establish the Angular 21 project with modern configuration

**CLI Commands:**
```bash
# Create new Angular 21 project with standalone architecture
ng new course-abesse-angular-ngrx-signal-form --routing --style=css --standalone

# Install additional dependencies
npm install @ngrx/signals
```

**Key Configuration Changes:**

1. **Angular Configuration (angular.json)**
- Enabled strict mode for TypeScript
- Configured build optimization for production
- Setup development server with hot reload

2. **Package.json Dependencies**
```json
{
  "dependencies": {
    "@angular/animations": "^21.0.0-next.0",
    "@angular/common": "^21.0.0-next.0",
    "@angular/compiler": "^21.0.0-next.0",
    "@angular/core": "^21.0.0-next.0",
    "@angular/forms": "^21.0.0-next.0",
    "@angular/platform-browser": "^21.0.0-next.0",
    "@angular/platform-browser-dynamic": "^21.0.0-next.0",
    "@angular/router": "^21.0.0-next.0",
    "@ngrx/signals": "^20.1.0",
    "rxjs": "~7.8.0",
    "tslib": "^2.3.0"
  }
}
```

**App Configuration Setup:**
```typescript
// src/app/app.config.ts
import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes, withComponentInputBinding()),
    provideHttpClient(withFetch())
  ]
};
```

---

## Step-by-Step Implementation Guide

### Step 1: Core Model Definition
**Command:** `touch src/app/model/user.ts`

**Implementation:**
```typescript
export interface User {
  id: number;
  name: string;
  email: string;
  category: 'admin' | 'user' | 'guest';
}
```

**Key Learning:** Interface definition with strict typing and union types for categories.

### Step 2: HTTP Service Layer
**Command:** `ng g s user --project=course-abesse-angular-ngrx-signal-form`

**Implementation:**
```typescript
// src/app/service/user.service.ts
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../model/user';

@Injectable({ providedIn: 'root' })
export class UserService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'https://nettuts.hu/jms/cherryApp/users';

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.apiUrl);
  }

  getUser(id: number): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/${id}`);
  }

  createUser(user: Omit<User, 'id'>): Observable<User> {
    return this.http.post<User>(this.apiUrl, user);
  }

  updateUser(id: number, user: Partial<User>): Observable<User> {
    return this.http.patch<User>(`${this.apiUrl}/${id}`, user);
  }

  deleteUser(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
```

**Key Learning:** Modern dependency injection with `inject()` function and strict typing for API operations.

### Step 3: Signal-Based State Management
**Command:** `ng g s user --project=course-abesse-angular-ngrx-signal-form`

**Implementation:**
```typescript
// src/app/stores/user.store.ts
import { computed, inject, signal } from '@angular/core';
import { User } from '../model/user';
import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';
import { UserService } from '../service/user.service';
import { firstValueFrom } from 'rxjs';

export interface UserState {
  users: User[];
  loading: boolean;
  selectedUser: User | null;
  error: string | null;
}

export const UserStore = signalStore(
  { providedIn: 'root' },
  withState<UserState>({
    users: [],
    loading: false,
    selectedUser: null,
    error: null,
  }),
  withMethods((store, userService = inject(UserService)) => ({
    async loadUsers() {
      if (store.users().length > 0) {
        return;
      }

      patchState(store, { loading: true, error: null });
      try {
        const users = await firstValueFrom(userService.getUsers());
        patchState(store, { users });
      } catch (e) {
        patchState(store, { error: String(e) });
      } finally {
        patchState(store, { loading: false });
      }
    },
    async loadOneUser(id: number) {
      patchState(store, { loading: true, error: null });
      try {
        const selectedUser = await firstValueFrom(userService.getUser(id));
        patchState(store, { selectedUser });
      } catch (e) {
        patchState(store, { error: String(e) });
      } finally {
        patchState(store, { loading: false });
      }
    },
    async updateUser(user: User) {
      patchState(store, { loading: true, error: null });
      try {
        const updatedUser = await firstValueFrom(userService.updateUser(user.id, user));
        const index = store.users().findIndex((u) => u.id === updatedUser.id);
        if (index !== -1) {
          const users = [...store.users()];
          users[index] = updatedUser;
          patchState(store, { users });
        }
      } catch (e) {
        patchState(store, { error: String(e) });
      } finally {
        patchState(store, { loading: false });
      }
    },
    async createUser(user: User) {
      patchState(store, { loading: true, error: null });
      try {
        const createdUser = await firstValueFrom(userService.createUser(user));
        patchState(store, { users: [...store.users(), createdUser] });
      } catch (e) {
        patchState(store, { error: String(e) });
      } finally {
        patchState(store, { loading: false });
      }
    },
  })),
  withComputed((store) => ({
    userCount: () => store.users().length,
    hasUsers: () => store.users().length > 0,
  }))
);
```

**Key Learning:** Advanced signal patterns with `signalStore`, computed properties, and async/await operations with error handling.

---

## Core Services & Systems

### User Service Architecture

**Design Principles:**
- RESTful API integration with proper HTTP methods
- Observable-based responses for reactive programming
- Type-safe parameters and return types
- Centralized API endpoint management
- Error handling preparation for service layer

**Implementation Highlights:**
- Uses `inject()` function for dependency injection (modern Angular 21)
- Provides CRUD operations with proper typing
- Implements async/await operations in store layer
- Handles partial updates with `Partial<User>` type
- Uses `patch` HTTP method for updates instead of `put`

### Store Pattern Implementation

**Core Concepts:**
1. **State Declaration:** Using `withState` for structured state management
2. **Computed Properties:** Derived state that reacts to changes with `withComputed`
3. **Actions:** Methods that modify state with side effects using `withMethods`
4. **Error Handling:** Proper error state management for async operations
5. **Loading States:** Proper async operation tracking

**Advanced Patterns:**
- `signalStore` with feature APIs (`withState`, `withMethods`, `withComputed`)
- Async/await operations with error handling
- Optimistic UI updates
- Computed signals for derived state
- Error boundary handling for async operations

---

## State Management with NgRx Signals

### Signal Store Benefits

**Compared to Traditional NgRx:**
- No boilerplate reducers, actions, or effects
- Direct state manipulation with signals
- Automatic change detection and reactivity
- Simplified testing approach
- Better TypeScript integration

**Signal Patterns Demonstrated:**

1. **Structured State Management:** Using `withState`
```typescript
withState<UserState>({
  users: [],
  loading: false,
  selectedUser: null,
  error: null,
})
```

2. **Computed Signals:** Derived state with `withComputed`
```typescript
withComputed((store) => ({
  userCount: () => store.users().length,
  hasUsers: () => store.users().length > 0,
}))
```

3. **Methods with Side Effects:** Using `withMethods`
```typescript
withMethods((store, userService = inject(UserService)) => ({
  async loadUsers() { /* implementation */ },
  async loadOneUser(id: number) { /* implementation */ },
  async updateUser(user: User) { /* implementation */ },
  async createUser(user: User) { /* implementation */ },
}))
```

### Advanced Error Handling

**Pattern:** Async/await with try/catch error handling
```typescript
async loadUsers() {
  patchState(store, { loading: true, error: null });
  try {
    const users = await firstValueFrom(userService.getUsers());
    patchState(store, { users });
  } catch (e) {
    patchState(store, { error: String(e) });
  } finally {
    patchState(store, { loading: false });
  }
}
```

---

## Advanced Form Patterns

### Signal Form Implementation (Manual)

**Approach:** Field-by-field manual definition with Signal Forms API

**Key Features:**
- Individual field control with validation
- Type-safe form building
- Reactive validation messages
- Submission handling with error recovery

**Implementation Pattern:**
```typescript
// Form building pattern using signal forms
userForm = form(this.user, (path) => {
  required(path.name);
  required(path.email);
  email(path.email);
  required(path.category);
});

// Linked signal for two-way binding
user = linkedSignal<User>(() => {
  const selectedUser = this.userStore.selectedUser();
  return selectedUser ?? { id: 0, name: '', category: 'guest', email: '' };
});
```

### Dynamic Form Implementation (Metadata-Driven)

**Approach:** Form generation based on metadata configuration

**Key Benefits:**
- Reusable form generation logic
- Configuration-driven field creation
- Consistent validation patterns
- Reduced boilerplate code

**Field Definition Pattern:**
```typescript
export interface FieldDef {
  name: string;
  label: string;
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  type?: string;
  options?: { value: string; label: string }[];
  pattern?: RegExp;
}

// Schema generation logic
export function toSchema(meta: FieldDef[]): Schema<unknown> {
  return schema<unknown>((path: any) => {
    for (const fieldDef of meta) {
      const prop = fieldDef.name;
      const fieldPath = path[prop];
      
      // Apply required validator
      if (fieldDef.required) {
        required(fieldPath);
      }
      
      // Apply email validator for email fields
      if (fieldDef.type === 'email') {
        email(fieldPath);
      }
      
      // Apply minLength validator
      if (typeof fieldDef.minLength !== 'undefined') {
        minLength(fieldPath, fieldDef.minLength);
      }
      
      // Apply maxLength validator
      if (typeof fieldDef.maxLength !== 'undefined') {
        maxLength(fieldPath, fieldDef.maxLength);
      }
      
      // Apply pattern validator
      if (fieldDef.pattern) {
        pattern(fieldPath, fieldDef.pattern);
      }
    }
  });
}
```

**Dynamic Template Rendering:**
```html
@for(fieldDef of metaInfo(); track fieldDef.name) { 
  @let field = dynamicForm()[fieldDef.name];
  <div class="mb-4">
    <label class="block text-gray-700 text-sm font-bold mb-2">
      {{ fieldDef.label }}
    </label>

    @switch (fieldDef.type) { 
      @case ('select') {
        <select [field]="field" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
          @for(option of fieldDef.options; track option.value) {
            <option [value]="option.value">{{ option.label }}</option>
          }
        </select>
      } 
      @case ('textarea') {
        <textarea [field]="field" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" rows="4"></textarea>
      } 
      @default {
        <input [field]="field" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
      } 
    } 
    @if (field && field().errors && field().errors().length > 0) {
      <p class="text-red-500 text-xs italic mt-1">
        {{ getErrorMessage(field().errors()[0]) }}
      </p>
    }
  </div>
}
```

---

## Testing Strategy

### Unit Testing Approach

**Test Structure:**
```typescript
import { describe, it, expect, beforeEach } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { UserStore } from './stores/user.store';
import { UserService } from './service/user.service';

describe('UserStore', () => {
  let store: any;
  let userService: UserService;
  
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [UserService]
    });
    
    store = TestBed.inject(UserStore);
    userService = TestBed.inject(UserService);
  });
  
  it('should initialize with empty state', () => {
    expect(store.users()).toEqual([]);
    expect(store.loading()).toBe(false);
    expect(store.error()).toBeNull();
  });
  
  it('should compute user count correctly', () => {
    TestBed.runInInjectionContext(() => {
      store.patchState({
        users: [
          { id: 1, name: 'User 1', email: 'user1@example.com', category: 'user' },
          { id: 2, name: 'User 2', email: 'user2@example.com', category: 'user' }
        ]
      });
      
      expect(store.userCount()).toBe(2);
      expect(store.hasUsers()).toBe(true);
    });
  });
});
```

**Testing Benefits of Signal Pattern:**
- Direct state assertion without complex setup
- Synchronous testing of async operations
- Predictable state transitions
- Easy stubbing of dependencies

---

## Best Practices & Lessons Learned

### 1. Signal Patterns

**Do's:**
- Use `computed()` for derived state
- Implement async/await with proper error handling
- Use `linkedSignal()` for form binding
- Mark Angular-managed properties as `readonly`

**Don'ts:**
- Avoid `effect()` for setting state
- Don't create signals in computed functions
- Avoid over-computing derived state

### 2. Form Implementation Patterns

**Signal Forms:**
- Use for complex validation logic
- Better for unique form requirements
- More control over field behavior
- Easier debugging and testing

**Dynamic Forms:**
- Use for repetitive form patterns
- Better for CRUD operations
- Configuration-driven approach
- Consistent user experience

### 3. State Management Best Practices

**Store Implementation:**
- Use structured state with `withState`
- Implement methods with `withMethods` for side effects
- Use `withComputed` for derived state
- Implement proper error boundaries

**Performance Considerations:**
- Use `computed()` for expensive calculations
- Implement proper memoization
- Avoid unnecessary signal updates
- Use `untrack()` where appropriate

### 4. Error Handling Strategy

**Patterns Demonstrated:**
- Async/await with try/catch error handling
- User-friendly error messages
- Centralized error handling
- Async operation state tracking

### 5. Component Architecture

**Modern Angular 21 Patterns:**
- Standalone components throughout
- `inject()` function for dependency injection
- Signal-based inputs and outputs
- Native control flow syntax (`@if`, `@for`)
- Component input binding with `withComponentInputBinding()`

---

## Summary

This curriculum demonstrates the complete development of a modern Angular 21 application showcasing:

1. **Advanced State Management** with NgRx Signals using `signalStore` and feature APIs
2. **Two Distinct Form Patterns** - Signal Forms and Dynamic Forms
3. **Modern Angular Architecture** with standalone components
4. **Reactive Programming Patterns** with signals and computed properties
5. **Comprehensive Testing Strategy** with modern tools

The application serves as a reference implementation for developers learning modern Angular patterns and provides practical examples of cutting-edge Angular 21 features in a real-world context.

**Key Takeaways:**
- Signal-based architecture simplifies state management
- Dynamic forms enable reusable form generation
- Modern Angular patterns reduce boilerplate
- Testing becomes more straightforward with signals
- Error handling with async/await provides better UX

This curriculum provides a complete roadmap for building modern Angular applications with the latest features and best practices.