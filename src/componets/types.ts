export enum AnswerState {
    Default,
    Selected,
    Correct,
    Wrong,
    Disabled
}


export interface Answer {
    text: string
    state: AnswerState
}

export interface QuestionModel {
    question: string
    allAnswers: Answer[]
    correctAnswerText: string
}

