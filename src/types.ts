export interface GeneratedPrompt {
  id: string;
  timestamp: number;
  imageUrl: string;
  prompt: string;
  details: {
    subject: string;
    angle: string;
    outfit: string;
    pose: string;
    environment: string;
    lighting: string;
    style: string;
  };
}

export interface PromptHistoryItem extends GeneratedPrompt {}
