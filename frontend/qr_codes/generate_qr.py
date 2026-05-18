import qrcode
import os

ip = "10.240.117.245"

folder = "qr_codes"

os.makedirs(folder, exist_ok=True)

for table in range(1, 11):

    url = f"http://10.240.117.245:3000/menu/{table}?v=2"

    qr = qrcode.make(url)

    qr.save(f"{folder}/table_{table}.png")

    print(f"QR Generated for Table {table}")

print("✅ Done")