export interface JobItem {
  id: number;
  title: string;
  company: string;
  location: string;
  job_type: string;
  publication_date: string;
  candidate_required_location: string;
  salary: string;
  description: string;
  url: string;
  company_logo?: string;
  tags: string[];
  isLocalJob?: boolean;
  contactEmail?: string;
  requirements?: string;
  benefits?: string;
  companyWebsite?: string;
  experienceLevel: string;
}

export const INITIAL_JOBS: JobItem[] = [
  {
    id: 101,
    title: "Senior Full-Stack Engineer (Next.js & AI)",
    company: "Vercel",
    location: "San Francisco, CA / Remote",
    job_type: "Full-time",
    publication_date: "2026-11-18T10:00:00Z",
    candidate_required_location: "Worldwide / Remote",
    salary: "$165,000 - $210,000",
    description: `We are looking for a Senior Full-Stack Engineer to architect next-generation web platforms combining Next.js 15, React Server Components, and AI agent workflows.\n\n### Responsibilities\n- Build high-performance frontend interfaces with React, TypeScript, and Tailwind CSS\n- Architect robust, serverless backend microservices and streaming AI pipelines\n- Collaborate with product designers and AI researchers to ship delightful user experiences\n- Optimize Core Web Vitals and edge caching strategies`,
    url: "https://vercel.com/careers",
    tags: ["Next.js", "React", "TypeScript", "AI", "Tailwind CSS", "Serverless"],
    isLocalJob: false,
    experienceLevel: "Senior Level",
    requirements: "• 5+ years of experience with React & TypeScript\n• Deep understanding of Server Components, Node.js, and HTTP/Edge streaming\n• Experience integrating LLMs (OpenAI, Gemini, Anthropic)\n• Passion for fast, accessible web interfaces",
    benefits: "• 100% remote work flexibility\n• Competitive equity compensation\n• Unlimited PTO and comprehensive health coverage\n• $3,000 annual home office & learning stipend",
    companyWebsite: "https://vercel.com"
  },
  {
    id: 102,
    title: "AI Research & Platform Engineer",
    company: "OpenAI",
    location: "San Francisco, CA / Hybrid",
    job_type: "Full-time",
    publication_date: "2026-11-19T14:30:00Z",
    candidate_required_location: "US / Hybrid",
    salary: "$230,000 - $310,000",
    description: `Join our applied engineering team to scale model inference infrastructure, low-latency API gateways, and multimodal agent execution environments.\n\n### Role Mission\nYou will build fault-tolerant distributed systems that serve millions of generative AI queries per minute with sub-100ms first-token latency.`,
    url: "https://openai.com/careers",
    tags: ["Python", "Rust", "Distributed Systems", "PyTorch", "Kubernetes", "LLMs"],
    isLocalJob: false,
    experienceLevel: "Senior Level",
    requirements: "• Experience scaling distributed compute and GPU inference clusters\n• Strong fluency in Python, Rust, or Go\n• Solid grasp of vector databases, attention mechanisms, and model quantization",
    benefits: "• Generous equity grant (PPU)\n• Full medical, dental, and vision with 100% premiums paid\n• On-site catered gourmet meals and wellness reimbursement",
    companyWebsite: "https://openai.com"
  },
  {
    id: 103,
    title: "Frontend Software Engineer - Payments UI",
    company: "Stripe",
    location: "Seattle, WA / Remote",
    job_type: "Full-time",
    publication_date: "2026-11-20T08:15:00Z",
    candidate_required_location: "Americas / Remote",
    salary: "$145,000 - $190,000",
    description: `Stripe's Dashboard team is responsible for the financial cockpit used by millions of internet businesses. We care deeply about craft, animation, micro-interactions, and pristine accessibility.\n\n### You will:\n- Design and implement critical merchant flows for checkout, subscriptions, and payouts\n- Build reusable components for the Stripe design system\n- Ensure bulletproof security and PCI compliance across payment widgets`,
    url: "https://stripe.com/jobs",
    tags: ["React", "TypeScript", "Design Systems", "Web Performance", "State Management"],
    isLocalJob: false,
    experienceLevel: "Mid Level",
    requirements: "• 3+ years engineering interactive web applications\n• Mastery of JavaScript/TypeScript, DOM performance, and responsive layout\n• A keen eye for visual polish and user experience",
    benefits: "• Flexible workspace policy (remote or hub)\n• Comprehensive family leave (up to 24 weeks)\n• Annual wellness and education allowance",
    companyWebsite: "https://stripe.com"
  },
  {
    id: 104,
    title: "Backend Cloud Infrastructure Engineer",
    company: "Google Cloud",
    location: "Sunnyvale, CA / Hybrid",
    job_type: "Full-time",
    publication_date: "2026-11-17T11:45:00Z",
    candidate_required_location: "United States",
    salary: "$175,000 - $240,000",
    description: `Google Cloud is looking for infrastructure engineers to enhance BigQuery and Cloud Run scalability, optimizing data ingestion pipelines and serverless container runtimes.`,
    url: "https://careers.google.com",
    tags: ["Go", "C++", "Kubernetes", "gRPC", "GCP", "Distributed Databases"],
    isLocalJob: false,
    experienceLevel: "Senior Level",
    requirements: "• Strong foundation in algorithms, concurrent programming, and networking\n• Experience with Linux internals, distributed consensus (Raft/Paxos), and gRPC\n• Bachelor's or Master's in Computer Science or equivalent practical experience",
    benefits: "• Industry-leading Google 401(k) match and equity package\n• Onsite healthcare, gyms, and tuition support\n• 4 weeks standard vacation + paid volunteer time",
    companyWebsite: "https://google.com"
  },
  {
    id: 105,
    title: "DevOps & Platform Engineer",
    company: "Datadog",
    location: "New York, NY / Remote",
    job_type: "Full-time",
    publication_date: "2026-11-21T09:00:00Z",
    candidate_required_location: "North America / Remote",
    salary: "$150,000 - $195,000",
    description: `Help us manage multi-region Kubernetes clusters processing billions of telemetry events per day. You will drive Terraform automation, CI/CD pipeline acceleration, and Chaos Engineering drills.`,
    url: "https://careers.datadoghq.com",
    tags: ["Terraform", "Kubernetes", "AWS", "Go", "CI/CD", "Prometheus"],
    isLocalJob: false,
    experienceLevel: "Mid Level",
    requirements: "• 3+ years running containerized infrastructure on AWS or GCP\n• Hands-on proficiency with Terraform, Helm, and GitOps workflows (ArgoCD)\n• Strong debugging skills in Linux network stacks",
    benefits: "• Equity grants with high growth potential\n• Flexible remote work stipends\n• Top-tier health and dental plans",
    companyWebsite: "https://datadoghq.com"
  },
  {
    id: 106,
    title: "Staff Product Designer (Design Systems)",
    company: "Figma",
    location: "San Francisco, CA / Remote",
    job_type: "Full-time",
    publication_date: "2026-11-16T16:20:00Z",
    candidate_required_location: "Remote",
    salary: "$170,000 - $225,000",
    description: `Shape the future of design tools. You will lead cross-functional initiatives to elevate Figma's design token architecture, cross-platform UI components, and developer handoff experiences.`,
    url: "https://figma.com/careers",
    tags: ["UI/UX", "Design Systems", "Figma", "User Research", "Prototyping"],
    isLocalJob: false,
    experienceLevel: "Lead/Principal",
    requirements: "• Portfolio demonstrating deep systems thinking and production design components\n• Experience balancing user empathy with technical feasibility\n• Exceptional communication and design leadership",
    benefits: "• Competitive salary + high-value Figma equity\n• Wellness allowance and home workstation setup budget\n• Global offsites and community events",
    companyWebsite: "https://figma.com"
  },
  {
    id: 107,
    title: "Junior React & TypeScript Developer",
    company: "NexHire Labs",
    location: "Bangalore, India / Remote",
    job_type: "Full-time",
    publication_date: "2026-11-21T12:00:00Z",
    candidate_required_location: "India / Remote",
    salary: "₹12,00,000 - ₹18,00,000",
    description: `Great opportunity for motivated engineers with 1-2 years experience or strong project portfolios. Build responsive modern dashboards, integrate REST/GraphQL APIs, and write clean, modular React components.`,
    url: "mailto:careers@nexhire.ai",
    tags: ["React", "JavaScript", "TypeScript", "Tailwind CSS", "Git"],
    isLocalJob: true,
    contactEmail: "careers@nexhire.ai",
    experienceLevel: "Entry Level",
    requirements: "• Proven foundation in modern JavaScript (ES6+), React hooks, and CSS/Tailwind\n• Familiarity with Git version control and RESTful APIs\n• Strong drive to learn modern fullstack web technologies",
    benefits: "• Mentorship from senior engineering leaders\n• Flexible working hours and hybrid work option\n• Annual conference sponsorships",
    companyWebsite: "https://nexhire.ai"
  },
  {
    id: 108,
    title: "Machine Learning Solutions Architect",
    company: "Amazon Web Services (AWS)",
    location: "Austin, TX / Remote",
    job_type: "Full-time",
    publication_date: "2026-11-15T13:40:00Z",
    candidate_required_location: "United States",
    salary: "$180,000 - $245,000",
    description: `Partner with enterprise customers to design scalable ML pipelines on Amazon SageMaker, Bedrock, and EKS. Guide technical roadmaps from exploratory PoC to multi-tenant production deployments.`,
    url: "https://amazon.jobs",
    tags: ["AWS", "SageMaker", "Python", "MLOps", "Bedrock", "Enterprise Architecture"],
    isLocalJob: false,
    experienceLevel: "Senior Level",
    requirements: "• 5+ years designing cloud data & ML architectures\n• Deep familiarity with SageMaker, Vector DBs, Fine-tuning, and RAG architectures\n• Strong executive presentation and client consulting skills",
    benefits: "• AWS Employee discount\n• Comprehensive Amazon health and stock ownership plans\n• Parental leave and fertility benefits",
    companyWebsite: "https://aws.amazon.com"
  }
];

