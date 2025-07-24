import React, { useEffect, useState } from "react";
import { Layout, Typography, Button, Input, Space, message, Select, Tooltip } from "antd";
import { PlusOutlined, SearchOutlined, ReloadOutlined } from "@ant-design/icons";
import StudentTable from "../components/StudentTable";
import StudentFormModal from "../components/StudentFormModal";
import { studentService } from "../services/studentService";
import type { Student, StudentFormData } from "../types/Student";

const { Header, Content } = Layout;
const { Title } = Typography;
const { Search } = Input;

const StudentListPage: React.FC = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [filteredStudents, setFilteredStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | undefined>(
    undefined
  );
  const [filterClass, setFilterClass] = useState<string>('');

  const fetchStudents = async (search = "") => {
    try {
      setLoading(true);
      const data = await studentService.getStudents(search);
      setStudents(data);
      setFilteredStudents(data);
    } catch {
      message.error("Lỗi khi lấy danh sách sinh viên");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []); // load lại 1 lần để đma r bảo đủ dữ liệu

  // Lọc và tìm kiếm
  useEffect(() => {
    let filtered = [...students];

    if (searchTerm) {
      filtered = filtered.filter(student =>
        student.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterClass) {
      filtered = filtered.filter(student => student.class === filterClass);
    }

    setFilteredStudents(filtered);
  }, [students, searchTerm, filterClass]);

  // Lấy danh sách lớp duy nhất
  const uniqueClasses = Array.from(new Set(students.map(student => student.class)));

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    fetchStudents(value);
  };

  const handleResetFilters = () => {
    setSearchTerm('');
    setFilterClass('');
  };

  // Xử lý thay đổi giá trị search
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
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
      fetchStudents(searchTerm);
    } catch {
      message.error("Có lỗi khi xóa sinh viên");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (data: StudentFormData) => {
    try {
      setConfirmLoading(true);
      if (selectedStudent) {
        await studentService.updateStudent(selectedStudent.id, data);
        message.success("Cập nhật sinh viên thành công");
      } else {
        await studentService.addStudent(data);
        message.success("Thêm sinh viên thành công");
      }
      setModalVisible(false);
      fetchStudents(searchTerm);
    } catch {
      message.error(
        selectedStudent
          ? "Không thể cập nhật sinh viên"
          : "Không thể thêm sinh viên"
      );
    } finally {
      setConfirmLoading(false);
    }
  };

  const modalTitle = selectedStudent ? "Cập nhật sinh viên" : "Thêm sinh viên";

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Header style={{ background: "#fff", padding: "0 20px" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Title level={3} style={{ margin: "16px 0" }}>
            Quản Lý Sinh Viên
          </Title>
        </div>
      </Header>
      <Content style={{ padding: "20px" }}>
        <div
          style={{ background: "#fff", padding: "20px", borderRadius: "5px" }}
        >
          <div
            style={{
              marginBottom: "20px",
              display: "flex",
              gap: "30px",
            }}
          >
            <Search
              placeholder="Tìm kiếm theo tên"
              allowClear
              enterButton={<SearchOutlined />}
              onSearch={handleSearch}
              value={searchTerm}
              onChange={handleSearchChange}
              style={{ width: 300 }}
            />

            <Select
              placeholder="Chọn lớp"
              allowClear
              style={{ width: '200px' }}
              value={filterClass || undefined}
              onChange={(value) => setFilterClass(value || '')}
            >
              {uniqueClasses.map((className) => (
                <Select.Option key={className} value={className}>
                  {className}
                </Select.Option>
              ))}
            </Select>

            <Space>
              <Tooltip title="Làm mới">
                <Button
                  icon={<ReloadOutlined />} 
                  onClick={() => fetchStudents(searchTerm)}
                  loading={loading}
                />
              </Tooltip>
              <Button onClick={handleResetFilters}>
                Xóa bộ lọc
              </Button>
            </Space>

            <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
              Thêm sinh viên
            </Button>
          </div>

          <StudentTable
            students={filteredStudents}
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
      </Content>
    </Layout>
  );
};

export default StudentListPage;
