import os
import sys

# 프로젝트 루트 디렉터리를 sys.path에 추가하여 app.py를 안전하게 임포트합니다.
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app import app