export interface PYQItem {
  id: number;
  company: string;
  category: string;
  question: string;
  options?: string[];
  correct_answer: string;
  explanation: string;
  difficulty: "Easy" | "Medium" | "Hard";
  year: number;
}

export const INITIAL_PYQS: PYQItem[] = [
  // Google
  {
    id: 1,
    company: "Google",
    category: "Technical",
    question: "What is the time complexity of searching in a Balanced Binary Search Tree (such as AVL or Red-Black Tree)?",
    options: ["O(1)", "O(log n)", "O(n)", "O(n log n)"],
    correct_answer: "O(log n)",
    explanation: "Because a balanced BST maintains a height bounded by O(log n), every search operation traverses at most one path from the root to a leaf, guaranteeing logarithmic time complexity.",
    difficulty: "Easy",
    year: 2024
  },
  {
    id: 2,
    company: "Google",
    category: "DSA",
    question: "Which data structure is optimal for implementing an LRU (Least Recently Used) Cache with O(1) get and put operations?",
    options: ["Array and Min-Heap", "Hash Map + Doubly Linked List", "Binary Search Tree", "Singly Linked List"],
    correct_answer: "Hash Map + Doubly Linked List",
    explanation: "The Hash Map allows O(1) key-to-node lookup, while the Doubly Linked List enables O(1) insertion, node detachment, and moving accessed items to the front.",
    difficulty: "Medium",
    year: 2024
  },
  {
    id: 3,
    company: "Google",
    category: "System Design",
    question: "When designing a globally distributed URL shortener (e.g. TinyURL), which strategy best prevents hash collisions while keeping short IDs concise?",
    options: ["32-bit random integers", "Distributed ID Generator (Snowflake) with Base62 encoding", "MD5 hash of the original URL truncated to 6 chars without check", "Single centralized auto-increment database counter"],
    correct_answer: "Distributed ID Generator (Snowflake) with Base62 encoding",
    explanation: "A 64-bit unique ID generator (like Twitter Snowflake) ensures uniqueness without coordination bottlenecks across data centers. Base62 encoding produces a compact 6-7 character alphanumeric URL.",
    difficulty: "Hard",
    year: 2024
  },
  {
    id: 4,
    company: "Google",
    category: "Technical",
    question: "In JavaScript, what is the main difference between microtasks (Promise callbacks, queueMicrotask) and macrotasks (setTimeout, setInterval)?",
    options: ["Microtasks execute after all macrotasks finish", "The event loop executes all pending microtasks immediately after the current script and before the next macrotask", "Macrotasks run with higher priority", "Microtasks run in a separate web worker"],
    correct_answer: "The event loop executes all pending microtasks immediately after the current script and before the next macrotask",
    explanation: "The event loop processes the microtask queue completely between each task and before any rendering or next macrotask execution, ensuring immediate reaction to asynchronous promise completions.",
    difficulty: "Medium",
    year: 2023
  },

  // Amazon
  {
    id: 5,
    company: "Amazon",
    category: "DSA",
    question: "Given a stream of integers, which data structure efficiently finds the running median in O(1) retrieval time?",
    options: ["Two heaps: a Max-Heap for the lower half and a Min-Heap for the upper half", "A single Sorted Array", "A Stack and a Queue", "A Bloom Filter"],
    correct_answer: "Two heaps: a Max-Heap for the lower half and a Min-Heap for the upper half",
    explanation: "Balancing two heaps keeps the median at the roots. Insertion takes O(log n) and computing the median is O(1) by inspecting the tops of the two heaps.",
    difficulty: "Hard",
    year: 2024
  },
  {
    id: 6,
    company: "Amazon",
    category: "Behavioral",
    question: "During an Amazon behavioral interview on 'Customer Obsession', how should you structure your response using the STAR method?",
    options: ["Describe what went wrong without taking personal accountability", "State the Situation, Task, specific Actions you took to put the customer first, and measurable Results achieved", "Focus strictly on technical code details without customer impact", "Explain what your manager instructed you to do"],
    correct_answer: "State the Situation, Task, specific Actions you took to put the customer first, and measurable Results achieved",
    explanation: "Amazon evaluates Leadership Principles through the STAR framework: Situation context, your specific Task, tangible Actions you spearheaded, and quantitative Results/metrics.",
    difficulty: "Medium",
    year: 2024
  },
  {
    id: 7,
    company: "Amazon",
    category: "System Design",
    question: "In Amazon's DynamoDB architecture, what mechanism is utilized to maintain data consistency across distributed replicas?",
    options: ["Two-phase locking across all nodes", "Quorum consensus (R + W > N) combined with sloppy quorums and hinted handoff", "Centralized master-replica replication", "Single-threaded ledger synchronization"],
    correct_answer: "Quorum consensus (R + W > N) combined with sloppy quorums and hinted handoff",
    explanation: "Amazon Dynamo uses configurable quorum reads and writes (R + W > N) alongside vector clocks, Merkle trees for anti-entropy, and hinted handoff to maximize availability under partitions.",
    difficulty: "Hard",
    year: 2023
  },

  // Microsoft
  {
    id: 8,
    company: "Microsoft",
    category: "Technical",
    question: "What is the primary benefit of TypeScript's 'unknown' type over 'any'?",
    options: ["'unknown' disables all type checking", "'unknown' enforces type checking or narrowing before any operations can be performed on the value", "'unknown' can only hold primitive values", "'unknown' compiles to slower JavaScript"],
    correct_answer: "'unknown' enforces type checking or narrowing before any operations can be performed on the value",
    explanation: "'unknown' is the type-safe counterpart of 'any'. You cannot access properties, call it as a function, or pass it without first performing type narrowing (e.g., typeof, instanceof, or custom type guards).",
    difficulty: "Medium",
    year: 2024
  },
  {
    id: 9,
    company: "Microsoft",
    category: "Technical",
    question: "Which database ACID property ensures that concurrent transactions do not interfere with one another?",
    options: ["Atomicity", "Consistency", "Isolation", "Durability"],
    correct_answer: "Isolation",
    explanation: "Isolation determines how transaction integrity is visible to other concurrent operations. Isolation levels (Read Committed, Repeatable Read, Serializable) prevent dirty reads, non-repeatable reads, and phantom reads.",
    difficulty: "Easy",
    year: 2023
  },
  {
    id: 10,
    company: "Microsoft",
    category: "DSA",
    question: "How do you detect a cycle in a Singly Linked List with O(1) auxiliary space?",
    options: ["Floyd's Cycle-Finding Algorithm (Tortoise and Hare pointers)", "Store visited nodes in a HashSet", "Reverse the linked list", "Count total nodes twice"],
    correct_answer: "Floyd's Cycle-Finding Algorithm (Tortoise and Hare pointers)",
    explanation: "By advancing a slow pointer by 1 step and a fast pointer by 2 steps, if a cycle exists, the fast pointer will eventually lap and meet the slow pointer within the loop without extra memory.",
    difficulty: "Medium",
    year: 2023
  },

  // Meta
  {
    id: 11,
    company: "Meta",
    category: "Technical",
    question: "How does React 19 / React Server Components (RSC) fundamentally reduce client JavaScript bundle size?",
    options: ["By compressing JavaScript with gzip on client", "Server Components run exclusively on the server and are streamed as an interactive virtual DOM payload without shipping their component JS code or server dependencies to the client", "By eliminating all CSS styles", "By executing code inside WebAssembly"],
    correct_answer: "Server Components run exclusively on the server and are streamed as an interactive virtual DOM payload without shipping their component JS code or server dependencies to the client",
    explanation: "Server Components do not add to the client bundle. Only Client Components marked with 'use client' and their imports are packaged into the browser bundle, drastically reducing JS download and hydration time.",
    difficulty: "Hard",
    year: 2024
  },
  {
    id: 12,
    company: "Meta",
    category: "System Design",
    question: "In designing Facebook's Live News Feed, what is the best strategy to handle celebrity accounts with millions of followers (high fan-out)?",
    options: ["Pure Fan-out-on-Write (Push model for all users)", "Hybrid Model: Fan-out-on-Write for regular users, and Fan-out-on-Read (Pull model) for celebrities merged at timeline generation time", "Store entire feed in browser localStorage", "Single SQL query without caching"],
    correct_answer: "Hybrid Model: Fan-out-on-Write for regular users, and Fan-out-on-Read (Pull model) for celebrities merged at timeline generation time",
    explanation: "If a user with 50M followers posts, pushing 50M writes causes severe write amplification and lag. A hybrid architecture pushes for typical users but pulls celebrity updates dynamically during read.",
    difficulty: "Hard",
    year: 2024
  },

  // TCS & Tech Foundations
  {
    id: 13,
    company: "TCS",
    category: "Aptitude",
    question: "A train running at 72 km/h crosses a 200m platform in 22 seconds. What is the length of the train in meters?",
    options: ["200 m", "240 m", "260 m", "280 m"],
    correct_answer: "240 m",
    explanation: "Speed in m/s = 72 * (5/18) = 20 m/s. Total distance in 22s = 20 * 22 = 440 m. Since Total Distance = Train Length + Platform Length, Train Length = 440 - 200 = 240 meters.",
    difficulty: "Medium",
    year: 2024
  },
  {
    id: 14,
    company: "TCS",
    category: "Technical",
    question: "Which of the following sorting algorithms has the best worst-case time complexity?",
    options: ["Quick Sort", "Bubble Sort", "Merge Sort", "Insertion Sort"],
    correct_answer: "Merge Sort",
    explanation: "Merge Sort consistently guarantees O(n log n) time complexity in the worst, average, and best cases, whereas Quick Sort can degrade to O(n²) when bad pivots are chosen.",
    difficulty: "Easy",
    year: 2023
  },

  // Apple & Netflix
  {
    id: 15,
    company: "Apple",
    category: "Technical",
    question: "In modern Operating Systems and CPU architectures, what is a Translation Lookaside Buffer (TLB)?",
    options: ["A memory cache used to speed up virtual-to-physical address translation", "A network routing buffer", "A disk cache for file swap", "An audio processing queue"],
    correct_answer: "A memory cache used to speed up virtual-to-physical address translation",
    explanation: "The TLB is a high-speed hardware memory cache on the Memory Management Unit (MMU) that stores recent page table translations, avoiding expensive main-memory page walks.",
    difficulty: "Hard",
    year: 2024
  },
  {
    id: 16,
    company: "Netflix",
    category: "System Design",
    question: "How does Netflix achieve seamless video playback under varying network conditions worldwide?",
    options: ["Sending raw uncompressed video over UDP", "Adaptive Bitrate Streaming (HLS / MPEG-DASH) with edge CDN distribution and chunked encoding", "Downloading the full 4K file before playback", "FTP file transfer"],
    correct_answer: "Adaptive Bitrate Streaming (HLS / MPEG-DASH) with edge CDN distribution and chunked encoding",
    explanation: "Video is sliced into multi-second chunks encoded across diverse resolutions and bitrates. Client video players detect throughput changes and dynamically adjust chunk quality to prevent buffering.",
    difficulty: "Medium",
    year: 2024
  }
];

