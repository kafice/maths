// src/utils/problemGenerator.js

/**
 * Helper function to get a random integer between min and max (inclusive)
 */
export const getRandomInt = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

/**
 * Helper function to check if subtraction requires multiple borrows
 */
export const requiresMultipleBorrows = (a, b) => {
  let borrowCount = 0;
  let aDigits = a.toString().split("").map(Number).reverse();
  let bDigits = b.toString().split("").map(Number).reverse();

  for (let i = 0; i < aDigits.length; i++) {
    if (i < bDigits.length && aDigits[i] < bDigits[i]) {
      borrowCount++;
    }
  }

  return borrowCount > 1;
};

/**
 * Generate an addition problem based on difficulty level
 */
export const generateAdditionProblem = (difficulty) => {
  let num1, num2, num3, question, answer;

  switch (difficulty) {
    case "easy":
      // Two 2-digit numbers ≤100, no carry
      do {
        num1 = getRandomInt(10, 90);
        num2 = getRandomInt(10, 90);
      } while ((num1 % 10) + (num2 % 10) >= 10); // Ensure no carrying

      question = `${num1} + ${num2} = ?`;
      answer = num1 + num2;
      break;

    case "medium":
      // Three 2-digit numbers ≤1,000, carry allowed
      num1 = getRandomInt(10, 90);
      num2 = getRandomInt(10, 90);
      num3 = getRandomInt(10, 90);

      question = `${num1} + ${num2} + ${num3} = ?`;
      answer = num1 + num2 + num3;
      break;

    case "hard":
      // Two 3-digit numbers ≤1,000, multiple carries
      num1 = getRandomInt(100, 900);
      num2 = getRandomInt(100, 900);

      question = `${num1} + ${num2} = ?`;
      answer = num1 + num2;
      break;

    case "very-hard":
      // Multi-step operations (4–5 digit numbers)
      num1 = getRandomInt(1000, 9000);
      num2 = getRandomInt(1000, 9000);

      // Either mixed operations or simple addition of large numbers
      if (Math.random() > 0.5) {
        num3 = getRandomInt(100, 900);
        question = `${num1} + ${num2} - ${num3} = ?`;
        answer = num1 + num2 - num3;
      } else {
        question = `${num1} + ${num2} = ?`;
        answer = num1 + num2;
      }
      break;

    default:
      num1 = getRandomInt(10, 90);
      num2 = getRandomInt(10, 90);
      question = `${num1} + ${num2} = ?`;
      answer = num1 + num2;
  }

  return {
    question,
    answer,
    type: "add",
    difficulty,
    points: difficulty === "very-hard" ? 20 : 10,
  };
};

/**
 * Generate a subtraction problem based on difficulty level
 */
export const generateSubtractionProblem = (difficulty) => {
  let num1, num2, num3, question, answer;

  switch (difficulty) {
    case "easy":
      // Two 2-digit numbers ≤100, no borrow
      do {
        num2 = getRandomInt(10, 90);
        num1 = getRandomInt(Math.max(10, num2), 99);
      } while (num1 % 10 < num2 % 10); // Ensure no borrowing

      question = `${num1} - ${num2} = ?`;
      answer = num1 - num2;
      break;

    case "medium":
      // Two 3-digit numbers ≤1,000, single borrow
      do {
        num1 = getRandomInt(100, 900);
        num2 = getRandomInt(100, 900);
      } while (num1 < num2); // Ensure positive result

      question = `${num1} - ${num2} = ?`;
      answer = num1 - num2;
      break;

    case "hard":
      // Two 3-digit numbers ≤1,000, multiple borrows
      num1 = getRandomInt(100, 900);
      // Ensure num2 is smaller but requires multiple borrows
      do {
        num2 = getRandomInt(1, num1 - 1);
      } while (!requiresMultipleBorrows(num1, num2));

      question = `${num1} - ${num2} = ?`;
      answer = num1 - num2;
      break;

    case "very-hard":
      // Large numbers (≤10,000), borrowing across zeros
      num1 = getRandomInt(1000, 9000);

      if (Math.random() > 0.5) {
        // Create a problem with zeros (e.g., 1000, 2000, etc.)
        num1 = Math.floor(num1 / 1000) * 1000;
        num2 = getRandomInt(1, num1 - 1);
        question = `${num1} - ${num2} = ?`;
        answer = num1 - num2;
      } else {
        // Multiple operations
        num2 = getRandomInt(100, 900);
        num3 = getRandomInt(100, 900);
        question = `${num1} - ${num2} - ${num3} = ?`;
        answer = num1 - num2 - num3;
      }
      break;

    default:
      num1 = getRandomInt(10, 90);
      num2 = getRandomInt(1, num1);
      question = `${num1} - ${num2} = ?`;
      answer = num1 - num2;
  }

  return {
    question,
    answer,
    type: "subtract",
    difficulty,
    points: difficulty === "very-hard" ? 20 : 10,
  };
};

/**
 * Generate a percentage problem based on difficulty level
 */
