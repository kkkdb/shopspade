# Shopspade

This is a monorepo project containing a Vue 3 component library and utility functions.

## Project Structure

```
shopspade/
```
├── packages/
│   ├── components/     # Vue 3 component library
│   └── utils/         # Utility library
├── examples/          # Example projects
```

## Installation

### Components

```bash
pnpm add @shopspade/components
```

### Utils

```bash
pnpm add @shopspade/utils
```

## Usage

```typescript
// Import components
import { Button } from '@shopspade/components'
import '@shopspade/components/style'

// Import utilities
import { request } from '@shopspade/utils'
```

## Development Setup

1. Install dependencies:
```bash
pnpm install
```

2. Build all packages:
```bash
pnpm build
```

3. Development:
```bash
pnpm dev
```

## Usage

### Components

```typescript
import { Button } from '@shopspade/components'
import '@shopspade/components/style'
```

### Utils

```typescript
import { formatDate, debounce } from '@shopspade/utils'
```

## Commands

- `pnpm build`: Build all packages
- `pnpm dev`: Start development mode
- `pnpm lint`: Lint all packages
- `pnpm test`: Run tests
- `pnpm clean`: Clean build artifacts
