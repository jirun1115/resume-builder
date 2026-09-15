// ==========================================================================
// AI Resume & Portfolio Builder - 픽셀 아트 안경만두 인터랙티브 로직
// ==========================================================================

document.addEventListener("DOMContentLoaded", () => {
    // 1. 주요 DOM 요소 참조
    const form = document.getElementById("builderForm");
    const nameInput = document.getElementById("name");
    const roleInput = document.getElementById("role");
    const experienceInput = document.getElementById("experience");
    const projectsInput = document.getElementById("projects");
    const mandooChar = document.getElementById("mandooChar");
    const mandooSpeech = document.getElementById("mandooSpeech");

    const generateBtn = document.getElementById("generateBtn");
    const emptyState = document.getElementById("emptyState");
    const loadingArea = document.getElementById("loadingArea");
    const errorArea = document.getElementById("errorArea");
    const errorMessage = document.getElementById("errorMessage");
    const outputArea = document.getElementById("outputArea");
    const resultText = document.getElementById("resultText");
    const actionButtons = document.getElementById("actionButtons");
    const copyBtn = document.getElementById("copyBtn");
    const downloadBtn = document.getElementById("downloadBtn");

    let currentApplicantName = "";
    let rawMarkdownText = "";

    // 2. 직무 키워드에 따른 '픽셀 안경만두' 동적 변경 매핑 딕셔너리
    const MANDOO_THEMES = [
        {
            // '개발', '엔지니어', '백엔드' 등 입력 시 -> 헤드셋 픽셀 만두
            keywords: ["개발", "엔지니어", "백엔드", "프론트", "코딩", "프로그래머", "소프트웨어", "dev", "data", "웹"],
            image: "/static/images/pixel_mandoo_dev.svg",
            speech: "코딩 헤드셋 픽셀만두 출동! 🎧"
        },
        {
            // '디자인', '기획' 입력 시 -> 베레모 픽셀 만두
            keywords: ["디자인", "기획", "디자이너", "ui", "ux", "일러스트", "아트", "영상", "pm", "마케팅"],
            image: "/static/images/pixel_mandoo_beret.svg",
            speech: "감각적인 베레모 픽셀만두 등장! 🎨"
        }
    ];

    // 원본 투명 누끼 안경만두 캐릭터 (sample2_transparent.png)
    const DEFAULT_MANDOO = {
        image: "/static/images/sample2_transparent.png",
        speech: "안녕! 난 안경만두야! 🥟"
    };

    // 3. 입력창 포커스(Focus) 시 동적 말풍선 멘트 매핑
    const FOCUS_MESSAGES = {
        name: "당신의 멋진 이름을 알려줘! 😎",
        role: "어떤 일을 하고 싶은지 정확하게 적어주면 더 좋아! 🎯",
        experience: "사소한 경험이라도 직무와 엮으면 훌륭한 무기가 돼! ✨",
        projects: "핵심 역할과 성과를 수치화해서 적으면 합격률이 쑥쑥 올라가! 📈"
    };

    // 각 입력창 클릭(Focus) 및 벗어남(Blur) 이벤트 등록
    [
        { input: nameInput, message: FOCUS_MESSAGES.name },
        { input: roleInput, message: FOCUS_MESSAGES.role },
        { input: experienceInput, message: FOCUS_MESSAGES.experience },
        { input: projectsInput, message: FOCUS_MESSAGES.projects }
    ].forEach(({ input, message }) => {
        if (!input) return;
        input.addEventListener("focus", () => {
            mandooSpeech.textContent = message;
        });
        input.addEventListener("blur", () => {
            mandooSpeech.textContent = DEFAULT_MANDOO.speech;
        });
    });

    // '지원 직무' 타이핑 시 픽셀 안경만두 캐릭터와 말풍선 실시간 변환
    roleInput.addEventListener("input", () => {
        const val = roleInput.value.toLowerCase().trim();
        let matched = null;

        for (const theme of MANDOO_THEMES) {
            if (theme.keywords.some(k => val.includes(k))) {
                matched = theme;
                break;
            }
        }

        if (matched) {
            mandooChar.src = matched.image;
            mandooSpeech.textContent = matched.speech;
        } else {
            mandooChar.src = DEFAULT_MANDOO.image;
            mandooSpeech.textContent = val ? "어떤 일을 하고 싶은지 정확하게 적어주면 더 좋아! 🎯" : FOCUS_MESSAGES.role;
        }
    });

    // 3. 화면 상태 변경 함수들
    // (1) 로딩 상태: 픽셀 안경만두가 뒤뚱뒤뚱 움직이며 작성
    function showLoading() {
        emptyState.style.display = "none";
        errorArea.style.display = "none";
        outputArea.style.display = "none";
        actionButtons.style.display = "none";
        loadingArea.style.display = "block";
        generateBtn.disabled = true;
        generateBtn.textContent = "🥟 안경만두가 작성 중입니다...";
    }

    // (2) 결과 성공 상태
    function showResult(text) {
        rawMarkdownText = text;
        loadingArea.style.display = "none";
        errorArea.style.display = "none";
        emptyState.style.display = "none";
        outputArea.style.display = "block";
        actionButtons.style.display = "flex";

        // marked.js로 마크다운 서식 변환
        if (typeof marked !== "undefined" && marked.parse) {
            resultText.innerHTML = marked.parse(text);
        } else {
            resultText.textContent = text;
        }

        generateBtn.disabled = false;
        generateBtn.textContent = "✨ AI Resume & Portfolio Builder Generate";
    }

    // (3) 오류 상태
    function showError(message) {
        loadingArea.style.display = "none";
        outputArea.style.display = "none";
        actionButtons.style.display = "none";
        emptyState.style.display = "none";
        errorArea.style.display = "block";
        errorMessage.textContent = message;
        generateBtn.disabled = false;
        generateBtn.textContent = "✨ AI Resume & Portfolio Builder Generate";
    }

    // 4. 폼 제출 이벤트 핸들러
    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const name = document.getElementById("name").value.trim();
        const role = document.getElementById("role").value.trim();
        const experience = document.getElementById("experience").value.trim();
        const projects = document.getElementById("projects").value.trim();
        const tone = document.getElementById("tone").value;
        const promptTypeElement = document.querySelector('input[name="prompt_type"]:checked');
        const promptType = promptTypeElement ? promptTypeElement.value : "A";

        if (!name || !role || !experience || !projects) {
            showError("모든 필수 항목(Name, 지원 직무, 경력, 프로젝트)을 입력해줘만두!");
            return;
        }

        currentApplicantName = name;
        showLoading();

        try {
            const response = await fetch("/generate", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    name: name,
                    role: role,
                    tone: tone,
                    prompt_type: promptType,
                    experience: experience,
                    projects: projects
                })
            });

            const data = await response.json();

            if (response.ok && data.success) {
                showResult(data.result);
            } else {
                const errMsg = data.message || "문서 생성에 실패했어요 ㅠㅠ";
                showError(errMsg);
            }
        } catch (error) {
            console.error("API 요청 오류:", error);
            showError("서버와 연결할 수 없어요. 터미널의 Flask 서버를 확인해줘만두!");
        }
    });

    // 5. 결과 복사 기능
    copyBtn.addEventListener("click", async () => {
        const textToCopy = rawMarkdownText || resultText.textContent;
        if (!textToCopy) return;

        try {
            await navigator.clipboard.writeText(textToCopy);
            const originalText = copyBtn.textContent;
            copyBtn.textContent = "✅ 복사 완료만두!";
            copyBtn.disabled = true;

            setTimeout(() => {
                copyBtn.textContent = originalText;
                copyBtn.disabled = false;
            }, 2000);
        } catch (err) {
            console.error("클립보드 복사 실패:", err);
            alert("클립보드 복사에 실패했습니다. 마우스로 드래그해서 복사해 주세요!");
        }
    });

    // 6. 마크다운(.md) 파일 다운로드 기능
    downloadBtn.addEventListener("click", () => {
        const textToDownload = rawMarkdownText || resultText.textContent;
        if (!textToDownload) return;

        const blob = new Blob([textToDownload], { type: "text/markdown;charset=utf-8;" });
        const url = URL.createObjectURL(blob);

        const safeName = currentApplicantName ? currentApplicantName.replace(/[^a-zA-Z0-9가-힣]/g, "_") : "resume";
        const filename = `${safeName}_이력서_포트폴리오.md`;

        const a = document.createElement("a");
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();

        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    });
});
