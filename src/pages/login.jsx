import React, { useState } from 'react';
import { Button, Form, Input, notification, Spin } from 'antd';
import { loginApi } from '../util/api';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);  // Để hiển thị trạng thái chờ

    const onFinish = async (values) => {
        console.log('Form Data:', values);
        const { name, password } = values;

        try {
            setLoading(true);  // Bắt đầu trạng thái chờ
            const res = await loginApi(name, password);
            console.log("API Response:", res); // Log phản hồi từ API

            if (res && res.EC === 0) {
                // Lưu id_user và access_token vào localStorage
                localStorage.setItem("username", res.data.user.name);
                localStorage.setItem("id_user", res.data.user.id);
                localStorage.setItem("access_token", res.data.token);

                notification.success({
                    message: "LOGIN SUCCESS",
                    description: "Welcome back, you are logged in successfully."
                });

                // Chuyển hướng người dùng về trang chủ
                navigate("/");

            } else {
                notification.error({
                    message: "LOGIN FAILED",
                    description: res?.EM ?? "An error occurred during login."
                });
            }
        } catch (error) {
            console.error("Login error:", error);
            notification.error({
                message: "LOGIN ERROR",
                description: "Something went wrong. Please try again later."
            });
        } finally {
            setLoading(false);  // Dừng trạng thái chờ
        }
    };

    return (
        <div style={{ margin: 50 }}>
            <Form
                name="loginForm"
                labelCol={{
                    span: 8,
                }}
                wrapperCol={{
                    span: 16,
                }}
                style={{
                    maxWidth: 600,
                }}
                onFinish={onFinish}
                autoComplete="off"
                layout="vertical"
            >
                <Form.Item
                    label="Username"
                    name="name"
                    rules={[
                        {
                            required: true,
                            message: 'Please input your username!',
                        },
                    ]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    label="Password"
                    name="password"
                    rules={[
                        {
                            required: true,
                            message: 'Please input your password!',
                        },
                    ]}
                >
                    <Input.Password />
                </Form.Item>

                <Form.Item>
                    <Button
                        type="primary"
                        htmlType="submit"
                        loading={loading}  // Hiển thị spinner khi đang gửi yêu cầu
                        block
                    >
                        Login
                    </Button>
                </Form.Item>
            </Form>

            {/* Hiển thị khi đang chờ phản hồi */}
            {loading && (
                <div style={{ textAlign: 'center' }}>
                    <Spin size="large" />
                </div>
            )}
        </div>
    );
};

export default LoginPage;
