import React, { useState } from 'react';
import './QuestionItem.css';
import * as api from '../services/api';

function QuestionItem({ question, onExplain, onUpdate, onDelete }) {
    const [showAnswer, setShowAnswer] = useState(false);
    const [currentConfidence, setCurrentConfidence] = useState(question.confidence || 0);
    const [updatingConfidence, setUpdatingConfidence] = useState(false);

    const handleToggleAnswer = () => {
        setShowAnswer(!showAnswer);
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

    return (
        <div className="question-item">
            <div className="question-header">
                <p className="question-text"><strong>Q:</strong> {question.question}</p>
                <div className="question-icons">
                    {/* FolderPage already asks "Are you sure?", so no second confirm here */}
                    <button onClick={onDelete} title="Delete">🗑️</button>
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
                    {/* Tells FolderPage to open the ExplainModal for this question */}
                    <button onClick={onExplain}>💡 AI Explanation</button>
                </div>
            )}
        </div>
    );
}

export default QuestionItem;