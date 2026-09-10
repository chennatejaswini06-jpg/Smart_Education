import os
import json
import requests

KNOWLEDGE_BASE = {
    "recursion": {
        "title": "Recursion in Computer Science",
        "explain": "Recursion is a programming technique where a function calls itself to solve smaller instances of the same problem. Every recursive function MUST have two parts: (1) A Base Case that terminates recursion without further calls, and (2) A Recursive Step that reduces the input size towards the base case. If the base case is omitted or unreachable, the function pushes stack frames endlessly until the memory limit is reached, causing a StackOverflowError.",
        "example": """// Java: Recursive Factorial with Base Case
public class RecursionExample {
    public static int factorial(int n) {
        // Base Case: 0! = 1 and 1! = 1
        if (n <= 1) {
            return 1;
        }
        // Recursive Step: n * (n-1)!
        return n * factorial(n - 1);
    }

    public static void main(String[] args) {
        System.out.println("5! = " + factorial(5)); // Output: 120
    }
}""",
        "analogy": "Think of Recursion like a set of Russian Matryoshka nesting dolls. To find what is inside the smallest doll (the Base Case), you must open each larger doll one by one. Once you reach the solid tiny doll at the center, you reassemble the shells back upwards in reverse order (unwinding the call stack).",
        "practice": "Practice Question: Write a recursive function `int sumOfDigits(int n)` in Java or Python that takes a non-negative integer like 1234 and returns the sum of its digits (1 + 2 + 3 + 4 = 10).\nHint: `n % 10` gives the last digit, while `n / 10` drops the last digit. What is the base case when `n == 0`?",
        "step_by_step": "Step-by-step trace of `factorial(3)`:\n1. `factorial(3)` calls `factorial(2)` and pauses at `3 * ?`\n2. `factorial(2)` calls `factorial(1)` and pauses at `2 * ?`\n3. `factorial(1)` hits the base case (`n <= 1`), returning `1` immediately\n4. Unwinding: `factorial(2)` computes `2 * 1 = 2` and returns to step 1\n5. Unwinding: `factorial(3)` computes `3 * 2 = 6`\nTotal call stack depth = 3 frames. Return value = 6.",
        "summarize": "• Recursion = Self-referential function.\n• Requires Base Case (halting) + Recursive Step (progress towards base).\n• Uses Call Stack memory (O(depth) auxiliary space).\n• Without base case = StackOverflowError.\n• Use Memoization (Dynamic Programming) to eliminate redundant recursive branches."
    },
    "binary search": {
        "title": "Binary Search Algorithm",
        "explain": "Binary Search is an optimal divide-and-conquer search algorithm with O(log n) time complexity. It works exclusively on sorted arrays by repeatedly comparing the target value against the middle element of the current range, discarding half the search space at each iteration.",
        "example": """# Python: Binary Search Implementation
def binary_search(arr, target):
    low = 0
    high = len(arr) - 1
    
    while low <= high:
        # Use low + (high - low) // 2 to avoid potential integer overflow
        mid = low + (high - low) // 2
        
        if arr[mid] == target:
            return mid # Target found at index mid
        elif arr[mid] < target:
            low = mid + 1 # Search in the right half
        else:
            high = mid - 1 # Search in the left half
            
    return -1 # Target not found in array""",
        "analogy": "Imagine looking up a contact named 'Rahul' in a physical phone book. You open directly to the middle (letter 'M'). Because 'R' comes after 'M', you tear away the first half entirely. You repeat the midpoint split on the remaining pages until you land directly on 'R'.",
        "practice": "Practice Question: Given a sorted array of distinct integers `arr` and a target value, return the index where target would be inserted in order if not found (LeetCode #35).\nHint: When the while loop terminates (`low > high`), what does the `low` pointer represent?",
        "step_by_step": "Tracing Binary Search on `[2, 5, 8, 12, 16, 23, 38]` with target `16`:\n1. `low = 0, high = 6` -> `mid = 3 (val = 12)`. Since `12 < 16`, set `low = 4`.\n2. `low = 4, high = 6` -> `mid = 5 (val = 23)`. Since `23 > 16`, set `high = 4`.\n3. `low = 4, high = 4` -> `mid = 4 (val = 16)`. Match! Return index `4`.\nTotal comparisons: 3 (much faster than 5 in linear search).",
        "summarize": "• Precondition: Array MUST be sorted in monotonic order.\n• Time Complexity: O(log n) worst/average, O(1) best case.\n• Space Complexity: O(1) iterative, O(log n) recursive.\n• Key Formula: `mid = low + (high - low) / 2` to prevent 32-bit integer overflow."
    },
    "polymorphism": {
        "title": "Polymorphism in Object-Oriented Programming",
        "explain": "Polymorphism (from Greek 'many forms') allows an entity like a variable, function, or object to possess multiple behaviors depending on runtime context. In Java/C++, polymorphism exists in two flavors: Compile-Time Polymorphism (Method Overloading) and Runtime Polymorphism (Method Overriding with Dynamic Method Dispatch).",
        "example": """// Java: Runtime Polymorphism
class Animal {
    void makeSound() {
        System.out.println("Animal makes a generic sound");
    }
}

class Dog extends Animal {
    @Override
    void makeSound() {
        System.out.println("Dog barks: Woof! Woof!");
    }
}

public class Main {
    public static void main(String[] args) {
        // Parent class reference holding child instance
        Animal myPet = new Dog();
        myPet.makeSound(); // Outputs: "Dog barks: Woof! Woof!" at runtime
    }
}""",
        "analogy": "Consider a 'Power Button' icon. On a smartphone, pressing it locks the screen; on a laptop, it puts it to sleep; on a television, it powers the display. The command ('press button') is identical, but each device polymorphic responds in its own specialized manner.",
        "practice": "Practice Question: Can you override a `static` method in Java? Why or why not?\nHint: Method overriding relies on dynamic dispatch via the object's runtime virtual method table (vtable). Are static methods bound to objects or classes?",
        "step_by_step": "How the JVM executes overridden methods at runtime:\n1. Compilation: Compiler verifies that `Animal` class declares `makeSound()`.\n2. Bytecode: Emits `invokevirtual Animal.makeSound()`.\n3. Runtime: The JVM inspects the actual object instance on the heap (`Dog`).\n4. VTable Lookup: Retrieves the method pointer from `Dog`'s vtable.\n5. Execution: Executes `Dog.makeSound()`. This is Dynamic Dispatch.",
        "summarize": "• Polymorphism = 'One interface, multiple implementations'.\n• Method Overloading = Compile-time (same method name, different parameter signature).\n• Method Overriding = Runtime (subclass provides specific implementation of parent method).\n• Enables loose coupling, extensible architectures, and clean dependency inversion."
    },
    "sql injection": {
        "title": "SQL Injection (SQLi) & Secure Querying",
        "explain": "SQL Injection is a severe security vulnerability where an attacker manipulates application SQL queries by injecting malicious SQL statements through untrusted user inputs. It happens when user input is concatenated directly into SQL command strings instead of being treated as isolated data parameters.",
        "example": """# Vulnerable Code (DO NOT DO THIS!):
query = f"SELECT * FROM users WHERE user='{username}' AND pass='{password}'"
# If attacker enters: ' OR '1'='1' -- 
# Query becomes: SELECT * FROM users WHERE user='' OR '1'='1' -- ...

# Secure Code using Parameterized Query:
cursor.execute(
    "SELECT * FROM users WHERE username = ? AND password_hash = ?",
    (username, password_hash)
)""",
        "analogy": "Imagine a passport officer who asks for your name and writes it onto an official stamped deportation warrant. If your name is `John Doe, but also release all prisoners`, and the officer blindly reads the entire sentence as a legal order without separating your name from the command, disaster ensues.",
        "practice": "Practice Question: Does using an Object-Relational Mapper (ORM) like Hibernate or SQLAlchemy completely prevent SQL Injection? In what situations might a developer still introduce a vulnerability when using an ORM?",
        "step_by_step": "Exploitation & Prevention step-by-step:\n1. Vulnerable app receives input: `admin' --`\n2. App concatenates: `SELECT * FROM users WHERE user = 'admin' --' AND pass = 'x'`\n3. The `--` comments out the password verification clause!\n4. Attacker gains full admin access without a password.\n5. Remedy: Prepared statements pre-compile the SQL template on the database server. Input strings are treated strictly as data literals, never executable code.",
        "summarize": "• SQLi occurs via unsanitized input concatenation in database queries.\n• Impact: Unauthorized data leaks, authentication bypass, data tampering, database drop.\n• Primary Defence: Parameterized queries (Prepared Statements).\n• Secondary Defences: Principle of least privilege, input validation, WAF."
    },
    "sql joins": {
        "title": "SQL Relational Joins",
        "explain": "SQL Joins allow you to correlate and combine columns from two or more tables based on common matching keys (primary key - foreign key relationships). The four standard types are INNER JOIN, LEFT JOIN, RIGHT JOIN, and FULL OUTER JOIN.",
        "example": """-- SQL: Demonstrating INNER vs LEFT JOIN
-- 1. INNER JOIN: Only students enrolled in active courses
SELECT s.student_name, c.course_title
FROM students s
INNER JOIN enrollments e ON s.id = e.student_id
INNER JOIN courses c ON e.course_id = c.id;

-- 2. LEFT JOIN: All students, even if they have NO enrollments (NULLs filled)
SELECT s.student_name, e.course_id
FROM students s
LEFT JOIN enrollments e ON s.id = e.student_id;""",
        "analogy": "Think of a dinner RSVP list. Table A has list of invited guests; Table B has list of people who arrived. INNER JOIN is the list of invited guests who actually showed up. LEFT JOIN is the list of all invited guests, with a checkmark if they came or blank (NULL) if they did not.",
        "practice": "Practice Question: What happens if you run a `SELECT * FROM tableA, tableB;` query without specifying an `ON` or `WHERE` join condition?\nHint: It produces every possible pairing of rows between both tables.",
        "step_by_step": "Query execution sequence for `FROM A LEFT JOIN B ON A.id = B.a_id`:\n1. Cartesian Product: Conceptual pairing of all rows in A with B.\n2. Filter on ON Condition: Retain rows where `A.id = B.a_id`.\n3. Preserve Left Rows: For any row in A that had zero matches in B, output the row with NULL values for all B columns.\n4. Project SELECT columns.",
        "summarize": "• INNER JOIN: Returns only matching records from both tables.\n• LEFT JOIN: Returns ALL rows from left table, plus matched rows from right (or NULLs).\n• RIGHT JOIN: Returns ALL rows from right table, plus matched rows from left.\n• FULL JOIN: Returns all records when there is a match in either table.\n• Performance: Ensure indexes exist on columns used in `ON` clauses."
    },
    "linked lists": {
        "title": "Linked Lists & Pointer Manipulation",
        "explain": "A Linked List is a linear data structure where elements (nodes) are not stored at contiguous memory locations. Instead, each node contains a data payload and a pointer/reference to the next node in the sequence. Unlike arrays, linked lists provide O(1) dynamic insertions and deletions without reallocation overhead, but require O(n) sequential traversal to access elements.",
        "example": """// Java: Reversing a Singly Linked List in O(n) time and O(1) space
public ListNode reverseList(ListNode head) {
    ListNode prev = null;
    ListNode current = head;
    
    while (current != null) {
        ListNode nextTemp = current.next; // Save next node
        current.next = prev;              // Reverse pointer direction
        prev = current;                   // Advance prev pointer
        current = nextTemp;               // Advance current pointer
    }
    
    return prev; // New head of reversed list
}""",
        "analogy": "Think of a scavenger hunt. Clue #1 gives you a riddle and the physical location of Clue #2. Clue #2 gives you another riddle and the location of Clue #3. You cannot skip directly to Clue #10 without following the trail node by node.",
        "practice": "Practice Question: How do you find the middle element of a singly linked list in a single pass without knowing the total length beforehand?\nHint: Use the fast and slow two-pointer technique (Tortoise and Hare).",
        "step_by_step": "Tracing Linked List Reversal on `1 -> 2 -> 3 -> null`:\n1. Init: `prev = null`, `current = Node(1)`\n2. Loop 1: `next = Node(2)`. Set `Node(1).next = null`. Move `prev = Node(1)`, `current = Node(2)`.\n3. Loop 2: `next = Node(3)`. Set `Node(2).next = Node(1)`. Move `prev = Node(2)`, `current = Node(3)`.\n4. Loop 3: `next = null`. Set `Node(3).next = Node(2)`. Move `prev = Node(3)`, `current = null`.\n5. Terminate: Return `prev` (`Node(3) -> Node(2) -> Node(1) -> null`).",
        "summarize": "• Non-contiguous heap memory linked via pointers.\n• Insertion/Deletion at known pointer: O(1).\n• Access by index: O(n) sequential traversal.\n• Floyd's Cycle Detection uses slow (1 step) and fast (2 steps) pointers in O(1) space.\n• Sentinel/Dummy nodes simplify head/tail edge case manipulations."
    }
}

