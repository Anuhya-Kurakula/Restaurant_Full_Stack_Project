import qrcode

base_url = "http://192.168.1.54:3001/menu/"  # 🔁 mee IP correct ga pettandi

for table_number in range(1, 11):  # 1 to 10 tables
    url = f"{base_url}{table_number}"
    qr = qrcode.make(url)
    qr.save(f"table{table_number}_qr.png")
    print(f"QR generated for Table {table_number}")

print("All QR Codes Generated Successfully!")