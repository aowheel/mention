export interface User {
  id: `user_${string}`;
  name: string;
  displayName: string;
  pfp: `https://${string}`;
}

export const users: User[] = [
  {
    id: "user_001",
    name: "alice_johnson",
    displayName: "Alice",
    pfp: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=400",
  },
  {
    id: "user_002",
    name: "bob_smith",
    displayName: "Bob",
    pfp: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400",
  },
  {
    id: "user_003",
    name: "charlie_brown",
    displayName: "Charlie",
    pfp: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400",
  },
  {
    id: "user_004",
    name: "diana_prince",
    displayName: "Diana",
    pfp: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400",
  },
  {
    id: "user_005",
    name: "edward_norton",
    displayName: "Alice",
    pfp: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400",
  },
  {
    id: "user_006",
    name: "fiona_apple",
    displayName: "Fiona",
    pfp: "https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=400",
  },
  {
    id: "user_007",
    name: "george_lucas",
    displayName: "George",
    pfp: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400",
  },
  {
    id: "user_008",
    name: "helen_hunt",
    displayName: "Bob",
    pfp: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400",
  },
  {
    id: "user_009",
    name: "ivan_petrov",
    displayName: "Ivan",
    pfp: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400",
  },
  {
    id: "user_010",
    name: "julia_roberts",
    displayName: "Julia",
    pfp: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=400",
  },
];
