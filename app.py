import os
import logging
from flask import Flask, render_template, request, jsonify, make_response
from dotenv import load_dotenv
from google import genai

# 1. 환경변수(.env) 로드
load_dotenv()

# 2. 로깅(Logging) 설정: 서버 터미널에 요청, 응답, 오류를 기록합니다.
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
    handlers=[logging.StreamHandler()]
)
logger = logging.getLogger(__name__)

# 3. Flask 웹 애플리케이션 초기화
app = Flask(__name__)

# 4. Gemini API Key 확인 및 설정
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
client = None

if not GEMINI_API_KEY:
    logger.warning("경고: GEMINI_API_KEY가 .env 파일에 설정되어 있지 않습니다.")
else:
    client = genai.Client(api_key=GEMINI_API_KEY)

# 5. 루트(/) 라우트: 메인 웹 페이지 렌더링
@app.route("/")
def index():
    return render_template("index.html")

# 5-1. PWA 매니페스트 라우트
@app.route("/manifest.json")
def manifest():
    return app.send_static_file("manifest.json")

# 5-2. PWA 서비스 워커 라우트 (루트 스코프 권한 헤더 포함)
@app.route("/sw.js")
def service_worker():
    response = make_response(app.send_static_file("sw.js"))
    response.headers["Content-Type"] = "application/javascript"
    response.headers["Service-Worker-Allowed"] = "/"
    return response

# 6. 생성(/generate) 라우트: AI 이력서 및 포트폴리오 생성 API
@app.route("/generate", methods=["POST"])
def generate():
    try:
        # [1] 요청 데이터 수신 및 JSON 파싱
        data = request.get_json()
        if not data:
            logger.warning("요청 실패: 전송된 JSON 데이터가 없습니다.")
            return jsonify({
                "success": False,
                "message": "요청 데이터가 올바르지 않습니다. JSON 형식으로 전송해 주세요."
            }), 400

        name = data.get("name", "").strip()
        role = data.get("role", "").strip()
        experience = data.get("experience", "").strip()
        projects = data.get("projects", "").strip()
        tone = data.get("tone", "전문적이고 신뢰감 있는").strip()
        prompt_type = data.get("prompt_type", "A").strip()

        # [2] 백엔드 입력값 검증 (Validation)
        if not name:
            return jsonify({"success": False, "message": "이름을 입력해 주세요."}), 400
        if not role:
            return jsonify({"success": False, "message": "지원 직무를 입력해 주세요."}), 400
        if not experience:
            return jsonify({"success": False, "message": "경력 사항을 입력해 주세요."}), 400
        if not projects:
            return jsonify({"success": False, "message": "프로젝트 경험을 입력해 주세요."}), 400

        # [3] 요청 로그 기록
        logger.info(
            "생성 요청 수신 - 지원자: %s, 직무: %s, 톤: %s, 프롬프트 모드: %s",
            name, role, tone, prompt_type
        )

        # [4] API Key 존재 여부 확인
        if not GEMINI_API_KEY or GEMINI_API_KEY == "your_gemini_api_key_here":
            logger.error("API 키 오류: 유효한 GEMINI_API_KEY가 설정되지 않았습니다.")
            return jsonify({
                "success": False,
                "message": ".env 파일에 유효한 Gemini API 키가 설정되지 않았습니다. API 키를 확인해 주세요."
            }), 500

        # [5] 프롬프트 엔지니어링 (Prompt Engineering)
        if prompt_type == "B":
            # Prompt B: 전문가 모드 (STAR 기법, 비즈니스 임팩트 중심)
            system_instruction = (
                "당신은 글로벌 IT 기업의 시니어 테크니컬 리크루터이자 커리어 전략가입니다.\n"
                "지원자의 경험을 분석하여 강점과 문제 해결 능력, 구체적인 비즈니스 임팩트(STAR 기법: Situation, Task, Action, Result)가 드러나도록 "
                "고급 수준의 전문적인 이력서(Resume)와 포트폴리오(Portfolio) 초안을 작성하세요.\n"
                f"글의 어조(Tone): {tone}\n"
            )
        else:
            # Prompt A: 일반 모드 (가독성 중심, 깔끔한 표준 서식)
            system_instruction = (
                "당신은 친절하고 전문적인 커리어 코치입니다.\n"
                "지원자가 작성한 기본 정보를 바탕으로 가독성이 높고 채용 담당자의 눈에 띄는 깔끔한 이력서(Resume)와 포트폴리오(Portfolio) 초안을 작성하세요.\n"
                f"글의 어조(Tone): {tone}\n"
            )

        user_content = f"""
다음 지원자 정보를 바탕으로 완성도 높은 [이력서(Resume)]와 [포트폴리오(Portfolio)]를 마크다운(Markdown) 문서로 작성해 주세요.

### 지원자 기본 정보
- **이름**: {name}
- **지원 직무**: {role}
- **경력 및 활동**:
{experience}

- **주요 프로젝트**:
{projects}

### 작성 지침
1. 문서는 반드시 마크다운(Markdown) 포맷으로 작성하세요.
2. 크게 `# 1. 이력서 (Resume)` 섹션과 `# 2. 포트폴리오 (Portfolio)` 섹션으로 명확히 구분하세요.
3. 이력서 섹션에는 자기소개 요약(Summary), 핵심 역량(Core Skills), 경력 사항(Experience)을 포함하세요.
4. 포트폴리오 섹션에는 각 프로젝트별 개요, 담당 역할, 기술 스택, 핵심 성과 및 배운 점을 체계적으로 서술하세요.
5. 설정된 어조('{tone}')를 자연스럽게 유지하며 설득력 있는 문장으로 다듬어 주세요.
"""

        full_prompt = f"{system_instruction}\n\n{user_content}"

        # [6] Gemini API 호출 (과부하가 적고 빠른 gemini-3.5-flash-lite 모델)
        response = client.models.generate_content(
            model="gemini-3.5-flash-lite",
            contents=full_prompt,
        )

        result_text = response.text

        # [7] 응답 로그 기록
        logger.info(
            "생성 완료 - 지원자: %s, 생성된 결과 길이: %d 글자",
            name, len(result_text)
        )

        return jsonify({
            "success": True,
            "result": result_text
        }), 200

    except Exception as e:
        logger.error("서버 오류 발생: %s", str(e), exc_info=True)
        return jsonify({
            "success": False,
            "message": f"AI 문서 생성 중 오류가 발생했습니다: {str(e)}"
        }), 500

# 7. 서버 실행 진입점
if __name__ == "__main__":
    logger.info("Flask 서버를 준비합니다. http://127.0.0.1:5000")
    app.run(host="127.0.0.1", port=5000, debug=True)
