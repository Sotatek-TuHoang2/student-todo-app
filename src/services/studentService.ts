import axiosInstance from "./axiosInstance";
import type { Student, StudentFormData } from "../types/Student";

const STUDENTS_ENDPOINT = '/students';

export const studentService = {
    // Lay danh sach sv
    getStudents: async (searchTerm: string = '') => {
        try {
            const params = searchTerm ? { q: searchTerm } : {};
            const response = await axiosInstance.get<Student[]>
                (STUDENTS_ENDPOINT, { params });
            return response.data;
        } catch (error) {
            console.error('Loi lay ds SV', error);
            throw error;
        }
    },

    // Them moi sv
    addStudent: async (studentData: StudentFormData) => {
        try {
            const response = await axiosInstance.get<Student[]>
                (STUDENTS_ENDPOINT);
            const students = response.data;

            let maxId = 0;
            students.forEach(student => {
                const studentId = parseInt(student.id);
                if (!isNaN(studentId) && studentId > maxId) {
                    maxId = studentId;
                }
            });

            const newId = (maxId + 1).toString();

            const newStudent = {...studentData, id: newId};
            const newResponse = await axiosInstance.post<Student>(STUDENTS_ENDPOINT, newStudent)
            return newResponse.data
        } catch (error) {
            console.error('Loi them moi SV', error);
            throw error;
        }
    },

    // Update SV
    updateStudent: async (id: string, studentData: StudentFormData) => {
        try {
            const response = await axiosInstance.put<Student>
                (`${STUDENTS_ENDPOINT}/${id}`, studentData);
            return response.data;
        } catch (error) {
            console.error('Loi cap nhat SV', error);
            throw error;
        }
    },

    // Xoa SV
    deleteStudent: async (id: string) => {
        try {
            await axiosInstance.delete<void>
                (`${STUDENTS_ENDPOINT}/${id}`);
        } catch (error) {
            console.error('Loi xoa SV', error);
            throw error;
        }
    },
}

