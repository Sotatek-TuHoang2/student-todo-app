import React, { useEffect, useState } from 'react';
import { Layout, Typography, Button, Input, message } from 'antd';
import { PlusOutlined, SearchOutlined } from '@ant-design/icons';
import StudentTable from '../components/StudentTable' ;
import StudentFormModal from '../components/StudentFormModal';
import { studentService } from '../services/studentService';
import type { Student, StudentFormData } from '../types/Student';


const { Header, Content } = Layout;
const { Title } = Typography;
const { Search } = Input;

const StudentListPage: React.FC = () => {
    const [students, setStudents] = useState<Student[]>([]);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [modalVisible, setModalVisible] = useState(false);
    const [confirmLoading, setConfirmLoading] = useState(false);
    const [selectedStudent, setSelectedStudent] = useState<Student | undefined>(undefined);

    const fetchStudents = async (search = '') => {
        try {
            setLoading(true);
            const data = await studentService.getStudents(search);
            setStudents(data);
        } catch {
            message.error("Lỗi khi lấy danh sách sinh viên")
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStudents();
    }, []); // load lại 1 lần để đma r bảo đủ dữ liệu

    const handleSearch = (value: string) => {
        setSearchTerm(value);
        fetchStudents(value);
    };

    const handleAdd = () => {
        setSelectedStudent(undefined);
        setModalVisible(true);
    };

    const handleEdit = (student: Student) => {
        setSelectedStudent(student);
        setModalVisible(true);
    };

    const handleDelete = async (id: string) => {
        try {
            setLoading(true);
            await studentService.deleteStudent(id);
            message.success("Xóa sinh viên thành công");
            fetchStudents(searchTerm)
        } catch {
            message.error("Có lỗi khi xóa sinh viên")
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (data: StudentFormData) => {
        try {
            setConfirmLoading(true);
            if (selectedStudent) {
                await studentService.updateStudent(selectedStudent.id, data)
                message.success("Cập nhật sinh viên thành công");
            } else {
                await studentService.addStudent(data);
                message.success("Thêm sinh viên thành công")
            }
            setModalVisible(false);
            fetchStudents(searchTerm);
        } catch {
            message.error(
                selectedStudent 
                ? "Không thể cập nhật sinh viên"
                : "Không thể thêm sinh viên"
            )
        } finally {
            setConfirmLoading(false);
        }
    };

    const modalTitle = selectedStudent 
            ? "Cập nhật sinh viên" 
            : "Thêm sinh viên"

    return (
        <Layout style={{ minHeight: '100vh' }}>
            <Header style={{ background: '#fff', padding: '0 20px'}}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Title level={3} style={{ margin: '16px 0' }}>
                        Quản Lý Sinh Viên
                    </Title>
                </div>
            </Header>
            <Content style={{ padding: '20px' }}>
                <div style={{ background: '#fff', padding: '20px', borderRadius: '5px'}}>
                    <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between'}}>
                        <Search 
                            placeholder='Tìm kiếm theo tên'
                            allowClear
                            enterButton={<SearchOutlined />}
                            onSearch={handleSearch}
                            style={{ width: 300}}
                        />
                        <Button
                            type='primary'
                            icon={<PlusOutlined />}
                            onClick={handleAdd}
                        >
                            Thêm sinh viên
                        </Button>

                        <StudentTable 
                            students={students}
                            loading={loading}
                            onEdit={handleEdit}
                            onDelete={handleDelete}
                        />

                        <StudentFormModal 
                            visible={modalVisible}
                            onClose={() => setModalVisible(false)}
                            onSubmit={handleSubmit}
                            initialValues={selectedStudent}
                            title={modalTitle}
                            confirmLoading={confirmLoading}
                        />
                    </div>
                </div>
            </Content>
        </Layout>
    )
}

export default StudentListPage;