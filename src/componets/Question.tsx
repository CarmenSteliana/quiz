import { QuestionModel, Answer, AnswerState } from './types'
import styles from './Question.module.css'
import { decode } from 'html-entities';
import { useState } from 'react';

export interface QuestionProps {
    question: QuestionModel
    selectAnswer: (answer: Answer) => void
}

export default function Question({ question, selectAnswer }: QuestionProps) {

    return (<>
        <div>
            <div className={styles.question}>
                {decode(question.question)}
            </div>
            <div className={styles.buttons}>
                {
                    question.allAnswers
                        .map((answer, i) => <AnswerComponent
                            key={i}
                            answer={answer}
                            index={i}
                            click={() => selectAnswer(answer)}
                        />)
                }
            </div>
            <div className={styles.line}></div>

        </div>

    </>

    )
}

const AnswerComponent = ({ answer, index, click }: { answer: Answer, index: number, click: () => void }) => {

    let color = "white"

    switch (answer.state) {
        case AnswerState.Default:
            color = "white"
            break;
        case AnswerState.Selected:
            color = "blue"
            break;
        case AnswerState.Correct:
            color = "green"
            break;
        case AnswerState.Wrong:
            color = "red"
            break;
        case AnswerState.Disabled:
            color = "grey"
            break;

        default:
            break;
    }

    return <button
        className={styles.button}
        key={index}
        style={{ backgroundColor: color }}
        onClick={click}
        disabled={false}>
        <div>{decode(answer.text)}</div>
    </button>
}