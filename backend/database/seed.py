import os
import sqlite3
import hashlib
from datetime import datetime, timedelta

def hash_password(password: str) -> str:
    # PBKDF2 with SHA256
    salt = b"edusmart_salt_2026"
    key = hashlib.pbkdf2_hmac("sha256", password.encode("utf-8"), salt, 100000)
    return key.hex()

def get_db():
    db_path = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), "database", "edusmart.db")
    conn = sqlite3.connect(db_path)
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA foreign_keys = ON;")
    return conn

def seed_database():
    conn = get_db()
    cursor = conn.cursor()

    # Clear existing data safely
    tables = [
        "doubt_alerts", "goals", "user_badges", "badges", "recommendations",
        "ai_conversations", "learning_progress", "study_tasks", "study_plans",
        "quiz_answers", "quiz_attempts", "questions", "topic_mastery",
        "topic_material", "topics", "subjects", "student_profiles", "users"
    ]
    for table in tables:
        cursor.execute(f"DELETE FROM {table};")
        cursor.execute(f"DELETE FROM sqlite_sequence WHERE name='{table}';")

    # 1. Users
    student_pwd = hash_password("Demo@123")
    admin_pwd = hash_password("Admin@123")

    cursor.execute("""
        INSERT INTO users (id, name, email, password_hash, role, avatar)
        VALUES (1, 'Demo Student', 'demo@edusmart.ai', ?, 'student', 'https://api.dicebear.com/7.x/avataaars/svg?seed=DemoStudent')
    """, (student_pwd,))

    cursor.execute("""
        INSERT INTO users (id, name, email, password_hash, role, avatar)
        VALUES (2, 'Dr. A. Sharma', 'admin@edusmart.ai', ?, 'admin', 'https://api.dicebear.com/7.x/avataaars/svg?seed=ProfSharma')
    """, (admin_pwd,))

    # Cohort students for admin analytics
    cohort_students = [
        ('Rahul Verma', 'rahul.v@college.edu', 'student'),
        ('Priya Patel', 'priya.p@college.edu', 'student'),
        ('Ananya Sharma', 'ananya.s@college.edu', 'student'),
        ('Rohit Kumar', 'rohit.k@college.edu', 'student')
    ]
    for idx, (name, email, role) in enumerate(cohort_students, start=3):
        cursor.execute("""
            INSERT INTO users (id, name, email, password_hash, role, avatar)
            VALUES (?, ?, ?, ?, ?, ?)
        """, (idx, name, email, student_pwd, role, f'https://api.dicebear.com/7.x/avataaars/svg?seed={name.replace(" ", "")}'))

    # 2. Student Profiles
    cursor.execute("""
        INSERT INTO student_profiles (
            user_id, college, course, year, learning_goal, academic_level,
            daily_study_hours, preferred_learning_style, target_date, xp_points, streak_days, level, last_active_date
        ) VALUES (
            1, 'National Institute of Technology', 'B.Tech Computer Science', '3rd Year',
            'Software Developer', 'Intermediate', 3.0, 'Hands-on / Practical',
            '2026-11-15', 1450, 7, 4, date('now')
        )
    """)

    # Profiles for other students
    cursor.execute("""
        INSERT INTO student_profiles (user_id, college, course, year, learning_goal, academic_level, daily_study_hours, preferred_learning_style, xp_points, streak_days, level, last_active_date)
        VALUES (3, 'NIT Surathkal', 'B.Tech IT', '3rd Year', 'Full Stack Developer', 'Intermediate', 2.5, 'Visual', 1100, 4, 3, date('now'))
    """)
    cursor.execute("""
        INSERT INTO student_profiles (user_id, college, course, year, learning_goal, academic_level, daily_study_hours, preferred_learning_style, xp_points, streak_days, level, last_active_date)
        VALUES (4, 'IIIT Hyderabad', 'B.Tech CSE', '4th Year', 'Data Scientist', 'Advanced', 4.0, 'Conceptual', 2200, 12, 6, date('now'))
    """)
    cursor.execute("""
        INSERT INTO student_profiles (user_id, college, course, year, learning_goal, academic_level, daily_study_hours, preferred_learning_style, xp_points, streak_days, level, last_active_date)
        VALUES (5, 'DTU Delhi', 'B.Tech Software', '2nd Year', 'Software Developer', 'Beginner', 2.0, 'Reading', 650, 2, 2, date('now'))
    """)
    cursor.execute("""
        INSERT INTO student_profiles (user_id, college, course, year, learning_goal, academic_level, daily_study_hours, preferred_learning_style, xp_points, streak_days, level, last_active_date)
        VALUES (6, 'BITS Pilani', 'B.E. CS', '3rd Year', 'Cybersecurity Analyst', 'Intermediate', 3.5, 'Hands-on / Practical', 1600, 8, 5, date('now'))
    """)

    # 3. Badges
    badges = [
        ('streak_7', '7 Day Streak', 'Studied consistently for 7 consecutive days', '🔥', 150),
        ('quiz_master', 'Quiz Master', 'Achieved over 80% in 5 consecutive quizzes', '🏆', 250),
        ('topics_10', '10 Topics Completed', 'Successfully completed 10 technical modules', '📚', 200),
        ('curious_learner', 'Curious Learner', 'Interacted with the AI Tutor more than 15 times', '💡', 100),
        ('goal_achiever', 'Goal Achiever', 'Completed your weekly personalized learning schedule', '🎯', 300),
        ('speed_demon', 'Speed Demon', 'Answered all quiz questions correctly within 30 seconds', '⚡', 150),
        ('cyber_defender', 'Cyber Defender', 'Mastered foundational network and web security principles', '🛡️', 200)
    ]
    for code, title, desc, icon, xp in badges:
        cursor.execute("INSERT INTO badges (code, title, description, icon, xp_reward) VALUES (?, ?, ?, ?, ?)",
                       (code, title, desc, icon, xp))

    # Assign badges to Demo Student (1)
    for b_id in [1, 2, 3, 4]:
        cursor.execute("INSERT INTO user_badges (user_id, badge_id) VALUES (1, ?)", (b_id,))

    # 4. Subjects
    subjects = [
        (1, 'Java Programming', 'JAVA', 'Coffee', '#f97316', 'Object-oriented programming, memory management, JVM, and core Java concepts'),
        (2, 'Python', 'PYTHON', 'FileCode2', '#3b82f6', 'Pythonic paradigms, data structures, scripting, and automation'),
        (3, 'C Programming', 'C', 'Terminal', '#64748b', 'Low-level memory pointers, structures, and systems programming'),
        (4, 'C++', 'CPP', 'Cpu', '#8b5cf6', 'Object-oriented design, STL containers, and high-performance algorithms'),
        (5, 'SQL & Databases', 'SQL', 'Database', '#06b6d4', 'Relational database design, ACID properties, indexing, and complex queries'),
        (6, 'Data Structures & Algorithms', 'DSA', 'Binary', '#ec4899', 'Time complexity, recursion, dynamic programming, trees, and graphs'),
        (7, 'Cybersecurity', 'CYBER', 'ShieldCheck', '#10b981', 'Application security, cryptography, penetration testing, and ethical hacking'),
        (8, 'Computer Networks', 'NETWORKS', 'Network', '#6366f1', 'OSI layers, TCP/IP protocols, routing, and network diagnostics'),
        (9, 'Database Management Systems', 'DBMS', 'Server', '#14b8a6', 'Transactions, concurrency control, normalization, and recovery'),
        (10, 'Web Development', 'WEBDEV', 'Globe', '#f59e0b', 'Modern frontend React, RESTful architectures, and responsive web design')
    ]
    for s in subjects:
        cursor.execute("INSERT INTO subjects (id, name, code, icon, color, description) VALUES (?, ?, ?, ?, ?, ?)", s)

    # 5. Topics
    topics = [
        # Java (1)
        (1, 1, 'Java OOP & Polymorphism', 'Medium', 35, 'Method overloading, method overriding, dynamic method dispatch and interfaces', 1),
        (2, 1, 'Java Arrays & Collections', 'Easy', 25, 'ArrayList, HashMap, traversal algorithms, and memory layout', 2),
        (3, 1, 'Exception Handling & Multithreading', 'Hard', 45, 'Try-catch blocks, custom exceptions, threads, and synchronization locks', 3),

        # Python (2)
        (4, 2, 'Python Basics & Control Flow', 'Easy', 20, 'Syntax, list comprehensions, generators, and conditional statements', 1),
        (5, 2, 'Python Dictionaries & Sets', 'Medium', 30, 'Hash maps, set theory operations, and time complexity in lookups', 2),

        # C Programming (3)
        (6, 3, 'Pointers & Dynamic Memory', 'Hard', 45, 'Pointer arithmetic, malloc/free, memory leaks, and segmentation faults', 1),

        # C++ (4)
        (7, 4, 'STL Containers & Iterators', 'Medium', 35, 'Vector, map, unordered_set, iterators, and custom comparator lambdas', 1),

        # SQL (5)
        (8, 5, 'SQL Joins & Aggregations', 'Medium', 30, 'INNER, LEFT, RIGHT, FULL OUTER joins, GROUP BY, and HAVING clauses', 1),
        (9, 5, 'Indexing & Query Optimization', 'Hard', 40, 'B-Trees, Hash indexes, EXPLAIN PLAN, and index selectivity', 2),

        # DSA (6) - CRITICAL FOCUS TOPICS FOR DEMO
        (10, 6, 'Recursion & Backtracking', 'Hard', 45, 'Base cases, recursion tree analysis, call stack memory, and N-Queens', 1),
        (11, 6, 'Linked Lists', 'Medium', 35, 'Singly, doubly, circular linked lists, reversal, and cycle detection', 2),
        (12, 6, 'Dynamic Programming', 'Hard', 50, 'Overlapping subproblems, memoization vs tabulation, knapsack problem', 3),
        (13, 6, 'Binary Search & Two Pointers', 'Easy', 30, 'Search space reduction, logarithmic time complexity, boundary handling', 4),

        # Cybersecurity (7)
        (14, 7, 'Cybersecurity Basics & Threats', 'Easy', 25, 'Malware, phishing, social engineering, and CIA triad principles', 1),
        (15, 7, 'Web Security & SQL Injection', 'Medium', 35, 'OWASP Top 10, SQLi, Cross-Site Scripting (XSS), and remediation', 2),

        # Computer Networks (8)
        (16, 8, 'OSI & TCP/IP Model', 'Medium', 30, 'Layer functions, headers, packet encapsulation, and protocols', 1),

        # DBMS (9)
        (17, 9, 'Normalization & ACID Properties', 'Medium', 35, '1NF to BCNF anomalies, Atomicity, Consistency, Isolation, Durability', 1),

        # Web Development (10)
        (18, 10, 'React Components & Hooks', 'Medium', 30, 'State management, useEffect lifecycle, virtual DOM, and component props', 1),
        (19, 10, 'REST APIs & HTTP Protocols', 'Easy', 25, 'GET/POST/PUT/DELETE methods, status codes, and JSON serialization', 2)
    ]
    for t in topics:
        cursor.execute("INSERT INTO topics (id, subject_id, name, difficulty_level, estimated_minutes, description, order_index) VALUES (?, ?, ?, ?, ?, ?, ?)", t)

    # 6. Seeded Questions (35+ comprehensive questions)
    questions = [
        # Java (Topics 1, 2, 3)
        (1, 1, 'In Java, dynamic method dispatch is the mechanism by which a call to an overridden method is resolved at which stage?',
         'Compile-time', 'Runtime', 'Link-time', 'Class-loading time', 'B', 'Medium',
         'Dynamic method dispatch allows Java to resolve calls to overridden methods at runtime rather than compile-time based on the actual object referenced.'),

        (1, 1, 'Which concept in Object-Oriented Programming is demonstrated when multiple methods in the same class have the same name but different parameters?',
         'Method Overriding', 'Method Overloading', 'Data Encapsulation', 'Dynamic Dispatch', 'B', 'Easy',
         'Method Overloading occurs when two or more methods within the same class have identical names but different parameter lists (compile-time polymorphism).'),

        (1, 2, 'What is the time complexity of searching for an element by index in a standard Java ArrayList?',
         'O(1)', 'O(n)', 'O(log n)', 'O(n log n)', 'A', 'Easy',
         'ArrayList in Java is backed by a contiguous array, allowing random access in constant time O(1) via its index.'),

        (1, 3, 'Which keyword in Java is used to ensure that only one thread can execute a critical section of code at a given time?',
         'volatile', 'synchronized', 'transient', 'atomic', 'B', 'Hard',
         'The synchronized keyword in Java locks the monitor associated with an object, ensuring mutually exclusive thread execution.'),

        # Python (Topics 4, 5)
        (2, 4, 'What is the output of `[x**2 for x in range(5) if x % 2 == 0]` in Python?',
         '[0, 1, 4]', '[0, 4, 16]', '[1, 9, 25]', '[4, 16]', 'B', 'Easy',
         'The list comprehension filters even numbers from 0 to 4 (0, 2, 4) and squares them, producing [0, 4, 16].'),

        (2, 5, 'What is the average time complexity for key lookups in a standard Python dictionary?',
         'O(1)', 'O(log n)', 'O(n)', 'O(n^2)', 'A', 'Easy',
         'Python dictionaries are implemented using optimized hash tables, which provide average O(1) time complexity for lookups.'),

        # C Programming (Topic 6)
        (3, 6, 'What happens if you allocate memory using malloc() in C but fail to call free() before your program terminates?',
         'Memory Leak', 'Dangling Pointer', 'Segmentation Fault', 'Buffer Overflow', 'A', 'Medium',
         'Failing to deallocate dynamically allocated heap memory results in a memory leak, as that heap space remains marked as allocated.'),

        (3, 6, 'What does the operator `*` represent when placed before a pointer variable in an expression like `int x = *ptr;`?',
         'Address-of operator', 'Dereference operator', 'Multiplication only', 'Memory allocation', 'B', 'Easy',
         'The `*` dereference operator retrieves the value stored at the memory address currently pointed to by `ptr`.'),

        # C++ (Topic 7)
        (4, 7, 'Which standard C++ container is typically implemented as a Red-Black Tree and keeps keys sorted?',
         'std::vector', 'std::unordered_map', 'std::map', 'std::deque', 'C', 'Medium',
         'In the C++ STL, std::map is implemented using self-balancing Red-Black binary search trees, guaranteeing O(log n) lookups and sorted keys.'),

        # SQL (Topics 8, 9)
        (5, 8, 'Which SQL JOIN returns all rows from the left table and matching rows from the right table, filling nulls if no match exists?',
         'INNER JOIN', 'LEFT JOIN', 'FULL JOIN', 'CROSS JOIN', 'B', 'Easy',
         'A LEFT JOIN (or LEFT OUTER JOIN) keeps all records from the left table and includes matched values from the right table, or NULLs if unmatched.'),

        (5, 8, 'What is the primary difference between the `WHERE` clause and the `HAVING` clause in SQL?',
         'WHERE filters before aggregation; HAVING filters after aggregation', 'WHERE applies only to text; HAVING applies to numbers', 'HAVING cannot use comparison operators', 'There is no difference', 'A', 'Medium',
         'WHERE filters individual rows before grouping/aggregating, whereas HAVING filters grouped aggregated results created by GROUP BY.'),

        (5, 9, 'What is the typical time complexity of searching a indexed column that utilizes a standard B-Tree index in relational databases?',
         'O(1)', 'O(log n)', 'O(n)', 'O(n log n)', 'B', 'Hard',
         'B-Tree indexes maintain balanced search trees with high branching factor, providing O(log n) disk seek operations for lookups.'),

        # DSA - Recursion (Topic 10 - DEMO WEAK SPOT)
        (6, 10, 'What is the fatal runtime error that occurs when a recursive function lacks an adequate base case or fails to reach it?',
         'OutOfMemoryError: Heap Space', 'StackOverflowError', 'NullPointerException', 'ConcurrentModificationException', 'B', 'Easy',
         'Each recursive call pushes an activation frame onto the call stack. Without a terminating base case, the stack memory is exhausted, throwing StackOverflowError.'),

        (6, 10, 'In calculating Fibonacci recursively with `fib(n) = fib(n-1) + fib(n-2)`, what is the time complexity of the naive unmemoized solution?',
         'O(n)', 'O(n log n)', 'O(2^n)', 'O(n!)', 'C', 'Hard',
         'The naive recursion tree branches twice at each level up to depth n, generating roughly 2^n calls with massive redundant computation.'),

        (6, 10, 'Which data structure implicitly manages the state and local variables during execution of recursive function calls?',
         'Heap', 'Call Stack', 'Queue', 'Priority Queue', 'B', 'Easy',
         'The system call stack holds the activation frames, parameters, return addresses, and local variables for every nested recursive call.'),

        (6, 10, 'How does memoization optimize a naive recursive algorithm?',
         'By converting recursive calls into iterative loops automatically',
         'By caching the results of expensive function calls and returning the cached result when the same inputs occur again',
         'By allocating extra threads for every recursive branch',
         'By removing the base case requirement',
         'B', 'Medium',
         'Memoization is a top-down dynamic programming technique where subproblem results are stored in a lookup table (cache) to avoid redundant recalculation.'),

        # DSA - Linked Lists (Topic 11 - DEMO WEAK SPOT)
        (6, 11, 'Which algorithm can detect whether a singly linked list contains a cycle using only O(1) auxiliary space?',
         'Dijkstra Algorithm', 'Floyds Tortoise and Hare Algorithm', 'Kruskals Algorithm', 'Binary Search', 'B', 'Medium',
         'Floyds cycle-finding algorithm uses two pointers moving at different speeds (slow moves 1 step, fast moves 2 steps). If a loop exists, they must meet.'),

        (6, 11, 'What is the time complexity to insert a new node at the head of a Singly Linked List if you have a pointer to the head?',
         'O(1)', 'O(n)', 'O(log n)', 'O(n^2)', 'A', 'Easy',
         'Inserting at the head simply requires pointing the new node to current head and updating the head pointer, taking constant O(1) time.'),

        (6, 11, 'To reverse a singly linked list iteratively in-place, how many pointer variables are typically required?',
         '1 (current)', '2 (current, next)', '3 (prev, current, next)', 'None (recursion only)', 'C', 'Medium',
         'An in-place iterative reversal uses three pointers: prev (previous node), current (node being processed), and next (temporary holder of next node).'),

        # DSA - Dynamic Programming (Topic 12 - DEMO WEAK SPOT)
        (6, 12, 'Which two core properties must a problem exhibit to be effectively solvable using Dynamic Programming?',
         'Greedy choice property and disjoint sets', 'Optimal substructure and overlapping subproblems', 'Divide-and-conquer and logarithmic height', 'Random access and continuous memory', 'B', 'Hard',
         'DP is applicable when subproblems repeat (overlapping subproblems) and an optimal solution to the problem contains optimal solutions to subproblems (optimal substructure).'),

        (6, 12, 'What is the primary difference between Memoization and Tabulation in Dynamic Programming?',
         'Memoization is Top-Down; Tabulation is Bottom-Up', 'Memoization is Bottom-Up; Tabulation is Top-Down', 'Tabulation uses recursion while Memoization uses loops', 'There is no difference', 'A', 'Medium',
         'Memoization is top-down (starts at the main problem and saves sub-answers as recursion unwinds), whereas Tabulation is bottom-up (builds the table iteratively from base cases up).'),

        # DSA - Binary Search (Topic 13)
        (6, 13, 'What prerequisite must a collection satisfy before Binary Search can be applied?',
         'Elements must be stored in a linked list', 'Elements must be unique with no duplicates', 'Elements must be sorted in monotonic order', 'Collection size must be a power of 2', 'C', 'Easy',
         'Binary search requires that the data elements be sorted so that comparing against the midpoint element eliminates half the search space.'),

        (6, 13, 'What is the worst-case time complexity of Binary Search on an array containing n sorted elements?',
         'O(1)', 'O(log n)', 'O(n)', 'O(n log n)', 'B', 'Easy',
         'Binary search divides the remaining candidate interval in half at every step, yielding logarithmic O(log n) time complexity.'),

        # Cybersecurity (Topics 14, 15)
        (7, 14, 'What does the CIA triad stand for in computer and network security?',
         'Control, Inspection, Authentication', 'Confidentiality, Integrity, Availability', 'Cryptography, Identity, Authorization', 'Cybersecurity, Intelligence, Analysis', 'B', 'Easy',
         'The CIA triad forms the bedrock of information security: Confidentiality (privacy), Integrity (data accuracy/tamper-proof), and Availability (accessibility).'),

        (7, 15, 'What is the most secure and effective defence against SQL Injection vulnerabilities in backend applications?',
         'Validating inputs using client-side JavaScript only', 'Using Parameterized Queries (Prepared Statements)', 'Encrypting database table names', 'Restricting web traffic to HTTPS only', 'B', 'Medium',
         'Parameterized queries separate code from untrusted data parameters, ensuring that the database engine treats input purely as literal values rather than executable SQL syntax.'),

        (7, 15, 'Which attack occurs when malicious scripts are injected into trusted websites and executed in unsuspecting users browsers?',
         'Cross-Site Scripting (XSS)', 'Cross-Site Request Forgery (CSRF)', 'Buffer Overflow', 'Distributed Denial of Service (DDoS)', 'A', 'Medium',
         'XSS attacks occur when an application includes untrusted data in a web page without proper validation or escaping, running malicious JavaScript in the victims browser session.'),

        # Computer Networks (Topic 16)
        (8, 16, 'At which layer of the OSI model do Routers primarily operate to forward packets across networks?',
         'Layer 2 - Data Link Layer', 'Layer 3 - Network Layer', 'Layer 4 - Transport Layer', 'Layer 7 - Application Layer', 'B', 'Easy',
         'Routers examine IP packets and make routing decisions at Layer 3 (Network Layer) based on logical IP addresses.'),

        (8, 16, 'What is the primary difference between TCP and UDP protocols at the Transport layer?',
         'TCP is connection-oriented and reliable; UDP is connectionless and faster with no delivery guarantee',
         'TCP is used only for video streaming; UDP is for file transfer',
         'UDP guarantees packet ordering; TCP does not',
         'TCP operates at Layer 2; UDP operates at Layer 4',
         'A', 'Easy',
         'TCP establishes a 3-way handshake and guarantees reliable, ordered packet delivery via ACKs and retransmissions, whereas UDP minimizes overhead for real-time speed.'),

        # DBMS (Topic 17)
        (9, 17, 'A database relation is said to be in 3NF (Third Normal Form) if it is in 2NF and has no what?',
         'Composite primary keys', 'Transitive functional dependencies', 'Foreign keys', 'Duplicate table names', 'B', 'Medium',
         'Third Normal Form requires eliminating all transitive dependencies: non-prime attributes must depend directly and only on the primary key, not through other non-prime attributes.'),

        (9, 17, 'In database transaction management, which ACID property guarantees that all operations within a transaction succeed together or all rollback completely?',
         'Atomicity', 'Consistency', 'Isolation', 'Durability', 'A', 'Easy',
         'Atomicity enforces the all-or-nothing rule: either all changes in the transaction commit to disk, or upon failure the database is rolled back to its pre-transaction state.'),

        # Web Development (Topics 18, 19)
        (10, 18, 'In React, what is the primary purpose of the `useEffect` hook?',
         'To declare reactive component state variables',
         'To handle side effects such as data fetching, subscriptions, and manual DOM mutations',
         'To directly manipulate the browser DOM bypassing the Virtual DOM',
         'To style components using Tailwind classes',
         'B', 'Easy',
         'useEffect lets functional components synchronize with external systems and perform side effects such as API calls, timers, and event listeners.'),

        (10, 18, 'Why must React state never be mutated directly (e.g., `state.count = 5`)?',
         'Direct mutation causes syntax errors in modern browsers',
         'React relies on shallow reference equality checks to detect changes and trigger UI re-renders',
         'JavaScript does not support object mutation',
         'Direct mutation slows down CSS animations',
         'B', 'Medium',
         'React compares state references. If state is mutated directly, the object reference remains identical, causing React to miss the update and fail to re-render the UI.'),

        (10, 19, 'Which HTTP status code signifies that a client request was successfully processed and returned data (OK)?',
         '200', '201', '400', '404', 'A', 'Easy',
         'HTTP 200 OK indicates that the request has succeeded and the requested payload is present in the response body.'),

        (10, 19, 'What makes an HTTP method idempotent in RESTful API design?',
         'Calling the method multiple times with the same parameters produces the same side-effect on the server as calling it once',
         'The method executes in less than 10 milliseconds',
         'The method does not require authentication headers',
         'The method always returns JSON data',
         'A', 'Medium',
         'Idempotence means making multiple identical requests (e.g., GET, PUT, DELETE) has the identical state effect as making a single request.')
    ]

    for q in questions:
        cursor.execute("""
            INSERT INTO questions (subject_id, topic_id, question_text, option_a, option_b, option_c, option_d, correct_option, difficulty, explanation)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, q)

    # 7. Seed Topic Materials (for AI study material explorer)
    materials = [
        (10, # Recursion & Backtracking
         "Recursion is a programming technique where a function calls itself directly or indirectly to solve a smaller instance of the same problem. Every recursive solution consists of a Base Case (halting condition) and a Recursive Case (reduction step).",
         "1. Base Case: The condition under which the function returns without making another call, preventing stack overflow.\n2. Call Stack Memory: Each call creates a stack frame containing local variables and return address.\n3. Recursion Tree: A visual representation of branching calls.\n4. Time & Space Complexity: Analyzing call depth and branching factor.",
         "// Recursive Factorial in Java\npublic class RecursionDemo {\n    public static int factorial(int n) {\n        // Base case\n        if (n <= 1) return 1;\n        // Recursive case\n        return n * factorial(n - 1);\n    }\n\n    public static void main(String[] args) {\n        System.out.println(factorial(5)); // Output: 120\n    }\n}",
         "java",
         '{"type": "tree", "root": "fact(4)", "branches": [{"name": "fact(3)", "sub": "fact(2) -> fact(1) = 1"}]}',
         "1. Forgetting the Base Case leading to StackOverflowError.\n2. Modifying state incorrectly so the problem does not shrink towards the base condition.\n3. Redundant recalculations in tree recursion without memoization.",
         "Try implementing recursive sum of array elements, or write a function to reverse a string recursively."),

        (13, # Binary Search
         "Binary Search is an efficient divide-and-conquer algorithm for locating a target value within a sorted array. It operates by repeatedly comparing the target to the middle element and halving the search interval.",
         "1. Precondition: Array must be sorted.\n2. Two Pointers: Left and Right boundaries define the active search space.\n3. Midpoint Calculation: Use `mid = left + (right - left) / 2` to prevent integer overflow.\n4. Time Complexity: O(log n) logarithmic time.",
         "// Binary Search in Python\ndef binary_search(arr, target):\n    left, right = 0, len(arr) - 1\n    while left <= right:\n        mid = left + (right - left) // 2\n        if arr[mid] == target:\n            return mid\n        elif arr[mid] < target:\n            left = mid + 1\n        else:\n            right = mid - 1\n    return -1",
         "python",
         '{"type": "intervals", "steps": ["[0...15]", "[8...15]", "[8...11]", "Target Found!"]}',
         "1. Using `(left + right) // 2` which can overflow in languages like C++/Java for large arrays.\n2. Off-by-one errors in loop conditions (`left < right` vs `left <= right`).\n3. Applying binary search to unsorted data.",
         "Solve LeetCode #704 (Binary Search) and implement Search in Rotated Sorted Array."),

        (8, # SQL Joins
         "SQL Joins combine rows from two or more tables based on a related column between them. Understanding the difference between INNER, LEFT, RIGHT, and FULL joins is crucial for high-performance database querying.",
         "1. INNER JOIN: Only rows with matching values in both tables.\n2. LEFT JOIN: All rows from left table, matched rows from right table (NULL if no match).\n3. Cross Product: Cartesian product when join condition is omitted.\n4. Performance: Indexes on foreign key join columns dramatically accelerate joins.",
         "-- Fetch all students and their enrolled courses\nSELECT s.name, c.course_title\nFROM students s\nLEFT JOIN enrollments e ON s.id = e.student_id\nLEFT JOIN courses c ON e.course_id = c.id\nWHERE s.active = 1;",
         "sql",
         '{"type": "venn", "left": "Table A", "right": "Table B", "intersection": "Matches"}',
         "1. Accidental Cartesian products due to missing ON conditions.\n2. Filtering outer table columns in the WHERE clause instead of ON clause, unintentionally converting LEFT JOIN to INNER JOIN.\n3. Joining without index coverage on foreign keys.",
         "Write a query to find all students who have NOT enrolled in any course yet.")
    ]
    for m in materials:
        cursor.execute("""
            INSERT INTO topic_material (topic_id, overview, key_concepts, code_example, code_language, visualization_data, common_mistakes, practice_prompts)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        """, m)

    # 8. Topic Mastery for Demo Student (User 1)
    # Reflecting exact specs:
    # Java: 82%, Python: 88%, SQL: 72%, DSA: 54%, Cybersecurity: 81%, Web Dev: 76%
    # Weak topics: Recursion (48%), Linked Lists (50%), Dynamic Programming (45%)
    # Strong topics: Python Basics (92%), Java OOP (85%), Cybersecurity Basics (88%)
    masteries = [
        (1, 1, 85.0, 20, 17, 'Mastered'),   # Java OOP (Strong)
        (1, 2, 80.0, 15, 12, 'Mastered'),   # Java Arrays
        (1, 3, 72.0, 10, 7, 'Moderate'),    # Java Exceptions
        (1, 4, 92.0, 25, 23, 'Mastered'),   # Python Basics (Strong)
        (1, 5, 84.0, 12, 10, 'Mastered'),   # Python Dicts
        (1, 6, 68.0, 14, 9, 'Moderate'),    # C Pointers
        (1, 7, 74.0, 15, 11, 'Moderate'),   # C++ STL
        (1, 8, 70.0, 18, 13, 'Moderate'),   # SQL Joins
        (1, 9, 74.0, 10, 7, 'Moderate'),    # SQL Indexing
        (1, 10, 48.0, 22, 10, 'Weak'),      # DSA Recursion (WEAK!)
        (1, 11, 50.0, 16, 8, 'Weak'),       # DSA Linked Lists (WEAK!)
        (1, 12, 45.0, 12, 5, 'Weak'),       # DSA DP (WEAK!)
        (1, 13, 75.0, 18, 14, 'Moderate'),  # DSA Binary Search
        (1, 14, 88.0, 20, 18, 'Mastered'),  # Cybersecurity Basics (Strong)
        (1, 15, 74.0, 14, 10, 'Moderate'),  # Web Security
        (1, 16, 78.0, 15, 12, 'Moderate'),  # Computer Networks
        (1, 17, 70.0, 12, 8, 'Moderate'),   # DBMS Normalization
        (1, 18, 78.0, 16, 13, 'Moderate'),  # React Hooks
        (1, 19, 74.0, 14, 10, 'Moderate')   # REST APIs
    ]
    for u_id, t_id, score, att, corr, stat in masteries:
        cursor.execute("""
            INSERT INTO topic_mastery (user_id, topic_id, mastery_score, questions_attempted, questions_correct, status)
            VALUES (?, ?, ?, ?, ?, ?)
        """, (u_id, t_id, score, att, corr, stat))

    # 9. Doubt Alert: Demo Student struggling with Recursion
    cursor.execute("""
        INSERT INTO doubt_alerts (user_id, topic_id, topic_name, mistake_count, status)
        VALUES (1, 10, 'Recursion & Backtracking', 3, 'ACTIVE')
    """)

    # 10. Quiz Attempts History
    now = datetime.now()
    attempts = [
        (1, 6, 10, 5, 2, 40.0, 'Medium', 40, 280, (now - timedelta(days=2)).isoformat()),
        (1, 1, 1, 5, 4, 80.0, 'Easy', 80, 210, (now - timedelta(days=3)).isoformat()),
        (1, 2, 4, 5, 5, 100.0, 'Easy', 100, 180, (now - timedelta(days=4)).isoformat()),
        (1, 7, 14, 5, 4, 80.0, 'Medium', 80, 240, (now - timedelta(days=5)).isoformat()),
        (1, 5, 8, 5, 3, 60.0, 'Medium', 60, 260, (now - timedelta(days=6)).isoformat())
    ]
    for att in attempts:
        cursor.execute("""
            INSERT INTO quiz_attempts (user_id, subject_id, topic_id, total_questions, correct_answers, score_percentage, difficulty_level, xp_earned, time_taken_seconds, completed_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, att)

    # 11. Study Plan & Tasks
    cursor.execute("""
        INSERT INTO study_plans (id, user_id, title, target_exam_date, daily_hours, priority, total_tasks, completed_tasks)
        VALUES (1, 1, 'Semester 6 Placement & Academic Mastery Plan', '2026-11-15', 3.0, 'High', 7, 3)
    """)

    tasks = [
        (1, 1, 1, 'Monday', 'Java Arrays & Memory Layout', 'Java Programming', 'Java Arrays & Collections', 30, 1, (now - timedelta(days=2)).strftime('%Y-%m-%d'), 1),
        (2, 1, 1, 'Monday', 'SQL Joins & Relational Algebra', 'SQL & Databases', 'SQL Joins & Aggregations', 25, 1, (now - timedelta(days=2)).strftime('%Y-%m-%d'), 2),
        (3, 1, 1, 'Tuesday', 'Cybersecurity Basics & Threat Models', 'Cybersecurity', 'Cybersecurity Basics & Threats', 20, 1, (now - timedelta(days=1)).strftime('%Y-%m-%d'), 3),
        (4, 1, 1, 'Today', 'Deep Dive: Recursion Call Stack & Base Cases', 'Data Structures & Algorithms', 'Recursion & Backtracking', 45, 0, now.strftime('%Y-%m-%d'), 4),
        (5, 1, 1, 'Today', 'Adaptive Quiz: Recursion & Binary Search', 'Data Structures & Algorithms', 'Recursion & Backtracking', 15, 0, now.strftime('%Y-%m-%d'), 5),
        (6, 1, 1, 'Tomorrow', 'Linked List Reversal & Cycle Detection', 'Data Structures & Algorithms', 'Linked Lists', 40, 0, (now + timedelta(days=1)).strftime('%Y-%m-%d'), 6),
        (7, 1, 1, 'Friday', 'DBMS Normalization & ACID Properties', 'Database Management Systems', 'Normalization & ACID Properties', 35, 0, (now + timedelta(days=2)).strftime('%Y-%m-%d'), 7)
    ]
    for task in tasks:
        cursor.execute("""
            INSERT INTO study_tasks (id, plan_id, user_id, day_of_week, title, subject_name, topic_name, duration_minutes, is_completed, scheduled_date, order_index)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, task)

    # 12. Learning Progress (7-Day Streak)
    for i in range(7, 0, -1):
        dt = (now - timedelta(days=i)).strftime('%Y-%m-%d')
        mins = 90 + (i * 10)
        quizzes = 1 if i % 2 == 0 else 2
        xp = mins * 2 + quizzes * 50
        cursor.execute("""
            INSERT INTO learning_progress (user_id, study_date, study_minutes, quizzes_taken, xp_gained)
            VALUES (1, ?, ?, ?, ?)
        """, (dt, mins, quizzes, xp))

    # Today's active progress
    cursor.execute("""
        INSERT INTO learning_progress (user_id, study_date, study_minutes, quizzes_taken, xp_gained)
        VALUES (1, ?, 45, 1, 90)
    """, (now.strftime('%Y-%m-%d'),))

    # 13. Recommendations
    recs = [
        (1, 'Urgent: Focus on Recursion Basics', 'Your current mastery in Recursion is 48%. We detected 3 recent errors on call stack depth and base cases.', 'HIGH', 'REVISION', 10, '/ai-tutor?topic=Recursion'),
        (1, 'Target Role Gap: Master Linked Lists', 'Your Software Developer roadmap requires 80% DSA mastery. Linked list reversal needs practice.', 'HIGH', 'PRACTICE', 11, '/quiz?topic=11'),
        (1, 'Spaced Repetition: Revise SQL Joins', 'It has been 5 days since you reviewed SQL Joins and Aggregations. Complete a 5-min recap.', 'MEDIUM', 'REVISION', 8, '/revision'),
        (1, 'Advanced Track: Explore Dynamic Programming', 'Since you are advancing in recursion, start building foundations for memoization.', 'LOW', 'ADVANCED', 12, '/study-material?topic=12')
    ]
    for r in recs:
        cursor.execute("""
            INSERT INTO recommendations (user_id, title, description, priority, type, topic_id, action_link)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        """, r)

    # 14. AI Conversations history (realistic chat seed)
    cursor.execute("""
        INSERT INTO ai_conversations (user_id, topic_context, prompt, response, action_type)
        VALUES (
            1, 'Java', 'What is polymorphism in Java?',
            'Polymorphism in Java allows an object to take on many forms. The most common use is when a parent class reference is used to refer to a child class object. It comes in two forms: Compile-time polymorphism (Method Overloading) and Runtime polymorphism (Method Overriding with dynamic dispatch).',
            'explain'
        )
    """)
    cursor.execute("""
        INSERT INTO ai_conversations (user_id, topic_context, prompt, response, action_type)
        VALUES (
            1, 'DSA', 'Explain binary search in simple terms.',
            'Imagine searching for a word in a dictionary. You do not read every word from page 1. Instead, you open the book right in the middle. If your word alphabetically comes before that page, you discard the entire right half and look into the left half. That is Binary Search: halving the search space at each step in O(log n) time.',
            'analogy'
        )
    """)

    # 15. Goals
    goals = [
        (1, 'Achieve 80%+ Mastery in Data Structures & Algorithms', 80, 54, '%', '2026-11-15', 0),
        (1, 'Complete 10 Adaptive Practice Quizzes', 10, 5, 'quizzes', '2026-10-31', 0),
        (1, 'Maintain 14-Day Learning Streak', 14, 7, 'days', '2026-10-25', 0)
    ]
    for g in goals:
        cursor.execute("""
            INSERT INTO goals (user_id, title, target_value, current_value, unit, deadline, is_completed)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        """, g)

    conn.commit()
    conn.close()
    print("Database successfully seeded with realistic demo data!")

if __name__ == '__main__':
    seed_database()
