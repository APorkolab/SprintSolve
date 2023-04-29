<?php
header("Content-Type: application/json");

$questions = [
    [
        "question" => "Mi az információfeldolgozás?",
        "answers" => [
            "A szöveges jellemzők meghatározása",
            "A szöveges kategóriák létrehozása",
            "A szöveges javítás",
            "Az adatok elemzése és értelmezése"
        ],
        "correct_answer" => 3
    ],
    [
        "question" => "Mi a szöveges kategóriázás?",
        "answers" => [
            "A szöveges jellemzők meghatározása",
            "A szöveges kategóriák létrehozása",
            "A szöveges javítás",
            "Az adatok elemzése és értelmezése"
        ],
        "correct_answer" => 1
    ],
    // További kérdések...
];

$selectedQuestion = $questions[array_rand($questions)];

echo json_encode([
    "question" => $selectedQuestion["question"],
    "answers" => $selectedQuestion["answers"],
    "correct_answer" => $selectedQuestion["correct_answer"]
]);
?>