export const generatePercentageProblem = (difficulty) => {
  let num1, num2, num3, question, answer, explanation;

  switch (difficulty) {
    case "easy":
      // Basic % of whole numbers (≤100)
      num1 = getRandomInt(1, 100);
      // Use simple percentages: 10%, 25%, 50%, 75%, 100%
      const simplePercentages = [10, 25, 50, 75, 100];
      num2 = simplePercentages[getRandomInt(0, simplePercentages.length - 1)];

      question = `${num2}% of ${num1} = ?`;
      answer = Math.round((num2 / 100) * num1);
      explanation = `${num2}% of ${num1} = ${num1} × ${num2}/100 = ${answer}`;
      break;

    case "medium":
      // % increase/decrease (≤1,000)
      num1 = getRandomInt(1, 1000);
      num2 = getRandomInt(1, 50); // 1-50% change

      if (Math.random() > 0.5) {
        // Increase
        question = `${num1} increased by ${num2}% = ?`;
        answer = Math.round(num1 * (1 + num2 / 100));
        explanation = `${num1} × (1 + ${num2}/100) = ${num1} × ${
          1 + num2 / 100
        } = ${answer}`;
      } else {
        // Decrease
        question = `${num1} decreased by ${num2}% = ?`;
        answer = Math.round(num1 * (1 - num2 / 100));
        explanation = `${num1} × (1 - ${num2}/100) = ${num1} × ${
          1 - num2 / 100
        } = ${answer}`;
      }
      break;

    case "hard":
      // Reverse/compound % (≤10,000)
      if (Math.random() > 0.5) {
        // Reverse percentage
        answer = getRandomInt(100, 1000);
        num2 = getRandomInt(10, 59); // 10-59%
        num1 = Math.round(answer / (1 + num2 / 100));

        question = `A value increased by ${num2}% is ${answer}. What was the original value?`;
        explanation = `If x increased by ${num2}% equals ${answer}, then x × (1 + ${num2}/100) = ${answer}. So x = ${answer} / (1 + ${num2}/100) = ${answer} / ${
          1 + num2 / 100
        } = ${num1}`;
      } else {
        // Compound percentage
        num1 = getRandomInt(100, 1000);
        num2 = getRandomInt(10, 39); // First % (10-39%)
        num3 = getRandomInt(10, 39); // Second % (10-39%)

        question = `${num1} increased by ${num2}%, then increased by ${num3}% = ?`;
        const intermediate = num1 * (1 + num2 / 100);
        answer = Math.round(intermediate * (1 + num3 / 100));
        explanation = `First increase: ${num1} × (1 + ${num2}/100) = ${intermediate.toFixed(
          2
        )}. Second increase: ${intermediate.toFixed(
          2
        )} × (1 + ${num3}/100) = ${answer}`;
      }
      break;

    case "very-hard":
      // Multi-layered compound % (e.g., financial scenarios)
      num1 = getRandomInt(1000, 10000);
      num2 = getRandomInt(10, 39); // First % (10-39%)

      if (Math.random() > 0.5) {
        // Three-layer percentage change
        num3 = getRandomInt(10, 39);
        const thirdPercentage = getRandomInt(10, 39);

        question = `A product costs $${num1}. The price increases by ${num2}%, then decreases by ${num3}%, then increases by ${thirdPercentage}%. What is the final price?`;

        const step1 = num1 * (1 + num2 / 100);
        const step2 = step1 * (1 - num3 / 100);
        answer = Math.round(step2 * (1 + thirdPercentage / 100));

        explanation = `Initial price: $${num1}. After ${num2}% increase: $${step1.toFixed(
          2
        )}. After ${num3}% decrease: $${step2.toFixed(
          2
        )}. After ${thirdPercentage}% increase: $${answer}`;
      } else {
        // Backward calculation from final price
        answer = getRandomInt(1000, 10000);
        num3 = getRandomInt(10, 39);

        // Calculate what the original price would have been
        const factor = (1 + num2 / 100) * (1 - num3 / 100);
        num1 = Math.round(answer / factor);

        question = `A product's price increases by ${num2}%, then decreases by ${num3}%. The final price is $${answer}. What was the original price?`;
        explanation = `If x increased by ${num2}%, then decreased by ${num3}% equals ${answer}, then x × (1 + ${num2}/100) × (1 - ${num3}/100) = ${answer}. So x = ${answer} / ((1 + ${num2}/100) × (1 - ${num3}/100)) = ${answer} / ${factor.toFixed(
          4
        )} = ${num1}`;
      }
      break;

    default:
      num1 = getRandomInt(1, 100);
      num2 = 10;
      question = `${num2}% of ${num1} = ?`;
      answer = Math.round((num2 / 100) * num1);
      explanation = `${num2}% of ${num1} = ${num1} × ${num2}/100 = ${answer}`;
  }

  return {
    question,
    answer,
    explanation,
    type: "percentage",
    difficulty,
    points: difficulty === "very-hard" ? 20 : 10,
  };
};

/**
 * Generate a sequence problem based on difficulty level
 */
