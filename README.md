# 🥟 AI Resume & Portfolio Builder (안경만두 에디션)

> Google Gemini API와 Flask를 기반으로 제작된 귀여운 안경만두 테마의 **AI 이력서 & 포트폴리오 생성기**입니다.  
> 사용자의 간단한 이력과 경험 키워드를 바탕으로 완성도 높은 국/영문 이력서 및 포트폴리오 초안을 즉시 작성해 줍니다.

---

## ✨ 주요 기능 (Key Features)

- 🤖 **AI 기반 이력서/포트폴리오 생성**
  - 최신 Google Gemini API(`gemini-3.5-flash-lite`)를 연동하여 전문적인 국문/영문 이력서와 포트폴리오를 빠르게 생성합니다.
  - 신입, 경력, 이직 등 다양한 목적과 전문적/열정적/담백한 톤앤매너를 선택할 수 있습니다.
- 🥟 **반응형 픽셀 안경만두 캐릭터 & 동적 말풍선**
  - **포커스 반응형 가이드**: 입력창(이름, 지원 직무, 경력, 프로젝트) 클릭 시 안경만두가 실시간으로 팁과 조언을 말풍선으로 건넵니다.
  - **직무 맞춤형 인터랙션**: 지원 직무에 '개발' 또는 '디자인' 키워드 입력 시 직무에 어울리는 캐릭터로 동적 전환됩니다.
- 📝 **마크다운 렌더링 & 유틸리티**
  - `marked.js`를 활용하여 생성된 이력서를 깔끔한 마크다운 서식으로 실시간 렌더링합니다.
  - **원클릭 클립보드 복사** 및 **.md 파일 다운로드** 기능을 지원합니다.
- 🎨 **레트로 픽셀 & 동글동글 디자인 테마**
  - 눈이 편안한 빨간 도트 패턴 배경과 가독성이 뛰어난 **나눔스퀘어 라운드(NanumSquareRound)** 웹폰트를 적용했습니다.

---

## 🛠 기술 스택 (Tech Stack)

### Backend
- **Python 3.10+**
- **Flask**: 경량 웹 서버 및 REST API 구축
- **google-generativeai**: Gemini 모델 연동
- **python-dotenv**: 환경 변수 관리
- **Pillow**: 투명 픽셀 캐릭터 이미지 처리

### Frontend
- **HTML5 / CSS3**: 반응형 2열 그리드 레이아웃, 레트로 픽셀 스타일링
- **Vanilla JavaScript**: 동적 폼 상태 관리, 캐릭터 인터랙션, 비동기 API 통신 (`Fetch API`)
- **Marked.js**: 실시간 마크다운 파서 및 렌더러

---

## 📁 프로젝트 구조 (Project Structure)

```text
resume-builder/
├── app.py                     # Flask 메인 애플리케이션 및 Gemini API 엔드포인트
├── requirements.txt           # 프로젝트 의존성 패키지 목록
├── .env.example               # 환경 변수 설정 템플릿
├── .env                       # API Key 설정 파일 (Git 제외)
├── .gitignore                 # Git 추적 제외 설정
├── README.md                  # 프로젝트 설명 문서
├── templates/
│   └── index.html             # 웹앱 메인 템플릿
├── static/
│   ├── css/
│   │   └── style.css          # 도트 배경 및 안경만두 스타일시트
│   ├── js/
│   │   └── app.js            # 말풍선 상태 관리 및 비동기 생성 스크립트
│   └── images/                # 안경만두 투명 픽셀 캐릭터 및 데코 에셋
└── sample/                    # 원본 캐릭터 샘플 이미지
```

---

## 🚀 시작하기 (Getting Started)

### 1. 사전 요구사항 (Prerequisites)
- [Python 3.10 이상](https://www.python.org/) 설치
- [Google AI Studio](https://aistudio.google.com/)에서 발급받은 Gemini API 키

### 2. 가상환경 생성 및 패키지 설치
```powershell
# 가상환경 생성 (Windows)
py -m venv venv

# 가상환경 활성화
.\venv\Scripts\Activate.ps1

# 필수 패키지 설치
pip install -r requirements.txt
```

### 3. 환경 변수 설정
프로젝트 루트 디렉터리에 `.env` 파일을 생성하고 발급받은 API 키를 입력합니다:
```ini
GEMINI_API_KEY=your_gemini_api_key_here
```

### 4. 로컬 서버 실행
```powershell
py app.py
```
서버가 시작되면 웹 브라우저에서 **`http://127.0.0.1:5000`**으로 접속합니다.

---

## 💡 사용 방법 (Usage)

1. **좌측 정보 입력창**에 이름, 지원 직무, 경력 및 주요 프로젝트 경험을 작성합니다.
   - 각 입력창을 클릭할 때마다 상단 안경만두가 알려주는 작성 팁을 확인해 보세요!
2. 원하는 언어(한국어 / 영어)와 글의 톤(전문적 / 열정적 / 담백한)을 선택합니다.
3. **'✨ AI 이력서 & 포트폴리오 생성하기'** 버튼을 누릅니다.
4. 생성이 완료되면 우측 결과창에서 완성된 마크다운 문서를 확인하고, **클립보드 복사** 또는 **.md 다운로드**를 이용해 간편하게 활용할 수 있습니다.

---

## 📄 라이선스 (License)
This project is open-source and available under the [MIT License](LICENSE).
