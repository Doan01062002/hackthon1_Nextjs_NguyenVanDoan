"use client";

import axios from "axios";
import React, { useEffect, useState } from "react";

interface Product {
  id: number;
  ProductName: string;
  image: string;
  price: number;
  quantity: number;
}

const App = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [newProductName, setNewProductName] = useState("");
  const [newProductImage, setNewProductImage] = useState("");
  const [newProductPrice, setNewProductPrice] = useState("");
  const [newProductQuantity, setNewProductQuantity] = useState("");
  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [deleteProductId, setDeleteProductId] = useState<number | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    axios
      .get("http://localhost:3000/api/products")
      .then((response) => setProducts(response.data))
      .catch((err) => console.log(err));
  }, []);

  const handleAddProduct = async () => {
    if (!validateInputs()) return;

    const newProduct = {
      id: Math.floor(Math.random() * 1000000),
      ProductName: newProductName,
      image: newProductImage,
      price: parseInt(newProductPrice, 10),
      quantity: parseInt(newProductQuantity, 10),
    };

    try {
      const response = await axios.post(
        "http://localhost:3000/api/products",
        newProduct
      );
      if (response.status === 200) {
        setProducts([...products, newProduct]);
        resetForm();
        setSuccessMessage("Sản phẩm đã được thêm thành công!");
        setTimeout(() => {
          setSuccessMessage("");
        }, 2000);
        setErrorMessage(null);
      }
    } catch (err) {
      setErrorMessage("Thêm sản phẩm thất bại");
      setSuccessMessage(null);
    }
  };

  const handleEditProduct = (product: Product) => {
    setEditProduct(product);
    setNewProductName(product.ProductName);
    setNewProductImage(product.image);
    setNewProductPrice(product.price.toString());
    setNewProductQuantity(product.quantity.toString());
    // Change form title and button text
    document.getElementById("formTitle")!.innerText = "Cập nhật sản phẩm";
    document.getElementById("submitButton")!.innerText = "Cập nhật";
  };

  const handleUpdateProduct = async () => {
    if (!editProduct || !validateInputs()) return;

    const updatedProduct = {
      ...editProduct,
      ProductName: newProductName,
      image: newProductImage,
      price: parseInt(newProductPrice, 10),
      quantity: parseInt(newProductQuantity, 10),
    };

    try {
      const response = await axios.put(
        `http://localhost:3000/api/products/${editProduct.id}`,
        updatedProduct
      );
      if (response.status === 200) {
        setProducts(
          products.map((p) => (p.id === editProduct.id ? updatedProduct : p))
        );
        resetForm();
        setSuccessMessage("Sản phẩm đã được cập nhật thành công!");
        setTimeout(() => {
          setSuccessMessage("");
        }, 2000);
        setErrorMessage(null);
      }
    } catch (err) {
      setErrorMessage("Cập nhật sản phẩm thất bại");
      setSuccessMessage(null);
    }
  };

  const handleDeleteProduct = async () => {
    if (deleteProductId === null) return;

    try {
      const response = await axios.delete(
        `http://localhost:3000/api/products/${deleteProductId}`
      );
      if (response.status === 200) {
        setProducts(products.filter((p) => p.id !== deleteProductId));
        setShowModal(false);
        setDeleteProductId(null);
        setSuccessMessage("Sản phẩm đã được xóa thành công!");
        setTimeout(() => {
          setSuccessMessage("");
        }, 2000);
        setErrorMessage(null);
      }
    } catch (err) {
      setErrorMessage("Xóa sản phẩm thất bại");
      setSuccessMessage(null);
    }
  };

  const validateInputs = (): boolean => {
    let valid = true;
    let message = "";

    // Check for duplicate product names
    if (
      products.some(
        (p) =>
          p.ProductName === newProductName &&
          (!editProduct || p.id !== editProduct.id)
      )
    ) {
      message = "Tên sản phẩm đã tồn tại.";
      valid = false;
    }

    // Check if fields are empty or invalid
    if (!newProductName.trim()) {
      message = "Tên sản phẩm không được để trống.";
      valid = false;
    } else if (!newProductImage.trim()) {
      message = "Hình ảnh không được để trống.";
      valid = false;
    } else if (
      parseInt(newProductPrice, 10) <= 0 ||
      isNaN(parseInt(newProductPrice, 10))
    ) {
      message = "Giá phải lớn hơn 0 và không được để trống.";
      valid = false;
    } else if (
      parseInt(newProductQuantity, 10) <= 0 ||
      isNaN(parseInt(newProductQuantity, 10))
    ) {
      message = "Số lượng phải lớn hơn 0 và không được để trống.";
      valid = false;
    }

    setErrorMessage(message);
    setTimeout(() => {
      setErrorMessage("");
    }, 2000);
    return valid;
  };

  const resetForm = () => {
    setEditProduct(null);
    setNewProductName("");
    setNewProductImage("");
    setNewProductPrice("");
    setNewProductQuantity("");
    document.getElementById("formTitle")!.innerText = "Thêm mới sản phẩm";
    document.getElementById("submitButton")!.innerText = "Thêm";
  };

  return (
    <div className="container mx-auto p-4 flex-row">
      <h1 className="text-2xl font-bold mb-4">Danh sách sản phẩm</h1>
      <table className="w-full border-collapse">
        <thead>
          <tr>
            <th className="px-4 py-2 border">ID</th>
            <th className="px-4 py-2 border">Tên sản phẩm</th>
            <th className="px-4 py-2 border">Hình ảnh</th>
            <th className="px-4 py-2 border">Giá</th>
            <th className="px-4 py-2 border">Số lượng</th>
            <th className="px-4 py-2 border">Chức năng</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id}>
              <td className="px-4 py-2 border">{product.id}</td>
              <td className="px-4 py-2 border">{product.ProductName}</td>
              <td className="px-4 py-2 border">
                <img
                  src={product.image}
                  alt={product.ProductName}
                  className="w-16 h-16 object-contain"
                />
              </td>
              <td className="px-4 py-2 border">{product.price} VNĐ</td>
              <td className="px-4 py-2 border">{product.quantity}</td>
              <td className="px-4 py-2 border">
                <button
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                  onClick={() => handleEditProduct(product)}
                >
                  Sửa
                </button>
                <button
                  className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded ml-2"
                  onClick={() => {
                    setDeleteProductId(product.id);
                    setShowModal(true);
                  }}
                >
                  Xóa
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="mt-8">
        <h2 id="formTitle" className="text-xl font-bold mb-4">
          Thêm mới sản phẩm
        </h2>
        {(errorMessage || successMessage) && (
          <div
            className={`p-4 mb-4 rounded ${
              errorMessage
                ? "bg-red-100 border border-red-400 text-red-700"
                : "bg-green-100 border border-green-400 text-green-700"
            }`}
          >
            <strong className="font-bold">
              {errorMessage ? "Lỗi:" : "Thành công:"}
            </strong>
            <p>{errorMessage || successMessage}</p>
          </div>
        )}
        <div className="mb-4">
          <label
            htmlFor="name"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Tên
          </label>
          <input
            placeholder="Tên sản phẩm"
            type="text"
            id="name"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={newProductName}
            onChange={(e) => setNewProductName(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="image"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Hình ảnh
          </label>
          <input
            placeholder="Địa chỉ hình ảnh"
            type="text"
            id="image"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={newProductImage}
            onChange={(e) => setNewProductImage(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="price"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Giá
          </label>
          <input
            placeholder="Giá sản phẩm"
            type="number"
            id="price"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={newProductPrice}
            onChange={(e) => setNewProductPrice(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="quantity"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Số lượng
          </label>
          <input
            placeholder="Số lượng sản phẩm"
            type="number"
            id="quantity"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={newProductQuantity}
            onChange={(e) => setNewProductQuantity(e.target.value)}
          />
        </div>
        <button
          id="submitButton"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 w-full rounded focus:outline-none focus-shadow-outline"
          onClick={editProduct ? handleUpdateProduct : handleAddProduct}
        >
          Thêm
        </button>
      </div>

      {/* Confirmation Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
          <div className="bg-white p-4 rounded shadow-lg">
            <h3 className="text-lg font-bold mb-4">Xác nhận xóa</h3>
            <p>Bạn có chắc chắn muốn xóa sản phẩm này?</p>
            <div className="mt-4 flex justify-end">
              <button
                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mr-2"
                onClick={handleDeleteProduct}
              >
                Xóa
              </button>
              <button
                className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
                onClick={() => setShowModal(false)}
              >
                Hủy
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
