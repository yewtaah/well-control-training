"use client";

import Link from "next/link";
import { useState } from "react";
import type { Quiz } from "@/lib/curriculum";
import { useProgress } from "@/lib/useProgress";

type Answers = Record<string, number | undefined>;

export function KnowledgeCheck({
  courseSlug,
  courseTitle,
  quiz,
}: {
  courseSlug: string;
  courseTitle: string;
  quiz: Quiz;
}) {
  const { quizResult, recordQuizResult } = useProgress(courseSlug);
  const [answers, setAnswers] = useState<Answers>({});
  const [submitted, setSubmitted] = useState(false);

  const total = quiz.questions.length;
  const answeredCount = quiz.questions.filter(
    (question) => answers[question.id] !== undefined
  ).length;
  const correctCount = quiz.questions.filter(
    (question) => answers[question.id] === question.answerIndex
  ).length;
  const scorePercent = total === 0 ? 0 : Math.round((correctCount / total) * 100);
  const passed = scorePercent >= quiz.passPercent;

  function handleSubmit() {
    setSubmitted(true);
    recordQuizResult({
      scorePercent,
      correctCount,
      questionCount: total,
      passed,
    });
  }

  function handleRetake() {
    setAnswers({});
    setSubmitted(false);
  }

  return (
    <div className="flex flex-col gap-8">
      {!submitted && quizResult ? (
        <p className="rounded-lg border border-[var(--brand-border)] bg-zinc-50 px-4 py-3 text-sm text-zinc-600">
          Best previous attempt: {quizResult.scorePercent}%{" "}
          {quizResult.passed ? "— passed" : "— not yet passed"}
        </p>
      ) : null}

      {submitted ? (
        <div
          className={`rounded-lg border p-6 ${
            passed
              ? "border-emerald-300 bg-emerald-50"
              : "border-brand-gold bg-brand-gold/10"
          }`}
          role="status"
        >
          <p className="font-serif text-2xl font-semibold text-brand-navy">
            {scorePercent}% &mdash; {correctCount} of {total} correct
          </p>
          <p className="mt-2 text-sm leading-6 text-zinc-700">
            {passed
              ? `You passed the knowledge check for ${courseTitle}.`
              : `You need ${quiz.passPercent}% to pass. Review the explanations below and try again.`}
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={handleRetake}
              className="inline-flex h-10 items-center justify-center rounded-full border border-brand-navy px-5 text-sm font-semibold text-brand-navy transition-colors hover:bg-brand-navy hover:text-white"
            >
              Retake
            </button>
            <Link
              href={`/courses/${courseSlug}`}
              className="inline-flex h-10 items-center justify-center rounded-full bg-brand-gold px-5 text-sm font-semibold text-brand-navy transition-colors hover:bg-brand-gold-dark"
            >
              Back to course
            </Link>
          </div>
        </div>
      ) : null}

      <ol className="flex flex-col gap-8">
        {quiz.questions.map((question, questionIndex) => {
          const selected = answers[question.id];
          return (
            <li key={question.id}>
              <fieldset>
                <legend className="font-serif text-lg font-semibold leading-snug text-brand-navy">
                  {questionIndex + 1}. {question.prompt}
                </legend>
                <div className="mt-4 flex flex-col gap-2">
                  {question.options.map((option, optionIndex) => {
                    const isSelected = selected === optionIndex;
                    const isAnswer = optionIndex === question.answerIndex;
                    let tone =
                      "border-[var(--brand-border)] bg-white hover:border-brand-gold";
                    if (submitted && isAnswer) {
                      tone = "border-emerald-400 bg-emerald-50";
                    } else if (submitted && isSelected) {
                      tone = "border-red-300 bg-red-50";
                    } else if (isSelected) {
                      tone = "border-brand-gold bg-brand-gold/10";
                    }
                    return (
                      <label
                        key={option}
                        className={`flex cursor-pointer items-start gap-3 rounded-lg border px-4 py-3 text-sm leading-6 text-zinc-700 transition-colors ${tone}`}
                      >
                        <input
                          type="radio"
                          name={question.id}
                          className="mt-1 accent-[var(--brand-gold)]"
                          checked={isSelected ?? false}
                          disabled={submitted}
                          onChange={() =>
                            setAnswers((previous) => ({
                              ...previous,
                              [question.id]: optionIndex,
                            }))
                          }
                        />
                        <span>{option}</span>
                      </label>
                    );
                  })}
                </div>
              </fieldset>
              {submitted ? (
                <p className="mt-3 border-l-2 border-brand-gold pl-4 text-sm leading-6 text-zinc-600">
                  {question.explanation}
                </p>
              ) : null}
            </li>
          );
        })}
      </ol>

      {!submitted ? (
        <div className="flex flex-wrap items-center gap-4 border-t border-[var(--brand-border)] pt-6">
          <button
            type="button"
            onClick={handleSubmit}
            disabled={answeredCount < total}
            className="inline-flex h-11 items-center justify-center rounded-full bg-brand-gold px-6 text-sm font-semibold text-brand-navy transition-colors hover:bg-brand-gold-dark disabled:cursor-not-allowed disabled:bg-zinc-200 disabled:text-zinc-500"
          >
            Submit answers
          </button>
          <p className="text-sm text-zinc-500">
            {answeredCount} of {total} answered
          </p>
        </div>
      ) : null}
    </div>
  );
}
