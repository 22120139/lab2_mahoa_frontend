import React, { useState } from 'react';
import { AppstoreOutlined, MailOutlined, SettingOutlined } from '@ant-design/icons';
import { Menu } from 'antd';
import { Link, useNavigate } from 'react-router-dom';

const Header = () => {
    const navigate = useNavigate();  // Khai báo useNavigate để điều hướng
    const [current, setCurrent] = useState('home');

    // Khi nhấn vào "Đăng xuất", sẽ điều hướng đến trang đăng ký
    const handleLogout = () => {
        localStorage.clear();  // Xóa thông tin người dùng khỏi localStorage
        navigate('/register'); // Điều hướng đến trang đăng ký
    };

    const items = [
        {
            label: <Link to={"/"}>Home Page</Link>,
            key: 'home',
            icon: <MailOutlined />,
        },

        {
            label: <Link to={"/note"}>Notes</Link>,
            key: 'note',
            icon: <MailOutlined />,
        },

        {
            label: 'Welcome To ShareNoteApp',
            key: 'SubMenu',
            icon: <SettingOutlined />,
            children: [
                {
                    label: 'Đăng xuất',
                    key: 'logout',
                    onClick: handleLogout, // Khi nhấn vào "Đăng xuất", gọi hàm handleLogout
                },
            ],
        },
    ];

    const onClick = (e) => {
        console.log('click ', e);
        setCurrent(e.key);
    };

    return (
        <Menu
            onClick={onClick}
            selectedKeys={[current]}
            mode="horizontal"
            items={items}
            style={{
                fontSize: '18px',          // Tăng kích thước chữ
                backgroundColor: '#f0f2f5', // Thay đổi màu nền
                border: 'none',             // Loại bỏ viền
                boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)', // Thêm bóng đổ
                position: 'fixed',          // Cố định menu
                top: 0,                     // Menu luôn ở trên cùng
                left: 0,                    // Menu bắt đầu từ bên trái
                width: '100%',              // Chiều rộng menu chiếm toàn bộ màn hình
                zIndex: 1000,               // Đảm bảo menu nằm trên các phần tử khác
            }}
            theme="light"
        />
    );
};

export default Header;
