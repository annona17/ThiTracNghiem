document.getElementById("studentForm").addEventListener("submit", function(event) {
      event.preventDefault(); // Ngăn chặn việc submit form mặc định
      var name = document.getElementById("name").value;
      var dob = document.getElementById("dob").value;
      var studentId = document.getElementById("studentId").value;
      var classRoom = document.getElementById("class").value;

      // Hiển thị thông tin sinh viên
      console.log("Họ và tên: " + name);
      console.log("Ngày sinh: " + dob);
      console.log("Mã sinh viên: " + studentId);
      console.log("Lớp: " + classRoom);

      // Ẩn form và hiển thị bộ câu hỏi demo
      document.getElementById("studentForm").style.display = "none";
      document.getElementById("quizContainer").style.display = "block";

      document.getElementById("submitBtn").style.display = "block";

      // Gọi hàm để load câu hỏi demo (Bạn cần cung cấp các câu hỏi ở đây)
      loadDemoQuestions();
    });

    function loadDemoQuestions() {
    fetch('data.json')
        .then(response => response.json())
        .then(data => {
            var quizContainer = document.getElementById("quiz");
            data.forEach(function(questionObj, index) {
                var questionElement = document.createElement("div");
                questionElement.classList.add("question");
                questionElement.innerHTML = `
                    <p>${questionObj.question}</p>
                `;
                
                // Thêm các lựa chọn
                if (questionObj.type === "multiple_choice") {
                    questionObj.options.forEach(function(option, optionIndex) {
                        var optionElement = document.createElement("div");
                        optionElement.classList.add("option");
                        optionElement.innerHTML = `
                            <input type="radio" id="question_${index}_option_${optionIndex}" name="question_${index}" value="${option}">
                            <label for="question_${index}_option_${optionIndex}">${option}</label>
                        `;
                        questionElement.appendChild(optionElement);
                    });
                } else if (questionObj.type === "true_false") {
                    var trueOptionElement = document.createElement("div");
                    trueOptionElement.classList.add("option");
                    trueOptionElement.innerHTML = `
                        <input type="radio" id="question_${index}_option_true" name="question_${index}" value="true">
                        <label for="question_${index}_option_true">Đúng</label>
                    `;
                    questionElement.appendChild(trueOptionElement);
        
                    var falseOptionElement = document.createElement("div");
                    falseOptionElement.classList.add("option");
                    falseOptionElement.innerHTML = `
                        <input type="radio" id="question_${index}_option_false" name="question_${index}" value="false">
                        <label for="question_${index}_option_false">Sai</label>
                    `;
                    questionElement.appendChild(falseOptionElement);
                } else if (questionObj.type === "multiple_choice_multiple_answer") {
                    questionObj.options.forEach(function(option, optionIndex) {
                        var optionElement = document.createElement("div");
                        optionElement.classList.add("option");
                        optionElement.innerHTML = `
                            <input type="checkbox" id="question_${index}_option_${optionIndex}" name="question_${index}" value="${option}">
                            <label for="question_${index}_option_${optionIndex}">${option}</label>
                        `;
                        questionElement.appendChild(optionElement);
                    });
                } else if (questionObj.type === "essay") {
                    var answerInput = document.createElement("textarea");
                    answerInput.setAttribute("id", `question_${index}_answer`);
                    answerInput.setAttribute("name", `question_${index}_answer`);
                    answerInput.setAttribute("placeholder", "Nhập đáp án của bạn ở đây...");
                    answerInput.setAttribute("placeholder", "Nhập đáp án của bạn ở đây...");
                    answerInput.style.paddingLeft = "15px"; // Đặt lề trái
                    answerInput.style.fontSize = "16px"; 
                    questionElement.appendChild(answerInput);
                }
                
                quizContainer.appendChild(questionElement);
            });
        })
        .catch(error => console.error('Error loading quiz questions:', error));
}
document.getElementById("submitBtn").addEventListener("click", function() {
    var totalQuestions = document.querySelectorAll(".question").length - 10;
    var totalCorrect = 0;

    var unansweredQuestions = document.querySelectorAll('.question:not(:has(input:checked)):not(:has(textarea))');

    if (unansweredQuestions.length > 0) {
        var confirmSubmit = confirm("Bạn chưa hoàn thiện các câu hỏi. Bạn chắc chắn muốn nộp bài?");
        if (confirmSubmit) {
            calculateAndDisplayResult(totalQuestions, totalCorrect);
        } else {
            return;
        }
    } else {
        calculateAndDisplayResult(totalQuestions, totalCorrect);
    }
});

function calculateAndDisplayResult(totalQuestions, totalCorrect) {
    document.querySelectorAll(".question").forEach(function(question) {
        var questionType = question.getAttribute("data-type");

        if (questionType === "true_false" || questionType === "multiple_choice") {
            var selectedOption = question.querySelector("input:checked");
            if (selectedOption) {
                var userAnswer = selectedOption.value;
                var correctAnswer = question.getAttribute("data-answer");

                if (userAnswer === correctAnswer) {
                    totalCorrect++;
                }
            }
        } else if (questionType === "multiple_choice_multiple_answer") {
            var userAnswers = Array.from(question.querySelectorAll("input:checked")).map(function(option) {
                return option.value;
            });
            var correctAnswers = question.getAttribute("data-answer").split(",");

            if (arraysEqual(userAnswers, correctAnswers)) {
                totalCorrect++;
            }
        } else if (questionType === "essay") {
            // Xử lý câu hỏi tự luận (không kiểm tra đáp án)
            totalQuestions--; // Giảm số lượng câu hỏi tự luận khỏi tổng số câu hỏi
        }
    });

    var resultText = "Số câu trắc nghiệm đúng: " + totalCorrect + "/" + totalQuestions;
    if (totalQuestions === totalCorrect) {
        resultText += "\nChúc mừng! Bạn đã hoàn thành tất cả câu hỏi một cách chính xác.";
    } else {
        resultText += "\nBạn chưa hoàn thành tất cả câu hỏi một cách chính xác.";
    }

    alert(resultText); // Hiển thị kết quả dưới dạng hộp thoại
}


function arraysEqual(arr1, arr2) {
    if (arr1.length != arr2.length) return false;
    for (var i = 0; i < arr1.length; i++) {
        if (arr1[i] != arr2[i]) return false;
    }
    return true;
}
