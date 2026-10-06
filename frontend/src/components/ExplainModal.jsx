import React, { useState, useEffect, useCallback } from 'react';
import ReactMarkdown from 'react-markdown';
import './ExplainModal.css';
import * as api from '../services/api';

// FolderPage only renders this modal when it should be open,
// so it fetches the explanation as soon as it appears.
function ExplainModal({ question, answer, onClose }) {
    const [explanation, setExplanation] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const fetchExplanation = useCallback(async () => {
        setLoading(true);
        setError('');
        try {
            const response = await api.explainAnswer(question, answer);
            if (response.success) {
                setExplanation(response.data.explanation);
            } else {
                setError(response.message || 'Failed to get explanation');
            }
        } catch (err) {
            setError('Failed to get explanation. Please try again.');
        } finally {
            setLoading(false);
        }
    }, [question, answer]);

    useEffect(() => {
        fetchExplanation();
    }, [fetchExplanation]);

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
                    {error && (
                        <div className="error">
                            <p>{error}</p>
                            <button onClick={fetchExplanation}>Try again</button>
                        </div>
                    )}
                    {explanation && (
                        <div className="explanation-box">
                            <h4>Explanation:</h4>
                            {/* ReactMarkdown shows **bold**, headings and lists properly,
                                and never runs HTML from the AI text (safe from script injection) */}
                            <ReactMarkdown>{explanation}</ReactMarkdown>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default ExplainModal;