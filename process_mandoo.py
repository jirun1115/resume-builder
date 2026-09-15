from PIL import Image

src_path = r"C:\AI-study\resume-builder\sample\sample3.jpg"
img = Image.open(src_path).convert("RGBA")
width, height = img.size

# 1. 흰색 배경 투명화 (R, G, B > 230)
datas = img.load()
for y in range(height):
    for x in range(width):
        r, g, b, a = datas[x, y]
        if r > 230 and g > 230 and b > 230:
            datas[x, y] = (255, 255, 255, 0)

# 전체 투명화 이미지 저장
img.save(r"C:\AI-study\resume-builder\static\images\sample3_transparent.png", "PNG")

# 2. 3마리 캐릭터가 위치한 Y 범위 제한 (높이 30% ~ 62%)
top_y = int(height * 0.30)
bottom_y = int(height * 0.62)

# 좌측 만두 (서 있는 만두 1)
crop1 = img.crop((int(width * 0.03), top_y, int(width * 0.35), bottom_y))
b1 = crop1.getbbox()
if b1:
    crop1 = crop1.crop(b1)
crop1.save(r"C:\AI-study\resume-builder\static\images\mandoo_stand1.png", "PNG")

# 중앙 만두 (누워있는 만두)
crop2 = img.crop((int(width * 0.35), top_y, int(width * 0.65), bottom_y))
b2 = crop2.getbbox()
if b2:
    crop2 = crop2.crop(b2)
crop2.save(r"C:\AI-study\resume-builder\static\images\mandoo_lie.png", "PNG")

# 우측 만두 (서 있는 만두 2)
crop3 = img.crop((int(width * 0.66), top_y, int(width * 0.97), bottom_y))
b3 = crop3.getbbox()
if b3:
    crop3 = crop3.crop(b3)
crop3.save(r"C:\AI-study\resume-builder\static\images\mandoo_stand2.png", "PNG")

print("Tight cropping complete!")
