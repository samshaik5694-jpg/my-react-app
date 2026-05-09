import { useState } from "react";

const INTERVIEW_CATEGORIES = [
  {
    id: "javascript",
    name: "JavaScript",
    icon: "🟨",
    color: "#f7df1e",
    questions: [
      {
        q: "What is the difference between var, let, and const?",
        a: "var is function-scoped and hoisted. let is block-scoped and hoisted (TDZ). const is block-scoped, hoisted (TDZ), and immutable. Use const by default, let when reassignment needed, avoid var.",
      },
      {
        q: "Explain event bubbling and event capturing.",
        a: "Capturing: event travels down from root to target. Bubbling: event travels up from target to root. Most events bubble by default. Use addEventListener(event, handler, true) to capture.",
      },
      {
        q: "What is a closure?",
        a: "A closure is a function that has access to variables from its outer scope even after the outer function has returned. Created automatically when functions are nested.",
      },
      {
        q: "What is hoisting?",
        a: "JavaScript moves declarations to the top of their scope before code execution. var and function declarations are hoisted and initialized. let/const are hoisted but not initialized (Temporal Dead Zone).",
      },
      {
        q: "Explain the this keyword.",
        a: "this refers to the context object where a function is called. In methods: object, arrow functions: parent scope, global functions: window/undefined (strict), new: new instance, call/apply/bind: specified context.",
      },
      {
        q: "What is a promise?",
        a: "Promise is an object representing eventual completion/failure of async operation. States: pending, fulfilled, rejected. Use .then(), .catch(), .finally(). Better than callbacks for async flow.",
      },
      {
        q: "Difference between async/await and promises?",
        a: "async/await is syntactic sugar over promises. async function returns a promise. await pauses execution until promise settles. Cleaner error handling with try/catch vs .catch().",
      },
      {
        q: "What is event delegation?",
        a: "Technique of attaching a listener to a parent element instead of each child. Event bubbles up, check event.target to identify clicked child. Saves memory, handles dynamic elements.",
      },
      {
        q: "Explain prototype and prototype chain.",
        a: "Every JS object has __proto__ pointing to its prototype. Chain: object → constructor.prototype → Object.prototype → null. Used for inheritance and property lookup.",
      },
      {
        q: "What is destructuring?",
        a: "Syntax to unpack values from arrays or properties from objects. Array: const [a, b] = [1, 2]. Object: const {x, y} = {x: 1, y: 2}. Simplifies code and improves readability.",
      },
      {
        q: "What is the spread operator?",
        a: "Spreads array/object elements. Arrays: [...arr1, ...arr2]. Objects: {...obj1, ...obj2}. Shallow copy. Useful for merging, copying, passing arguments.",
      },
      {
        q: "Explain map, filter, reduce.",
        a: "map: transforms each element, returns new array. filter: selects elements matching condition. reduce: accumulates values into single result. All return new array (except reduce).",
      },
      {
        q: "What is memoization?",
        a: "Optimization technique caching function results. Returns cached result if inputs are same. Prevents expensive recalculations. Common in recursion, React (useMemo).",
      },
      {
        q: "Difference between == and ===?",
        a: "== coerces types before comparing. === strict equality, no type coercion. Always use === to avoid unexpected behaviors. == can hide bugs.",
      },
      {
        q: "What is NaN and how to check it?",
        a: "NaN is 'Not-a-Number', typeof NaN === 'number'. Check with Number.isNaN(x) or Number.isNaN(x) (best). isNaN() coerces first, less reliable.",
      },
      {
        q: "Explain null vs undefined.",
        a: "null: intentional absence of value, assigned by programmer. undefined: unintentional absence, default for missing parameters/returns. typeof null === 'object' (bug), typeof undefined === 'undefined'.",
      },
      {
        q: "What is a callback function?",
        a: "Function passed to another function, invoked inside. Used for handling async operations, event handlers. Can lead to callback hell if nested deeply.",
      },
      {
        q: "What is function currying?",
        a: "Technique converting function taking multiple args into series of functions taking one arg. Enables partial application. Example: f(a,b,c) → f(a)(b)(c).",
      },
      {
        q: "Explain the bind, call, and apply methods.",
        a: "bind: returns new function with this bound, doesn't invoke. call: invokes immediately with this and individual args. apply: invokes immediately with this and array of args.",
      },
      {
        q: "What is object-oriented programming in JS?",
        a: "JS uses prototypal inheritance, not classical. Create objects with constructors/classes, prototype methods for shared functionality. ES6 class syntax provides classical OOP appearance.",
      },
    ],
  },
  {
    id: "react",
    name: "React",
    icon: "⚛️",
    color: "#61dafb",
    questions: [
      {
        q: "What is React?",
        a: "JavaScript library for building UIs with reusable components. Uses virtual DOM for efficient rendering. Declarative, component-based, learns once and applies everywhere.",
      },
      {
        q: "Explain virtual DOM.",
        a: "In-memory representation of actual DOM. React updates vDOM, diffs with previous version, batches changes, updates only changed parts in real DOM. Improves performance.",
      },
      {
        q: "What are hooks?",
        a: "Functions letting use state and other React features in functional components. Common: useState, useEffect, useContext, useReducer. Rules: only call at top level, only in React functions.",
      },
      {
        q: "Difference between state and props?",
        a: "State: internal component data, mutable, managed locally. Props: external data passed from parent, immutable, read-only. Parent updates props, child re-renders.",
      },
      {
        q: "What is useEffect?",
        a: "Hook for side effects (API calls, subscriptions, DOM updates). Runs after render. Dependency array: [] runs once, [dep] when dep changes, no array runs always. Returns cleanup function.",
      },
      {
        q: "Explain useContext.",
        a: "Hook for accessing context value. Avoids prop drilling. Create context with React.createContext(), provide with Context.Provider, consume with useContext(Context).",
      },
      {
        q: "What is useReducer?",
        a: "Hook for complex state logic. Takes reducer function and initial state. Returns state and dispatch. Better than useState for multiple related state updates.",
      },
      {
        q: "What is useMemo?",
        a: "Hook memoizing computed values. Prevents expensive recalculations. Takes function and dependency array. Returns memoized value. Use when computation is expensive.",
      },
      {
        q: "What is useCallback?",
        a: "Hook memoizing function references. Prevents unnecessary re-renders of child components receiving function as prop. Takes function and dependency array.",
      },
      {
        q: "What is React.memo?",
        a: "HOC preventing re-renders when props haven't changed. Compares props shallowly. Wrap component: React.memo(Component). Custom comparison: React.memo(Component, compareFunction).",
      },
      {
        q: "Explain controlled vs uncontrolled components.",
        a: "Controlled: React state controls form value. Change updates state, state updates input. Uncontrolled: DOM controls form value. Access via ref. Use controlled for better control.",
      },
      {
        q: "What are fragments?",
        a: "React.Fragment allows returning multiple elements without wrapper div. Syntax: <> ... </> or <React.Fragment> ... </React.Fragment>. Cleaner DOM, no extra nodes.",
      },
      {
        q: "Explain keys in lists.",
        a: "Keys help React identify which items changed. Use stable IDs, not index (if list reorders). Without keys, React may re-render wrong components, losing state.",
      },
      {
        q: "What is prop drilling?",
        a: "Passing props through multiple layers even if intermediate components don't use them. Problem: verbose, hard to maintain. Solution: useContext, Redux, or other state management.",
      },
      {
        q: "Explain lifting state up.",
        a: "Moving state to nearest common ancestor when multiple components need same state. Enables parent to manage and pass state/handlers to children. Single source of truth.",
      },
      {
        q: "What are higher-order components (HOC)?",
        a: "Pattern taking component and returning enhanced component. Used for code reuse, state abstraction, props manipulation. Examples: React.memo, connect (Redux).",
      },
      {
        q: "What is render props pattern?",
        a: "Pattern using function as prop to share code between components. Component receives function returning React elements. Enables flexible, reusable logic without HOC.",
      },
      {
        q: "Explain React.StrictMode.",
        a: "Development tool highlighting potential problems. Intentionally double-renders components, detects unsafe lifecycles, warns legacy string refs. No effect in production.",
      },
      {
        q: "What is lazy loading in React?",
        a: "React.lazy() and Suspense for code splitting. Lazy: const Component = React.lazy(() => import('./Component')). Wrap with Suspense for fallback UI during load.",
      },
      {
        q: "How to optimize React app?",
        a: "Use React.memo, useMemo, useCallback. Code splitting with lazy(). Virtualization for long lists. Avoid inline functions/objects as props. Profile with DevTools.",
      },
    ],
  },
  {
    id: "system-design",
    name: "System Design",
    icon: "🏗️",
    color: "#00d4ff",
    questions: [
      {
        q: "What is system design?",
        a: "Process of defining architecture of large-scale system. Considers scalability, reliability, performance, maintainability. Balances tradeoffs. Not about coding, about high-level decisions.",
      },
      {
        q: "Explain scalability.",
        a: "Ability to handle increased load. Vertical: add more power to single machine (limited). Horizontal: add more machines (better). Requires stateless services, distributed databases.",
      },
      {
        q: "What is a load balancer?",
        a: "Distributes incoming requests across multiple servers. Ensures no single server overloaded. Algorithms: round-robin, least connections, IP hash. Can be hardware or software.",
      },
      {
        q: "Explain database sharding.",
        a: "Horizontal partitioning of data across multiple databases. Shard key determines which shard stores data. Improves scalability but complicates queries, transactions.",
      },
      {
        q: "What is caching?",
        a: "Storing frequently accessed data in fast storage. Reduces database load, improves response time. Types: in-memory (Redis), browser, CDN. Tradeoff: staleness vs performance.",
      },
      {
        q: "Explain CDN.",
        a: "Content Delivery Network distributes content geographically. Edge servers near users serve content. Reduces latency, bandwidth. Good for static assets, videos.",
      },
      {
        q: "What is eventual consistency?",
        a: "Consistency model where updates propagate asynchronously. System eventually reaches consistent state, not immediately. Enables better availability. Used in NoSQL databases.",
      },
      {
        q: "Explain CAP theorem.",
        a: "System can guarantee at most 2 of 3: Consistency (all nodes see same data), Availability (always responsive), Partition tolerance (tolerates network failures). Choose 2.",
      },
      {
        q: "What is database replication?",
        a: "Copying data across multiple databases. Master-slave: writes to master, reads from slaves. Improves read performance, availability. Introduces consistency challenges.",
      },
      {
        q: "Explain message queues.",
        a: "Async communication between services. Producer sends message, consumer processes later. Decouples services, improves reliability. Examples: RabbitMQ, Kafka, SQS.",
      },
      {
        q: "What is API rate limiting?",
        a: "Restricting number of requests per time period. Prevents abuse, ensures fair usage. Algorithms: token bucket, sliding window, fixed window. Returns 429 Too Many Requests.",
      },
      {
        q: "Explain microservices architecture.",
        a: "Building app as collection of loosely coupled services. Each service: own database, independently deployable, communicates via API/messages. Enables scalability, flexibility.",
      },
      {
        q: "What is circuit breaker pattern?",
        a: "Prevents cascading failures. Wraps requests to failing service. States: closed (normal), open (failing, reject requests), half-open (test recovery). Improves resilience.",
      },
      {
        q: "Explain idempotency.",
        a: "Property of operation: executing multiple times = executing once. Important for distributed systems with retries. Enables safe retries without duplicates.",
      },
      {
        q: "What is consistent hashing?",
        a: "Distributes data across nodes. When node added/removed, only affected data redistributes. Better than modulo hashing. Used in caches, databases, distributed systems.",
      },
      {
        q: "Explain bloom filter.",
        a: "Probabilistic data structure testing set membership. Space-efficient, fast lookup. False positives possible, no false negatives. Used in caches, databases for quick filtering.",
      },
      {
        q: "What is gRPC?",
        a: "High-performance RPC framework using Protocol Buffers. Faster than REST (HTTP/2, binary). Good for microservices communication. Streaming support.",
      },
      {
        q: "Explain event sourcing.",
        a: "Storing sequence of state changes as immutable events. Current state derived by replaying events. Enables audit trail, temporal queries, event replay.",
      },
      {
        q: "What is CQRS?",
        a: "Command Query Responsibility Segregation. Separate models for updates (commands) and reads (queries). Improves performance, scalability. More complex to implement.",
      },
      {
        q: "Explain distributed transactions.",
        a: "Transactions across multiple services/databases. Challenges: failures, partial commits, consistency. Solutions: 2-phase commit (slow, blocking), saga pattern (eventual consistency).",
      },
    ],
  },
  {
    id: "data-structures",
    name: "Data Structures",
    icon: "📊",
    color: "#69db7c",
    questions: [
      {
        q: "What is a linked list?",
        a: "Sequential data structure where each node contains data and reference to next node. Advantages: O(1) insertion/deletion at known position. Disadvantages: O(n) access, extra memory for pointers.",
      },
      {
        q: "Explain stack and queue.",
        a: "Stack: LIFO (Last In First Out). Queue: FIFO (First In First Out). Stack used for: recursion, undo/redo, expression evaluation. Queue for: BFS, task scheduling.",
      },
      {
        q: "What is a hash table?",
        a: "Data structure mapping keys to values using hash function. Average O(1) operations. Handles collisions with chaining or open addressing. Load factor affects performance.",
      },
      {
        q: "Explain binary tree and BST.",
        a: "Binary tree: each node has max 2 children. BST: left < parent < right. Enables efficient search O(log n) if balanced. Unbalanced BST degrades to O(n).",
      },
      {
        q: "What is a heap?",
        a: "Complete binary tree where parent >= children (max heap) or parent <= children (min heap). Supports O(log n) insert/delete. Root is max/min element. Used in priority queues.",
      },
      {
        q: "Explain graph representations.",
        a: "Adjacency list: node → list of neighbors. Space O(V+E), good for sparse. Adjacency matrix: 2D array. Space O(V²), good for dense, fast lookup.",
      },
      {
        q: "What is trie?",
        a: "Tree structure for storing strings efficiently. Each node represents character. Enables O(m) search where m is word length. Good for autocomplete, IP routing.",
      },
      {
        q: "Explain union-find (disjoint set).",
        a: "Data structure for managing disjoint sets. Operations: union (merge sets), find (find representative). Uses path compression and union by rank for near O(1) amortized.",
      },
      {
        q: "What is a segment tree?",
        a: "Tree for range queries and updates. Supports O(log n) range sum, min, max queries and updates. More complex than simple arrays but faster for queries.",
      },
      {
        q: "Explain fenwick tree (binary indexed tree).",
        a: "Efficient structure for prefix sum queries and updates. O(log n) for both. More space-efficient than segment tree. Single array representation.",
      },
      {
        q: "What is a skip list?",
        a: "Probabilistic data structure enabling fast search in linked list. Multiple levels with fewer nodes at higher levels. O(log n) average search, simpler than balanced trees.",
      },
      {
        q: "Explain AVL tree.",
        a: "Self-balancing BST where height difference between children <= 1. Maintains O(log n) search/insert/delete. More balanced than regular BST, more overhead on insertions.",
      },
      {
        q: "What is red-black tree?",
        a: "Self-balancing BST with color property. Constraints: root black, red node → black children, all paths same black count. Less strict than AVL, fewer rebalances.",
      },
      {
        q: "Explain B-tree.",
        a: "Generalized balanced tree where each node can have many children. Good for databases (minimizes disk I/O). Maintains order, supports range queries efficiently.",
      },
      {
        q: "What is suffix array?",
        a: "Sorted array of all suffixes of string. Enables O(log n) substring search after O(n log n) construction. More space-efficient than suffix tree.",
      },
      {
        q: "Explain bloom filter.",
        a: "Space-efficient probabilistic structure for membership testing. False positives possible, no false negatives. Used in caches, spam filters for fast filtering.",
      },
      {
        q: "What is a deque?",
        a: "Double-ended queue supporting insertions/deletions at both ends. Generalizes stack and queue. Used in sliding window problems, web browser history.",
      },
      {
        q: "Explain monotonic stack/queue.",
        a: "Stack/queue maintaining elements in monotonic order. Used for: next greater element, sliding window maximum, stock span. Achieves O(n) for problems requiring O(n²) brute force.",
      },
      {
        q: "What is a cartesian tree?",
        a: "Binary tree where in-order traversal gives original sequence and heap property maintained. Used for: RMQ (range minimum query), LCA (lowest common ancestor).",
      },
      {
        q: "Explain persistent data structure.",
        a: "Data structure preserving previous versions. Enables undo/redo, version history. Achieved with structural sharing. More space overhead but enables time travel.",
      },
    ],
  },
  {
    id: "algorithms",
    name: "Algorithms",
    icon: "🔄",
    color: "#ff6b6b",
    questions: [
      {
        q: "Explain sorting algorithms.",
        a: "Bubble: O(n²) simple. Quick: O(n log n) avg, O(n²) worst, divide-conquer. Merge: O(n log n) stable, requires O(n) extra space. Heap: O(n log n) in-place.",
      },
      {
        q: "What is binary search?",
        a: "Search sorted array in O(log n). Compare middle element, eliminate half. Requires array to be sorted. More efficient than linear O(n) for large data.",
      },
      {
        q: "Explain BFS (breadth-first search).",
        a: "Explores graph level by level using queue. Finds shortest path in unweighted graph. O(V+E) time and space. Used in: level order traversal, shortest path, connected components.",
      },
      {
        q: "What is DFS (depth-first search)?",
        a: "Explores graph deeply using stack/recursion. Useful for: topological sort, cycle detection, connected components. O(V+E) time. Can use less space than BFS with recursion.",
      },
      {
        q: "Explain Dijkstra's algorithm.",
        a: "Finds shortest path from source in weighted graph. Greedy approach. Time: O((V+E) log V) with min heap. Works with non-negative weights. Can't handle negative weights.",
      },
      {
        q: "What is Bellman-Ford algorithm?",
        a: "Finds shortest path with negative weights. O(VE) time. Detects negative cycles. Slower than Dijkstra but more general. Useful for: OSPF, EIGRP routing protocols.",
      },
      {
        q: "Explain Floyd-Warshall algorithm.",
        a: "Finds shortest paths between all pairs. O(V³) time. Works with negative weights (no negative cycles). More practical for small dense graphs.",
      },
      {
        q: "What is topological sort?",
        a: "Linear ordering of vertices in DAG where edge u→v means u before v. Used for: task scheduling, dependency resolution, build systems. O(V+E) using DFS or Kahn's algorithm.",
      },
      {
        q: "Explain Kruskal's algorithm.",
        a: "Finds minimum spanning tree. Greedy: sort edges, add if doesn't create cycle. O(E log E) with union-find. Better for sparse graphs than Prim's.",
      },
      {
        q: "What is Prim's algorithm?",
        a: "Finds minimum spanning tree. Builds from any vertex, greedily adds minimum edge. O(V²) simple, O((V+E) log V) with heap. Better for dense graphs.",
      },
      {
        q: "Explain dynamic programming.",
        a: "Optimization technique solving overlapping subproblems with memoization. Two approaches: top-down (recursion + memo), bottom-up (iteration). Reduces exponential to polynomial.",
      },
      {
        q: "What is greedy algorithm?",
        a: "Makes locally optimal choice at each step. Doesn't reconsider. Used for: Dijkstra, Kruskal, Huffman. May not give global optimum. Faster but less general.",
      },
      {
        q: "Explain divide and conquer.",
        a: "Breaks problem into subproblems, solves recursively, combines results. Examples: merge sort, quick sort, binary search. Often O(n log n). Enables parallel processing.",
      },
      {
        q: "What is backtracking?",
        a: "Explores all possibilities, abandons branch if invalid. Used for: N-queens, sudoku, permutations, combinations. Often exponential time but prunes invalid branches.",
      },
      {
        q: "Explain string matching (KMP, Boyer-Moore).",
        a: "KMP: O(n+m) preprocessing failure function. Boyer-Moore: O(n/m) average, skips characters. Both better than naive O(nm). Used in text editors, search engines.",
      },
      {
        q: "What is Rabin-Karp algorithm?",
        a: "Rolling hash for pattern matching. O(n+m) average, O(nm) worst. Useful for multiple pattern matching. Less overhead than KMP, good for practical use.",
      },
      {
        q: "Explain Huffman coding.",
        a: "Greedy algorithm for lossless compression. Builds optimal binary tree, assigns codes. Variable-length codes: frequent chars shorter. O(n log n) time, compression ratio typically 20-90%.",
      },
      {
        q: "What is A* algorithm?",
        a: "Graph search combining Dijkstra with heuristic. f(n) = g(n) + h(n). Faster than Dijkstra if good heuristic. Used in: pathfinding, games, robotics.",
      },
      {
        q: "Explain randomized algorithms.",
        a: "Algorithms using randomness. Quick sort (random pivot), Monte Carlo (probabilistic answer), Las Vegas (always correct). Avoids worst cases, good average performance.",
      },
      {
        q: "What is NP-completeness?",
        a: "Problem in NP if solution verifiable in polynomial time. NP-complete if NP-hard and in NP. Examples: TSP, SAT, knapsack. No known polynomial solution. Important in CS theory.",
      },
    ],
  },
  {
    id: "web",
    name: "Web & Networking",
    icon: "🌐",
    color: "#ffa94d",
    questions: [
      {
        q: "Explain HTTP vs HTTPS.",
        a: "HTTP: plain text, unencrypted, port 80. HTTPS: encrypted with TLS/SSL, port 443, secure. HTTPS prevents man-in-middle attacks, eavesdropping. Always use HTTPS in production.",
      },
      {
        q: "What is REST API?",
        a: "Representational State Transfer. Resources identified by URLs. Standard methods: GET (read), POST (create), PUT (update), DELETE (remove). Stateless, cacheable, scalable.",
      },
      {
        q: "Explain HTTP status codes.",
        a: "1xx: informational. 2xx: success (200 OK, 201 Created). 3xx: redirect (301, 304). 4xx: client error (400, 404, 401). 5xx: server error (500, 503).",
      },
      {
        q: "What is CORS?",
        a: "Cross-Origin Resource Sharing. Allows cross-domain requests. Browser enforces. Server sends Access-Control headers. Preflight OPTIONS request sent automatically. Prevents CSRF attacks.",
      },
      {
        q: "Explain cookies vs local storage vs session storage.",
        a: "Cookies: sent with each request, 4KB, expirable. LocalStorage: client-only, 5-10MB, persistent. SessionStorage: like localStorage but cleared on tab close. All vulnerable to XSS.",
      },
      {
        q: "What is OAuth 2.0?",
        a: "Authorization protocol for secure third-party access. User authorizes app to access resource. Tokens: access (short-lived), refresh (long-lived). Better than sharing passwords.",
      },
      {
        q: "Explain JWT (JSON Web Token).",
        a: "Token format: header.payload.signature. Self-contained, verifiable. Stateless authentication. Useful for APIs, microservices. Cannot be revoked immediately (use blacklist).",
      },
      {
        q: "What is JSONP?",
        a: "Workaround for same-origin policy using script tags. Returns JavaScript code calling function. Deprecated with CORS support. Security risk: any script executed.",
      },
      {
        q: "Explain WebSocket.",
        a: "Protocol enabling full-duplex communication over TCP. Persistent connection. Real-time applications: chat, notifications, gaming. Better than polling for many updates.",
      },
      {
        q: "What is GraphQL?",
        a: "Query language for APIs. Client specifies exactly needed data. Single endpoint. More efficient than REST for complex queries. Learning curve but powerful.",
      },
      {
        q: "Explain Content Security Policy (CSP).",
        a: "Security mechanism preventing XSS attacks. Specifies trusted sources for scripts, styles, etc. Set via header. Restricts inline scripts. Requires nonce/hash for inline.",
      },
      {
        q: "What is X-Frame-Options header?",
        a: "Prevents clickjacking attacks. Options: DENY (no framing), SAMEORIGIN, ALLOW-FROM. Tells browser if page can be embedded in iframes. Important security header.",
      },
      {
        q: "Explain DNS resolution.",
        a: "Process translating domain to IP. Local cache → recursive resolver → root nameserver → TLD → authoritative nameserver. Caching at each level. TTL controls cache duration.",
      },
      {
        q: "What is TCP/IP model?",
        a: "4 layers: Application (HTTP, FTP), Transport (TCP, UDP), Internet (IP), Link (Ethernet). TCP: reliable, ordered, slower. UDP: fast, unreliable, good for streaming.",
      },
      {
        q: "Explain handshake protocols.",
        a: "TCP 3-way: SYN, SYN-ACK, ACK before connection. TLS: extends with certificate exchange, cipher negotiation. Ensures connection, security. Adds latency but necessary.",
      },
      {
        q: "What is gzip compression?",
        a: "Lossless compression reducing response size. Server sends Content-Encoding: gzip header. Browser decompresses. Significantly reduces bandwidth (50-70% typical). Enable on server.",
      },
      {
        q: "Explain service workers.",
        a: "JavaScript running in background. Enables: offline support, push notifications, background sync. Registered per scope. Can intercept requests, cache responses. Foundation for PWA.",
      },
      {
        q: "What is progressive web app (PWA)?",
        a: "Web app with native-like experience. Features: responsive, offline (service worker), installable, fast, secure (HTTPS). Combines web and app benefits.",
      },
      {
        q: "Explain Same-Origin Policy.",
        a: "Security mechanism restricting scripts to same origin (protocol://domain:port). Prevents malicious scripts accessing sensitive data. CORS is controlled exception.",
      },
      {
        q: "What is man-in-the-middle (MITM) attack?",
        a: "Attacker intercepts communication between two parties. Impersonates both sides, captures data. HTTPS/TLS prevents by encrypting. Also VPN, certificate pinning protect.",
      },
    ],
  },
  {
    id: "html-css",
    name: "HTML & CSS",
    icon: "🎨",
    color: "#e34c26",
    questions: [
      {
        q: "What is semantic HTML?",
        a: "Using HTML elements meaningfully: <header>, <nav>, <article>, <footer>, <main>. Improves accessibility, SEO, maintainability. Screen readers understand structure better.",
      },
      {
        q: "Explain box model.",
        a: "Content → padding → border → margin. Box-sizing: content-box (default, width excludes padding/border), border-box (width includes). Use border-box generally.",
      },
      {
        q: "What is CSS specificity?",
        a: "Hierarchy: inline (1000) > ID (100) > class/pseudo (10) > element (1). Higher specificity overrides lower. !important (10000) overrides all. Avoid !important, use proper specificity.",
      },
      {
        q: "Explain CSS cascading.",
        a: "Rules applied in order: browser defaults → external CSS → internal CSS → inline styles. Later rules override earlier. Specificity determines precedence.",
      },
      {
        q: "What is CSS flexbox?",
        a: "Layout model for 1D (row/column) layouts. Container properties: display: flex, flex-direction, justify-content, align-items. Item properties: flex-grow, flex-shrink, flex-basis. Responsive, intuitive.",
      },
      {
        q: "Explain CSS grid.",
        a: "Layout model for 2D (rows and columns) layouts. Properties: grid-template-rows, grid-template-columns, gap. Place items with grid-column, grid-row. Powerful for complex layouts.",
      },
      {
        q: "What is CSS positioning?",
        a: "static (default, flow), relative (offset from static), absolute (removed from flow, relative to positioned parent), fixed (relative to viewport), sticky (hybrid). z-index controls layering.",
      },
      {
        q: "Explain responsive design.",
        a: "Design adapting to different screen sizes. Techniques: flexible layouts, flexible images/media, media queries. Mobile-first approach. Improves accessibility and UX.",
      },
      {
        q: "What is mobile-first design?",
        a: "Start with mobile design, progressively enhance for larger screens. Use min-width media queries. Forces prioritization, improves performance on mobile. Best practice.",
      },
      {
        q: "Explain CSS media queries.",
        a: "Apply styles based on conditions: @media (min-width: 768px) { ... }. Common breakpoints: mobile (320px), tablet (768px), desktop (1024px). Enable responsive design.",
      },
      {
        q: "What is BEM (Block Element Modifier)?",
        a: "CSS naming convention: .block, .block__element, .block--modifier. Improves readability, avoids conflicts, makes refactoring easier. Widely adopted, good for maintainability.",
      },
      {
        q: "Explain CSS preprocessing (SASS/LESS).",
        a: "Languages extending CSS with variables, nesting, mixins, functions. Compile to CSS. Enable code reuse, organization. SASS (SCSS syntax) more popular than LESS.",
      },
      {
        q: "What is CSS specificity problem?",
        a: "High specificity selectors hard to override. Leads to escalating specificity. Solution: keep specificity low, avoid nesting, use classes over IDs, never use !important.",
      },
      {
        q: "Explain CSS custom properties (variables).",
        a: "Syntax: --variable-name: value; access: var(--variable-name). Cascade, inherit to children. Dynamic (can change with JavaScript). Enable theming, maintainability.",
      },
      {
        q: "What is CSS animation?",
        a: "Define @keyframes, apply with animation property. Smoother than transitions for complex sequences. Properties: animation-duration, animation-timing-function, animation-delay, animation-iteration-count.",
      },
      {
        q: "Explain CSS transitions.",
        a: "Smooth change between states. Properties: transition-property, transition-duration, transition-timing-function, transition-delay. Triggered by pseudo-classes (:hover) or JavaScript.",
      },
      {
        q: "What is accessibility (a11y)?",
        a: "Designing for people with disabilities: visual, motor, cognitive, hearing. Techniques: semantic HTML, ARIA labels, keyboard navigation, color contrast, alt text, focus management.",
      },
      {
        q: "Explain ARIA roles.",
        a: "Attributes defining element meaning to assistive technologies. Examples: role=\"button\", role=\"navigation\", role=\"alert\". Enhance accessibility when semantic HTML insufficient.",
      },
      {
        q: "What is WCAG 2.1?",
        a: "Web Content Accessibility Guidelines. Three levels: A (minimum), AA (recommended), AAA (enhanced). Four principles: Perceivable, Operable, Understandable, Robust.",
      },
      {
        q: "Explain focus management.",
        a: "Managing where focus moves (keyboard navigation). Use tabindex (0 for natural flow, positive for specific order, -1 for not focusable). Skip links useful. Trap focus in modals.",
      },
    ],
  },
  {
    id: "database",
    name: "Database",
    icon: "🗄️",
    color: "#00d4ff",
    questions: [
      {
        q: "What is normalization?",
        a: "Organizing database to reduce redundancy. Levels: 1NF (no repeating groups), 2NF (no partial dependencies), 3NF (no transitive dependencies), BCNF (strongest). Prevents anomalies.",
      },
      {
        q: "Explain ACID properties.",
        a: "Atomicity: all-or-nothing. Consistency: valid state to valid state. Isolation: concurrent independence. Durability: persistent after commit. Ensures data integrity.",
      },
      {
        q: "What is denormalization?",
        a: "Intentionally adding redundancy for performance. Reduces joins, improves read speed. Tradeoff: slower writes, storage overhead, consistency challenges. Use when reads >> writes.",
      },
      {
        q: "Explain indexing.",
        a: "Data structure (B-tree, hash) speeding up queries. Trades write speed for read speed. Composite indexes for multiple columns. Choose columns with high selectivity.",
      },
      {
        q: "What is query optimization?",
        a: "Improving SQL query performance. Techniques: proper indexing, reducing joins, early filtering (WHERE before JOIN), avoiding N+1 queries, query rewriting. Use EXPLAIN to analyze.",
      },
      {
        q: "Explain JOIN types.",
        a: "INNER: common rows only. LEFT: all from left + matching right. RIGHT: all from right + matching left. FULL OUTER: all from both. CROSS: cartesian product.",
      },
      {
        q: "What is database replication?",
        a: "Copying data to multiple databases. Master-slave: writes to master, reads from slaves. Improves read performance, availability. Introduces consistency challenges, replication lag.",
      },
      {
        q: "Explain master-master replication.",
        a: "Both databases act as master, accepting writes. Requires conflict resolution. Higher availability, complexity. Useful for geographic distribution, hot standby.",
      },
      {
        q: "What is database backup and recovery?",
        a: "Regular backups ensure data preservation. Strategies: full (expensive, complete), incremental (fast, smaller), differential (balance). Recovery: restore from backup + apply logs.",
      },
      {
        q: "Explain NoSQL databases.",
        a: "Non-relational alternatives to SQL. Types: document (MongoDB), key-value (Redis), column-family (HBase), graph (Neo4j). Advantages: flexible schema, scalability. Disadvantages: no ACID, weaker consistency.",
      },
      {
        q: "What is MongoDB?",
        a: "Document database storing JSON-like documents. Flexible schema, horizontal scaling with sharding. Transactions (from v4.0), aggregation pipeline. Good for: rapid development, unstructured data.",
      },
      {
        q: "Explain Redis.",
        a: "In-memory key-value store. Extremely fast (all in RAM). Data structures: strings, lists, sets, hashes, sorted sets. Useful for: caching, sessions, real-time analytics, pub/sub.",
      },
      {
        q: "What is Cassandra?",
        a: "Column-family NoSQL database. Distributed, highly scalable, fault-tolerant. No single point of failure. Eventual consistency. Good for: time-series data, massive scale.",
      },
      {
        q: "Explain database connection pooling.",
        a: "Maintaining pool of reusable connections. Avoids overhead of creating connections per request. Improves performance under load. Configure: min/max size, timeout.",
      },
      {
        q: "What is ORM (Object-Relational Mapping)?",
        a: "Mapping database tables to classes. Automates SQL generation. Examples: Hibernate, SQLAlchemy, Sequelize. Advantages: abstraction, safety. Disadvantages: performance overhead, less control.",
      },
      {
        q: "Explain database transactions.",
        a: "Grouping operations ensuring consistency. Begin, perform operations, commit/rollback. Isolation levels: read uncommitted, read committed, repeatable read, serializable. Higher isolation = more locking.",
      },
      {
        q: "What is deadlock in database?",
        a: "Two transactions wait for each other's locks. Prevents progress. Database detects, rolls back one transaction. Prevent with: consistent lock ordering, short transactions, lower isolation level.",
      },
      {
        q: "Explain sharding vs replication.",
        a: "Replication: copies data across servers for availability/read scaling. Sharding: partitions data across servers for write scaling. Can combine both for distributed database.",
      },
      {
        q: "What is N+1 query problem?",
        a: "Executing one query + N additional queries per result. Instead of JOIN. Slows performance dramatically. Fix: JOIN, eager loading, query batching, caching.",
      },
      {
        q: "Explain database locking.",
        a: "Preventing concurrent access conflicts. Row-level: locks specific rows (more concurrency). Table-level: locks entire table (simpler, more blocking). Deadlock possible with multiple locks.",
      },
    ],
  },
  {
    id: "devops",
    name: "DevOps & Cloud",
    icon: "☁️",
    color: "#ff9900",
    questions: [
      {
        q: "What is DevOps?",
        a: "Combining development and operations. Culture of collaboration, automation, measurement. Goals: faster releases, reliability, scalability. Practices: CI/CD, IaC, monitoring.",
      },
      {
        q: "Explain CI/CD.",
        a: "CI: automatically test code on push. CD: automatically deploy to production. Reduces manual errors, enables frequent releases. Tools: Jenkins, GitLab CI, GitHub Actions.",
      },
      {
        q: "What is Docker?",
        a: "Containerization platform packaging app + dependencies. Lightweight than VMs, consistent across environments. Images: blueprints. Containers: running instances. Improves deployment.",
      },
      {
        q: "Explain Kubernetes.",
        a: "Container orchestration platform. Manages containerized app across cluster. Features: auto-scaling, self-healing, rolling updates, service discovery. Complex but powerful for production.",
      },
      {
        q: "What is infrastructure as code (IaC)?",
        a: "Defining infrastructure via code/configuration. Version control, reproducibility, automation. Tools: Terraform, CloudFormation, Ansible. Enables consistent environments.",
      },
      {
        q: "Explain monitoring and logging.",
        a: "Monitoring: tracking system metrics (CPU, memory, latency). Logging: recording events. Tools: Prometheus, ELK, DataDog. Essential for debugging, alerting, performance optimization.",
      },
      {
        q: "What is AWS (Amazon Web Services)?",
        a: "Cloud computing platform offering 200+ services. Compute (EC2), storage (S3), database (RDS), networking. Flexible, scalable, pay-as-you-go. Dominant cloud provider.",
      },
      {
        q: "Explain AWS EC2.",
        a: "Elastic Compute Cloud providing virtual machines. Auto-scaling, load balancing, security groups. Pay per hour/second. Good for: web servers, databases, batch processing.",
      },
      {
        q: "What is AWS S3?",
        a: "Simple Storage Service for object storage. Highly available, scalable, durable. Good for: backups, media storage, static websites. Use lifecycle policies to manage costs.",
      },
      {
        q: "Explain AWS RDS.",
        a: "Relational Database Service managing MySQL, PostgreSQL, Oracle. Handles backups, patches, replication. Good for: relational data, high availability. More expensive than self-managed.",
      },
      {
        q: "What is AWS Lambda?",
        a: "Serverless compute running code on demand. Pay per execution, auto-scaling. Good for: event-driven workloads, background jobs, APIs. Limited execution time (15 min).",
      },
      {
        q: "Explain AWS API Gateway.",
        a: "Service creating RESTful/WebSocket APIs. Routes requests to backends (Lambda, EC2). Handles authentication, throttling, logging. Common use: Lambda + API Gateway for serverless APIs.",
      },
      {
        q: "What is containerization?",
        a: "Packaging app with dependencies in isolated container. Advantages: portability, resource efficiency, quick startup. Docker industry standard. Lighter than VMs.",
      },
      {
        q: "Explain load balancing.",
        a: "Distributing traffic across servers. Algorithms: round-robin, least connections, IP hash, weighted. Improves availability, performance. Types: layer 4 (TCP), layer 7 (HTTP).",
      },
      {
        q: "What is auto-scaling?",
        a: "Automatically adjusting resources based on demand. Scales up under high load, down when idle. Saves costs, ensures availability. Configure: min/max instances, metrics, policies.",
      },
      {
        q: "Explain blue-green deployment.",
        a: "Two identical production environments: blue (current), green (new). Deploy to green, test, switch traffic. Zero downtime, easy rollback. More infrastructure overhead.",
      },
      {
        q: "What is canary deployment?",
        a: "Gradually rolling out changes to small percentage of users. Monitor metrics, increase if healthy. Less risk than big bang. Slower rollout, good for critical systems.",
      },
      {
        q: "Explain high availability (HA).",
        a: "System designed to operate continuously without downtime. Techniques: redundancy, monitoring, failover, load balancing. SLA: uptime percentage guarantee (99.9% = 9 hours/year down).",
      },
      {
        q: "What is disaster recovery?",
        a: "Plan to restore systems after failures. RTO: recovery time objective. RPO: recovery point objective. Backup strategies, failover procedures. Regular testing essential.",
      },
      {
        q: "Explain serverless computing.",
        a: "Abstract infrastructure management, focus on code. Vendor manages scaling, maintenance. Pay per execution. Advantages: cheap for sporadic workloads, quick deployment. Limitations: latency, debugging.",
      },
    ],
  },
];

