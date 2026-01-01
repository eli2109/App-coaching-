export interface Lesson {
  id: string;
  dayNumber: number;
  title: string;
  objective: string;
  thought: string;
  youtubeId: string;
}

export interface Pathway {
  id: 'BOOST' | 'RELAX';
  name: string;
  lessons: Lesson[];
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: {
    text: string;
    target: 'BOOST' | 'RELAX';
  }[];
}
