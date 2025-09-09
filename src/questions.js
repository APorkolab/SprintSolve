export const questionState = {
    text: "",
    correctAnswer: null,
    answers: [],
    display: false,
};

let categories = [];

// Utility to decode HTML entities
function decodeHtml(html) {
    const txt = document.createElement("textarea");
    txt.innerHTML = html;
    return txt.value;
}

// Shuffles array in place and returns it
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function transformQuestion(apiQuestion) {
    const incorrectAnswers = apiQuestion.incorrect_answers.map(answer => decodeHtml(answer));
    const correctAnswer = decodeHtml(apiQuestion.correct_answer);

    const allAnswers = shuffleArray([...incorrectAnswers, correctAnswer]);
    const correctIndex = allAnswers.indexOf(correctAnswer);

    return {
        question: decodeHtml(apiQuestion.question),
        answers: allAnswers,
        correct_answer: correctIndex,
    };
}

export async function loadCategories() {
    try {
        const response = await fetch('https://opentdb.com/api_category.php');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        categories = data.trivia_categories;
        return categories;
    } catch (error) {
        // eslint-disable-next-line no-console
        console.error("Error loading categories:", error);
        return []; // Return empty array on error
    }
}

export async function fetchQuestion(categoryId) {
    try {
        const response = await fetch(`https://opentdb.com/api.php?amount=1&category=${categoryId}&type=multiple`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();

        if (data.response_code !== 0) {
            throw new Error(`API returned response code: ${data.response_code}`);
        }

        const transformed = transformQuestion(data.results[0]);

        questionState.text = transformed.question;
        questionState.correctAnswer = transformed.correct_answer;
        questionState.answers = transformed.answers;
        questionState.display = true;

    } catch (error) {
        // eslint-disable-next-line no-console
        console.error("Error fetching question:", error);
        // Display an error message on the canvas
        questionState.text = "Error loading question. Please try again.";
        questionState.display = true;
        questionState.answers = [];
    }
}
