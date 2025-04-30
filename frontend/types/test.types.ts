export interface Test {
  _id: string;
  userId: string;
  wpm: number;
  accuracy: number;
  time: number;
  type: string;
  language: string;
  wordCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface ReturnPayload {
  success: boolean;
  message: string;
  data?: Test[] | Test;
}

export interface CreateTestPayload {
  wpm: number;
  accuracy: number;
  time: number;
  type: string;
  wordCount: number;
}

export interface GetUserTestsPayload {
  success: boolean;
  message: string;
  data?: Test[];
}

export interface TestProviderPayload {
  testLanguage: string;
  updateTestLanguage: (language: string) => void;

  createTest: (test: CreateTestPayload) => Promise<ReturnPayload>;
  getUserTests: (userId: string) => Promise<GetUserTestsPayload>;
  clearTests: () => Promise<ReturnPayload>;
  getTest: (testId: string) => Promise<ReturnPayload>;
  deleteTest: (testId: string) => Promise<ReturnPayload>;
}
