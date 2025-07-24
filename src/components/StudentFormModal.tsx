import React, { useEffect } from "react";
import { Modal, Form, Input, DatePicker, Button } from "antd";
import type { Student, StudentFormData } from "../types/Student";
import dayjs from "dayjs";

interface StudentFormModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (data: StudentFormData) => void;
  initialValues?: Student;
  title: string;
  confirmLoading: boolean;
}

const StudentFormModal: React.FC<StudentFormModalProps> = ({
  visible,
  onClose,
  onSubmit,
  initialValues,
  title,
  confirmLoading,
}) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (visible) {
      form.resetFields(); //Reset các trường khi mở lên
      if (initialValues) {
        form.setFieldsValue({
          ...initialValues,
          dob: initialValues.dob ? dayjs(initialValues.dob) : undefined,
        });
      }
    }
  }, [visible, initialValues, form]); //Dep Theo dõi sự thay đổi

  const handleSubmit = () => {
    form.validateFields().then((values) => {
      const formattedValues = {
        ...values,
        dob: values.dob.format("YYYY-MM-DD"),
      };
      onSubmit(formattedValues);
    });
  };

  return (
    <Modal
      open={visible}
      title={title}
      onCancel={onClose}
      confirmLoading={confirmLoading}
      footer={[
        <Button key="back" onClick={onClose}>
          Hủy
        </Button>,
        <Button
          key="submit"
          type="primary"
          loading={confirmLoading}
          onClick={handleSubmit}
        >
          Lưu
        </Button>,
      ]}
    >
      <Form form={form} layout="vertical" initialValues={{ remember: true }}>
        <Form.Item
          name="fullName"
          label="Họ và tên"
          rules={[{ required: true, message: "Vui lòng nhập họ tên" }]}
        >
          <Input placeholder="Nhập họ tên"></Input>
        </Form.Item>

        <Form.Item
          name="email"
          label="Email"
          rules={[
            { required: true, message: "Vui lòng nhập Email" },
            { type: "email", message: "Email không hợp lệ" },
          ]}
        >
          <Input placeholder="Nhập email"></Input>
        </Form.Item>

        <Form.Item
          name="dob"
          label="Ngày sinh"
          rules={[{ required: true, message: "Vui lòng chọn ngày sinh" }]}
        >
          <DatePicker
            style={{ width: "100%" }}
            format="DD/MM/YYYY"
          ></DatePicker>
        </Form.Item>

        <Form.Item
          name="class"
          label="Lớp"
          rules={[{ required: true, message: "Vui lòng nhập lớp" }]}
        >
          <Input placeholder="Nhập lớp"></Input>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default StudentFormModal;
