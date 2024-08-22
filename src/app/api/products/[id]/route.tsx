import path from "path";
import fs from "fs";
import { NextRequest, NextResponse } from "next/server";

type Paramtypes = {
  params: {
    id: string;
  };
};

// Lấy sản phẩm theo id

export async function GET(request: Request, { params }: Paramtypes) {
  try {
    const { id } = params;
    const productId = parseInt(id, 10);

    const filePath = path.join(process.cwd(), "src/database/products.json");

    const data = fs.readFileSync(filePath, "utf8");
    const products = JSON.parse(data);

    const product = products.find(
      (item: { id: number }) => item.id === productId
    );

    if (!product) {
      return NextResponse.json({ message: "Lấy sản phẩm thành công" });
    }

    return NextResponse.json(product);
  } catch (err) {
    return NextResponse.json({ message: "Lấy sản phẩm thất bại" });
  }
}

// Cập nhật sản phẩm

export async function PUT(request: NextRequest, { params }: Paramtypes) {
  try {
    const { id } = params;
    const productId = parseInt(id, 10);

    // B1: Lấy đường dẫn của file cần đọc
    const filePath = path.join(process.cwd(), "src/database/products.json");
    const data = fs.readFileSync(filePath, "utf8");
    const products = JSON.parse(data);

    // B2: Tìm kiếm vị trí cần cập nhật
    const fileIndex = products.findIndex(
      (product: { id: number }) => product.id === productId
    );

    if (fileIndex === -1) {
      return NextResponse.json({ message: "Sản phẩm không tìm thấy" });
    }

    // B3: Lấy dữ liệu từ client và cập nhật sản phẩm
    const updatedProduct = await request.json();
    products[fileIndex] = updatedProduct;

    // B4: Ghi đè lại file
    fs.writeFileSync(filePath, JSON.stringify(products, null, 2), "utf8");

    // B5: Trả về thông báo
    return NextResponse.json({ message: "Cập nhật sản phẩm thành công" });
  } catch (err) {
    return NextResponse.json({ message: "Cập nhật sản phẩm thất bại" });
  }
}

// Xóa sản phẩm theo id

export async function DELETE(request: NextRequest, { params }: Paramtypes) {
  try {
    const { id } = params;
    const productId = parseInt(id, 10);

    // B1: Lấy đường dẫn của file cần đọc
    const filePath = path.join(process.cwd(), "src/database/products.json");
    const data = fs.readFileSync(filePath, "utf8");
    const products = JSON.parse(data);

    // B2: Tìm chỉ số của sản phẩm cần xóa
    const updatedProducts = products.filter(
      (product: { id: number }) => product.id !== productId
    );

    if (products.length === updatedProducts.length) {
      return NextResponse.json({ message: "Sản phẩm không tìm thấy" });
    }

    // B3: Ghi đè lại file
    fs.writeFileSync(
      filePath,
      JSON.stringify(updatedProducts, null, 2),
      "utf8"
    );

    // B4: Trả về thông báo
    return NextResponse.json({ message: "Xóa sản phẩm thành công" });
  } catch (err) {
    return NextResponse.json({ message: "Xóa sản phẩm thất bại" });
  }
}
