import fs from "fs";
import path from "path";
import React from "react";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  try {
    // Buoc 1: lấy ra đường dẫn của file cần đọc
    const filePath = path.join(process.cwd(), "src/database/products.json");
    // Bước 2: Sử dụng fs để đọc file
    const data = fs.readFileSync(filePath, "utf8");

    // Bước 3: Ép kiểu từ dạng JSON sang TS
    const products = JSON.parse(data);
    // trả về dữ liệu cho phía client
    return NextResponse.json(products);
  } catch (err) {
    return NextResponse.json(err);
  }
}

export async function POST(request: NextRequest) {
  try {
    // B1: Lấy dữ liệu từ client
    const productsRequest = await request.json();

    // B2: Lấy ra đường dẫn của file cần đọc
    const filePath = path.join(process.cwd(), "src/database/products.json");

    // Đọc file cần ghi vào
    const products = JSON.parse(fs.readFileSync(filePath, "utf8"));

    // Push dữ liệu vào trong mảng
    products.push(productsRequest);

    // B3: Ghi file
    fs.writeFileSync(filePath, JSON.stringify(products, null, 2), "utf8");

    return NextResponse.json({ message: "Thêm sản phẩm thành công" }); // Success message
  } catch (err) {
    return NextResponse.json({ message: "Ghi file không thành công" }); // Error message
  }
}