export interface QuizTopicQuestions {
  [topic: string]: {
    id: number;
    question: string;
    options: string[];
    correctAnswer: number;
    explanation: string;
    difficulty: "Easy" | "Medium" | "Hard";
  }[];
}

export const CURATED_QUIZ_BANK: QuizTopicQuestions = {
  JavaScript: [
    {
      id: 1,
      question: "What is the output of `typeof NaN` in JavaScript?",
      options: ["'number'", "'nan'", "'undefined'", "'object'"],
      correctAnswer: 0,
      explanation: "In ECMAScript specification, NaN is a numeric data value representing an unrepresentable value, so its typeof evaluates to 'number'.",
      difficulty: "Easy"
    },
    {
      id: 2,
      question: "Which of the following methods creates a true deep clone of a nested object without methods in modern JavaScript?",
      options: ["Object.assign({}, obj)", "{ ...obj }", "structuredClone(obj)", "obj.clone()"],
      correctAnswer: 2,
      explanation: "`structuredClone()` is the native Web API and Node.js standard for performing deep copies of complex nested data, circular references, and TypedArrays.",
      difficulty: "Medium"
    },
    {
      id: 3,
      question: "What is the key difference between `call()` and `apply()` in JavaScript?",
      options: ["`call` is asynchronous, `apply` is synchronous", "`call` takes comma-separated arguments, while `apply` takes an array of arguments", "`apply` cannot set the this context", "There is no difference"],
      correctAnswer: 1,
      explanation: "Both invoke a function with an explicit `this` binding, but `fn.call(ctx, arg1, arg2)` accepts arguments individually while `fn.apply(ctx, [arg1, arg2])` accepts an array.",
      difficulty: "Easy"
    },
    {
      id: 4,
      question: "What is Event Bubbling in the browser DOM?",
      options: ["Events travel from window down to target element", "Events trigger on the innermost target element first, then propagate upwards to ancestors", "Events are discarded if not handled immediately", "Events only fire on the parent node"],
      correctAnswer: 1,
      explanation: "In the bubbling phase, an event starts at the target element that received the interaction and bubbles up the DOM tree through its parents, ending at `window`.",
      difficulty: "Medium"
    },
    {
      id: 5,
      question: "What does the `WeakMap` data structure in JavaScript allow that regular `Map` does not?",
      options: ["Keys can be primitives like strings or numbers", "Keys must be objects, and they do not prevent garbage collection if no other references exist", "Keys can be iterated via for..of", "It has a `.size` property"],
      correctAnswer: 1,
      explanation: "Keys in WeakMap are weakly held objects. If there are no other references to the key object, the entry is automatically garbage-collected, preventing memory leaks.",
      difficulty: "Hard"
    }
  ],
  React: [
    {
      id: 1,
      question: "When should you use the `useCallback` hook in React?",
      options: ["To execute side effects after rendering", "To memoize a callback function instance between renders to prevent unnecessary child re-renders", "To fetch data from a REST endpoint", "To replace useState entirely"],
      correctAnswer: 1,
      explanation: "`useCallback(fn, deps)` returns a memoized version of the function that only changes when dependencies change, preventing child components wrapped in `React.memo` from re-rendering.",
      difficulty: "Medium"
    },
    {
      id: 2,
      question: "What is the primary rule regarding React Hook invocation order?",
      options: ["Hooks can be called inside if conditions if the condition never changes", "Hooks must be called at the top level of a component and never inside loops, conditions, or nested functions", "Hooks must be called in alphabetical order", "Hooks can only be called in class components"],
      correctAnswer: 1,
      explanation: "React relies on the call order of hooks during each render to correlate internal state pointers. Calling hooks conditionally desynchronizes the internal state array.",
      difficulty: "Easy"
    },
    {
      id: 3,
      question: "What does `useId()` provide in React 18+?",
      options: ["A unique random UUID for database primary keys", "A stable, unique ID for accessibility attributes (ARIA) that matches across server and client rendering", "A hash of the component source code", "A CSS class identifier"],
      correctAnswer: 1,
      explanation: "`useId` generates a stable identifier across SSR and client hydration, eliminating hydration mismatch warnings when linking `<label htmlFor=...>` to `<input id=...>`. ",
      difficulty: "Medium"
    },
    {
      id: 4,
      question: "What problem does React Fiber resolve compared to the legacy Stack Reconciler?",
      options: ["It prevents all JavaScript bugs", "It allows splitting rendering work into incremental chunks that can be paused, resumed, or aborted based on priority", "It replaces the browser DOM with WebGL", "It eliminates the need for JSX"],
      correctAnswer: 1,
      explanation: "Fiber is a reimplementation of React's core reconciliation algorithm with virtual stack frames, enabling cooperative multitasking, concurrent rendering, and high-priority input handling.",
      difficulty: "Hard"
    },
    {
      id: 5,
      question: "In React 19, how can you handle asynchronous form actions without manual state loading trackers?",
      options: ["Using the new `useActionState` and `useFormStatus` hooks", "Using `window.fetch` inside `componentDidMount`", "Using Redux Thunk only", "By writing custom event listeners on window"],
      correctAnswer: 0,
      explanation: "`useActionState` (formerly useFormState) automatically tracks pending status, response data, and optimistic updates directly linked to form actions.",
      difficulty: "Medium"
    }
  ],
  Python: [
    {
      id: 1,
      question: "What is the difference between a list and a tuple in Python?",
      options: ["Lists are immutable, tuples are mutable", "Lists are mutable, tuples are immutable", "Tuples cannot contain integers", "Lists cannot be nested"],
      correctAnswer: 1,
      explanation: "Lists are dynamic and mutable (can append, remove, reassign elements), while tuples are immutable once created and use less memory overhead.",
      difficulty: "Easy"
    },
    {
      id: 2,
      question: "What does the `*args` and `**kwargs` syntax allow in Python function definitions?",
      options: ["Pointer dereferencing like C++", "Accepting an arbitrary number of positional arguments (*args) and keyword arguments (**kwargs)", "Defining generator functions", "Running functions in parallel threads"],
      correctAnswer: 1,
      explanation: "`*args` packs extra positional arguments into a tuple, while `**kwargs` packs named keyword arguments into a dictionary.",
      difficulty: "Easy"
    },
    {
      id: 3,
      question: "How does Python's GIL (Global Interpreter Lock) affect multi-threading?",
      options: ["It prevents Python from running on multiple machines", "It allows only one native thread to execute Python bytecode at a time, limiting CPU-bound speedup from standard threading", "It doubles the execution speed of NumPy", "It disables garbage collection"],
      correctAnswer: 1,
      explanation: "The GIL prevents true concurrent execution of Python bytecode across multiple CPU cores in CPython. For CPU-bound tasks, `multiprocessing` or native C extensions are used instead.",
      difficulty: "Medium"
    },
    {
      id: 4,
      question: "What is the result of `[x**2 for x in range(5) if x % 2 == 0]`?",
      options: ["[0, 4, 16]", "[1, 9]", "[0, 1, 4, 9, 16]", "[4, 16]"],
      correctAnswer: 0,
      explanation: "Even numbers in range(5) are 0, 2, 4. Squared, they yield [0, 4, 16].",
      difficulty: "Easy"
    },
    {
      id: 5,
      question: "In Python generators, what does the `yield from <iterable>` expression do?",
      options: ["Stops the generator immediately", "Delegates generation of values transparently to a subgenerator or iterable", "Clears the memory cache", "Converts the generator to a list"],
      correctAnswer: 1,
      explanation: "`yield from` delegates iteration to a subgenerator, passing values and two-way channel exceptions (`send`, `throw`) back and forth seamlessly.",
      difficulty: "Hard"
    }
  ],
  "System Design": [
    {
      id: 1,
      question: "According to the CAP Theorem, what are the three properties, and how many can a distributed system guarantee simultaneously during a network partition?",
      options: ["Consistency, Availability, Performance (All 3)", "Consistency, Availability, Partition Tolerance (Only 2 at a time)", "Concurrency, Atomicity, Persistence (Only 1)", "C-Caching, A-Authentication, P-Prototyping"],
      correctAnswer: 1,
      explanation: "When a network partition (P) occurs, a distributed system must choose between remaining Consistent (returning errors if nodes disagree) or Available (returning potentially stale data).",
      difficulty: "Medium"
    },
    {
      id: 2,
      question: "What is the purpose of Consistent Hashing in distributed caching and database sharding?",
      options: ["Encrypting user passwords", "Minimizing the number of keys that must be remapped when nodes are added or removed (only K/N keys moved)", "Sorting database rows chronologically", "Compressing network packets"],
      correctAnswer: 1,
      explanation: "Consistent hashing maps both servers and keys to a virtual ring. Adding or removing a node only impacts adjacent keys rather than rehashing the entire keyspace.",
      difficulty: "Hard"
    },
    {
      id: 3,
      question: "What is the primary role of a Reverse Proxy (e.g., NGINX, Cloudflare) in web architecture?",
      options: ["Connecting client databases to frontend", "Sitting in front of web servers to handle SSL termination, load balancing, compression, and caching", "Compiling TypeScript files on the fly", "Managing browser cookies only"],
      correctAnswer: 1,
      explanation: "A reverse proxy sits before backend servers, providing centralized security, TLS termination, load balancing across instances, and static asset caching.",
      difficulty: "Easy"
    },
    {
      id: 4,
      question: "When should you choose an Event-Driven Architecture with message queues (Kafka, RabbitMQ) over synchronous REST calls?",
      options: ["When responses must be delivered in under 5ms synchronously", "When decoupling microservices, buffering traffic spikes, and processing background tasks asynchronously", "When building simple static marketing websites", "When database transactions require 100% immediate synchronous lock"],
      correctAnswer: 1,
      explanation: "Message brokers decouple producers from consumers, buffer traffic spikes, allow independent service scaling, and ensure durable event processing even if consumers are temporarily down.",
      difficulty: "Medium"
    },
    {
      id: 5,
      question: "What is the difference between Write-Through and Write-Back (Write-Behind) cache policies?",
      options: ["Write-Through writes directly to cache and asynchronously to DB; Write-Back writes only to DB", "Write-Through synchronously writes data to both cache and database; Write-Back writes to cache immediately and updates the DB asynchronously", "Write-Through is read-only", "Write-Back deletes the cache on every write"],
      correctAnswer: 1,
      explanation: "Write-Through ensures maximum data consistency by updating both cache and storage simultaneously. Write-Back prioritizes ultra-fast write latency by updating cache first and flushing to DB in batches.",
      difficulty: "Hard"
    }
  ]
};
