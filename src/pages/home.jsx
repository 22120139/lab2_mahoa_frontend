import React, { useEffect, useState } from 'react';
import { Typography, Button } from 'antd';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
    const navigate = useNavigate();
    const [username, setUsername] = useState(null);

    useEffect(() => {
        // Lấy tên người dùng từ localStorage
        const storedUsername = localStorage.getItem('username');
        if (storedUsername) {
            setUsername(storedUsername);
        } else {
            // Nếu không có tên người dùng trong localStorage, chuyển hướng đến trang đăng nhập
            navigate('/login');
        }
    }, [navigate]);

    return (
        <div style={{ padding: '20px', marginTop: '80px' }}>  {/* Thêm margin-top để tạo khoảng cách */}
            {username ? (
                <>
                    <Typography.Title level={2}>Welcome, {username}!</Typography.Title>
                    <Button
                        type="primary"
                        onClick={() => navigate('/note')}
                    >
                        Go to Notes
                    </Button>
                </>
            ) : (
                <Typography.Text>You need to log in first.</Typography.Text>
            )}
        </div>
    );
};

export default HomePage;
