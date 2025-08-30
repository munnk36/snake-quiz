export function calculatePercentage(score: number, total: number): number {
    if (total === 0) return 0;
    return Math.round((score / total) * 100);
}

export function getPerformanceLevel(percentage: number): 'excellent' | 'good' | 'fair' | 'poor' {
    if (percentage >= 90) return 'excellent';
    if (percentage >= 70) return 'good';
    if (percentage >= 50) return 'fair';
    return 'poor';
}

export function formatScore(score: number, total: number): string {
    return `${score} / ${total}`;
}

export function isValidQuestionIndex(index: number, maxQuestions: number): boolean {
    return index >= 0 && index < maxQuestions;
}

export function getNextQuestionIndex(currentIndex: number, maxQuestions: number): number | null {
    const nextIndex = currentIndex + 1;
    return isValidQuestionIndex(nextIndex, maxQuestions) ? nextIndex : null;
}
