import React, { useState } from 'react';
import './QuestionItem.css';
import * as api from '../services/api';

function QuestionItem(props) {
    const question = props.question;
    const onUpdate = props.onUpdate;
    const onDelete = props.onDelete;
    const [showAnswer, setShowAnswer] = useState(false);
    const [explanation, setExplanation] = useState('');
    const [showExplanation, setShowExplanation] = useState(false);
    const [loading, setLoading] = useState(false);
    const [currentConfidence, setCurrentConfidence] = useState(question.confidence || 0);
    const [updatingConfidence, setUpdatingConfidence] = useState(false);

    const handleToggleAnswer = () => {
        setShowAnswer(!showAnswer);
    };

    const handleExplain = async () => {
        setLoading(true);
        const response = await api.explainAnswer(question.question, question.answer);
        if (response.success) {
            setExplanation(response.data.explanation);
            setShowExplanation(true);
        }
        setLoading(false);
    };

    const handleDeleteQuestion = async () => {
        if (window.confirm('Delete this question?')) {
            onDelete();
        }
    };

    // Handle confidence level update
    const handleConfidenceClick = async (confidenceLevel) => {
        setUpdatingConfidence(true);
        try {
            const response = await api.updateQuestionConfidence(question._id, confidenceLevel);
            if (response.success) {
                setCurrentConfidence(confidenceLevel);
                if (onUpdate) {
                    onUpdate({ confidence: confidenceLevel });
                }
            }
        } catch (err) {
            console.error('Failed to update confidence:', err);
        } finally {
            setUpdatingConfidence(false);
        }
    };

    const getConfidenceLabel = () => {
        switch(currentConfidence) {
            case 0: return '🔴 Not Confident';
            case 1: return '🟡 Somewhat';
            case 2: return '🟢 Very Confident';
            default: return '⚪ Not Set';
        }
    };

    return (
        <div className="question-item">
            <div className="question-header">
                <p className="question-text"><strong>Q:</strong> {question.question}</p>
                <div className="question-icons">
                    <button onClick={handleDeleteQuestion} title="Delete">🗑️</button>
                </div>
            </div>

            {/* Confidence Level Display and Buttons */}
            <div className="confidence-section">
                <label>Confidence Level:</label>
                <div className="confidence-buttons">
                    <button
                        className={`confidence-btn ${currentConfidence === 0 ? 'active' : ''}`}
                        onClick={() => handleConfidenceClick(0)}
                        disabled={updatingConfidence}
                        title="Not Confident"
                    >
                        🔴 Not Confident (0)
                    </button>
                    <button
                        className={`confidence-btn ${currentConfidence === 1 ? 'active' : ''}`}
                        onClick={() => handleConfidenceClick(1)}
                        disabled={updatingConfidence}
                        title="Somewhat Confident"
                    >
                        🟡 Somewhat (1)
                    </button>
                    <button
                        className={`confidence-btn ${currentConfidence === 2 ? 'active' : ''}`}
                        onClick={() => handleConfidenceClick(2)}
                        disabled={updatingConfidence}
                        title="Very Confident"
                    >
                        🟢 Very Confident (2)
                    </button>
                </div>
            </div>

            <button className="toggle-btn" onClick={handleToggleAnswer}>
                {showAnswer ? 'Hide Answer' : 'Show Answer'}
            </button>

            {showAnswer && (
                <div className="answer-box">
                    <p><strong>A:</strong> {question.answer}</p>
                    <button 
                    onClick={handleExplain} 
                    disabled={true}
                    title="AI features temporarily unavailable"
                >
                💡 AI Explanation (Temporarily Unavailable)
                </button>
                </div>
            )}

            {showExplanation && (
                <div className="explanation-box">
                    <h4>Explanation:</h4>
                    <p>{explanation}</p>
                </div>
            )}
        </div>
    );
}

export default QuestionItem;