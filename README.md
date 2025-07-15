# Virtualized Data Table

A high-performance, fully-featured virtualized data table built with React, Redux Toolkit, and `@tanstack/react-virtual`. Supports thousands of rows and columns with smooth performance, dynamic cell content (videos, audios, editable fields), filtering, sorting, search, pagination, and responsive row/column sizing.

---

## 🔧 Features

- 🔁 **Infinite Scroll** with paginated backend-style data fetching
- 🧠 **Virtualization** for both rows and columns using `@tanstack/react-virtual`
- 📹 **Embedded Media Support**:
  - Video strips (YouTube embeds)
  - Audio strips (HTML5 audio)
- 🔎 **Global Search** with debounce
- 🎯 **Column Filtering** (multi-select dropdowns)
- ⬆️⬇️ **Column Sorting** (text & media-aware)
- ✏️ **Inline Editable Cells**
- 🧱 **Dynamic Row & Column Sizing** (measured per content)
- 🧪 **Redux Toolkit** based state management
- 📦 **Lazy loading** and **simulated backend API**


---

## 🚀 Getting Started

### 1. Install Dependencies

```bash
npm install
# or
yarn install
```

### 2. Run the App

```bash
npm run dev
```

### 🔍 Filtering, Searching, Sorting
Filtering: Multi-select per column, works with text, audio, and video types

Search: Global search input with debounce

Sorting: Ascending/descending per column; for media, it sorts by number of items (e.g., number of video IDs)

### 🧪 Simulated Backend (simulateFetchPage)
Located in features/table/tableAPI.ts

Generates paginated, realistic-looking data

Accepts searchQuery, columnFilters, sort, and page

Simulates latency (setTimeout) to mimic real API behavior

### ✨ Advanced Features
Dynamic measurement: Row heights and column widths are measured per cell based on actual rendered content.

Media handling:

Videos open in a modal (YouTube embed)

Audios render in row-aligned strips

Debounced search uses a memoized useDebouncedValue for performance

### 🛠 Technologies Used
React + TypeScript

Redux Toolkit

@tanstack/react-virtual

SCSS Modules

HTML5 audio/video APIs
