import { useEffect, useState } from "react";
import "./App.css";

function App() {
    const [students, setStudents] = useState([]);
    const [name, setName] = useState("");
    const [age, setAge] = useState("");
    const [email, setEmail] = useState("");
    const [department, setDepartment] = useState("");
    const [createdAt, setCreatedAt] = useState("");
    const [updatedAt, setUpdatedAt] = useState("");
    const [editId, setEditId] = useState(null);

    const API = "http://localhost:5000/students";

    const getStudents = () => {
        fetch(API)
            .then(response => {
                if (!response.ok) {
                    throw new Error("Failed to fetch students");
                }
                return response.json();
            })
            .then(data => setStudents(data))
            .catch(error => alert(error.message));
    };

    useEffect(() => {
        getStudents();
    }, []);

    const clearForm = () => {
        setName("");
        setAge("");
        setEmail("");
        setDepartment("");
        setCreatedAt("");
        setUpdatedAt("");
        setEditId(null);
    };

    const addStudent = () => {
        if (!name.trim() || !email.trim()) {
            alert("Please enter student name and email");
            return;
        }

        fetch(API, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                name,
                age: age ? Number(age) : null,
                email,
                department
            })
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error("Failed to add student");
                }
                return response.json();
            })
            .then(() => {
                clearForm();
                getStudents();
            })
            .catch(error => alert(error.message));
    };

    const editStudent = (student) => {
        setEditId(student.id);
        setName(student.name || "");
        setAge(student.age ?? "");
        setEmail(student.email || "");
        setDepartment(student.department || "");
        setCreatedAt(student.created_at || "");
        setUpdatedAt(student.updated_at || "");
    };

    const updateStudent = () => {
        if (!name.trim() || !email.trim()) {
            alert("Please enter student name and email");
            return;
        }

        fetch(`${API}/${editId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                name,
                age: age ? Number(age) : null,
                email,
                department
            })
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error("Failed to update student");
                }
                return response.json();
            })
            .then(() => {
                clearForm();
                getStudents();
            })
            .catch(error => alert(error.message));
    };

    const deleteStudent = (id) => {
        if (!window.confirm("Are you sure you want to delete this student?")) {
            return;
        }

        fetch(`${API}/${id}`, {
            method: "DELETE"
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error("Failed to delete student");
                }
                return response.json();
            })
            .then(() => {
                if (editId === id) {
                    clearForm();
                }
                getStudents();
            })
            .catch(error => alert(error.message));
    };

    const formatDate = (date) => {
        if (!date) return "Not available";

        const parsedDate = new Date(date);

        return Number.isNaN(parsedDate.getTime())
            ? date
            : parsedDate.toLocaleString();
    };

    return (
        <div className="container">
            <h1>Student Management System</h1>

            <div className="form">
                <input
                    type="text"
                    placeholder="Enter Name"
                    value={name}
                    onChange={e => setName(e.target.value)}
                />

                <input
                    type="email"
                    placeholder="Enter Email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                />

                <input
                    type="number"
                    placeholder="Enter Age"
                    value={age}
                    onChange={e => setAge(e.target.value)}
                />

                <input
                    type="text"
                    placeholder="Enter Department"
                    value={department}
                    onChange={e => setDepartment(e.target.value)}
                />

                {editId !== null && (
                    <div className="timestamps">
                        <p>
                            <strong>Created At:</strong>{" "}
                            {formatDate(createdAt)}
                        </p>

                        <p>
                            <strong>Updated At:</strong>{" "}
                            {formatDate(updatedAt)}
                        </p>
                    </div>
                )}
            </div>

            <div className="main-buttons">
                {editId === null ? (
                    <button onClick={addStudent}>
                        Add Student
                    </button>
                ) : (
                    <>
                        <button onClick={updateStudent}>
                            Update Student
                        </button>

                        <button onClick={clearForm}>
                            Cancel
                        </button>
                    </>
                )}

             
            </div>

            <h2>Students ({students.length})</h2>

            <div className="students">
                {students.map(student => (
                    <div className="student-card" key={student.id}>
                        <h3>{student.name}</h3>

                        <p>
                            <strong>ID:</strong> {student.id}
                        </p>

                        <p>
                            <strong>Email:</strong> {student.email}
                        </p>

                        <p>
                            <strong>Age:</strong> {student.age ?? "N/A"}
                        </p>

                        <p>
                            <strong>Department:</strong>{" "}
                            {student.department || "N/A"}
                        </p>

                        <p>
                            <strong>Created At:</strong>{" "}
                            {formatDate(student.created_at)}
                        </p>

                        <p>
                            <strong>Updated At:</strong>{" "}
                            {formatDate(student.updated_at)}
                        </p>

                        <div className="card-buttons">
                            <button onClick={() => editStudent(student)}>
                                Edit
                            </button>

                            <button
                                onClick={() => deleteStudent(student.id)}
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default App;

