import React from 'react';
import { Button, Form, Input, notification } from 'antd';
import { loginApi } from '../util/api';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
    const navigate = useNavigate();

    const onFinish = async (values) => {
        console.log('Form Data:', values);
        const { name, password } = values;

        const res = await loginApi(name, password);
        console.log("API Response:", res); // Log phản hồi từ API

        if (res && res.EC === 0) {
            localStorage.setItem("id_user", res.data.user.id); // Lưu id_user
            localStorage.setItem("access_token", res.data.token);
            notification.success({
                message: "LOGIN USER",
                description: "Success"
            });
            navigate("/");

        } else {
            notification.error({
                message: "LOGIN USER",
                description: res?.EM ?? "error"
            })
        }

    };

    return (
        <div style={{ margin: 50 }}>
            <Form
                name="basic"
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
                layout='vertical'
            >
                <Form.Item
                    label="Name"
                    name="name"
                    rules={[
                        {
                            required: true,
                            message: 'Please input your email!',
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



                <Form.Item
                >
                    <Button type="primary" htmlType="submit">
                        Login
                    </Button>
                </Form.Item>
            </Form>
        </div>
    )
}

export default LoginPage;