export default function InterviewQuestions() {
  const [selectedCategory, setSelectedCategory] = useState(INTERVIEW_CATEGORIES[0].id);
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedIndex, setExpandedIndex] = useState(null);

  const category = INTERVIEW_CATEGORIES.find((c) => c.id === selectedCategory);
  const filteredQuestions = category.questions.filter(
    (q) =>
      q.q.toLowerCase().includes(searchTerm.toLowerCase()) ||
      q.a.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #0f172a 0%, #1a0f2e 100%)",
        color: "#e2e8f0",
        fontFamily: "'Segoe UI', system-ui, sans-serif",
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: "28px 32px",
          borderBottom: "1px solid #1e2535",
          background: "rgba(10, 14, 23, 0.5)",
          backdropFilter: "blur(10px)",
        }}
      >
        <div style={{ maxWidth: "1400px", margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "20px" }}>
            <span style={{ fontSize: "32px" }}>🎓</span>
            <div>
              <h1 style={{ margin: 0, fontSize: "28px", fontWeight: 700 }}>Interview Prep</h1>
              <p style={{ margin: "4px 0 0", color: "#94a3b8", fontSize: "14px" }}>
                {category.questions.length} questions • {INTERVIEW_CATEGORIES.length} categories
              </p>
            </div>
          </div>

          {/* Search */}
          <input
            type="text"
            placeholder="Search questions and answers..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setExpandedIndex(null);
            }}
            style={{
              width: "100%",
              padding: "12px 16px",
              background: "#141824",
              border: "1px solid #334155",
              borderRadius: "8px",
              color: "#e2e8f0",
              fontSize: "14px",
              outline: "none",
              transition: "all 0.2s",
            }}
            onFocus={(e) => {
              e.target.style.borderColor = "#00d4ff";
              e.target.style.background = "#0f172a";
            }}
            onBlur={(e) => {
              e.target.style.borderColor = "#334155";
              e.target.style.background = "#141824";
            }}
          />
        </div>
      </div>

      {/* Main */}
      <div style={{ display: "flex", maxWidth: "1400px", margin: "0 auto" }}>
        {/* Categories sidebar */}
        <div
          style={{
            width: "240px",
            borderRight: "1px solid #1e2535",
            padding: "20px 12px",
            overflowY: "auto",
            maxHeight: "calc(100vh - 120px)",
          }}
        >
          {INTERVIEW_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => {
                setSelectedCategory(cat.id);
                setSearchTerm("");
                setExpandedIndex(null);
              }}
              style={{
                width: "100%",
                padding: "12px 14px",
                marginBottom: "8px",
                background: selectedCategory === cat.id ? "#1a2236" : "transparent",
                border: `1px solid ${selectedCategory === cat.id ? cat.color + "44" : "transparent"}`,
                borderLeft: selectedCategory === cat.id ? `3px solid ${cat.color}` : "3px solid transparent",
                borderRadius: "6px",
                color: selectedCategory === cat.id ? "#f1f5f9" : "#94a3b8",
                cursor: "pointer",
                textAlign: "left",
                fontSize: "13px",
                fontWeight: 600,
                transition: "all 0.15s",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <span style={{ fontSize: "16px" }}>{cat.icon}</span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {cat.name}
                  </div>
                  <div style={{ fontSize: "11px", color: "#64748b", marginTop: "2px" }}>
                    {cat.questions.length}
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Questions */}
        <div style={{ flex: 1, padding: "28px 32px", overflowY: "auto", maxHeight: "calc(100vh - 120px)" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              marginBottom: "24px",
            }}
          >
            <span style={{ fontSize: "24px" }}>{category.icon}</span>
            <div>
              <h2 style={{ margin: 0, fontSize: "20px", fontWeight: 700 }}>{category.name}</h2>
              <p style={{ margin: "4px 0 0", color: "#94a3b8", fontSize: "13px" }}>
                {filteredQuestions.length} of {category.questions.length} questions
                {searchTerm && ` (filtered)`}
              </p>
            </div>
          </div>

          {filteredQuestions.length === 0 ? (
            <div style={{ textAlign: "center", padding: "60px 20px", color: "#64748b" }}>
              <div style={{ fontSize: "48px", marginBottom: "16px" }}>🔍</div>
              <p style={{ margin: 0, fontSize: "16px" }}>No questions match your search.</p>
            </div>
          ) : (
            filteredQuestions.map((item, idx) => (
              <div
                key={idx}
                onClick={() => setExpandedIndex(expandedIndex === idx ? null : idx)}
                style={{
                  background: expandedIndex === idx ? "#1a2236" : "#141824",
                  border: `1px solid ${expandedIndex === idx ? "#334155" : "#1e2535"}`,
                  borderRadius: "8px",
                  marginBottom: "12px",
                  overflow: "hidden",
                  transition: "all 0.2s ease",
                  cursor: "pointer",
                }}
              >
                {/* Question */}
                <div
                  style={{
                    padding: "16px 18px",
                    display: "flex",
                    alignItems: "flex-start",
                    gap: "12px",
                  }}
                >
                  <div
                    style={{
                      width: "28px",
                      height: "28px",
                      borderRadius: "50%",
                      background: category.color + "22",
                      border: `1px solid ${category.color}`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "12px",
                      fontWeight: 700,
                      color: category.color,
                      flexShrink: 0,
                    }}
                  >
                    Q
                  </div>
                  <div style={{ flex: 1 }}>
                    <p
                      style={{
                        margin: 0,
                        fontSize: "14px",
                        fontWeight: 600,
                        color: "#e2e8f0",
                        lineHeight: "1.5",
                      }}
                    >
                      {item.q}
                    </p>
                  </div>
                  <span style={{ color: "#475569", fontSize: "16px", flexShrink: 0 }}>
                    {expandedIndex === idx ? "▲" : "▼"}
                  </span>
                </div>

                {/* Answer */}
                {expandedIndex === idx && (
                  <div
                    style={{
                      borderTop: "1px solid #1e2535",
                      padding: "16px 18px",
                      background: "#0f172a",
                      display: "flex",
                      gap: "12px",
                    }}
                  >
                    <div
                      style={{
                        width: "28px",
                        height: "28px",
                        borderRadius: "50%",
                        background: "#69db7c22",
                        border: "1px solid #69db7c",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "12px",
                        fontWeight: 700,
                        color: "#69db7c",
                        flexShrink: 0,
                      }}
                    >
                      A
                    </div>
                    <p
                      style={{
                        margin: 0,
                        fontSize: "13px",
                        color: "#cbd5e1",
                        lineHeight: "1.7",
                      }}
                    >
                      {item.a}
                    </p>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
