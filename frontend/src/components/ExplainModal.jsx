import React, { useState, useEffect, useCallback } from 'react';
import './ExplainModal.css';
import * as api from '../services/api';

function ExplainModal(props) {
    const { question, answer, isOpen, onClose } = props;
    const [explanation, setExplanation] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // MOVED UP - Define function FIRST
    const fetchExplanation = useCallback(async () => {
        setLoading(true);
        setError('');
        try {
            const response = await api.explainAnswer(question, answer);
            if (response.success) {
                setExplanation(response.data.explanation);
            } else {
                setError(response.message);
            }
        } catch (err) {
            setError('Failed to get explanation');
        } finally {
            setLoading(false);
        }
    }, [question, answer]);

    // NOW use it here
    useEffect(() => {
        if (isOpen) {
            fetchExplanation();
        }
    }, [isOpen, fetchExplanation]);

    if (!isOpen) return null;

    return (
        <div className="explain-overlay" onClick={onClose}>
            <div className="explain-modal" onClick={(e) => e.stopPropagation()}>
                <div className="explain-header">
                    <h2>💡 Explanation</h2>
                    <button className="close-btn" onClick={onClose}>✕</button>
                </div>

                <div className="explain-body">
                    <div className="question-box">
                        <h4>Question:</h4>
                        <p>{question}</p>
                    </div>

                    <div className="answer-box">
                        <h4>Answer:</h4>
                        <p>{answer}</p>
                    </div>

                    {loading && <p className="loading">Generating explanation...</p>}
                    {error && <p className="error">{error}</p>}
                    {explanation && (
                        <div className="explanation-box">
                            <h4>Explanation:</h4>
                            <p>{explanation}</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default ExplainModal;