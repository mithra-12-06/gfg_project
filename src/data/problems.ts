export interface Problem {
  id: number;
  title: string;
  difficulty: "Easy" | "Medium" | "Hard";
  tags: string[];
  description: string;
  exampleInput: string;
  exampleOutput: string;
}

const problemTemplates: Omit<Problem, "id">[] = [
  { title: "Two Sum", difficulty: "Easy", tags: ["Array", "HashMap"], description: "Find two numbers that add up to a specific target.", exampleInput: "[2,7,11,15], target=9", exampleOutput: "[0,1]" },
  { title: "Reverse Linked List", difficulty: "Easy", tags: ["Linked List"], description: "Reverse a singly linked list.", exampleInput: "1->2->3->4->5", exampleOutput: "5->4->3->2->1" },
  { title: "Valid Parentheses", difficulty: "Easy", tags: ["Stack", "String"], description: "Determine if input string has valid bracket pairs.", exampleInput: "\"()[]{}\"", exampleOutput: "true" },
  { title: "Maximum Subarray", difficulty: "Medium", tags: ["Array", "DP"], description: "Find contiguous subarray with largest sum.", exampleInput: "[-2,1,-3,4,-1,2,1,-5,4]", exampleOutput: "6" },
  { title: "Merge Two Sorted Lists", difficulty: "Easy", tags: ["Linked List"], description: "Merge two sorted linked lists into one.", exampleInput: "1->2->4, 1->3->4", exampleOutput: "1->1->2->3->4->4" },
  { title: "Binary Tree Inorder Traversal", difficulty: "Easy", tags: ["Tree", "Recursion"], description: "Return inorder traversal of a binary tree.", exampleInput: "[1,null,2,3]", exampleOutput: "[1,3,2]" },
  { title: "Longest Common Subsequence", difficulty: "Medium", tags: ["DP", "String"], description: "Find the longest common subsequence of two strings.", exampleInput: "\"abcde\", \"ace\"", exampleOutput: "3" },
  { title: "N-Queens", difficulty: "Hard", tags: ["Backtracking"], description: "Place N queens on an NxN chessboard.", exampleInput: "n=4", exampleOutput: "[[.Q..,...]]" },
  { title: "Median of Two Sorted Arrays", difficulty: "Hard", tags: ["Binary Search", "Array"], description: "Find median of two sorted arrays.", exampleInput: "[1,3], [2]", exampleOutput: "2.0" },
  { title: "Climbing Stairs", difficulty: "Easy", tags: ["DP", "Math"], description: "Count distinct ways to climb n stairs.", exampleInput: "3", exampleOutput: "3" },
  { title: "Coin Change", difficulty: "Medium", tags: ["DP"], description: "Find minimum coins to make amount.", exampleInput: "coins=[1,2,5], amount=11", exampleOutput: "3" },
  { title: "Word Break", difficulty: "Medium", tags: ["DP", "Trie"], description: "Can string be segmented into dictionary words?", exampleInput: "\"leetcode\", [\"leet\",\"code\"]", exampleOutput: "true" },
  { title: "Trapping Rain Water", difficulty: "Hard", tags: ["Array", "Two Pointers"], description: "Compute water trapped after raining.", exampleInput: "[0,1,0,2,1,0,1,3,2,1,2,1]", exampleOutput: "6" },
  { title: "Rotate Image", difficulty: "Medium", tags: ["Matrix"], description: "Rotate a matrix 90 degrees clockwise.", exampleInput: "[[1,2,3],[4,5,6],[7,8,9]]", exampleOutput: "[[7,4,1],[8,5,2],[9,6,3]]" },
  { title: "Group Anagrams", difficulty: "Medium", tags: ["HashMap", "String"], description: "Group strings that are anagrams.", exampleInput: "[\"eat\",\"tea\",\"tan\",\"ate\",\"nat\",\"bat\"]", exampleOutput: "[[eat,tea,ate],[tan,nat],[bat]]" },
  { title: "Best Time to Buy and Sell Stock", difficulty: "Easy", tags: ["Array", "Greedy"], description: "Maximize profit from stock prices.", exampleInput: "[7,1,5,3,6,4]", exampleOutput: "5" },
  { title: "Palindrome Number", difficulty: "Easy", tags: ["Math"], description: "Check if integer is a palindrome.", exampleInput: "121", exampleOutput: "true" },
  { title: "Search in Rotated Array", difficulty: "Medium", tags: ["Binary Search", "Array"], description: "Search in a rotated sorted array.", exampleInput: "[4,5,6,7,0,1,2], target=0", exampleOutput: "4" },
  { title: "Merge Intervals", difficulty: "Medium", tags: ["Array", "Sorting"], description: "Merge overlapping intervals.", exampleInput: "[[1,3],[2,6],[8,10],[15,18]]", exampleOutput: "[[1,6],[8,10],[15,18]]" },
  { title: "Word Ladder", difficulty: "Hard", tags: ["BFS", "String"], description: "Find shortest transformation sequence.", exampleInput: "\"hit\", \"cog\", [hot,dot,dog,lot,log,cog]", exampleOutput: "5" },
  { title: "Find Peak Element", difficulty: "Medium", tags: ["Binary Search"], description: "Find a peak element in array.", exampleInput: "[1,2,3,1]", exampleOutput: "2" },
  { title: "Longest Increasing Subsequence", difficulty: "Medium", tags: ["DP", "Binary Search"], description: "Find length of longest increasing subsequence.", exampleInput: "[10,9,2,5,3,7,101,18]", exampleOutput: "4" },
  { title: "Regular Expression Matching", difficulty: "Hard", tags: ["DP", "String"], description: "Implement regex matching with . and *.", exampleInput: "\"aa\", \"a*\"", exampleOutput: "true" },
  { title: "Course Schedule", difficulty: "Medium", tags: ["Graph", "Topological Sort"], description: "Determine if you can finish all courses.", exampleInput: "2, [[1,0]]", exampleOutput: "true" },
  { title: "Serialize Binary Tree", difficulty: "Hard", tags: ["Tree", "BFS"], description: "Serialize and deserialize a binary tree.", exampleInput: "[1,2,3,null,null,4,5]", exampleOutput: "[1,2,3,null,null,4,5]" },
  { title: "Maximum Product Subarray", difficulty: "Medium", tags: ["Array", "DP"], description: "Find contiguous subarray with largest product.", exampleInput: "[2,3,-2,4]", exampleOutput: "6" },
  { title: "Minimum Window Substring", difficulty: "Hard", tags: ["Sliding Window", "String"], description: "Find minimum window containing all chars.", exampleInput: "\"ADOBECODEBANC\", \"ABC\"", exampleOutput: "\"BANC\"" },
  { title: "Number of Islands", difficulty: "Medium", tags: ["Graph", "BFS"], description: "Count number of islands in a grid.", exampleInput: "[[1,1,0],[0,1,0],[0,0,1]]", exampleOutput: "2" },
  { title: "House Robber", difficulty: "Medium", tags: ["DP"], description: "Maximum amount you can rob without alerting police.", exampleInput: "[1,2,3,1]", exampleOutput: "4" },
  { title: "Sudoku Solver", difficulty: "Hard", tags: ["Backtracking", "Matrix"], description: "Solve a 9x9 Sudoku puzzle.", exampleInput: "board[..]", exampleOutput: "solved board" },
];

