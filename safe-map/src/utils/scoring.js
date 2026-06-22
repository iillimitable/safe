/**
 * Calculates the safety score based on the 15 questions.
 * @param {Object} responses - Object containing answers to 15 questions
 * @returns {number} Final Safety Score (0-100)
 */
const calculateSafetyScore = (responses) => {
    let score = 0;

    // 1. Overall Safety (25 points)
    // Q1: Overall rating (1-5) -> 12.5 points
    const q1 = parseInt(responses.q1) || 3;
    score += (q1 / 5) * 12.5;

    // Q2: Walking alone -> 7.5 points
    // 4: Yes (Day & Night), 3: Only Day, 2: Not at Night, 1: Not at All
    const q2 = parseInt(responses.q2) || 2;
    score += (q2 / 4) * 7.5;

    // Q3: Crime witnessed (Penalty handled separately) -> 5 points if No
    if (responses.q3 === 'No') score += 5;

    // 2. Infrastructure (20 points)
    // Q4: Street lighting (1-5) -> 6 points
    const q4 = parseInt(responses.q4) || 3;
    score += (q4 / 5) * 6;

    // Q5: Crowded (1-4) -> 5 points
    // 4: Always, 3: Sometimes, 2: Rarely, 1: Almost Empty
    const q5 = parseInt(responses.q5) || 2;
    score += (q5 / 4) * 5;

    // Q6: CCTV (1-3) -> 5 points
    // 3: Many, 2: Few, 1: None
    const q6 = parseInt(responses.q6) || 1;
    score += (q6 / 3) * 5;

    // Q7: Clean (1-4) -> 4 points
    const q7 = parseInt(responses.q7) || 2;
    score += (q7 / 4) * 4;

    // 3. Law & Order (15 points)
    // Q8: Police patrol (1-4) -> 8 points
    const q8 = parseInt(responses.q8) || 2;
    score += (q8 / 4) * 8;

    // Q9: Emergency help (1-4) -> 7 points
    const q9 = parseInt(responses.q9) || 2;
    score += (q9 / 4) * 7;

    // 4. Time-Based (20 points)
    // Q10: Day safety (1-5) -> 8 points
    const q10 = parseInt(responses.q10) || 3;
    score += (q10 / 5) * 8;

    // Q11: Night safety (1-5) -> 12 points
    const q11 = parseInt(responses.q11) || 3;
    score += (q11 / 5) * 12;

    // 5. Gender Safety (15 points)
    // Q12: Safe for women (1-5) -> 10 points
    const q12 = parseInt(responses.q12) || 3;
    score += (q12 / 5) * 10;

    // Q13: Harassment (Penalty handled separately) -> 5 points if No
    if (responses.q13 === 'No') score += 5;

    // 6. Incident Reporting (5 points)
    // Q14: Issue common -> 5 points if No major issues
    const q14Response = responses.q14;
    const isNoIssues = Array.isArray(q14Response) 
        ? (q14Response.includes('No major issues') && q14Response.length === 1)
        : q14Response === 'No major issues';
    
    if (isNoIssues) score += 5;

    // Penalties
    let penalty = 0;
    if (responses.q3 === 'Yes') penalty += 5;
    if (responses.q13 === 'Yes') penalty += 5;
    if (responses.q3 === 'Yes' && responses.q13 === 'Yes') penalty += 5; // Extra penalty

    score -= penalty;

    // Normalize and Clamp
    return Math.max(0, Math.min(100, Math.round(score)));
};

module.exports = { calculateSafetyScore };
