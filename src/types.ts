export interface FoodMenu {
  id: string;
  name: string;
  image?: string;
  votes: number;
}

export interface Review {
  id: string;
  author: string;
  grade: number; // 학년 (예: 1학년, 2학년, 3학년)
  rating: number; // 별점 (1~5)
  comment: string;
  createdAt: string; // "12:40" 또는 날짜
  likes: number;
}

export interface WorldCupCandidate {
  id: string;
  name: string;
  image: string;
  wins: number; // 역대 우승 횟수
}

export interface DailyMenu {
  date: string;
  kcal: number;
  rice: string; // 밥
  soup: string; // 국
  dishes: string[]; // 반찬들
  dessert: string; // 후식
}
