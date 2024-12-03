import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import './AdminApp.css';

const API_BASE_URL = 'https://ltdd-api.onrender.com/tripAPI';

const fetchTrips = () => axios.get(`${API_BASE_URL}/trips`);
const createTrip = (data) => axios.post(`${API_BASE_URL}/create`, data);
const updateTrip = (id, data) => axios.put(`${API_BASE_URL}/update/${id}`, data);
const deleteTrip = (id) => axios.delete(`${API_BASE_URL}/delete/${id}`);

const AdminApp = () => {
  const [trips, setTrips] = useState([]);
  const [selectedTrip, setSelectedTrip] = useState(null);
  const [isAdding, setIsAdding] = useState(false); // Kiểm tra trạng thái "Thêm mới"
  const { register, handleSubmit, reset } = useForm();

  useEffect(() => {
    fetchTrips()
      .then((res) => setTrips(res.data))
      .catch((error) => console.error('Lỗi khi tải dữ liệu:', error));
  }, []);

  const onSave = (data) => {
    if (selectedTrip) {
      updateTrip(selectedTrip._id, data)
        .then(() => {
          setTrips((prev) =>
            prev.map((trip) =>
              trip._id === selectedTrip._id ? { ...trip, ...data } : trip
            )
          );
          resetForm();
        })
        .catch((error) => console.error('Lỗi khi cập nhật trip:', error));
    } else {
      createTrip(data)
        .then((res) => {
          setTrips((prev) => [...prev, res.data]);
          resetForm();
        })
        .catch((error) => console.error('Lỗi khi tạo mới trip:', error));
    }
  };

  const handleDelete = (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa chuyến đi này?')) {
      deleteTrip(id)
        .then(() => {
          setTrips((prev) => prev.filter((trip) => trip._id !== id));
        })
        .catch((error) => console.error('Lỗi khi xóa trip:', error));
    }
  };

  const handleEdit = (trip) => {
    setSelectedTrip(trip);
    setIsAdding(false); // Tắt chế độ thêm mới
    reset(trip);
  };

  const handleAddNew = () => {
    setSelectedTrip(null); // Không có trip nào được chọn
    setIsAdding(true); // Chuyển sang trạng thái thêm mới
    resetForm(); // Reset dữ liệu form
  };

  const resetForm = () => {
    reset({
      title: '',
      location: '',
      date: '',
      time: '',
      imageUrl: '',
      price: '',
      des: '',
    });
  };

  return (
    <div className="admin-app">
      <h1>Quản lý Trips</h1>
      <div className="container">
        {/* Danh sách Trips */}
        <div className="trip-list">
          <h2>Danh sách Trips</h2>
          <table className="table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Location</th>
                <th>Date</th>
                <th>Time</th>
                <th>ImageURL</th>
                <th>Price</th>
                <th>Description</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {trips.map((trip) => (
                <tr key={trip._id}>
                  <td>{trip.title}</td>
                  <td>{trip.location}</td>
                  <td>{trip.date}</td>
                  <td>{trip.time}</td>
                  <td>{trip.imageUrl}</td>
                  <td>{trip.price}</td>
                  <td>{trip.des}</td>
                  <td>
                    <button className="btn edit" onClick={() => handleEdit(trip)}>Sửa</button>
                    <button className="btn delete" onClick={() => handleDelete(trip._id)}>Xóa</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <button className="btn add" onClick={handleAddNew}>
            Thêm mới Trip
          </button>
        </div>

        {/* Form Quản lý Trips */}
        {(selectedTrip || isAdding) && (
          <div className="trip-form">
            <h2>{selectedTrip ? 'Cập nhật Trip' : 'Thêm mới Trip'}</h2>
            <form onSubmit={handleSubmit(onSave)}>
              <div className="form-group">
                <label>Title:</label>
                <input {...register('title', { required: true })} placeholder="Nhập tiêu đề" />
              </div>
              <div className="form-group">
                <label>Location:</label>
                <input {...register('location', { required: true })} placeholder="Nhập địa điểm" />
              </div>
              <div className="form-group">
                <label>Date:</label>
                <input type="date" {...register('date', { required: true })} />
              </div>
              <div className="form-group">
                <label>Time:</label>
                <input type="number" {...register('time', { required: true })} />
              </div>
              <div className="form-group">
                <label>Image URL:</label>
                <input {...register('imageUrl')} placeholder="Nhập link ảnh" />
              </div>
              <div className="form-group">
                <label>Price:</label>
                <textarea {...register('price')} placeholder="Nhập giá"></textarea>
              </div>
              <div className="form-group">
                <label>Description:</label>
                <textarea {...register('des')} placeholder="Nhập mô tả"></textarea>
              </div>
              <div className="form-actions">
                <button type="submit" className="btn save">Lưu</button>
                <button type="button" className="btn cancel" onClick={() => setIsAdding(false)}>
                  Hủy
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminApp;