export const generateSequenceProblem = (difficulty) => {
  let sequence, nextValue, question, explanation;

  switch (difficulty) {
    case "easy":
      // Arithmetic progression (≤100)
      const start = getRandomInt(1, 20);
      const increment = getRandomInt(1, 10);

      sequence = Array(5)
        .fill()
        .map((_, i) => start + i * increment);
      nextValue = start + 5 * increment;

      question = `What is the next number in this sequence? ${sequence.join(
        ", "
      )}, ?`;
      explanation = `This is an arithmetic sequence with constant difference ${increment}`;
      break;

    case "medium":
      // Two-step patterns (≤1,000)
      if (Math.random() > 0.5) {
        // Alternating addition (e.g., +2, +5, +2, +5)
        const inc1 = getRandomInt(1, 10);
        const inc2 = getRandomInt(inc1 + 1, inc1 + 10);
        const startValue = getRandomInt(1, 20);

        sequence = [startValue];
        for (let i = 0; i < 4; i++) {
          sequence.push(sequence[i] + (i % 2 === 0 ? inc1 : inc2));
        }
        nextValue = sequence[4] + (4 % 2 === 0 ? inc1 : inc2);

        explanation = `The sequence alternates between adding ${inc1} and adding ${inc2}`;
      } else {
        // Squared numbers or cubed numbers
        const startNum = getRandomInt(1, 10);
        sequence = Array(5)
          .fill()
          .map((_, i) => Math.pow(startNum + i, 2));
        nextValue = Math.pow(startNum + 5, 2);

        explanation = `Each term is the square of the position number plus ${
          startNum - 1
        }`;
      }

      question = `What is the next number in this sequence? ${sequence.join(
        ", "
      )}, ?`;
      break;

    case "hard":
      // Geometric/non-linear (≤10,000)
      if (Math.random() > 0.5) {
        // Geometric sequence
        const startVal = getRandomInt(1, 5);
        const ratio = getRandomInt(2, 4);

        sequence = Array(5)
          .fill()
          .map((_, i) => startVal * Math.pow(ratio, i));
        nextValue = startVal * Math.pow(ratio, 5);

        explanation = `This is a geometric sequence with ratio ${ratio}`;
      } else {
        // Fibonacci-like sequence
        const a = getRandomInt(1, 5);
        const b = getRandomInt(a + 1, a + 10);

        sequence = [a, b];
        for (let i = 2; i < 5; i++) {
          sequence.push(sequence[i - 1] + sequence[i - 2]);
        }
        nextValue = sequence[4] + sequence[3];

        explanation = `Each number is the sum of the two previous numbers`;
      }

      question = `What is the next number in this sequence? ${sequence.join(
        ", "
      )}, ?`;
      break;

    case "very-hard":
      // Abstract/nested logic (e.g., primes, factorials)
      const sequenceType = getRandomInt(0, 2);

      if (sequenceType === 0) {
        // Look-and-say sequence
        sequence = ["1", "11", "21", "1211", "111221"];
        nextValue = 312211;
        explanation =
          "This is a look-and-say sequence: each term describes the previous term";
      } else if (sequenceType === 1) {
        // Alternating operations
        const startSeq = getRandomInt(2, 6);
        sequence = [startSeq];

        // For example: ×2, +3, ×2, +3, ...
        const mul = getRandomInt(2, 4);
        const add = getRandomInt(1, 10);

        for (let i = 0; i < 4; i++) {
          if (i % 2 === 0) {
            sequence.push(sequence[i] * mul);
          } else {
            sequence.push(sequence[i] + add);
          }
        }

        if (4 % 2 === 0) {
          nextValue = sequence[4] * mul;
        } else {
          nextValue = sequence[4] + add;
        }

        explanation = `The sequence alternates between multiplying by ${mul} and adding ${add}`;
      } else {
        // Position-based sequence
        sequence = [1, 4, 9, 16, 25];
        nextValue = 36;
        explanation =
          "Each number is the square of its position (1², 2², 3², 4², 5², 6²)";
      }

      question = `What is the next number in this sequence? ${sequence.join(
        ", "
      )}, ?`;
      break;

    default:
      sequence = [2, 4, 6, 8, 10];
      nextValue = 12;
      question = `What is the next number in this sequence? ${sequence.join(
        ", "
      )}, ?`;
      explanation = "This is an arithmetic sequence with common difference 2";
  }

  return {
    question,
    answer: nextValue,
    explanation,
    type: "sequence",
    difficulty,
    points: difficulty === "very-hard" ? 20 : 10,
  };
};

/**
 * Get a random problem based on category and difficulty
 */
export const generateProblem = (category, difficulty) => {
  // If mixed category, randomly select a category
  const actualCategory =
    category === "mixed"
      ? ["add", "subtract", "percentage", "sequence"][getRandomInt(0, 3)]
      : category;

  switch (actualCategory) {
    case "add":
      return generateAdditionProblem(difficulty);
    case "subtract":
      return generateSubtractionProblem(difficulty);
    case "percentage":
      return generatePercentageProblem(difficulty);
    case "sequence":
      return generateSequenceProblem(difficulty);
    default:
      return generateAdditionProblem(difficulty);
  }
};
