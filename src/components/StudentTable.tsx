import React from 'react';
import { Table, Button, Space, Popconfirm } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import type { Student } from '../types/Student';

interface StudentTableProps {
    students: Student[];
    loading: boolean;
    onEdit: (student: Student) => void;
    onDelete: (id: string) => void;
}

const StudentTable: React.FC<StudentTableProps> = ({
    students,
    loading,
    onEdit,
    onDelete,
}) => {
    const columns: ColumnsType<Student> = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
        },
        {
            title: 'Họ và tên',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Ngày sinh',
            dataIndex: 'dob',
            key: 'dob',
            render: (dob: string) => new Date(dob).
                toLocaleDateString('vi-VN'),
        },
        {
            title: 'Lớp',
            dataIndex: 'class',
            key: 'class',
        },
        {
            title: 'Hành động',
            key: 'action',
            render: (_, record) => (
                <Space size={'middle'}>
                    <Button type='primary' onClick={() => onEdit(record)}>
                        Sửa
                    </Button>
                    <Popconfirm 
                        title="Bạn có chắc chắn muốn xóa sinh viên này không?" 
                        onConfirm={() => onDelete(record.id)} 
                        okText="Xóa" 
                        cancelText="Hủy"
                    >
                        <Button danger>Xóa</Button>
                    </Popconfirm>
                </Space>
            )
        }
    ]

    return (
        <Table
            columns = {columns} 
            dataSource = {students}
            rowKey = "id" 
            loading={loading}
            pagination={{pageSize: 10}}
        />
    )
}

export default StudentTable;