const allTags = ["Array","HashMap","Linked List","Stack","String","Tree","Recursion","DP","Backtracking","Binary Search","Math","Two Pointers","Matrix","Greedy","Sorting","BFS","DFS","Graph","Topological Sort","Trie","Sliding Window","Heap","Bit Manipulation","Union Find","Segment Tree"];

function seededRandom(seed: number) {
  const x = Math.sin(seed + 1) * 10000;
  return x - Math.floor(x);
}

export const problems: Problem[] = Array.from({ length: 150 }, (_, i) => {
  if (i < problemTemplates.length) {
    return { id: i + 1, ...problemTemplates[i] };
  }
  const r = (n: number) => seededRandom(i * 17 + n * 3);
  const diff: Problem["difficulty"] = r(1) < 0.35 ? "Easy" : r(1) < 0.7 ? "Medium" : "Hard";
  const tagCount = 1 + Math.floor(r(2) * 3);
  const tags = Array.from({ length: tagCount }, (_, j) => allTags[Math.floor(r(10 + j) * allTags.length)]);
  const uniqueTags = [...new Set(tags)];
  const titlePrefixes = ["Find","Count","Check","Validate","Maximum","Minimum","Longest","Shortest","Optimal","Detect"];
  const titleSuffixes = ["Path","Sequence","Subarray","Substring","Nodes","Elements","Pairs","Sum","Product","Distance"];
  const title = `${titlePrefixes[Math.floor(r(3) * titlePrefixes.length)]} ${titleSuffixes[Math.floor(r(4) * titleSuffixes.length)]} ${i + 1 - problemTemplates.length}`;
  return {
    id: i + 1,
    title,
    difficulty: diff,
    tags: uniqueTags,
    description: `Given an input, ${title.toLowerCase()}. Return the result.`,
    exampleInput: `[${Math.floor(r(5) * 10)}, ${Math.floor(r(6) * 10)}, ${Math.floor(r(7) * 10)}]`,
    exampleOutput: `${Math.floor(r(8) * 100)}`,
  };
});