def ask_ai(prompt: str, action_type: str = "explain", topic_context: str = "General", academic_level: str = "Intermediate") -> str:
    groq_key = os.environ.get("GROQ_API_KEY", "").strip()
    
    if groq_key:
        try:
            system_instruction = f"""You are EduSmart AI, an expert, encouraging personal tutor designed for the Smart India Hackathon.
The student is currently at the '{academic_level}' level.
The context topic is: {topic_context}.
Requested mode: {action_type} (Options: explain simply, give code example, give real-world analogy, give practice question, explain step-by-step, summarize).

Guidelines:
- If action_type is 'explain', provide a clear, intuitive conceptual explanation adapted for a {academic_level} student.
- If action_type is 'example', provide clean, commented, runnable code with expected output.
- If action_type is 'analogy', provide an unforgettable real-world metaphor.
- If action_type is 'practice', provide a challenging but solvable problem with a hint.
- If action_type is 'step_by_step', trace through the execution state clearly.
- If action_type is 'summarize', give crisp bullet points of key takeaways.
- Keep the tone supportive, academic, and structured with markdown headings and code blocks.
"""
            headers = {
                "Authorization": f"Bearer {groq_key}",
                "Content-Type": "application/json"
            }
            payload = {
                "model": "llama-3.3-70b-versatile",
                "messages": [
                    {"role": "system", "content": system_instruction},
                    {"role": "user", "content": prompt}
                ],
                "temperature": 0.6,
                "max_tokens": 1000
            }
            resp = requests.post("https://api.groq.com/openai/v1/chat/completions", headers=headers, json=payload, timeout=12)
            if resp.status_code == 200:
                data = resp.json()
                return data["choices"][0]["message"]["content"]
        except Exception as e:
            # Fallback seamlessly if API call fails
            pass

    # Fallback to local intelligent knowledge engine
    prompt_lower = (prompt + " " + topic_context).lower()
    matched_key = None
    for k in KNOWLEDGE_BASE.keys():
        if k in prompt_lower:
            matched_key = k
            break

    if matched_key:
        kb = KNOWLEDGE_BASE[matched_key]
        mode = action_type.lower()
        if mode == "example":
            return f"### 💻 Code Example: {kb['title']}\n\nHere is a clean, practical implementation with detailed comments:\n\n```{kb['example']}\n```\n\n**Key Takeaway:** Notice how state boundaries and conditions are explicitly validated."
        elif mode == "analogy":
            return f"### 🧩 Intuitive Analogy: {kb['title']}\n\n{kb['analogy']}\n\nThis mental model helps you visualize what happens behind the scenes before memorizing code syntax."
        elif mode == "practice":
            return f"### 📝 Practice Challenge: {kb['title']}\n\n{kb['practice']}\n\nTake 5 minutes to draft your solution, then compare with our step-by-step trace!"
        elif mode == "step_by_step":
            return f"### 🪜 Step-by-Step Walkthrough: {kb['title']}\n\n{kb['step_by_step']}"
        elif mode == "summarize":
            return f"### 📋 Key Takeaways Summary: {kb['title']}\n\n{kb['summarize']}"
        else:
            return f"### 💡 {kb['title']} (Personalized for {academic_level} Learner)\n\n{kb['explain']}\n\n**Why this matters:** In software engineering and technical interviews, mastering this pattern helps you write robust, scalable, and memory-safe solutions."

    # General smart synthesis fallback
    return f"""### 🤖 EduSmart AI Guidance: {topic_context}

**Question:** {prompt}

**Personalized Explanation ({academic_level} Level):**
In computing, this concept revolves around breaking down complex operations into predictable, testable units. When working with {topic_context}, always ensure your implementation adheres to time-complexity bounds and proper error boundaries.

**Key Recommendations:**
1. Focus on core syntax and invariant properties first.
2. Trace small test inputs manually on paper to verify variable mutations.
3. Test edge cases: null values, empty collections, single-item collections, and boundary indices.

*Click the helper chips above (Explain Simply, Give Example, Give Analogy, Step-by-Step) to explore deeper!*
"""
