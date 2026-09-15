from PIL import Image

src_path = r"C:\AI-study\resume-builder\sample\sample2.jpg"
img = Image.open(src_path).convert("RGBA")
width, height = img.size

datas = img.load()
for y in range(height):
    for x in range(width):
        r, g, b, a = datas[x, y]
        # 흰색 배경(R, G, B > 230)을 완전 투명 처리
        if r > 230 and g > 230 and b > 230:
            datas[x, y] = (255, 255, 255, 0)

# 바운딩 박스를 찾아 타이트하게 잘라내기
bbox = img.getbbox()
if bbox:
    img = img.crop(bbox)

# 투명 PNG로 저장
out_path = r"C:\AI-study\resume-builder\static\images\sample2_transparent.png"
img.save(out_path, "PNG")
print("sample2 transparent png created successfully!")
