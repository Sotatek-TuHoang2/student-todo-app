import type { Student } from "../types/Student";
import { Button, Modal, Descriptions } from 'antd';
import { UserOutlined } from "@ant-design/icons";

interface StudentDetailModalProps {
    open: boolean;
    onClose: () => void;
    student: Student | null;
}

const StudentDetailModal: React.FC<StudentDetailModalProps> = ({ open, onClose, student}) => {

    if (!student) return null; 

    return (
        <Modal 
            title="Thông tin chi tiết sinh viên"
            open={open}
            onCancel={onClose}
            footer={[
                <Button key="close" type="primary" onClick={onClose}>
                    Đóng
                </Button>
            ]}
        >
            <div style={{display: "flex", alignItems: "center", justifyContent: "center", margin: "1rem 0"}}>
                <UserOutlined style={{ color: "#1890ff", fontSize: "100px" }} />
            </div>
            <Descriptions bordered column={1}>
                <Descriptions.Item label="Họ tên">{student.fullName}</Descriptions.Item>
                <Descriptions.Item label="Email">{student.email}</Descriptions.Item>
                <Descriptions.Item label="Ngày sinh">
                    {new Date(student.dob).toLocaleDateString("vi-VN")}
                </Descriptions.Item>
                <Descriptions.Item label="Lớp">{student.class}</Descriptions.Item>
            </Descriptions>
        </Modal>
    )
}

export default StudentDetailModal;